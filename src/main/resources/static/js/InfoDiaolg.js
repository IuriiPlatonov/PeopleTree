class InfoDialog {

	constructor(message, type, callback) {
		this.message = message;
		this.type = type;
		this.callback = callback;
		
		this.isActive = false;
		this.delta_x = 0;
		this.delta_y = 0;
		
		this.ie = 0;
		if (navigator.userAgent.indexOf("MSIE") != -1) this.ie = 1;
		
		if (type.getName() === 'ok') {
			this.createOkDialog();
		}
		if (type.getName() === 'okno') {
			this.createOkNoDialog();
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
	}

	createOkDialog() {
		this.dialog = DomUtils.addDivWithText(document.body, 'infoDialog', '<span>' + this.message + ' Ok button </span>');
	}

	createOkNoDialog() {
		this.backgroung = DomUtils.addDiv(document.body, 'infoDialogBackground')
		this.dialog = DomUtils.addDivWithClasses(this.backgroung, ['infoDialog', 'noselect']);
		DomUtils.addSpan(this.dialog, 'infoDialogMessage', this.message);

		this.noButton = DomUtils.addDivWithText(this.dialog, 'infoDialogButton', '<span class="infoDialogButtonText">Нет</span>');
		this.okButton = DomUtils.addDivWithText(this.dialog, 'infoDialogButton', '<span class="infoDialogButtonText">Да</span>');
	}

	saveXY(event) {
		this.isActive = true;
		var x = event.pageX;
		var y = event.pageY;

		let x_block = this.dialog.offsetLeft;
		let y_block = this.dialog.offsetTop;

		this.delta_x = x_block - x;
		this.delta_y = y_block - y;

		if (this.ie) {
			document.onmousemove = this.moveBlock;
		} else {
			document.addEventListener("mousemove", this.moveBlock, false);
		}
	}
	
	clearXY() {
		if (this.ie) {
			document.onmousemove = null;
		} else {
			document.removeEventListener("mousemove", this.moveBlock, false);
		}
	}
	
	moveBlock(event) {
		var	x = event.pageX;
		var	y = event.pageY;

		let new_x = this.delta_x + x;
		let new_y = this.delta_y + y;
		this.dialog.style.top = new_y + 'px';
		this.dialog.style.left = new_x + 'px';
	}

	ok() {
		this.callback();
		document.body.removeChild(this.backgroung);
	}

	no() {
		document.body.removeChild(this.backgroung);
	}
	
	initListener() {
		if (this.ie) {
			this.dialog.onmousedown = this.saveXY;
			document.onmouseup = this.clearXY;
			this.okButton.onclick = this.ok;
			if (this.type.getName() === 'okno') this.noButton.onclick = this.no;
			
		} else {
			this.dialog.addEventListener('mousedown', this.saveXY);
			document.addEventListener('mouseup', this.clearXY);
			this.okButton.addEventListener('click', this.ok);
			if (this.type.getName() === 'okno') this.noButton.addEventListener('click', this.no);
		}
	}
}