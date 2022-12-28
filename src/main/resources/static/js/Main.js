

var getPeopleUrl = "/api/people";
getPeople();
var map = new Map();


function initPeopleMap(people) {

  people.forEach(function (entry) {
	let person = new PersonBean(entry.id, entry.parentId, entry.firstName, entry.secondName,
		      entry.patronymic, entry.age, entry.email, entry.address, entry.posX,
		      entry.posY);
    map.set(entry.id, new PersonCard(person, redrawConnections));
  });
 
  redrawConnections();
}


//function drawConnections() {
//  var canvas;
//  if (document.getElementById('canvas')) {
//    canvas = document.getElementById('canvas');
//  } else {
//    canvas = document.createElement('canvas');
//    canvas.classList.add('canvas');
//    canvas.id = 'canvas';
//    canvas.width = window.innerWidth;
//    canvas.height = window.innerHeight;
//    // canvas.classList.add('noselect');
//  }
//
//  let ctx = canvas.getContext('2d');
//  ctx.clearRect(0, 0, canvas.width, canvas.height);
//  ctx.fill();
//
//  isStart = true;
//  ctx.beginPath();
//
//
//  map.forEach((value, key) => {
//    let x = value.getX() + value.getWidth() / 2;
//    let y = value.getY() + value.getHeight() / 2;
//    if (isStart) {
//      ctx.moveTo(x, y);
//      isStart = false;
//    } else {
//      ctx.lineTo(x, y);
//    }
//  });
//
//  ctx.strokeStyle = "red";
//  ctx.lineWidth = "0.2";
//  ctx.stroke();
//
//  document.body.appendChild(canvas);
//}

function redrawConnections() {
  var canvas;
  if (document.getElementById('canvas')) {
    canvas = document.getElementById('canvas');
  } else {
    canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.id = 'canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // canvas.classList.add('noselect');
  }


  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  isStart = true;
  ctx.beginPath();

  let userId = "1";
  let rootPerson = map.get(userId);
  let x = rootPerson.getX() + rootPerson.getWidth() / 2;
  let y = rootPerson.getY() + rootPerson.getHeight() / 2;
  connectToChildNode(rootPerson.getId(), x, y, ctx);

  ctx.strokeStyle = "red";
  ctx.lineWidth = "0.2";
  ctx.stroke();

  document.body.appendChild(canvas);
}

function connectToChildNode(id, start_x, start_y, context) {
  map.forEach((value, key) => {
      let x;
      let y;
      if (id === value.getParentId()) {
        x = value.getX() + value.getWidth() / 2;
        y = value.getY() + value.getHeight() / 2;
        context.moveTo(start_x, start_y);
        context.lineTo(x, y);{
        connectToChildNode(value.id, x, y);
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






