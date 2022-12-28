class InfoDialog {

	constructor(message, type, callback) {
		this.message = message;
		this.type = type;
		this.callback = callback;
		if (type.getName() === 'ok') {
			this.createOkDialog();
		}
		if (type.getName() === 'okno') {
			this.createOkNoDialog();
		}
		this.initListener();
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
		
		this.dialog = document.createElement('div');
		this.dialog.classList.add('infoDialog');
		this.dialog.classList.add('noselect');

		let message = document.createElement('span');
		message.classList.add('infoDialogMessage');
		message.innerHTML = this.message;

		this.okButton = document.createElement('div');
		this.okButton.classList.add('infoDialogButton');
		this.okButton.innerHTML = '<span class="infoDialogButtonText">Да</span>';
		
		this.noButton = document.createElement('div');
		this.noButton.classList.add('infoDialogButton');
		this.noButton.innerHTML = '<span class="infoDialogButtonText">Нет</span>';
		
		this.dialog.appendChild(message);
		this.dialog.appendChild(this.noButton);
		this.dialog.appendChild(this.okButton);
		
		this.backgroung.appendChild(this.dialog);
		
		document.body.appendChild(this.backgroung);
	}

	initListener() {
		let backgroung = this.backgroung;
		let dialog = this.dialog;
		let noButton = this.noButton;
		let okButton = this.okButton;
		
		let type = this.type;
		
		let callback = this.callback;
		let isActive = false;
		let delta_x = 0;
		let delta_y = 0;
		let ie = 0;
		let browser = navigator.userAgent;

		if (browser.indexOf("MSIE") != -1) ie = 1;

		if (ie) {
			dialog.onmousedown = saveXY;
			document.onmouseup = clearXY;
			okButton.onclick = ok;
			if (type.getName() === 'okno') noButton.onclick = no;
			
		} else {
			dialog.addEventListener('mousedown', saveXY);
			document.addEventListener('mouseup', clearXY);
			okButton.addEventListener('click', ok);
			if (type.getName() === 'okno') noButton.addEventListener('click', no);
		}

		/* Получаем текущие координаты курсора */
		function saveXY(obj_event) {
			var x = 0;
			var y = 0;

			isActive = true;

			if (obj_event) {
				x = obj_event.pageX;
				y = obj_event.pageY;
			}

			else {
				x = window.event.clientX;
				y = window.event.clientY;
				if (ie) {
					y -= 2;
					x -= 2;
				}
			}
			/* Узнаём текущие координаты блока */
			let x_block = dialog.offsetLeft;
			let y_block = dialog.offsetTop;
			/* Узнаём смещение */
			delta_x = x_block - x;
			delta_y = y_block - y;

			if (ie) {
				document.onmousemove = moveBlock;
			} else {
				document.addEventListener("mousemove", moveBlock, false);
			}
		}

		function clearXY() {
			if (ie) {
				document.onmousemove = null;
			} else {
				document.removeEventListener("mousemove", moveBlock, false);
			}
		}

		/* Получаем новые координаты курсора мыши */
		function moveBlock(event) {
			var x = 0;
			var y = 0;
			if (event) {
				x = event.pageX;
				y = event.pageY;
			}
			else {
				x = window.event.clientX;
				y = window.event.clientY;
				if (ie) {
					y -= 2;
					x -= 2;
				}
			}
			/* Вычисляем новые координаты блока */
			let new_x = delta_x + x;
			let new_y = delta_y + y;
			dialog.style.top = new_y + 'px';
			dialog.style.left = new_x + 'px';
		}

		function ok() {
			callback();
			document.body.removeChild(backgroung);
		}

		function no() {
			document.body.removeChild(backgroung);
		}
	}
}