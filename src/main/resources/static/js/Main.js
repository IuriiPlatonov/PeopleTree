import * as THREE from 'three';
import * as BEAN from 'beans';
import * as OBJECT from 'objects';

import { TWEEN } from 'three/addons/libs/tween.module.min.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

var camera, scene, renderer, lineRenderer;
var controls;

const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

var getPeopleUrl = "/api/people";
var peopleMap = new Map();
var bones = new Map();
getPeople();
var objectMap = new Map();





// var desktop = new Desktop();

function initPeopleMap(people) {

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 3000;

  scene = new THREE.Scene();

  people.forEach(function (entry) {
    let person = new BEAN.PersonBean(entry.id, entry.parentId, entry.firstName, entry.secondName,
      entry.patronymic, entry.age, entry.email, entry.address, entry.posX,
      entry.posY);
    let personCard = new OBJECT.PersonCard(person, camera, redrawConnections); 
     peopleMap.set(entry.id, personCard);

    
    let element = personCard.getElement();

    const objectCSS = new CSS3DObject(element);
    personCard.cardPanel.style.left = (Math.random() * 4000 - 2000) + 'px';
    personCard.cardPanel.style.top = (Math.random() * 4000 - 2000) + 'px';
    personCard.cardPanel.style.transform = 'translateZ(' +  (Math.random() * 4000 - 2000 )+ 'px)'; 
    scene.add(objectCSS);
    objectMap.set(entry.id,objectCSS);
    objects.push(personCard);

    const object = new THREE.Object3D();
    object.position.y = parseInt(person.posX);
    object.position.x = parseInt(person.posY);


    
    targets.table.push(object);

    
  });
// lineRenderer = new THREE.WebGLRenderer({ alpha: true });
// lineRenderer.setPixelRatio(window.devicePixelRatio);
// lineRenderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(lineRenderer.domElement);
  
  
  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.domElement.style.position = 'absolute';
// renderer.domElement.style.top = 0;
  document.body.appendChild(renderer.domElement); 
  

  
  controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener('change', render);
// controls.enabled = false
// controls.rotateSpeed = 1.0
// controls.zoomSpeed = 1.2
controls.panSpeed = 0.29;
controls.keys = ['KeyA', 'KeyS', 'KeyD'];
// controls.noPan = true //default false
controls.noRotate = true; // default false
// controls.noZoom = true //default false
// controls.staticMoving = true //default false
// controls.dynamicDampingFactor = 0.1
redrawConnections('create');
transform(targets.table, 2000);

  window.addEventListener('resize', onWindowResize);

 

  
}

function drawCSS3DLine(id, start, end, type){
	
	const tmpVec1 = new THREE.Vector3();
	const tmpVec2 = new THREE.Vector3();
	const tmpVec3 = new THREE.Vector3();
	const tmpVec4 = new THREE.Vector3();
	
	tmpVec1.subVectors( end, start );
	const bondLength = tmpVec1.length();
	let object;
	
	 if ("create" === type) {
	
	let bond = document.createElement( 'div' );
	bond.className = 'bond';
	bond.style.height = bondLength + 'px';

	object = new CSS3DObject( bond );
	object.position.copy( start );
	object.position.lerp( end, 0.5 );

	 } else {
	
	 object = bones.get(id);
	 object.element.style.height = bondLength + 'px';
	 object.position.copy( start );
	 object.position.lerp( end, 0.5 );
}

	const axis = tmpVec2.set( 0, 1, 0 ).cross( tmpVec1 );
	const radians = Math.acos( tmpVec3.set( 0, 1, 0 ).dot( tmpVec4.copy( tmpVec1 ).normalize() ) );

	const objMatrix = new THREE.Matrix4().makeRotationAxis( axis.normalize(), radians );
	object.matrix.copy( objMatrix );
	object.quaternion.setFromRotationMatrix( object.matrix );

// object.matrixAutoUpdate = false;
	object.updateMatrix();

	 if ("create" === type) {
	scene.add( object );
	bones.set(id, object);
	// objects.push( object );
	
	 } 
	 render();
}

//function updateConnections() {
//	bones.forEach((value, key) => {
//		let person = peopleMap.get(key);
//		value.position.x = person.getX();
//		value.position.y = person.getY();
//		value.position.z = 0;
//		value.position.lerp( end, 0.5 );
//	});
//}
//
//
//function distanceVector( v1, v2 ) {
//    let dx = v1.x - v2.x;
//    let dy = v1.y - v2.y;
//    let dz = v1.z - v2.z;
//    return Math.sqrt( dx * dx + dy * dy + dz * dz );
//}


function transform(targets, duration) {

  TWEEN.removeAll();

  for (let i = 0; i < objects.length; i++) {

    const object = objects[i];
    const target = targets[i];

    new TWEEN.Tween({top: parseInt(object.cardPanel.style.top.replace("px", "")), left:  parseInt(object.cardPanel.style.left.replace("px", ""))})
      .to({ top: target.position.x, left: target.position.y }, Math.random() * duration + duration).onUpdate(function (object1) {
    	  object.cardPanel.style.top = object1.top + 'px'
    	  object.cardPanel.style.left = object1.left + 'px'
    	
    })
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(redrawConnections)
    .start();

}

function hello() {
	alert('ok');
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

function animate() {

  requestAnimationFrame(animate);

  TWEEN.update();

  controls.update();

}

function renderTween(){
	updatePeopleCoord();
	redrawConnections('update');
}


function updatePeopleCoord() {
	
}

function render() {

 renderer.render(scene, camera);

}

// window.addPerson = function(person) {
// peopleMap.set(person.id, new PersonCard(person, redrawConnections));
// }

 function redrawConnections(type) {
   let userId = "1";
   let rootPerson = peopleMap.get(userId);
   let x = (rootPerson.getX() ) ;
   let y = (rootPerson.getY() );
   let z = 0;
   connectToChildNode(rootPerson.getId(), x , y , z, camera, type);
 }

 function connectToChildNode(id, start_x, start_y, start_z, camera, type) {
 	peopleMap.forEach((value, key) => {
       let x;
       let y;
       let z;
       if (id === value.getParentId()) {
         x = (value.getX() ) ;
         y = (value.getY());
         z = 0;
        
         drawCSS3DLine(value.getId(), new THREE.Vector3(start_x, start_y, start_z),
             new THREE.Vector3(x, y, z), type);

         connectToChildNode(value.getId(), x, y, z, camera, type);
       }
     
   });
 }

function getPeople() {
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
          animate();
        });
      }
    }
  ).then(
    html => console.log(html)
  );
}






