class InfoCard {

  constructor(person, x, y, callback) {
	  this.x = x;
	  this.y = y;
	  this.callback = callback;
	  this.person = person;
	  
	  this.ie = 0;
	  if (navigator.userAgent.indexOf("MSIE") != -1) this.ie = 1;
	  
	  this.initCardInfo();
	  this.initListener();
  }
  
  initCardInfo() {
	  
	  this.backgroung = DomUtils.addDiv(document.body, 'infoCardBackground');	
	  
	  let cardInfoPanel = DomUtils.addDivWithClasses(this.backgroung, ['infoCardPanel', 'noselect']);
	  cardInfoPanel.style.left = this.x + 'px';
	  cardInfoPanel.style.top = this.y + 'px';
	  
	  this.namePanel = this.createField(this.person.firstName, "infoCardName", 'Имя');
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