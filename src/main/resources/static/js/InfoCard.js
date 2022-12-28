class InfoCard {

//  constructor(id, parentId, name, secondName, patronymic, age, email, address, x, y, callback) {
//	  this.callback = callback;
//	  this.parentId = parentId;
//	  this.id = id; 
//	  this.name = name; 
//	  this.secondName = secondName; 
//	  this.patronymic = patronymic;
//	  this.age = age; 
//	  this.email = email; 
//	  this.address =address;
//	  this.x = x;
//	  this.y = y;
//	  this.initCardInfo();
//	  this.initListener();
//  }
  
  constructor(person, x, y, callback) {
	  this.x = x;
	  this.y = y;
	  this.callback = callback;
	  this.person = person;
	  this.initCardInfo();
	  this.initListener();
  }
  
  initCardInfo() {
	  
	  this.backgroung = document.createElement('div');
	  this.backgroung.classList.add('infoCardBackground');
	  
	  let cardInfoPanel = document.createElement('div');
	  cardInfoPanel.classList.add('infoCardPanel');
	  cardInfoPanel.classList.add('noselect');
	  cardInfoPanel.style.left = this.x + 'px';
	  cardInfoPanel.style.top = this.y + 'px';
	  
	  this.namePanel = this.createField(this.person.name, "infoCardName", 'Имя');
	  this.secondNamePanel = this.createField(this.person.secondName, "infoCardSecondName", 'Фамилия');
	  this.patronymicPanel = this.createField(this.person.patronymic, "infoCardPatronymic", 'Отчество');
	  this.agePanel = this.createField(this.person.age, "infoCardAge", 'Возраст');
	  this.emailPanel = this.createField(this.person.email, "infoCardEmail", 'Почта');
	  this.addressPanel = this.createField(this.person.address, "infoCardAddress", 'Адрес');
  
	  let buttonPanel = document.createElement('div');
	  buttonPanel.classList.add('infoCardButtonPanel');	  
	  
	  this.okButton = document.createElement('div');
	  this.okButton.classList.add('infoCardButton');
	  this.okButton.innerHTML = '<span class="infoCardButtonText">Сохранить</span>';
		
	  this.noButton = document.createElement('div');
	  this.noButton.classList.add('infoCardButton');
	  this.noButton.innerHTML = '<span class="infoCardButtonText">Отмена</span>';

	  buttonPanel.appendChild(this.okButton);
	  buttonPanel.appendChild(this.noButton);
	  
	  cardInfoPanel.appendChild(this.namePanel);
	  cardInfoPanel.appendChild(this.secondNamePanel);
	  cardInfoPanel.appendChild(this.patronymicPanel);
	  cardInfoPanel.appendChild(this.agePanel);
	  cardInfoPanel.appendChild(this.emailPanel);
	  cardInfoPanel.appendChild(this.addressPanel);
	  
	  cardInfoPanel.appendChild(buttonPanel);
	  
	  this.backgroung.appendChild(cardInfoPanel);
	  
	  document.body.appendChild(this.backgroung);
  }
  
  createField(value, id, label)
  {
	  let panel = document.createElement('div');
	  panel.classList.add('inputPanel');
	  
	  let input = document.createElement('input');
	  input.id = id;
	  input.classList.add('input');
	  input.value = value;
	  
	  let nameLabel = document.createElement('label');
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
		
		let name = this.namePanel.childNodes[1];
		let secondName = this.secondNamePanel.childNodes[1];
		let patronymic = this.patronymicPanel.childNodes[1];
		let age = this.agePanel.childNodes[1];
		let email = this.emailPanel.childNodes[1];
		let address = this.addressPanel.childNodes[1];
		
		let id = this.person.id;
		
		let parentId = this.person.parentId;
		let ie = 0;
		let browser = navigator.userAgent;

		if (browser.indexOf("MSIE") != -1) ie = 1;

		if (ie) {

			okButton.onclick = ok;
			noButton.onclick = no;
			
		} else {

			okButton.addEventListener('click', ok);
			noButton.addEventListener('click', no);
		}

		function ok() {
			callback(id, parentId, name.value, secondName.value, patronymic.value, age.value, email.value, address.value);
			document.body.removeChild(backgroung);
		}

		function no() {
			document.body.removeChild(backgroung);
		}
	}
}