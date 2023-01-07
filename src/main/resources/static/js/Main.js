import * as THREE from 'three';
import * as BEAN from 'beans';
import * as OBJECT from 'objects';

import { TWEEN } from 'three/addons/libs/tween.module.min.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

var camera, scene, renderer, lineRenderer;
var controls;

var objects = new Map;
var bones = new Map();

var getPeopleUrl = "/api/people";

getPeople();

function initPeopleMap(people) {

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1500;

  scene = new THREE.Scene();

  people.forEach(function (entry) {

    let person = new BEAN.PersonBean(entry.id, entry.parentId, entry.firstName, entry.secondName,
      entry.patronymic, entry.age, entry.email, entry.address, entry.posX,
      entry.posY);
    addPersonCard(person);
  });
  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener('change', render);
  controls.panSpeed = 0.29;
  controls.noRotate = true; // default false

  redrawConnections();
  transform(1000, function() {});

  window.addEventListener('resize', onWindowResize);
}

function drawCSS3DLine(id, start, end, type) {

  const tmpVec1 = new THREE.Vector3();
  const tmpVec2 = new THREE.Vector3();
  const tmpVec3 = new THREE.Vector3();
  const tmpVec4 = new THREE.Vector3();

  tmpVec1.subVectors(end, start);
  const boneLength = tmpVec1.length();

  let object = bones.get(id) ? bones.get(id) : createBone(id);
  object.element.style.height = boneLength + 'px';
  object.position.copy(start);
  object.position.lerp(end, 0.5);
  
  const axis = tmpVec2.set(0, 1, 0).cross(tmpVec1);
  axis.z = Math.abs(axis.z) === 0 ? 1 : axis.z;
  const radians = Math.acos(tmpVec3.set(0, 1, 0).dot(tmpVec4.copy(tmpVec1).normalize()));

  const objMatrix = new THREE.Matrix4().makeRotationAxis(axis.normalize(), radians);
  object.matrix.copy(objMatrix);
  object.quaternion.setFromRotationMatrix(object.matrix);

 // object.matrixAutoUpdate = false;
  object.updateMatrix();

  render();
}

function createBone(id) {
	let bone = document.createElement('div');
    bone.className = 'bone';
    let object = new CSS3DObject(bone);

    scene.add(object);
    bones.set(id, object);
    return object;
}

function transform(duration, callback) {
  TWEEN.removeAll();

  objects.forEach((value, key) => {
    const object = value.objectCSS;
    const target = value.target;
    const person = value.personCard;

    new TWEEN.Tween({ top: parseInt(object.element.style.top.replace("px", "")), left: parseInt(object.element.style.left.replace("px", "")), z: object.position.z })
      .to({ top: target.position.x, left: target.position.y, z: 0 }, Math.random() * duration + duration).onUpdate(function (object1) {

        object.element.style.top = object1.top + 'px';
        object.element.style.left = object1.left + 'px';
        object.position.z = object1.z;
        person.setZ(object1.z);
        redrawConnections();
      })
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(callback)
      .start();
  });
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

function render() {
  renderer.render(scene, camera);
}

function addPersonCard(person) {
	let personCard = new OBJECT.PersonCard(person, camera, redrawConnections);

	let element = personCard.getElement();
	element.style.left = (Math.random() * 2000 - 1000) * (Math.random() < 0.5 ? -1 : 1)+ 'px';
	element.style.top = (Math.random() * 1000 - 500) * (Math.random() < 0.5 ? -1 : 1)+ 'px';

	const objectCSS = new CSS3DObject(element);
	objectCSS.position.z = (Math.random() * 2000 - 1000) * (Math.random() < 0.5 ? -1 : 1);
	personCard.setZ(objectCSS.position.z);

	const object = new THREE.Object3D();
	object.position.y = parseInt(person.posX);
	object.position.x = parseInt(person.posY);

	objects.set(person.id, {personCard: personCard, objectCSS: objectCSS, target: object})
	scene.add(objectCSS);
}

window.addPerson = function(person) {
	addPersonCard(person);
	redrawConnections();
	transform(1000, function() {});
}

window.delPerson = function(id) {
	let objectCSS = objects.get(id).objectCSS;
	let target = objects.get(id).target;
	let bone = bones.get(id);
	
	target.position.y = (Math.random() * 6000) * (Math.random() < 0.5 ? -1 : 1);
	target.position.x = (Math.random() * 6000) * (Math.random() < 0.5 ? -1 : 1);
	target.position.z = (Math.random() * 6000) * (Math.random() < 0.5 ? -1 : 1);
	
	transform(1000, function() {
		scene.remove(objectCSS);
		scene.remove(bone);
		objects.delete(id);
		redrawConnections();
	});
	
	
}

window.updateTarget = function(id) {
	let personCard = objects.get(id).personCard;
	let target = objects.get(id).target;
	target.position.y = personCard.getX();
	target.position.x = personCard.getY();
}

function redrawConnections() {
  let userId = "1";
  let rootPerson = objects.get(userId).personCard;
  let x = (rootPerson.getX());
  let y = (rootPerson.getY());
  let z = (rootPerson.getZ());
  connectToChildNode(rootPerson.getId(), x, y, z, camera);
}

function connectToChildNode(id, start_x, start_y, start_z, camera) {
  objects.forEach((value, key) => {
	let personCard = value.personCard;
    if (id === personCard.getParentId()) {
      let x = (personCard.getX());
      let y = (personCard.getY());
      let z = (personCard.getZ());
      drawCSS3DLine(personCard.getId(), new THREE.Vector3(start_x, start_y, start_z),
        new THREE.Vector3(x, y, z));

      connectToChildNode(personCard.getId(), x, y, z, camera);
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






