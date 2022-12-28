class PersonCard {
	
  constructor(person, drawConnectFunc) {
	this.person = person;
	this.drawConnectFunc = drawConnectFunc;
	this.delta_x = 0;
	this.delta_y = 0;
	this.isActive = false;
	this.ie = 0;

	this.bind();
    this.init();
  }
  
  bind() {
	this.openCardInfoForCreate = this.openCardInfoForCreate.bind(this);
	this.openCardInfoForEdit = this.openCardInfoForEdit.bind(this);	
	this.updateCardPosition = this.updateCardPosition.bind(this);	
	this.deleteCard = this.deleteCard.bind(this);	
	this.movePersonCard = this.movePersonCard.bind(this);	
	this.saveXY = this.saveXY.bind(this);	
	this.clearXY = this.clearXY.bind(this);	 
  }

  init() {
	if (navigator.userAgent.indexOf("MSIE") != -1) this.ie = 1;  
    this.initCardPanel();
    this.initPhotoBlock();
    this.initInfoBlock();
    this.initButtonBlock();
    this.initListener();
  }

  initCardPanel() {
    this.cardPanel = DomUtils.addDivWithClasses(document.body, ['cardPanel', 'noselect'] );
    this.cardPanel.style.left = this.person.x + 'px';
    this.cardPanel.style.top = this.person.y + 'px';
  }

  initPhotoBlock() {
	DomUtils.addDivWithText(this.cardPanel, 'photoBlock', '<span>Тут будет фото</span>');
  }

  initInfoBlock() {
    let infoPanel = DomUtils.addDiv( this.cardPanel, 'infoBlock');
    DomUtils.addDivWithText(infoPanel, 'name', '<span>' + this.person.name + '</span>');
    DomUtils.addDivWithText(infoPanel, 'name', '<span>' + this.person.secondName + '</span>');
    DomUtils.addDivWithText(infoPanel, 'name', '<span>' + this.person.patronymic + '</span>');
    DomUtils.addDivWithText(infoPanel, 'name', '<span>' + this.person.age + '</span>');
  }

  initButtonBlock() {
    let buttonPanel = DomUtils.addDiv(this.cardPanel, 'iconPanel');
    this.settingButton = DomUtils.addImg(buttonPanel, 'icon', 'images/info.svg');
    this.addButton = DomUtils.addImg(buttonPanel, 'icon', 'images/plus.svg');
    this.deleteButton = DomUtils.addImgWithClasses(buttonPanel, ['icon', 'deleteIcon'], 'images/delete.svg');
  }

  openCardInfoForCreate(event) {
      let x = event.pageX;
      let y = event.pageY;
      
      let newPerson = new PersonBean(null, this.person.id, "", this.person.secondName, "", "", "", "", x + 15, y);     
      let cardInfo = new InfoCard(newPerson, x, y, function (id, parentId, name, secondName, patronymic, age, email, address) {
    	  let json = JSON.stringify({id: id, parentId: parentId, firstName: name, secondName: secondName,
          							 patronymic: patronymic, age: age, email: email, address: address});
    	  RequestMappingUtils.Post('api/create', json);		
      });	  					 
    }
  
  openCardInfoForEdit(event) {
      let x = event.pageX;
      let y = event.pageY;
      
      let cardInfo = new InfoCard(this.person, x, y, function (id, parentId, name, secondName, patronymic, age, email, address){
    	  let json = JSON.stringify({id: id, parentId: parentId, firstName: name, secondName: secondName,
				 patronymic: patronymic, age: age, email: email, address: address});
    	  RequestMappingUtils.Post('api/update', json);	
      });    		  					 
  }
  
  updateCardPosition() {
	  let json = JSON.stringify({id: this.person.id, posX: this.cardPanel.style.left.replace("px", ""), 
		  						 posY: this.cardPanel.style.top.replace("px", "")});
	  RequestMappingUtils.Post('/api/savePositions', json);	
  }
  
  deleteCard() {
      let dialog = new InfoDialog("Вы действительно хотите удалить карточку?", DialogType.OkNo, function () {
    	  let json = JSON.stringify({id: this.person.id});
    	  RequestMappingUtils.Post('api/delete', json);	
      });
  }
  
  movePersonCard(event) {
      var  x = event.pageX;
      var  y = event.pageY;

      let new_x = this.delta_x + x;
      let new_y = this.delta_y + y;
      this.cardPanel.style.top = new_y + 'px';
      this.cardPanel.style.left = new_x + 'px';
      this.drawConnectFunc();
    }
  
  saveXY(event) {
      this.isActive = true;

      var x = event.pageX;
      var y = event.pageY;

      let x_block = this.cardPanel.offsetLeft;
      let y_block = this.cardPanel.offsetTop;

      this.delta_x = x_block - x;
      this.delta_y = y_block - y;

      if (this.ie) {
        document.onmousemove = this.movePersonCard;
      } else {
        document.addEventListener("mousemove", this.movePersonCard, false);
      }
    }
  
  clearXY() {
      if (this.ie) {
        document.onmousemove = null;
      } else {
        document.removeEventListener("mousemove", this.movePersonCard, false);
      }
      if (this.isActive) {
    	this.updateCardPosition();
      }
      this.isActive = false;
  }
  
  initListener() {
    if (this.ie) {
      this.cardPanel.onmousedown = this.saveXY;
      document.onmouseup = this.clearXY;
      this.deleteButton.onclick = this.deleteCard;
      this.settingButton.onclick = this.openCardInfoForEdit;
      this.addButton.onclick = this.openCardInfoForCreate;
    } else {
      this.cardPanel.addEventListener('mousedown', this.saveXY);
      document.addEventListener('mouseup', this.clearXY);
      this.deleteButton.addEventListener('click', this.deleteCard);
      this.settingButton.addEventListener('click', this.openCardInfoForEdit);
      this.addButton.addEventListener('click', this.openCardInfoForCreate);
    }
  }
  
  getPerson() {
	  return this.person;
  }

  getElement() {
    return this.cardPanel;
  }
  
  getX() {
    return parseInt(this.cardPanel.style.left.replace("px", ""));
  }

  getY() {
	return parseInt(this.cardPanel.style.top.replace("px", ""));
  }
  
  getWidth() {
	return this.cardPanel.offsetWidth;
  }
  
  getHeight() {
	return this.cardPanel.offsetHeight;
  }
  
  getParentId(){
	return this.person.parentId;
  }
  
  getId(){
	return this.person.id;
  }
}