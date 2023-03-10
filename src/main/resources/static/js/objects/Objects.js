import * as DIALOG from 'dialogs';
import * as ENUM from 'enum';
import * as BEAN from 'beans';


class Card {

    constructor(cardBean, camera, eventBus, theme, drawConnectFunc) {
        this.camera = camera;
        this.cardBean = cardBean;
        this.eventBus = eventBus;
        this.drawConnectFunc = drawConnectFunc;
        this.delta_x = 0;
        this.delta_y = 0;
        this.isActive = false;
        this.z = 0;
        this.theme = theme;
        this.pointer = new Map();
        this.bind();
        this.init();
        let fi = window.outerHeight / window.outerWidth;
        this.teta = 1320 * (fi < 1 ? 1 : fi); /*1750 : 1290*/
    }

    bind() {
        this.updateCardPosition = this.updateCardPosition.bind(this);
        this.moveCard = this.moveCard.bind(this);
        this.saveXY = this.saveXY.bind(this);
        this.clearXY = this.clearXY.bind(this);
        this.init = this.init.bind(this);
        this.removePointer = this.removePointer.bind(this);
    }

    init() {
        this.initCardPanel();
        this.initListener();
    }

    initCardPanel() {
        this.cardPanel = document.createElement('div');
        this.cardPanel.classList.add('cardPanel');
        this.cardPanel.classList.add('noselect');
        this.cardPanel.style.left = this.cardBean.posX + 'px';
        this.cardPanel.style.top = this.cardBean.posY + 'px';
    }


    initListener() {
        this.cardPanel.addEventListener('pointerdown', this.saveXY);
        document.addEventListener('pointerup', this.clearXY);
        //    document.removeEventListener('pointercancel', this.removePointer);
    }


    updateCardPosition() {
        let json = JSON.stringify({id: this.cardBean.id, posX: this.cardBean.posX, posY: this.cardBean.posY});
        RequestMappingUtils.post('/api/savePositions', json);
    }

    moveCard(event) {
        if (event.pointerType === 'mouse'
            || event.pointerType === 'touch' && this.pointer.size === 1 && event.isPrimary) {
            //   event.preventDefault();
            event.stopPropagation();
            let x = Math.round(event.pageX);
            let y = Math.round(event.pageY);

            let new_x = this.delta_x + x / (1 / this.camera.position.z * this.teta);
            let new_y = this.delta_y - y / (1 / this.camera.position.z * this.teta);
            this.cardPanel.style.top = new_y + 'px';
            this.cardPanel.style.left = new_x + 'px';

            this.drawConnectFunc('update');
        }
    }

    removePointer(event) {
        this.pointer.delete(event.pointerId);
    }

    addPointer(event) {
        this.pointer.set(event.pointerId, event);
    }

    saveXY(event) {
        this.addPointer(event);

        if (event.pointerType === 'mouse' && event.button === 0
            || event.pointerType === 'touch' && this.pointer.size === 1 && event.isPrimary) {
            this.eventBus.fireEvent("canMoveCard", {isMove: true});
            //   event.preventDefault();
            event.stopPropagation();

            this.isActive = true;

            let x = Math.round(event.pageX);
            let y = Math.round(event.pageY);

            let x_block = this.cardPanel.offsetLeft;
            let y_block = this.cardPanel.offsetTop;

            let dx = x_block - x / (1 / this.camera.position.z * this.teta);
            let dy = y_block + y / (1 / this.camera.position.z * this.teta);
            this.delta_x = dx;
            this.delta_y = dy;

            document.addEventListener("pointermove", this.moveCard);
        }
    }

    clearXY(event) {

        if (event.pointerType === 'mouse' && event.button === 0
            || event.pointerType === 'touch' && this.pointer.size === 1 && event.isPrimary) {
            //  event.preventDefault();
            event.stopPropagation();
            this.eventBus.fireEvent("canMoveCard", {isMove: false});
            this.cardBean.posX = this.cardPanel.style.left.replace("px", "");
            this.cardBean.posY = this.cardPanel.style.top.replace("px", "");


            document.removeEventListener("pointermove", this.moveCard);

            if (this.isActive) {
                this.updateCardPosition();
                this.eventBus.fireEvent("updateTarget", this.cardBean.id);
            }
            this.isActive = false;
        }
        this.removePointer(event);
    }

    getPosX() {
        return parseInt(this.cardBean.posX);
    }

    getPosY() {
        return parseInt(this.cardBean.posY);
    }

    setPosX(x) {
        this.cardBean.posX = x;
    }

    setPosY(y) {
        this.cardBean.posY = y;
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
        return this.cardBean.parentId;
    }

    setParentId(id) {
        this.cardBean.parentId = id;
    }

    getId() {
        return this.cardBean.id;
    }


}

class PersonCard extends Card {
    bind() {
        super.bind();
        this.openCardInfoForCreate = this.openCardInfoForCreate.bind(this);
        this.openCardInfoForUpdate = this.openCardInfoForUpdate.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
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
        this.cardPanel.style.left = this.cardBean.posX + 'px';
        this.cardPanel.style.top = this.cardBean.posY + 'px';
    }

    initPhotoBlock() {
        this.photoBlock = document.createElement('div');
        this.photoBlock.classList.add('photoBlock');
        this.photoBlock.innerHTML = '<span>?????? ?????????? ????????</span>';
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
        this.nameText.innerHTML = '<span>' + this.cardBean.firstName + '</span>';
        this.secondNameText.innerHTML = '<span>' + this.cardBean.secondName + '</span>';
        this.patronymicText.innerHTML = '<span>' + this.cardBean.patronymic + '</span>';
        this.ageText.innerHTML = '<span>' + this.cardBean.age + '</span>';
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
        super.initListener();

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
        if (event.which !== 1) return;
        event.stopPropagation();

        let theme = this.theme;
        let eventBus = this.eventBus;
        let camera = this.camera;
        let drawConnectFunc = this.drawConnectFunc;

        let x = parseInt(this.cardBean.posX);
        let y = parseInt(this.cardBean.posY) - 150;

        let newPerson = new BEAN.PersonBean(null, this.cardBean.id, this.cardBean.workspaceId, "",
            this.cardBean.secondName, "", "", "", "", x, y);

        let cardInfo = new DIALOG.InfoCard(newPerson, function (person) {
            let json = JSON.stringify(person);
            RequestMappingUtils.postWithResponse('api/create', json, function (person) {

                let object = new PersonCard(person, camera, eventBus, theme, drawConnectFunc);
                eventBus.fireEvent("addObject", object);

            });
        });
    }

    openCardInfoForUpdate(event) {
        if (event.which !== 1) return;
        event.stopPropagation();
        let oldCardBean = this.cardBean;
        let updateCardData = this.updateCardData;

        let cardInfo = new DIALOG.InfoCard(this.cardBean, function (card) {
            let json = JSON.stringify(card);
            RequestMappingUtils.post('api/update', json);

            oldCardBean.name = card.firstName;
            oldCardBean.secondName = card.secondName;
            oldCardBean.patronymic = card.patronymic;
            oldCardBean.age = card.age;
            oldCardBean.email = card.email;
            oldCardBean.address = card.address;

            updateCardData();
        });
    }

    // updateCardPosition() {
    //     let json = JSON.stringify({id: this.cardBean.id, posX: this.cardBean.posX, posY: this.cardBean.posY});
    //     RequestMappingUtils.post('/api/savePositions', json);
    // }

    deleteCard(event) {
        if (event.which !== 1) return;
        event.stopPropagation();
        let id = this.cardBean.id;
        let parentId = this.cardBean.parentId;
        let eventBus = this.eventBus;

        function createDelDialog() {
            let dialog = new DIALOG.InfoDialog("???? ?????????????????????????? ???????????? ?????????????? ?????????????????", ENUM.DialogType.OkNo, function () {
                let json = JSON.stringify({id: id});
                RequestMappingUtils.postWithResponse('api/delete', json, function (people) {
                    eventBus.fireEvent("removeObjects", people);
                });
            });
        }

        function createDelAllOrReplaceChildrenDialog() {
            let dialog = new DIALOG.InfoDialog("???? ?????????????????????????? ???????????? ?????????????? ?????????????????<br>'????' - ?????? ?????????????? ?????????? ??????????????.<br>'????????' - ?????? ?????????????? ?????????? ?????????????????? ????????.", ENUM.DialogType.OkNoCancel,
                function () {
                    let json = JSON.stringify({id: id});
                    RequestMappingUtils.postWithResponse('api/delete', json, function (people) {
                        eventBus.fireEvent("removeObjects", people);
                    });
                },
                function () {
                    let json = JSON.stringify({id: id, parentId: parentId});
                    RequestMappingUtils.postWithResponse('api/deleteParent', json, function (deleteParentResponse) {
                        let parent = [deleteParentResponse.parent];
                        let children = deleteParentResponse.children;
                        //       window.parent.updateObjectParent(parent, children);
                        eventBus.fireEvent("updateObjectParent", {parent: parent, children: children});
                        eventBus.fireEvent("removeObjects", parent);
                    });
                });
            dialog.setCancelButtonText('????????');
        }


        RequestMappingUtils.get('/api/childrenCount?' + new URLSearchParams({personId: id}), function (response) {
            let childrenCount = parseInt(response.id);
            if (childrenCount === 1) {
                createDelDialog();
            } else {
                createDelAllOrReplaceChildrenDialog();
            }
        });
    }
}

class AuthCard extends Card {
    constructor(cardBean, camera, eventBus, theme, drawConnectFunc, nextStepFunc) {
        super(cardBean, camera, eventBus, theme, drawConnectFunc);

        this.nextStepFunc = nextStepFunc;
        this.expanded = false;
        this.valid = false;
    }

    bind() {
        super.bind();
        this.updateCardData = this.updateCardData.bind(this);
        this.doOnClick = this.doOnClick.bind(this);
        this.doOnClickAfterExpand = this.doOnClickAfterExpand.bind(this);
        this.expand = this.expand.bind(this);
        this.doOnTypeText = this.doOnTypeText.bind(this);
    }

    init() {
        this.initCardPanel();
        if (this.cardBean.authType === ENUM.AuthType.input) {
            this.initInputBlock();
        }
        if (this.cardBean.authType === ENUM.AuthType.button) {
            this.initButtonBlock();
        }
        if (this.cardBean.authType === ENUM.AuthType.collapsedInput
            || this.cardBean.authType === ENUM.AuthType.collapsedButton) {
            this.initCollapsedInputBlock();
        }
        this.initListener();
    }

    initCardPanel() {
        this.cardPanel = document.createElement('div');
        this.cardPanel.classList.add('loginPanel');
        this.cardPanel.classList.add('noselect');
        this.cardPanel.style.width = this.cardBean.width + 'px';
        this.cardPanel.style.left = this.cardBean.posX + 'px';
        this.cardPanel.style.top = this.cardBean.posY + 'px';
    }

    initInputBlock() {
        this.caption = document.createElement('div');
        this.caption.classList.add('loginLabel');
        this.cardPanel.appendChild(this.caption);

        this.value = document.createElement('input');
        this.value.classList.add('loginInput');
        this.value.classList.add('select');
        this.value.value = "";
        this.cardPanel.appendChild(this.value);

        this.updateCardData();
    }

    initCollapsedInputBlock() {

        this.button = document.createElement('div');
        this.button.classList.add('loginCollapsedButton');
        this.cardPanel.appendChild(this.button);

        this.buttonText = document.createElement('span');
        this.buttonText.classList.add('loginCollapsedButtonText');
        this.buttonText.innerHTML = '+';
        this.button.appendChild(this.buttonText);

        this.cardPanel.style.width = 50 + 'px';

    }

    updateCardData() {
        this.caption.innerHTML = '<span>' + this.cardBean.caption + '</span>';
    }

    initButtonBlock() {
        this.button = document.createElement('div');
        this.button.classList.add('loginButton');
        this.cardPanel.appendChild(this.button);

        this.buttonText = document.createElement('span');
        this.buttonText.classList.add('loginButtonText');
        this.buttonText.innerHTML = this.cardBean.caption;
        this.button.appendChild(this.buttonText);


    }

    initListener() {

        if (this.cardBean.authType === ENUM.AuthType.button) {
            this.button.addEventListener('mousedown', this.doOnClick);
        }
        if (this.cardBean.authType === ENUM.AuthType.collapsedInput
            || this.cardBean.authType === ENUM.AuthType.collapsedButton) {
            this.button.addEventListener('mousedown', this.doOnClickAfterExpand);
        }
        if (this.value) {
            this.value.addEventListener('keyup', this.doOnTypeText);
        }

        let theme = this.theme;

        this.eventBus.addEventListener("changeTheme", function (data) {
            theme = data;
        });

    }

    doOnClick() {
        this.nextStepFunc();
    }

    doOnTypeText() {
        this.nextStepFunc(true);
    }

    doOnClickAfterExpand() {
        this.expand();
        if (this.cardBean.authType === ENUM.AuthType.collapsedInput) {
            this.initInputBlock();
            this.nextStepFunc();
        }
        if (this.cardBean.authType === ENUM.AuthType.collapsedButton) {
            this.initButtonBlock();
            this.nextStepFunc(this.expanded);
            this.expanded = true;
        }
        this.initListener();
    }

    expand() {
        this.cardPanel.style.transition = 'width 1s ease-in-out';
        this.cardPanel.style.width = this.cardBean.width + 'px';
        this.cardPanel.removeChild(this.button);
    }

    getValue() {
        return this.value !== null ? this.value.value : "";
    }

    setPos(x, y) {
        this.cardPanel.style.left = x + 'px';
        this.cardPanel.style.top = y + 'px';
    }

    setBorderRed() {
        this.cardPanel.style.border = "3px solid rgba(255, 127, 127, 0.25)"
        this.cardPanel.style.boxShadow = "0px 0px 12px rgba(255, 0, 0, 0.5)"
    }

    setBorderGreen() {
        this.cardPanel.style.border = "3px solid rgba(127, 255, 127, 0.25)"
        this.cardPanel.style.boxShadow = "0px 0px 12px rgba(0,255 , 0, 0.5)"
    }

    setValid(isValid) {
        this.valid = isValid;
    }

    isValid() {
        return this.valid;
    }
}

class InfoCard extends Card {
    constructor(cardBean, camera, eventBus, theme, drawConnectFunc, nextStepFunc) {
        super(cardBean, camera, eventBus, theme, drawConnectFunc);
        this.nextStepFunc = nextStepFunc;
    }

    bind() {
        super.bind();
        this.updateCardData = this.updateCardData.bind(this);
        this.doOnClick = this.doOnClick.bind(this);
    }

    init() {
        this.initCardPanel();
        this.initInfoBlock();
        this.initListener();
    }

    initCardPanel() {

        this.cardPanel = document.createElement('fieldSet');
        this.cardPanel.classList.add('InfoCardPanel');
        this.cardPanel.classList.add('noselect');
        this.cardPanel.style.width = this.cardBean.width + 'px';
        this.cardPanel.style.left = this.cardBean.posX + 'px';
        this.cardPanel.style.top = this.cardBean.posY + 'px';


        let legend = document.createElement('legend');
        legend.classList.add('mainMenuThemePanelLegend');
        legend.innerHTML = this.cardBean.caption;
        this.cardPanel.appendChild(legend);
    }

    initInfoBlock() {
        this.caption = document.createElement('div');
        this.caption.classList.add('loginLabel');
        this.cardPanel.appendChild(this.caption);

        this.button = document.createElement('div');
        this.button.classList.add('infoCardPanelButton');
        this.cardPanel.appendChild(this.button);

        this.buttonText = document.createElement('div');
        this.buttonText.classList.add('loginButtonText');
        this.buttonText.innerHTML = '&times;';
        this.button.appendChild(this.buttonText);

        this.updateCardData();
    }

    updateCardData() {
        this.caption.innerHTML = '<span>' + this.cardBean.value + '</span>';
    }

    initListener() {
        super.initListener();
        this.button.addEventListener('mousedown', this.doOnClick);
        let theme = this.theme;
        this.eventBus.addEventListener("changeTheme", function (data) {
            theme = data;
        });

    }

    doOnClick() {
        this.nextStepFunc();
    }

    setPos(x, y) {
        this.cardPanel.style.left = x + 'px';
        this.cardPanel.style.top = y + 'px';
    }

    getMessage() {
        return this.cardBean.value;
    }
}

class DynamicCard {

    constructor(id, elementMap, camera, eventBus, theme, drawConnectFunc) {
        this.camera = camera;
        this.elementMap = elementMap;
        this.eventBus = eventBus;
        this.drawConnectFunc = drawConnectFunc;
        this.parentId = 0;
        this.workspaceId = '';
        this.cardPanelId = '';
        this.id = id;
        this.delta_x = 0;
        this.delta_y = 0;
        this.posX = 0;
        this.posY = 0;
        this.posZ = 0;
        this.isActive = false;
        this.z = 0;
        this.theme = theme;
        this.elements = new Map();
        this.pointer = new Map();
        this.bind();
        this.init();
        let fi = window.outerHeight / window.outerWidth;
        this.teta = 1320 * (fi < 1 ? 1 : fi); /*1750 : 1290*/
    }

    bind() {
        this.updateCardPosition = this.updateCardPosition.bind(this);
        this.moveCard = this.moveCard.bind(this);
        this.saveXY = this.saveXY.bind(this);
        this.clearXY = this.clearXY.bind(this);
        this.init = this.init.bind(this);
        this.removePointer = this.removePointer.bind(this);
        this.onDblClick = this.onDblClick.bind(this);
        this.openCardInfoForCreate = this.openCardInfoForCreate.bind(this);
        this.openCardInfoForUpdate = this.openCardInfoForUpdate.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.deselect = this.deselect.bind(this);
    }

    init() {
        this.initCardPanel();
        if (sessionStorage.getItem('workspaceId') !== '') {
            this.initAddButtonBlock();
        }
        this.initDeleteButtonBlock();
        this.initListener();
    }

    initCardPanel() {
        let eventBus = this.eventBus;
        this.elementMap.forEach(element => {
            if (element.elementIdentifier === 'CARD_PANEL') {
                this.cardPanel = document.createElement('div');
                this.cardPanel.classList.add('cardPanel');
                this.cardPanel.classList.add('noselect');
                this.posX = element.posX;
                this.posY = element.posY;
                this.cardPanel.style.left = element.posX + 'px';
                this.cardPanel.style.top = element.posY + 'px';
                this.cardPanel.style.height = element.height + 'px';
                this.cardPanel.style.width = element.width + 'px';
                this.parentId = element.parentId;
                this.workspaceId = element.workspaceId;
                this.cardPanelId = element.elementId;
            }
        });
        this.elementMap.forEach(element => {
            if (element.elementIdentifier === 'DIV') {
                let el = document.createElement('div');
                el.classList.add('cardElementBorder');
                el.classList.add('cardElementCursorMove');
                el.classList.add('cardElementBackground');
                // el.classList.add('cardElementShadow');
                el.classList.add('cardElementFont');
                el.classList.add('cardElementFlexCenter');

                el.innerHTML = '<span>' + element.value + '</span>';
                el.style.left = element.posX + 'px';
                el.style.top = element.posY + 'px';
                el.style.height = element.height + 'px';
                el.style.width = element.width + 'px';
                this.cardPanel.appendChild(el);
                this.elements.set(element.elementId, el);
            }
        });

        this.elementMap.forEach(element => {
            if (element.elementIdentifier === 'INPUT') {
                let el = document.createElement('input');
                el.classList.add('cardElementBorder');
                el.classList.add('cardElementCursorText');
                el.classList.add('cardElementBackground');
                // el.classList.add('cardElementShadow');
                el.classList.add('cardInputElementFont');
                el.classList.add('cardElementFlexCenter');

                el.value = element.value;
                el.style.left = element.posX + 'px';
                el.style.top = element.posY + 'px';
                el.style.height = element.height + 'px';
                el.style.width = element.width + 'px';
                el.addEventListener('pointerdown', function (event) {
                    event.stopPropagation();
                });
                el.addEventListener('keyup', function () {
                    eventBus.fireEvent("saveTextValue", {value: el.value, elementId: element.elementId});
                });

                this.cardPanel.appendChild(el);
                this.elements.set(element.elementId, el);
            }
        });

        this.elementMap.forEach(element => {
            if (element.elementIdentifier === 'TEXTAREA') {
                let el = document.createElement('textarea');
                el.spellcheck = false;
                el.classList.add('cardElementBorder');
                el.classList.add('cardElementCursorText');
                el.classList.add('cardElementBackground');
                el.classList.add('cardTextAreaScroll');
                el.classList.add('cardInputElementFont');
                el.classList.add('cardElementFlexCenter');

                el.value = element.value;
                el.style.left = element.posX + 'px';
                el.style.top = element.posY + 'px';
                el.style.height = element.height + 'px';
                el.style.width = element.width + 'px';
                el.addEventListener('pointerdown', function (event) {
                    event.stopPropagation();
                });
                el.addEventListener('keyup', function () {
                    eventBus.fireEvent("saveTextValue", {value: el.value, elementId: element.elementId});
                });
                this.cardPanel.appendChild(el);
                this.elements.set(element.elementId, el);
            }
        });

    }

    initAddButtonBlock() {
        this.addButton = document.createElement('img');
        this.addButton.classList.add('controlButtons');
        this.addButton.classList.add('addButton');
        this.addButton.setAttribute('src', 'images/' + this.theme.getName() + '/plus.svg');
        this.cardPanel.appendChild(this.addButton);

        this.addButton.addEventListener('pointerdown', this.openCardInfoForCreate);
    }

    initDeleteButtonBlock() {
        this.deleteButton = document.createElement('img');
        this.deleteButton.classList.add('controlButtons');
        this.deleteButton.classList.add('deleteButton');
        this.deleteButton.setAttribute('src', 'images/' + this.theme.getName() + '/delete.svg');
        this.cardPanel.appendChild(this.deleteButton);

        this.deleteButton.addEventListener('pointerdown', this.deleteCard);
    }

    initListener() {
        this.cardPanel.addEventListener('pointerdown', this.saveXY);
        document.addEventListener('pointerup', this.clearXY);
        this.cardPanel.addEventListener('dblclick', this.onDblClick);
        document.addEventListener('pointerdown', this.deselect);
        this.eventBus.addEventListener("deselect", this.deselect);

        let addButton = this.addButton;
        let deleteButton = this.deleteButton;
        let theme = this.theme;

        this.eventBus.addEventListener("changeTheme", function (data) {
            theme = data;
            //         settingButton.setAttribute('src', 'images/' + data.getName() + '/info.svg');

            addButton.setAttribute('src', 'images/' + data.getName() + '/plus.svg');
            deleteButton.setAttribute('src', 'images/' + data.getName() + '/delete.svg');
        });
        //    document.removeEventListener('pointercancel', this.removePointer);
    }

    onDblClick() {
        this.eventBus.fireEvent("dynamicCardDblClick", this.workspaceId);
    }

    updateCardPosition() {
        let json = JSON.stringify({id: this.cardPanelId, posX: this.posX, posY: this.posY});
        RequestMappingUtils.post('/api/savePosition', json);
    }

    moveCard(event) {
        if (event.pointerType === 'mouse'
            || event.pointerType === 'touch' && this.pointer.size === 1 && event.isPrimary) {
            //   event.preventDefault();
            event.stopPropagation();
            let x = Math.round(event.pageX);
            let y = Math.round(event.pageY);

            let new_x = this.delta_x + x / (1 / this.camera.position.z * this.teta);
            let new_y = this.delta_y - y / (1 / this.camera.position.z * this.teta);
            this.cardPanel.style.top = new_y + 'px';
            this.cardPanel.style.left = new_x + 'px';

            this.drawConnectFunc('update');
        }
    }

    removePointer(event) {
        this.pointer.delete(event.pointerId);
    }

    addPointer(event) {
        this.pointer.set(event.pointerId, event);
    }

    deselect() {
        this.cardPanel.classList.remove('cardPanelSelected');
        this.clearSessionCardParameters();
    }

    clearSessionCardParameters() {
        this.eventBus.fireEvent("setSessionCardParameters", {id: '', posX: 0, posY: 0, posZ: 0});
    }

    saveXY(event) {
        this.addPointer(event);

        if (event.pointerType === 'mouse' && event.button === 0
            || event.pointerType === 'touch' && this.pointer.size === 1 && event.isPrimary) {
            this.eventBus.fireEvent("deselect");
            this.cardPanel.classList.add('cardPanelSelected');
            //   this.setSessionCardParameters(this.id, this.posX, this.posY, this.posZ);
            this.eventBus.fireEvent("setSessionCardParameters", {
                id: this.id,
                posX: this.posX,
                posY: this.posY,
                posZ: this.posZ
            });
            this.eventBus.fireEvent("canMoveCard", {isMove: true});
            //   event.preventDefault();
            event.stopPropagation();

            this.isActive = true;

            let x = Math.round(event.pageX);
            let y = Math.round(event.pageY);

            let x_block = this.cardPanel.offsetLeft;
            let y_block = this.cardPanel.offsetTop;

            let dx = x_block - x / (1 / this.camera.position.z * this.teta);
            let dy = y_block + y / (1 / this.camera.position.z * this.teta);
            this.delta_x = dx;
            this.delta_y = dy;

            document.addEventListener("pointermove", this.moveCard);
        }
    }

    clearXY(event) {

        if (event.pointerType === 'mouse' && event.button === 0
            || event.pointerType === 'touch' && this.pointer.size === 1 && event.isPrimary) {
            //  event.preventDefault();
            event.stopPropagation();
            this.eventBus.fireEvent("canMoveCard", {isMove: false});
            this.posX = this.cardPanel.style.left.replace("px", "");
            this.posY = this.cardPanel.style.top.replace("px", "");


            document.removeEventListener("pointermove", this.moveCard);

            if (this.isActive) {
                this.updateCardPosition();
                this.eventBus.fireEvent("updateTarget", this.id);
            }
            this.isActive = false;
        }
        this.removePointer(event);
    }

    openCardInfoForCreate(event) {
        if (event.which !== 1) return;
        event.stopPropagation();

        this.eventBus.fireEvent("openAddCardDialog",
            {parentId: this.id, posX: this.posX, posY: this.posY, posZ: this.posZ});
    }

    openCardInfoForUpdate(event) {
        if (event.which !== 1) return;
        event.stopPropagation();
        let oldCardBean = this.cardBean;
        let updateCardData = this.updateCardData;

        let cardInfo = new DIALOG.InfoCard(this.cardBean, function (card) {
            let json = JSON.stringify(card);
            RequestMappingUtils.post('api/update', json);

            oldCardBean.name = card.firstName;
            oldCardBean.secondName = card.secondName;
            oldCardBean.patronymic = card.patronymic;
            oldCardBean.age = card.age;
            oldCardBean.email = card.email;
            oldCardBean.address = card.address;

            updateCardData();
        });
    }

    deleteCard(event) {
        if (event.which !== 1) return;
        event.stopPropagation();
        this.eventBus.fireEvent("openDeleteCardDialog",
            {cardId: this.id, workspaceId: this.workspaceId, parentId: this.parentId});
    }

    getPosX() {
        return parseInt(this.posX);
    }

    getPosY() {
        return parseInt(this.posY);
    }

    setPosX(x) {
        this.posX = x;
    }

    setPosY(y) {
        this.posY = y;
    }

    setPosZ(z) {
        this.posZ = z;
    }

    getPosZ() {
        return parseInt(this.posZ);
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
        return this.parentId;
    }

    setParentId(id) {
        this.parentId = id;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }
}

export {PersonCard, AuthCard, InfoCard, DynamicCard};