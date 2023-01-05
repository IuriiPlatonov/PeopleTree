class PersonCard {

  constructor(person, camera, drawConnectFunc, updateObjectCoordFunc) {
    // this.desktopPanel = desktopPanel;
	  this.updateObjectCoordFunc = updateObjectCoordFunc;
	  this.camera = camera;
    this.person = person;
    this.drawConnectFunc = drawConnectFunc;
    this.delta_x = 0;
    this.delta_y = 0;
     this.isActive = false;


     this.bind();
    this.init();
  }

   bind() {
//     this.openCardInfoForCreate = this.openCardInfoForCreate.bind(this);
//     this.openCardInfoForEdit = this.openCardInfoForEdit.bind(this);
     this.updateCardPosition = this.updateCardPosition.bind(this);
//     this.deleteCard = this.deleteCard.bind(this);
     this.movePersonCard = this.movePersonCard.bind(this);
     this.saveXY = this.saveXY.bind(this);
     this.clearXY = this.clearXY.bind(this);
     this.init = this.init.bind(this);
   }

  init() {
    if (this.cardPanel) this.desktopPanel.removeChild(this.cardPanel);
    this.initCardPanel();
    this.initPhotoBlock();
    this.initInfoBlock();
    this.initButtonBlock();
    this.initListener();
  }

  initCardPanel() {
    this.cardPanel = document.createElement('div');
    this.cardPanel.classList.add('cardPanel');
    this.cardPanel.classList.add('noselect');
    this.cardPanel.style.left = this.person.posX + 'px';
    this.cardPanel.style.top = this.person.posY + 'px';
  }

  initPhotoBlock() {
    this.photoBlock = document.createElement('div');
    this.photoBlock.classList.add('photoBlock');
    this.photoBlock.innerHTML = '<span>Тут будет фото</span>';
    this.cardPanel.appendChild(this.photoBlock);
  }

  initInfoBlock() {
    let infoPanel = document.createElement('div');
    infoPanel.classList.add('infoBlock');
    this.cardPanel.appendChild(infoPanel);

    this.nameText = document.createElement('div');
    this.nameText.classList.add('name');
    this.nameText.innerHTML = '<span>' + this.person.firstName + '</span>';
    infoPanel.appendChild(this.nameText);

    this.secondNameText = document.createElement('div');
    this.secondNameText.classList.add('name');
    this.secondNameText.innerHTML = '<span>' + this.person.secondName + '</span>';
    infoPanel.appendChild(this.secondNameText);

    this.patronymicText = document.createElement('div');
    this.patronymicText.classList.add('name');
    this.patronymicText.innerHTML = '<span>' + this.person.patronymic + '</span>';
    infoPanel.appendChild(this.patronymicText);

    this.ageText = document.createElement('div');
    this.ageText.classList.add('name');
    this.ageText.innerHTML = '<span>' + this.person.age + '</span>';
    infoPanel.appendChild(this.ageText);
  }

  initButtonBlock() {
    let buttonPanel = document.createElement('div');
    buttonPanel.classList.add('iconPanel');
    this.cardPanel.appendChild(buttonPanel);

    this.settingButton = document.createElement('img');
    this.settingButton.classList.add('icon');
    this.settingButton.setAttribute('src', 'images/info.svg')
    buttonPanel.appendChild(this.settingButton);

    this.addButton = document.createElement('img');
    this.addButton.classList.add('icon');
    this.addButton.setAttribute('src', 'images/plus.svg')
    buttonPanel.appendChild(this.addButton);

    this.deleteButton = document.createElement('img');
    this.deleteButton.classList.add('icon');
    this.deleteButton.classList.add('deleteIcon');
    this.deleteButton.setAttribute('src', 'images/delete.svg')
    buttonPanel.appendChild(this.deleteButton);
  }

  initListener() {
    this.cardPanel.addEventListener('mousedown', this.saveXY);
    document.addEventListener('mouseup', this.clearXY);
/*    this.deleteButton.addEventListener('click', this.deleteCard);
    this.settingButton.addEventListener('click', this.openCardInfoForEdit);
    this.addButton.addEventListener('click', this.openCardInfoForCreate);*/
  }

  // updateCanvasSize() {
  //   //	  if (this.cardPanel.style.top.replace("px", "") 
  // }

  // openCardInfoForCreate(event) {
  //   event.stopPropagation();
  //   let x = event.pageX;
  //   let y = event.pageY;

  //   let newPerson = new PersonBean(null, this.person.id, "", this.person.secondName, "", "", "", "", x + 15, y);
  //   let cardInfo = new InfoCard(newPerson, x, y, function (person) {
  //     let json = JSON.stringify(person);
  //     RequestMappingUtils.PostWithResponse('api/create', json, function (id) {
  //       person.id = String(id);
  //       window.parent.addPerson(person);
  //     });
  //   });
  // }

  // openCardInfoForEdit(event) {
  //   event.stopPropagation();
  //   let x = event.pageX;
  //   let y = event.pageY;

  //   let oldPerson = this.person;
  //   let init = this.init;

  //   let cardInfo = new InfoCard(this.person, x, y, function (person) {
  //     let json = JSON.stringify(person);
  //     RequestMappingUtils.Post('api/update', json);

  //     oldPerson.name = person.firstName;
  //     oldPerson.secondName = person.secondName;
  //     oldPerson.patronymic = person.patronymic;
  //     oldPerson.age = person.age;
  //     oldPerson.email = person.email;
  //     oldPerson.address = person.address;

  //     init();
  //   });
  // }

   updateCardPosition() {
     let json = JSON.stringify({ id: this.person.id, posX: this.person.posX, posY: this.person.posY });
     RequestMappingUtils.Post('/api/savePositions', json);
   }

  // deleteCard() {
  //   let dialog = new InfoDialog("Вы действительно хотите удалить карточку?", DialogType.OkNo, function () {
  //     let json = JSON.stringify({ id: this.person.id });
  //     RequestMappingUtils.Post('api/delete', json);
  //   });
  // }

   movePersonCard(event) {
     event.stopPropagation();
     var x = event.pageX;
     var y = event.pageY;

     let new_x = this.delta_x + x / (1 / this.camera.position.z * 1750);
     let new_y = this.delta_y - y / (1 / this.camera.position.z * 1750);
     this.cardPanel.style.top = new_y + 'px';
     this.cardPanel.style.left = new_x + 'px';


//  	  let desktopPanelWidth = this.desktopPanel.style.left.replace("px", ""); 
//  	  let desktopPanelHeight = this.desktopPanel.style.top.replace("px", ""); 
//  	  
//  	  let new
//  	  
//        if (parseInt(this.person.posX) > parseInt(desktopPanelWidth)) {
//      	  this.desktopPanel.style.left = this.person.posX 'px';
//        }
//     this.updateObjectCoordFunc(this.person.id, new_x, new_y);
     this.drawConnectFunc('update');
   }

   saveXY(event) {
     event.stopPropagation();
     this.isActive = true;

     var x = event.pageX;
     var y = event.pageY;

     let x_block = this.cardPanel.offsetLeft;
     let y_block = this.cardPanel.offsetTop;

     this.delta_x = x_block - x / (1 / this.camera.position.z * 1750);
     this.delta_y = y_block + y / (1 / this.camera.position.z * 1750);

   
       document.addEventListener("mousemove", this.movePersonCard, false);
   
   }

   clearXY() {
     event.stopPropagation();
     this.person.posX = this.cardPanel.style.left.replace("px", "");
     this.person.posY = this.cardPanel.style.top.replace("px", "");





       document.removeEventListener("mousemove", this.movePersonCard, false);

     if (this.isActive) {
       this.updateCardPosition();
     }
     this.isActive = false;
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
	  let y = parseInt(this.cardPanel.style.top.replace("px", ""));
    return y;
  }

  getWidth() {
    return this.cardPanel.offsetWidth;
  }

  getHeight() {
    return this.cardPanel.offsetHeight;
  }

  getParentId() {
    return this.person.parentId;
  }

  getId() {
    return this.person.id;
  }
}

export { PersonCard };