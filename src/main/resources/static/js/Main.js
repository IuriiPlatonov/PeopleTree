import * as THREE from 'three';
import * as BEAN from 'beans';
import * as OBJECT from 'objects';
import * as MENU from 'menu';
import * as ENUM from 'enum';

import {TWEEN} from 'three/addons/libs/tween.module.min.js';
import {TrackballControls} from 'three/addons/controls/TrackballControls.js';
import {CSS3DObject, CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer.js';
import {EventBus} from 'utils/EventBus.js';
// import {Bcrypt} from 'utils/bcrypt.min.js';

/**Константы api*/
let getPeopleUrl = "/api/people";
let checkAuthUrl = "/api/auth/checkAuth";
let authUrl = "/api/auth/login";
let registrationUrl = "/api/auth/registration";
let checkValidUrl = "/api/auth/checkValid";

let currentTimerId;

let camera, scene, renderer;
let controls;
let menu;

let objects = new Map;
let bones = new Map();
let eventBus = new EventBus();


initScene();
createMenu();
checkAuth();

function initScene() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1500;

    scene = new THREE.Scene();
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 100;
    controls.maxDistance = 6000;
    controls.addEventListener('change', render);
    controls.panSpeed = 0.29;
    controls.noRotate = true; // default false
    window.addEventListener('resize', onWindowResize);
}

/**
 * Проверяем авторизацию.
 * Если пользователь авторизован - рисуем сцену с карточками.
 * Если не авторизован - рисуем сцену авторизации
 */
function checkAuth() {
    RequestMappingUtils.get(checkAuthUrl, function (response) {
        clearObjects();
        if (response.authorized) {
            //           localStorage.setItem('userId', response.userId);
            createPeopleTree();
        } else {
            createLoginObjects();
        }
    });
}

/**
 * Сносим все объекты
 */
function clearObjects() {
    objects.clear();
    scene.clear();
    bones.clear();
}

function createMenu() {
    menu = new MENU.MainMenu(eventBus);
}

/**
 * Рисуем сцену авторизованного пользователя
 */
function initPeopleMap(people) {

    people.forEach(function (entry) {

        let person = new BEAN.PersonBean(entry.id, entry.parentId, entry.workspaceId, entry.firstName, entry.secondName, entry.patronymic,
            entry.age, entry.email, entry.address, entry.posX, entry.posY);
        let theme = menu.theme;
        let personCard = new OBJECT.PersonCard(person, camera, eventBus, theme, redrawConnections);
        addObjectToScene(personCard);
    });

    redrawConnections();
    transform(1000, function () {
    });


}

/**
 * Рисуем линию(связь) между карточками
 * Задаем ей положение в пространстве с помощью двух векторов THREE.Vector3(x, y, z)
 */
function drawCSS3DLine(id, start, end) {

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

/**
 * Создаем элемент "Линия"(кость) и помещаем ее в сцену
 */
function createBone(id) {
    let bone = document.createElement('div');
    bone.className = 'bone';
    let object = new CSS3DObject(bone);

    scene.add(object);
    bones.set(id, object);
    return object;
}

/**
 * Анимация с помощью библиотеки TWEEN
 * duration - cкорость анимации в мс
 * callback - функция выподняется по окончанию анимации
 */
function transform(duration, callback) {
    TWEEN.removeAll();

    objects.forEach((value, key) => {
        const objectCSS = value.objectCSS;
        const target = value.target.table;
        const object = value.object;

        new TWEEN.Tween({
            top: parseInt(objectCSS.element.style.top.replace("px", "")),
            left: parseInt(objectCSS.element.style.left.replace("px", "")),
            z: objectCSS.position.z
        })
            .to({
                top: target.position.x, left: target.position.y, z: target.position.z
            }, Math.random() * duration + duration)
            .onUpdate(function (obj) {
                objectCSS.element.style.top = obj.top + 'px';
                objectCSS.element.style.left = obj.left + 'px';
                objectCSS.position.z = obj.z;
                object.setZ(obj.z);
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

/**
 * Добавляем объект из класса Objects на сцену
 */
function addObjectToScene(object) {

    let element = object.getElement();
    element.style.left = (Math.random() * 2000 - 1000) * (Math.random() < 0.5 ? -1 : 1) + 'px';
    element.style.top = (Math.random() * 1000 - 500) * (Math.random() < 0.5 ? -1 : 1) + 'px';

    const objectCSS = new CSS3DObject(element);
    objectCSS.position.z = (Math.random() * 2000 - 1000) * (Math.random() < 0.5 ? -1 : 1);
    object.setZ(objectCSS.position.z);

    const tableTarget = createTableTarget(object);

    objects.set(object.getId(), {object: object, objectCSS: objectCSS, target: {table: tableTarget, sphere: null}})
    scene.add(objectCSS);
}

function createTableTarget(object) {
    const object3D = new THREE.Object3D();
    object3D.position.y = object.getPosX();
    object3D.position.x = object.getPosY();
    object3D.position.z = 0;
    return object3D;
}

//function addSphereTarget() {
//	const vector = new THREE.Vector3();
//	let i = 0;
//	  objects.forEach((value, key) => {
//		const target = value.target;
//	    const phi = Math.acos(- 1 + (2 * i) / objects.size);
//	    const theta = Math.sqrt(objects.size * Math.PI) * phi;
//
//	    const object = new THREE.Object3D();
//
//	    object.position.setFromSphericalCoords(800, phi, theta);
//
//	    vector.copy(object.position).multiplyScalar(2);
//
//	    object.lookAt(vector);
//
//	    target.sphere = object;
//	    i= i+1;
//	  });
//}


/**
 * Каждый раз когда смещаем любой объект вызываем
 * эту функцию для перерисовки линий связи
 */
function redrawConnections() {
    //  let id = localStorage.getItem('userId') != null ? localStorage.getItem('userId') : '1';
    //   if (!objects.get(id)) {
    //       return;
    //   }
    render();
    objects.forEach((value, key) => {
        if (!value.object.getParentId() || value.object.getParentId() === '') {
            let rootObject = value.object;
            let x = (rootObject.getX());
            let y = (rootObject.getY());
            let z = (rootObject.getZ());
            connectToChildNode(rootObject.getId(), x, y, z, camera);
        }
    });
}

function connectToChildNode(id, start_x, start_y, start_z, camera) {
    objects.forEach((value, key) => {
        let object = value.object;
        if (id === object.getParentId()) {
            let x = (object.getX());
            let y = (object.getY());
            let z = (object.getZ());
            drawCSS3DLine(object.getId(), new THREE.Vector3(start_x, start_y, start_z), new THREE.Vector3(x, y, z));

            connectToChildNode(object.getId(), x, y, z, camera);
        }

    });
}

/**
 * AJAX запрос на карточки авторизованного пользователя
 */
function createPeopleTree() {
    RequestMappingUtils.get(getPeopleUrl /*+ "?" + new URLSearchParams({userId: '1'})*/, function (people) {
        initPeopleMap(people);
        animate();
    });
}

/**
 * Глобальные функции доступные везде.
 */
window.checkAuth = function () {
    checkAuth();
}

window.addObject = function (object) {
    addObjectToScene(object);
    redrawConnections();
    transform(1000, function () {
    });
}

window.delObjects = function (objectsToDel) {

    objectsToDel.forEach(function (entry) {
        let target = objects.get(entry.id).target.table;
        target.position.y = (Math.random() * 6000) * (Math.random() < 0.5 ? -1 : 1);
        target.position.x = (Math.random() * 6000) * (Math.random() < 0.5 ? -1 : 1);
        target.position.z = (Math.random() * 6000) * (Math.random() < 0.5 ? -1 : 1);
    });

    transform(1000, function () {
        for (let i = 0; i < objectsToDel.length; i++) {
            scene.remove(objects.get(objectsToDel[i].id).objectCSS);
            scene.remove(bones.get(objectsToDel[i].id));
            objects.delete(objectsToDel[i].id);
            objectsToDel.splice(i, 1);
        }
    });

}

window.updateObjectParent = function (parent, children) {
    children.forEach(function (entry) {
        let object = objects.get(entry.id).object;
        object.setParentId(parent[0].parentId);
    });
}

window.updateTarget = function (id) {
    let object = objects.get(id).object;
    let target = objects.get(id).target.table;
    target.position.y = object.getX();
    target.position.x = object.getY();
}

/** Объекты авторизации*/

/** ЛОГИН
 *  В случае если пользователь не авторизован создаем сцену для авторизации
 */
function createLoginObjects() {

    let loginBean = new BEAN.AuthBean('1', null, "Логин", "", 0, 0, 210, ENUM.AuthType.input);
    let loginObject = new OBJECT.AuthCard(loginBean, camera, eventBus, menu.theme, redrawConnections, function () {
    });

    let passBean = new BEAN.AuthBean('2', '1', "Пароль", "", 0, -100, 210, ENUM.AuthType.input);
    let passObject = new OBJECT.AuthCard(passBean, camera, eventBus, menu.theme, redrawConnections, function () {
    });

    let createAccBean = new BEAN.AuthBean('3', '1', "Регистрация", "", 300, 50, 210, ENUM.AuthType.button);
    let createAccObject = new OBJECT.AuthCard(createAccBean, camera, eventBus, menu.theme, redrawConnections, function () {
        clearObjects();

        createRegisterObjects()
    });

    let recoverPassBean = new BEAN.AuthBean('4', '1', "Восстановить пароль", "", 320, -50, 210, ENUM.AuthType.button);
    let recoverPassObject = new OBJECT.AuthCard(recoverPassBean, camera, eventBus, menu.theme, redrawConnections, function () {
    });

    let enterBean = new BEAN.AuthBean('5', '2', "Войти", "", 0, -200, 210, ENUM.AuthType.button);
    let enterObject = new OBJECT.AuthCard(enterBean, camera, eventBus, menu.theme, redrawConnections, function () {
        // let bcrypt = dcodeIO.bcrypt;
        // let salt = bcrypt.genSaltSync(12);
        // let hash = bcrypt.hashSync(passObject.getValue(), 12);

        let json = JSON.stringify({email: loginObject.getValue(), password: passObject.getValue()});
        RequestMappingUtils.postWithResponse(authUrl /*"login?" + new URLSearchParams({
            username: loginObject.getValue(), password: passObject.getValue() })*/, json, function (response) {
            checkAuth();
        });
    });

    addAuthObject(loginObject);
    addAuthObject(passObject);
    addAuthObject(createAccObject);
    addAuthObject(recoverPassObject);
    addAuthObject(enterObject);
}

/** РЕГИСТРАЦИЯ
 *  В случае если пользователь не зарегестрирован создаем сцену для регистрации
 */
function createRegisterObjects() {
    let firstNameBean = new BEAN.AuthBean('1', '', "Имя", "", -100, 0, 300, ENUM.AuthType.input);
    let firstNameObject = new OBJECT.AuthCard(firstNameBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(firstNameObject, "name");
        }
    });

    let lastNameBean = new BEAN.AuthBean('2', '1', "Фамилия", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let lastNameObject = new OBJECT.AuthCard(lastNameBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(lastNameObject, "name");
        } else {
            moveObject(lastNameObject.getId(), -100, 0, 0, 500);
            moveObject(firstNameObject.getId(), -400, 200, -0, 500);
            addAuthObject(patronymicObject, 500);
        }
    });

    let patronymicBean = new BEAN.AuthBean('3', '2', "Отчество", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let patronymicObject = new OBJECT.AuthCard(patronymicBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(patronymicObject, "name");
        } else {
            moveObject(patronymicObject.getId(), -100, 0, 0, 500);
            moveObject(lastNameObject.getId(), 0, 200, -0, 500);
            addAuthObject(emailObject, 500);
        }
    });

    let emailBean = new BEAN.AuthBean('4', '3', "email", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let emailObject = new OBJECT.AuthCard(emailBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(emailObject, "email");
        } else {
            moveObject(emailObject.getId(), -100, 0, 0, 500);
            moveObject(patronymicObject.getId(), 400, 200, -0, 500);
            addAuthObject(passObject, 500);
        }
    });

    let passBean = new BEAN.AuthBean('5', '4', "Пароль", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let passObject = new OBJECT.AuthCard(passBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(passObject, "password");
        } else {
            moveObject(passObject.getId(), -100, 0, 0, 500);
            moveObject(emailObject.getId(), 400, -200, -0, 500);
            addAuthObject(confirmPassObject, 500);
        }
    });

    let confirmPassBean = new BEAN.AuthBean('6', '5', "Подтвердить", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let confirmPassObject = new OBJECT.AuthCard(confirmPassBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidConfirmPassword(passObject, confirmPassObject);
        } else {
            moveObject(confirmPassObject.getId(), -100, 0, 0, 500);
            moveObject(passObject.getId(), 0, -200, -0, 500);
            addAuthObject(enterObject, 500);
        }
    });


    let enterBean = new BEAN.AuthBean('7', '6', "Зарегистрировать", "", 100, 0, 300, ENUM.AuthType.collapsedButton);
    let enterObject = new OBJECT.AuthCard(enterBean, camera, eventBus, menu.theme, redrawConnections, function (expanded) {
        if (!expanded) {
            moveObject(enterObject.getId(), 0, 0, 0, 500);
            moveObject(confirmPassObject.getId(), -400, -200, -0, 500);
        } else if (firstNameObject.isValid() && lastNameObject.isValid() && patronymicObject.isValid()
            && emailObject.isValid() && passObject.isValid() && confirmPassObject.isValid()) {
            let json = JSON.stringify({
                firstname: firstNameObject.getValue(), lastname: lastNameObject.getValue(),
                patronymic: patronymicObject.getValue(), email: emailObject.getValue(), password: passObject.getValue(),
                confirmPassword: confirmPassObject.getValue()
            });
            RequestMappingUtils.postWithResponse(registrationUrl, json, function (response) {
                checkAuth();
            });
        }
    });

    addAuthObject(firstNameObject);
    addAuthObject(lastNameObject);
}

/** Проверяем валидность поля
 * API: /api/auth/checkValid
 * object: AuthObject
 * fieldTypeToValidation: name, email, password
 * */
function checkValidForAuthObjectWithDelay(object, fieldTypeToValidation, delay) {
    clearTimeout(currentTimerId);
    currentTimerId = setTimeout(() => {
        checkValidForObject(object, fieldTypeToValidation);
    }, delay ? delay : 1000);
}

function checkValidForObject(object, fieldTypeToValidation) {
    let json = JSON.stringify({text: object.getValue(), fieldName: fieldTypeToValidation});
    RequestMappingUtils.postWithResponse(checkValidUrl, json, function (response) {
        if (response.valid) {
            object.setBorderGreen();
            object.setValid(true);
        } else {
            object.setBorderRed();
            object.setValid(false);
        }
    });
}

function checkValidConfirmPassword(passObj, confPassObj) {
    if (passObj.getValue() === confPassObj.getValue()) {
        confPassObj.setBorderGreen();
        confPassObj.setValid(true);
    } else {
        confPassObj.setBorderRed();
        confPassObj.setValid(false);
    }
}

function moveObject(id, x, y, z, duration) {
    let target = objects.get(id).target.table;
    target.position.y = x;
    target.position.x = y;
    target.position.z = z;
    transform(duration ? duration : 1000, function () {
    });
}


function addAuthObject(object, duration) {
    addObjectToScene(object);
    redrawConnections();
    transform(duration ? duration : 1000, function () {
    });
    animate();
}

