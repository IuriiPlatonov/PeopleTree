import * as DIALOG from 'dialogs';
import * as ENUM from 'enum';
import * as BEAN from 'beans';


class PersonCard {

  constructor(person, camera, drawConnectFunc) {
    this.camera = camera;
    this.person = person;
    this.drawConnectFunc = drawConnectFunc;
    this.delta_x = 0;
    this.delta_y = 0;
    this.isActive = false;
    this.z = 0;

    this.bind();
    this.init();
  }

  bind() {
    this.openCardInfoForCreate = this.openCardInfoForCreate.bind(this);
    this.openCardInfoForUpdate = this.openCardInfoForUpdate.bind(this);
    this.updateCardPosition = this.updateCardPosition.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.movePersonCard = this.movePersonCard.bind(this);
    this.saveXY = this.saveXY.bind(this);
    this.clearXY = this.clearXY.bind(this);
    this.init = this.init.bind(this);
    this.updateCardData = this.updateCardData.bind(this);
  }

  init() {
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
    infoPanel.appendChild(this.nameText);

    this.secondNameText = document.createElement('div');
    this.secondNameText.classList.add('name');
    infoPanel.appendChild(this.secondNameText);

    this.patronymicText = document.createElement('div');
    this.patronymicText.classList.add('name');
    infoPanel.appendChild(this.patronymicText);

    this.ageText = document.createElement('div');
    this.ageText.classList.add('name');
    infoPanel.appendChild(this.ageText);

    this.updateCardData();
  }


  updateCardData() {
    this.nameText.innerHTML = '<span>' + this.person.firstName + '</span>';
    this.secondNameText.innerHTML = '<span>' + this.person.secondName + '</span>';
    this.patronymicText.innerHTML = '<span>' + this.person.patronymic + '</span>';
    this.ageText.innerHTML = '<span>' + this.person.age + '</span>';
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
    this.deleteButton.addEventListener('mousedown', this.deleteCard);
    this.settingButton.addEventListener('mousedown', this.openCardInfoForUpdate);
    this.addButton.addEventListener('mousedown', this.openCardInfoForCreate);
  }

  openCardInfoForCreate(event) {
    event.stopPropagation();
    let x = parseInt(this.person.posX);
    let y = parseInt(this.person.posY) - 150;

    let newPerson = new BEAN.PersonBean(null, this.person.id, "",
      this.person.secondName, "", "", "", "", x, y);
    let cardInfo = new DIALOG.InfoCard(newPerson, function (person) {
      let json = JSON.stringify(person);
      RequestMappingUtils.PostWithResponse('api/create', json, function (person) {
        person.id = person.id;
        window.parent.addPerson(person);
      });
    });
  }

  openCardInfoForUpdate(event) {
    event.stopPropagation();
    let oldPerson = this.person;
    let updateCardData = this.updateCardData;

    let cardInfo = new DIALOG.InfoCard(this.person, function (person) {
      let json = JSON.stringify(person);
      RequestMappingUtils.Post('api/update', json);

      oldPerson.name = person.firstName;
      oldPerson.secondName = person.secondName;
      oldPerson.patronymic = person.patronymic;
      oldPerson.age = person.age;
      oldPerson.email = person.email;
      oldPerson.address = person.address;

      updateCardData();
    });
  }

  updateCardPosition() {
    let json = JSON.stringify({ id: this.person.id, posX: this.person.posX, posY: this.person.posY });
    RequestMappingUtils.Post('/api/savePositions', json);
  }

  deleteCard(event) {
    event.stopPropagation();
    let userId = this.person.id;
    let dialog = new DIALOG.InfoDialog("Вы действительно хотите удалить карточку?", ENUM.DialogType.OkNo, function () {
      let json = JSON.stringify({ id: userId });
      RequestMappingUtils.Post('api/delete', json);
      window.parent.delPerson(userId);
    });
  }

  movePersonCard(event) {
    event.stopPropagation();
    var x = event.pageX;
    var y = event.pageY;

    let new_x = this.delta_x + x / (1 / this.camera.position.z * 1750);
    let new_y = this.delta_y - y / (1 / this.camera.position.z * 1750);
    this.cardPanel.style.top = new_y + 'px';
    this.cardPanel.style.left = new_x + 'px';

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
    window.parent.updateTarget(this.person.id);




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

  getZ() {
    return this.z;
  }

  setZ(z) {
    this.z = z;
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