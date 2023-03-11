class InfoDialog {

    constructor(message, type, okCallback, cancelCallback) {
        this.message = message;
        this.type = type;
        this.okCallback = okCallback;
        this.cancelCallback = cancelCallback;
        this.isActive = false;
        this.delta_x = 0;
        this.delta_y = 0;

        if (type.getName() === 'ok') {
            this.createOkDialog();
        }
        if (type.getName() === 'okno') {
            this.createOkNoDialog();
        }
        if (type.getName() === 'oknocancel') {
            this.createOkNoCancelDialog();
        }
        this.bind();
        this.initListener();
    }

    bind() {
        this.saveXY = this.saveXY.bind(this);
        this.clearXY = this.clearXY.bind(this);
        this.moveBlock = this.moveBlock.bind(this);
        this.ok = this.ok.bind(this);
        this.no = this.no.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    createOkDialog() {
        this.dialog = document.createElement('div');
        this.dialog.classList.add('infoDialog');
        this.dialog.innerHTML = '<span>' + this.message + ' Ok button </span>';
        document.body.appendChild(this.dialog);
    }

    createOkNoDialog() {
        this.backgroung = document.createElement('div');
        this.backgroung.classList.add('infoDialogBackground');
        document.body.appendChild(this.backgroung);


        this.dialog = document.createElement('div');
        this.dialog.classList.add('infoDialog');
        this.dialog.classList.add('noselect');
        this.backgroung.appendChild(this.dialog);

        let messageBox = document.createElement('span');
        messageBox.classList.add('infoDialogMessage');
        messageBox.innerHTML = this.message;
        this.dialog.appendChild(messageBox);

        this.noButton = document.createElement('div');
        this.noButton.classList.add('infoDialogButton');
        this.dialog.appendChild(this.noButton);

        this.noButtonText = document.createElement('span');
        this.noButtonText.classList.add('infoDialogButtonText');
        this.noButtonText.innerHTML = 'Нет';
        this.noButton.appendChild(this.noButtonText);

        this.okButton = document.createElement('div');
        this.okButton.classList.add('infoDialogButton');
        this.dialog.appendChild(this.okButton);

        this.okButtonText = document.createElement('span');
        this.okButtonText.classList.add('infoDialogButtonText');
        this.okButtonText.innerHTML = 'Да';
        this.okButton.appendChild(this.okButtonText);
    }

    createOkNoCancelDialog() {
        this.backgroung = document.createElement('div');
        this.backgroung.classList.add('infoDialogBackground');
        document.body.appendChild(this.backgroung);


        this.dialog = document.createElement('div');
        this.dialog.classList.add('infoDialog');
        this.dialog.classList.add('noselect');
        this.backgroung.appendChild(this.dialog);

        let messageBox = document.createElement('span');
        messageBox.classList.add('infoDialogMessage');
        messageBox.innerHTML = this.message;
        this.dialog.appendChild(messageBox);

        this.noButton = document.createElement('div');
        this.noButton.classList.add('infoDialogButton');
        this.dialog.appendChild(this.noButton);

        this.noButtonText = document.createElement('span');
        this.noButtonText.classList.add('infoDialogButtonText');
        this.noButtonText.innerHTML = 'Нет';
        this.noButton.appendChild(this.noButtonText);

        this.cancelButton = document.createElement('div');
        this.cancelButton.classList.add('infoDialogButton');
        this.dialog.appendChild(this.cancelButton);

        this.cancelButtonText = document.createElement('span');
        this.cancelButtonText.classList.add('infoDialogButtonText');
        this.cancelButtonText.innerHTML = 'Отмена';
        this.cancelButton.appendChild(this.cancelButtonText);

        this.okButton = document.createElement('div');
        this.okButton.classList.add('infoDialogButton');
        this.dialog.appendChild(this.okButton);

        this.okButtonText = document.createElement('span');
        this.okButtonText.classList.add('infoDialogButtonText');
        this.okButtonText.innerHTML = 'Да';
        this.okButton.appendChild(this.okButtonText);
    }

    setOkButtonText(text) {
        this.okButtonText.innerHTML = text;
    }

    setCancelButtonText(text) {
        this.cancelButtonText.innerHTML = text;
    }

    setNoButtonText(text) {
        this.noButtonText.innerHTML = text;
    }

    saveXY(event) {
        this.isActive = true;
        var x = event.pageX;
        var y = event.pageY;

        let x_block = this.dialog.offsetLeft;
        let y_block = this.dialog.offsetTop;

        this.delta_x = x_block - x;
        this.delta_y = y_block - y;

        document.addEventListener("mousemove", this.moveBlock, false);

    }

    clearXY() {
        document.removeEventListener("mousemove", this.moveBlock, false);
    }

    moveBlock(event) {
        var x = event.pageX;
        var y = event.pageY;

        let new_x = this.delta_x + x;
        let new_y = this.delta_y + y;
        this.dialog.style.top = new_y + 'px';
        this.dialog.style.left = new_x + 'px';
    }

    ok() {
        this.okCallback();
        document.body.removeChild(this.backgroung);
    }

    cancel() {
        this.cancelCallback();
        document.body.removeChild(this.backgroung);
    }

    no() {
        document.body.removeChild(this.backgroung);
    }

    initListener() {
        this.dialog.addEventListener('mousedown', this.saveXY);
        document.addEventListener('mouseup', this.clearXY);
        this.okButton.addEventListener('click', this.ok);
        if (this.type.getName() === 'okno' || this.type.getName() === 'oknocancel') this.noButton.addEventListener('click', this.no);
        if (this.type.getName() === 'oknocancel') this.cancelButton.addEventListener('click', this.cancel);
    }
}

class InfoCard {

    constructor(person, callback) {
        this.callback = callback;
        this.person = person;

        this.ie = 0;
        if (navigator.userAgent.indexOf("MSIE") != -1) this.ie = 1;

        this.initCardInfo();
        this.initListener();
    }

    initCardInfo() {

        this.backgroung = document.createElement('div');
        this.backgroung.classList.add('infoCardBackground');
        document.body.appendChild(this.backgroung);

        let cardInfoPanel = document.createElement('div');
        cardInfoPanel.classList.add('infoCardPanel');
        cardInfoPanel.classList.add('noselect');
//		  cardInfoPanel.style.left = this.x + 'px';
//		  cardInfoPanel.style.top = this.y + 'px';
        this.backgroung.appendChild(cardInfoPanel);

        this.namePanel = this.createField(this.person.firstName, "infoCardName", 'Имя');
        cardInfoPanel.appendChild(this.namePanel);

        this.secondNamePanel = this.createField(this.person.secondName, "infoCardSecondName", 'Фамилия');
        cardInfoPanel.appendChild(this.secondNamePanel);

        this.patronymicPanel = this.createField(this.person.patronymic, "infoCardPatronymic", 'Отчество');
        cardInfoPanel.appendChild(this.patronymicPanel);

        this.agePanel = this.createField(this.person.age, "infoCardAge", 'Возраст');
        cardInfoPanel.appendChild(this.agePanel);

        this.emailPanel = this.createField(this.person.email, "infoCardEmail", 'Почта');
        cardInfoPanel.appendChild(this.emailPanel);

        this.addressPanel = this.createField(this.person.address, "infoCardAddress", 'Адрес');
        cardInfoPanel.appendChild(this.addressPanel);

        let buttonPanel = document.createElement('div');
        buttonPanel.classList.add('infoCardButtonPanel');
        cardInfoPanel.appendChild(buttonPanel);

        this.okButton = document.createElement('div');
        this.okButton.classList.add('infoCardButton');
        this.okButton.innerHTML = '<span class="infoCardButtonText">Сохранить</span>';
        buttonPanel.appendChild(this.okButton);

        this.noButton = document.createElement('div');
        this.noButton.classList.add('infoCardButton');
        this.noButton.innerHTML = '<span class="infoCardButtonText">Отмена</span>';
        buttonPanel.appendChild(this.noButton);
    }

    createField(value, id, label) {
        let panel = document.createElement('div');
        panel.classList.add('inputPanel');

        let input = document.createElement('input');
        input.id = id;
        input.classList.add('infoCardInput');
        input.value = value;

        let nameLabel = document.createElement('label');
        nameLabel.classList.add('infoCardLabel');
        nameLabel.htmlFor = id;
        nameLabel.innerHTML = label;
        panel.appendChild(nameLabel);
        panel.appendChild(input);
        return panel;
    }


    initListener() {
        let backgroung = this.backgroung;

        let noButton = this.noButton;
        let okButton = this.okButton;
        let callback = this.callback;
        let person = this.person;
        let name = this.namePanel.childNodes[1];
        let secondName = this.secondNamePanel.childNodes[1];
        let patronymic = this.patronymicPanel.childNodes[1];
        let age = this.agePanel.childNodes[1];
        let email = this.emailPanel.childNodes[1];
        let address = this.addressPanel.childNodes[1];

        let id = this.person.id;
        let parentId = this.person.parentId;

        if (this.ie) {
            okButton.onclick = ok;
            noButton.onclick = no;
        } else {
            okButton.addEventListener('click', ok);
            noButton.addEventListener('click', no);
        }

        function ok() {
            person.id = id;
            person.parentId = parentId;
            person.firstName = name.value;
            person.secondName = secondName.value;
            person.patronymic = patronymic.value;
            person.age = age.value;
            person.email = email.value;
            person.address = address.value;

            callback(person);
            document.body.removeChild(backgroung);
        }

        function no() {
            document.body.removeChild(backgroung);
        }
    }
}

class AddCardDialog {
	constructor(cards, callback) {
		this.callback = callback;
		this.cards = cards;
        this.cardMap = new Map();
		this.initDialog();
		this.initListener();
	}

	initDialog() {
        this.backgroung = document.createElement('div');
        this.backgroung.classList.add('addCardDialogBackground');
        this.backgroung.style.display = 'flex';
        this.backgroung.style.alignItems = 'center';
        this.backgroung.style.placeContent = 'center';
        this.backgroung.style.flexDirection = 'column';

        document.body.appendChild(this.backgroung);

		this.cards.forEach((value, key) => {
			value.forEach(element => {
				if (element.elementIdentifier === 'CARD_PANEL') {
					let cardPanel = document.createElement('div');
					cardPanel.classList.add('addCardDialogPanel');
					cardPanel.classList.add('noselect');
                    cardPanel.style.position = 'relative';
                    cardPanel.style.marginTop = '30px';
					cardPanel.style.height = element.height + 'px';
					cardPanel.style.width = element.width + 'px';
                    this.cardMap.set(key, cardPanel);
                    this.backgroung.appendChild(cardPanel);
				}
			});
            value.forEach(element => {
				if (element.elementIdentifier === 'DIV') {
					let el = document.createElement('div');
					el.classList.add('cardElementBorder');
					// el.classList.add('cardElementCursorMove');
					el.classList.add('cardElementBackground');
					// el.classList.add('cardElementShadow');
					el.classList.add('cardElementFont');
					el.classList.add('cardElementFlexCenter');
                    el.style.position = 'absolute';
					el.innerHTML = '<span>' + element.value + '</span>';
					el.style.left = element.posX + 'px';
					el.style.top = element.posY + 'px';
					el.style.height = element.height + 'px';
					el.style.width = element.width + 'px';
                    this.cardMap.get(key).appendChild(el);
				}
			});

            value.forEach(element => {
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
                    this.cardMap.get(key).appendChild(el);
                }
            });

            value.forEach(element => {
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
                    this.cardMap.get(key).appendChild(el);
                }
            });
		});
	}

	initListener() {
        let callback = this.callback;
        let backgroung = this.backgroung;
        this.cardMap.forEach((value, key) => {
            value.addEventListener('pointerdown', function () {
                // let id = key;
                document.body.removeChild(backgroung);
                callback(key);

            });
        });


	}
}

export {InfoDialog, InfoCard, AddCardDialog};
