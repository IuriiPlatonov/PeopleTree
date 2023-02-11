import * as DIALOG from 'dialogs';
import * as ENUM from 'enum';
import * as BEAN from 'beans';


class PersonCard {

    constructor(person, camera, eventBus, theme, drawConnectFunc) {
        this.camera = camera;
        this.person = person;
        this.eventBus = eventBus;
        this.drawConnectFunc = drawConnectFunc;
        this.delta_x = 0;
        this.delta_y = 0;
        this.isActive = false;
        this.z = 0;
        this.theme = theme;
        this.bind();
        this.init();

        this.teta = 1290; /*1750*/

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
        this.settingButton.setAttribute('src', 'images/' + this.theme.getName() + '/info.svg');
        buttonPanel.appendChild(this.settingButton);

        this.addButton = document.createElement('img');
        this.addButton.classList.add('icon');
        this.addButton.setAttribute('src', 'images/' + this.theme.getName() + '/plus.svg');
        buttonPanel.appendChild(this.addButton);

        this.deleteButton = document.createElement('img');
        this.deleteButton.classList.add('icon');
        this.deleteButton.classList.add('deleteIcon');
        this.deleteButton.setAttribute('src', 'images/' + this.theme.getName() + '/delete.svg');
        buttonPanel.appendChild(this.deleteButton);
    }

    initListener() {
        this.cardPanel.addEventListener('mousedown', this.saveXY);
        document.addEventListener('mouseup', this.clearXY);
        this.deleteButton.addEventListener('mousedown', this.deleteCard);
        this.settingButton.addEventListener('mousedown', this.openCardInfoForUpdate);
        this.addButton.addEventListener('mousedown', this.openCardInfoForCreate);

        let settingButton = this.settingButton;
        let addButton = this.addButton;
        let deleteButton = this.deleteButton;
        let theme = this.theme;

        this.eventBus.addEventListener("changeTheme", function (data) {
            theme = data;
            settingButton.setAttribute('src', 'images/' + data.getName() + '/info.svg');
            addButton.setAttribute('src', 'images/' + data.getName() + '/plus.svg');
            deleteButton.setAttribute('src', 'images/' + data.getName() + '/delete.svg');
        });

    }

    openCardInfoForCreate(event) {
        if (event.which != 1) return;
        event.stopPropagation();

        let theme = this.theme;
        let eventBus = this.eventBus;
        let camera = this.camera;
        let drawConnectFunc = this.drawConnectFunc;

        let x = parseInt(this.person.posX);
        let y = parseInt(this.person.posY) - 150;

        let newPerson = new BEAN.PersonBean(null, this.person.id, "",
            this.person.secondName, "", "", "", "", x, y);

        let cardInfo = new DIALOG.InfoCard(newPerson, function (person) {
            let json = JSON.stringify(person);
            RequestMappingUtils.postWithResponse('api/create', json, function (person) {
                // person.id = person.id;
                let object = new PersonCard(person, camera, eventBus, theme, drawConnectFunc);
                window.parent.addObject(object);
            });
        });
    }

    openCardInfoForUpdate(event) {
        if (event.which != 1) return;
        event.stopPropagation();
        let oldPerson = this.person;
        let updateCardData = this.updateCardData;

        let cardInfo = new DIALOG.InfoCard(this.person, function (person) {
            let json = JSON.stringify(person);
            RequestMappingUtils.post('api/update', json);

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
        let json = JSON.stringify({id: this.person.id, posX: this.person.posX, posY: this.person.posY});
        RequestMappingUtils.post('/api/savePositions', json);
    }

    deleteCard(event) {
        if (event.which != 1) return;
        event.stopPropagation();
        let id = this.person.id;
        let parentId = this.person.parentId;

        function createDelDialog() {
            let dialog = new DIALOG.InfoDialog("Вы действительно хотите удалить карточку?", ENUM.DialogType.OkNo, function () {
                let json = JSON.stringify({id: id});
                RequestMappingUtils.postWithResponse('api/delete', json, function (people) {
                    window.parent.delObjects(people);
                });
            });
        }

        function createDelAllOrReplaceChildrenDialog() {
            let dialog = new DIALOG.InfoDialog("Вы действительно хотите удалить карточку?<br>'Да' - все потомки будут удалены.<br>'Выше' - все потомки будут привязаны выше.", ENUM.DialogType.OkNoCancel,
                function () {
                    let json = JSON.stringify({id: id});
                    RequestMappingUtils.postWithResponse('api/delete', json, function (people) {
                        window.parent.delObjects(people);
                    });
                },
                function () {
                    let json = JSON.stringify({id: id, parentId: parentId});
                    RequestMappingUtils.postWithResponse('api/deleteParent', json, function (deleteParentResponse) {
                        let parent = [deleteParentResponse.parent];
                        let children = deleteParentResponse.children;
                        window.parent.updateObjectParent(parent, children);
                        window.parent.delObjects(parent);
                    });
                });
            dialog.setCancelButtonText('Выше');
        }


        RequestMappingUtils.get('/api/childrenCount?' + new URLSearchParams({personId: id}), function (response) {
            let childrenCount = parseInt(response.id);
            if (childrenCount == 1) {
                createDelDialog();
            } else {
                createDelAllOrReplaceChildrenDialog();
            }
        });
    }


    movePersonCard(event) {
        if (event.which != 1) return;
        event.stopPropagation();
        let x = event.pageX;
        let y = event.pageY;

        let new_x = this.delta_x + x / (1 / this.camera.position.z * this.teta);
        let new_y = this.delta_y - y / (1 / this.camera.position.z * this.teta);
        this.cardPanel.style.top = new_y + 'px';
        this.cardPanel.style.left = new_x + 'px';

        this.drawConnectFunc('update');
    }

    saveXY(event) {
        if (event.which != 1) return;
        event.stopPropagation();
        this.isActive = true;

        var x = event.pageX;
        var y = event.pageY;

        let x_block = this.cardPanel.offsetLeft;
        let y_block = this.cardPanel.offsetTop;

        this.delta_x = x_block - x / (1 / this.camera.position.z * this.teta);
        this.delta_y = y_block + y / (1 / this.camera.position.z * this.teta);

        document.addEventListener("mousemove", this.movePersonCard);

    }

    clearXY(event) {
        if (event.which != 1) return;
        event.stopPropagation();
        this.person.posX = this.cardPanel.style.left.replace("px", "");
        this.person.posY = this.cardPanel.style.top.replace("px", "");


        document.removeEventListener("mousemove", this.movePersonCard);

        if (this.isActive) {
            this.updateCardPosition();
            window.parent.updateTarget(this.person.id);
        }
        this.isActive = false;
    }

    getPosX() {
        return parseInt(this.person.posX);
    }

    getPosY() {
        return parseInt(this.person.posY);
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

    setParentId(id) {
        this.person.parentId = id;
    }

    getId() {
        return this.person.id;
    }


}


class AuthCard {

    constructor(authBean, camera, eventBus, theme, drawConnectFunc, nextStepFunc) {
        this.camera = camera;
        this.authBean = authBean;
        this.eventBus = eventBus;
        this.drawConnectFunc = drawConnectFunc;
        this.nextStepFunc = nextStepFunc;
        this.delta_x = 0;
        this.delta_y = 0;
        this.isActive = false;
        this.z = 0;
        this.theme = theme;
        this.bind();
        this.init();

        this.teta = 1290; /*1750*/

    }

    bind() {
        this.moveAuthCard = this.moveAuthCard.bind(this);
        this.saveXY = this.saveXY.bind(this);
        this.clearXY = this.clearXY.bind(this);
        this.init = this.init.bind(this);
        this.updateCardData = this.updateCardData.bind(this);

    }

    init() {
        this.initCardPanel();
        if (this.authBean.authType === ENUM.AuthType.input) {
            this.initInputBlock();
        } else {
            this.initButtonBlock();
        }
        this.initListener();
    }

    initCardPanel() {
        this.cardPanel = document.createElement('div');
        this.cardPanel.classList.add('loginPanel');
        this.cardPanel.classList.add('noselect');
        this.cardPanel.style.left = this.authBean.posX + 'px';
        this.cardPanel.style.top = this.authBean.posY + 'px';
    }

    initInputBlock() {
        this.caption = document.createElement('div');
        this.caption.classList.add('loginLabel');
        this.cardPanel.appendChild(this.caption);

        this.value = document.createElement('input');
        this.value.classList.add('loginInput');
        this.value.value = "";
        this.cardPanel.appendChild(this.value);

        this.updateCardData();
    }


    updateCardData() {
        this.caption.innerHTML = '<span>' + this.authBean.caption + '</span>';
    }

    initButtonBlock() {
        this.button = document.createElement('div');
        this.button.classList.add('loginButton');
        this.cardPanel.appendChild(this.button);

        this.buttonText = document.createElement('span');
        this.buttonText.classList.add('loginButtonText');
        this.buttonText.innerHTML = this.authBean.caption;
        this.button.appendChild(this.buttonText);


    }

    initListener() {
        this.cardPanel.addEventListener('mousedown', this.saveXY);
        document.addEventListener('mouseup', this.clearXY);
        if (this.authBean.authType !== ENUM.AuthType.input) {
            this.button.addEventListener('mousedown', this.doOnClick);
        }
        let button = this.button;
        let theme = this.theme;

        this.eventBus.addEventListener("changeTheme", function (data) {
            theme = data;
 //            if (this.authBean.authType !== ENUM.AuthType.input) {
 // //               button.setAttribute('src', 'images/' + data.getName() + '/info.svg');
 //            }
        });

    }

    doOnClick(){
        this.nextStepFunc();
    }

    moveAuthCard(event) {
        if (event.which != 1) return;
        event.stopPropagation();
        var x = event.pageX;
        var y = event.pageY;

        let new_x = this.delta_x + x / (1 / this.camera.position.z * this.teta);
        let new_y = this.delta_y - y / (1 / this.camera.position.z * this.teta);
        this.cardPanel.style.top = new_y + 'px';
        this.cardPanel.style.left = new_x + 'px';

        this.drawConnectFunc('update');
    }

    saveXY(event) {
        if (event.which != 1) return;
        event.stopPropagation();
        this.isActive = true;

        var x = event.pageX;
        var y = event.pageY;

        let x_block = this.cardPanel.offsetLeft;
        let y_block = this.cardPanel.offsetTop;

        this.delta_x = x_block - x / (1 / this.camera.position.z * this.teta);
        this.delta_y = y_block + y / (1 / this.camera.position.z * this.teta);

        document.addEventListener("mousemove", this.moveAuthCard);

    }

    clearXY(event) {
        if (event.which != 1) return;
        event.stopPropagation();
        this.authBean.posX = this.cardPanel.style.left.replace("px", "");
        this.authBean.posY = this.cardPanel.style.top.replace("px", "");


        document.removeEventListener("mousemove", this.moveAuthCard);

        if (this.isActive) {
//	      window.parent.updateTarget(this.person.id);
        }
        this.isActive = false;
    }

    getPosX() {
        return parseInt(this.authBean.posX);
    }

    getPosY() {
        return parseInt(this.authBean.posY);
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
        return this.authBean.parentId;
    }

    setParentId(id) {
        this.authBean.parentId = id;
    }

    getValue() {
        return this.authBean.value;
    }

    getId() {
        return this.authBean.id;
    }

}

export {PersonCard, AuthCard};