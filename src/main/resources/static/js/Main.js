

var getPeopleUrl = "/api/people";
getPeople();
var peopleMap = new Map();


var desktop = new Desktop();

function initPeopleMap(people) {

  people.forEach(function (entry) {
	let person = new PersonBean(entry.id, entry.parentId, entry.firstName, entry.secondName,
		      entry.patronymic, entry.age, entry.email, entry.address, entry.posX,
		      entry.posY);
	peopleMap.set(entry.id, new PersonCard(person,  desktop.getDesktopPanel(), redrawConnections));
  });
 
  redrawConnections();
}

window.addPerson = function(person) {
	peopleMap.set(person.id, new PersonCard(person, redrawConnections));
}

function redrawConnections() {
  var ctx;
  var canvas;
  if (document.getElementById('canvas')) {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
  } else {
    canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.id = 'canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
 //   ctx.translate(canvas.width / 2, canvas.height / 2);
    // canvas.classList.add('noselect');
  }

   
  ctx.clearRect(0  , 0 , canvas.width, canvas.height);
  ctx.fill();
  
 
 // ctx.fillRect(0,0,50,50);

  isStart = true;
  ctx.beginPath();

  let userId = "1";
  let rootPerson = peopleMap.get(userId);
  let x = rootPerson.getX() + rootPerson.getWidth() / 2;
  let y = rootPerson.getY() + rootPerson.getHeight() / 2;
  connectToChildNode(rootPerson.getId(), x , y , ctx);

  ctx.strokeStyle = "red";
  ctx.lineWidth = "0.2";
  ctx.stroke();

  desktop.getDesktopPanel().appendChild(canvas);
}

function connectToChildNode(id, start_x, start_y, context) {
	peopleMap.forEach((value, key) => {
      let x;
      let y;
      if (id === value.getParentId()) {
        x = value.getX() + value.getWidth() / 2;
        y = value.getY() + value.getHeight() / 2;
        context.moveTo(start_x, start_y);
        context.lineTo(x, y);{
        connectToChildNode(value.getId(), x, y, context);
      }
    }
  });
}

function getPeople() {
  var people = [];
  fetch(getPeopleUrl, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(
    response => {
      if (response.status === 200) {
        response.json().then(json => {
          initPeopleMap(json);
        });

      }
    }
  ).then(
    html => console.log(html)
  );
}






