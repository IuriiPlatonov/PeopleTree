import * as THREE from 'three';
import * as BEAN from 'beans';
import * as OBJECT from 'objects';
import * as MENU from 'menu';
import * as ENUM from 'enum';
import * as DIALOG from 'dialogs';

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
let workspacesUrl = "/api/workspaces";
let workspaceUrl = "/api/cards";
let getCardPatternsUrl = "/api/cardPatterns";
let createNewCardUrl = "/api/createCard";
let getCardChildrenCountUrl = "/api/cardChildrenCount";
let deleteCardUrl = 'api/deleteCard';
let deleteWorkspaceUrl = 'api/deleteWorkspace';
let changeParentUrl = "api/changeParent";
let saveTextValueUrl = "api/saveTextValue";

let camera, scene, renderer;
let controls;
let menu;

let objects = new Map;
let bones = new Map();
let timers = new Map();
let infoIds = new Map();
let eventBus = new EventBus();


initScene();
initEventListeners();
checkAuth();

function initScene() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1500;

    scene = new THREE.Scene();
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new TrackballControls(camera, renderer.domElement, eventBus);
    controls.minDistance = 100;
    controls.maxDistance = 6000;
    //  controls.addEventListener('change', render);
    controls.panSpeed = 0.29;
    controls.noRotate = true; // default false
    window.addEventListener('resize', onWindowResize);

    menu = new MENU.MainMenu(eventBus);
    animate();
}

function initEventListeners() {
    eventBus.addEventListener("removeObjects", function (objects) {
        removeObjects(objects);
    });
    eventBus.addEventListener("addObject", function (object) {
        addObject(object);
    });
    eventBus.addEventListener("checkAuth", function () {
        checkAuth();
    });
    eventBus.addEventListener("updateObjectParent", function (data) {
        updateObjectParent(data);
    });
    eventBus.addEventListener("updateTarget", function (id) {
        updateTarget(id);
    });
    eventBus.addEventListener("dynamicCardDblClick", function (id) {
        changeWorkspace(id);
    });
    eventBus.addEventListener("openAddCardDialog", function (bean) {
        openAddCardDialog(bean);
    });
    eventBus.addEventListener("openDeleteCardDialog", function (bean) {
        openDeleteCardDialog(bean);
    });
    eventBus.addEventListener("setSessionCardParameters", function (bean) {
        setSessionCardParameters(bean.id, bean.posX, bean.posY, bean.posZ);
    });
    eventBus.addEventListener("saveTextValue", function (bean) {
        saveTextValue(bean);
    });


}


function setSessionCardParameters(id, posX, posY, posZ) {
    sessionStorage.setItem('cardId', id);
    sessionStorage.setItem('posX', posX);
    sessionStorage.setItem('posY', posY);
    sessionStorage.setItem('posZ', posZ);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    setTimeout(function () {
        requestAnimationFrame(animate);
    }, 1000 / 120);
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
}

/**
 * Проверяем авторизацию.
 * Если не авторизован - рисуем сцену авторизации.
 * Если пользователь авторизован - рисуем сцену с карточками рабочих столов.
 * Если в sessionStorage есть workspaceId - рисуем сам рабочий стол.
 */
function checkAuth() {
    RequestMappingUtils.get(checkAuthUrl, function (response) {
        let isAuthorised = response.authorized;
        let username = response.username;
        let workspaceId = sessionStorage.getItem('workspaceId');

        removeObjects(new Map(objects));
        updateMenuElements(isAuthorised, username);

        if (isAuthorised && !workspaceId) {
            getWorkspaces();
        } else if (isAuthorised && workspaceId) {
            getCardsForWorkspace(workspaceId);
        } else {
            createLoginObjects();
        }
    });
}

/**
 * Обновляем имя пользователя и видимость кнопок в меню
 */
function updateMenuElements(isAuthorised, username) {
    sessionStorage.setItem('isAuthorised', isAuthorised);
    localStorage.setItem('username', username ? username : "");
    eventBus.fireEvent("changeUserName");
}

/**
 * Сносим все объекты
 */
function removeObjects(objectsToDel) {
    objectsToDel.forEach(function (entry) {
        let key = entry.object ? entry.object.getId() : entry.id;
        key = key ? key : entry.cardId;
        setRandomCordToObjectById(key);
        transform(key, 500, function (tween, id) {
            scene.remove(objects.get(id) ? objects.get(id).objectCSS : '');
            scene.remove(bones.get(id));
            bones.delete(id);
            objects.delete(id);
            TWEEN.remove(tween);
        });
    });
}

/**
 * Сносим объект по id
 */
function removeObjectById(id) {
    if (objects.get(id)) {
        setRandomCordToObjectById(id);

        transform(id, 500, function () {
            scene.remove(objects.get(id).objectCSS);
            scene.remove(bones.get(id));
            bones.delete(id);
            objects.delete(id);
        });
    }
}

/**
 * Добавляем объект на сцену и анимируем его
 */
function addObject(object) {
    addObjectToScene(object);
    transform(object.getId(), 500, function () {
    });
}

/**
 * При удалении узла дерева обновляем parentId его детям
 */
function updateObjectParent(obj) {
    obj.children.forEach(function (entry) {
        let object = objects.get(entry.cardId).object;
        object.setParentId(obj.parent[0].parentId);
    });

}


/**
 * Обновить координаты цели анимации
 */
function updateTarget(id) {
    let object = objects.get(id).object;
    let target = objects.get(id).target.table;
    target.position.y = object.getX();
    target.position.x = object.getY();
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
        // addObjectToScene(personCard);
        addObject(personCard);
    });
}

/**
 * Рисуем сцену выбора рабочих столов для авторизованного пользователя
 */
function initWorkspaces(workspaces) {
    workspaces.forEach((value, key) => {
        let theme = menu.theme;
        let workspace = new OBJECT.DynamicCard(key, value, camera, eventBus, theme, redrawConnections);
        addObject(workspace);
    });
}

function changeWorkspace(id) {
    if (isItWorkspace()) {
        sessionStorage.setItem('workspaceId', id);
        checkAuth();
        setSessionCardParameters('', 0, 0, 0);
    }
}

function isItWorkspace() {
    return !sessionStorage.getItem('workspaceId') || sessionStorage.getItem('workspaceId') === '';
}

function initCardsForWorkspace(cards) {
    cards.forEach((value, key) => {
        let theme = menu.theme;
        let workspace = new OBJECT.DynamicCard(key, value, camera, eventBus, theme, redrawConnections);
        addObject(workspace);
    });
}

/**
 * Подгружаем шаблоны карточек, передаем их в диалог по созданию новой карточки,
 * в случае удачи шлем запрос на сохранение.
 */
function openAddCardDialog(bean) {
    RequestMappingUtils.get(getCardPatternsUrl, function (cards) {
        new DIALOG.AddCardDialog(new Map(Object.entries(cards)), function (cardId) {
            let workspaceId = sessionStorage.getItem('workspaceId');
            let json = JSON.stringify({
                cardId: cardId, workspaceId: workspaceId, parentId: bean.parentId,
                posX: bean.posX, posY: bean.posY
            });
            RequestMappingUtils.postWithResponse(createNewCardUrl, json, function (card) {
                let cardMap = new Map(Object.entries(card));
                let theme = menu.theme;
                cardMap.forEach((value, key) => {
                    let workspace = new OBJECT.DynamicCard(key, value, camera, eventBus, theme, redrawConnections);
                    addObject(workspace);
                });
            });
        });
    });
}

/**
 * Удаляем карточку рабочего стола или рабочий стол.
 * Если у карточки есть дочерние элементы, спрашиваем,
 * удалить все дочерние элементы или привязать их к вышестоящему узлу
 */
function openDeleteCardDialog(bean) {
    if (isItWorkspace()) {
        createDeleteWorkspaceDialog(bean);
    } else {
        RequestMappingUtils.get(getCardChildrenCountUrl + '?' + new URLSearchParams({cardId: bean.cardId}), function (response) {
            let childrenCount = parseInt(response.data);
            if (childrenCount === 1) {
                createDeleteCardDialog(bean);
            } else {
                createDelAllOrReplaceChildrenDialog(bean);
            }
        });
    }
}

function createDeleteCardDialog(bean) {
    new DIALOG.InfoDialog("Вы действительно хотите удалить карточку?", ENUM.DialogType.OkNo, function () {
        let json = JSON.stringify({cardId: bean.cardId});
        RequestMappingUtils.postWithResponse(deleteCardUrl, json, function (cards) {
            removeObjects(cards);
        });
    });
}

function createDeleteWorkspaceDialog(bean) {
    new DIALOG.InfoDialog("Вы действительно хотите удалить рабочий стол?", ENUM.DialogType.OkNo, function () {
        let json = JSON.stringify({workspaceId: bean.workspaceId, cardId: bean.cardId});
        RequestMappingUtils.postWithResponse(deleteWorkspaceUrl, json, function (cards) {
            removeObjects(cards);
        });
    });
}

function createDelAllOrReplaceChildrenDialog(bean) {
    let dialog = new DIALOG.InfoDialog("Вы действительно хотите удалить карточку?<br>" +
        "'Да' - все потомки будут удалены.<br>" +
        "'Выше' - все потомки будут привязаны выше.",
        ENUM.DialogType.OkNoCancel,
        function () {
            let json = JSON.stringify({cardId: bean.cardId});
            RequestMappingUtils.postWithResponse(deleteCardUrl, json, function (cards) {
                removeObjects(cards);
            });
        },
        function () {
            let json = JSON.stringify({cardId: bean.cardId, parentId: bean.parentId});
            RequestMappingUtils.postWithResponse(changeParentUrl, json, function (deleteParentResponse) {
                let parent = [deleteParentResponse.parent];
                let children = deleteParentResponse.children;
                updateObjectParent({parent: parent, children: children});
                removeObjects(parent);
            });
        });
    dialog.setCancelButtonText('Выше');
}

function saveTextValue(bean) {
    let json = JSON.stringify({value: bean.value, elementId: bean.elementId});
    RequestMappingUtils.post(saveTextValueUrl, json);
}

/**
 * Рисуем сцену рабочего стола для авторизованного пользователя
 */
function getCardsForWorkspace(id) {
    let json = JSON.stringify({workspaceId: id});
    RequestMappingUtils.postWithResponse(workspaceUrl, json, function (cards) {
        initCardsForWorkspace(new Map(Object.entries(cards)));
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
//    render();
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


function transformAll(duration, callback) {
    objects.forEach((value, key) => {
        transform(key, duration, callback);
    });
}

/**
 * Анимация с помощью библиотеки TWEEN
 * duration - cкорость анимации в мс
 * callback - функция выподняется по окончанию анимации
 */
function transform(id, duration, callback) {
    let object = objects.get(id);
    const objectCSS = object.objectCSS;
    const target = object.target.table;
    const card = object.object;
    let tween = new TWEEN.Tween({
        x: parseInt(objectCSS.element.style.top.replace("px", "")),
        y: parseInt(objectCSS.element.style.left.replace("px", "")),
        z: objectCSS.position.z
    });
    tween.to({
        x: target.position.x, y: target.position.y, z: target.position.z
    }, Math.random() * duration + duration)
        .onUpdate(function (obj) {
            objectCSS.element.style.top = obj.x + 'px';
            objectCSS.element.style.left = obj.y + 'px';
            objectCSS.position.z = obj.z;
            card.setZ(obj.z);
            redrawConnections();
        })
        .easing(TWEEN.Easing.Exponential.InOut)
        .onComplete(t => callback(tween, id))
        .start();
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
function setRandomCordToObjectById(id) {
    let target = objects.get(id).target.table;
    target.position.y = (Math.random() * 6000) * (Math.random() < 0.5 ? -1 : 1);
    target.position.x = (Math.random() * 6000) * (Math.random() < 0.5 ? -1 : 1);
    target.position.z = (Math.random() * 6000) * (Math.random() < 0.5 ? -1 : 1);
}

/**
 * Каждый раз когда смещаем любой объект вызываем
 * эту функцию для перерисовки линий связи
 */

function redrawConnections() {
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
 * AJAX запрос на рабочие столы авторизованного пользователя
 */
function getWorkspaces() {
    RequestMappingUtils.get(workspacesUrl, function (resp) {
        initWorkspaces(new Map(Object.entries(resp)));
    });
    // RequestMappingUtils.get(getPeopleUrl, function (people) {
    //     initPeopleMap(people);
    // });
}

function createInfoObject(parentId, caption, message, x, y, height) {
    let infoBean = new BEAN.AuthBean(UUID.generate(), parentId, caption, message, x, y, height, ENUM.InfoType.info);
    let infoObject = new OBJECT.InfoCard(infoBean, camera, eventBus, menu.theme, redrawConnections, function () {
        removeObjectById(infoObject.getId());
        infoIds.delete(parentId);
    });
    addAuthObject(infoObject);
    return infoObject.getId();
}

/** Объекты авторизации
 *  Сценарии для логина и регистрации
 *  TODO Потом надо будеть вынести их из этого класса
 * */

/** ЛОГИН
 *  В случае если пользователь не авторизован создаем сцену для авторизации
 */
function createLoginObjects() {

    let loginBean = new BEAN.AuthBean(UUID.generate(), null, "Логин", "", -50, 0, 210, ENUM.AuthType.input);
    let loginObject = new OBJECT.AuthCard(loginBean, camera, eventBus, menu.theme, redrawConnections, function () {
    });


    let passBean = new BEAN.AuthBean(UUID.generate(), loginObject.getId(), "Пароль", "", -50, -100, 210, ENUM.AuthType.input);
    let passObject = new OBJECT.AuthCard(passBean, camera, eventBus, menu.theme, redrawConnections, function () {
    });

    let createAccBean = new BEAN.AuthBean(UUID.generate(), loginObject.getId(), "Регистрация", "", 250, 50, 210, ENUM.AuthType.button);
    let createAccObject = new OBJECT.AuthCard(createAccBean, camera, eventBus, menu.theme, redrawConnections, function () {
        removeObjects(new Map(objects));
        createRegisterObjects()
    });

    let recoverPassBean = new BEAN.AuthBean(UUID.generate(), loginObject.getId(), "Восстановить пароль", "", 270, -50, 210, ENUM.AuthType.button);
    let recoverPassObject = new OBJECT.AuthCard(recoverPassBean, camera, eventBus, menu.theme, redrawConnections, function () {
    });

    let enterBean = new BEAN.AuthBean(UUID.generate(), passObject.getId(), "Войти", "", -50, -200, 210, ENUM.AuthType.button);
    let enterObject = new OBJECT.AuthCard(enterBean, camera, eventBus, menu.theme, redrawConnections, function () {
        let json = JSON.stringify({email: loginObject.getValue(), password: passObject.getValue()});
        RequestMappingUtils.postWithResponse(authUrl, json, function (response) {
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

    let firstNameBean = new BEAN.AuthBean(UUID.generate(), '', "Имя", "", -100, 0, 300, ENUM.AuthType.input);
    let firstNameObject = new OBJECT.AuthCard(firstNameBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(firstNameObject, "name");
        }
    });

    let lastNameBean = new BEAN.AuthBean(UUID.generate(), firstNameObject.getId(), "Фамилия", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let lastNameObject = new OBJECT.AuthCard(lastNameBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(lastNameObject, "name");
        } else {
            moveObject(lastNameObject.getId(), -100, 0, 0, 500);
            moveObject(firstNameObject.getId(), -400, 200, -0, 500);
            addAuthObject(patronymicObject, 500);
        }
    });

    let patronymicBean = new BEAN.AuthBean(UUID.generate(), lastNameObject.getId(), "Отчество", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let patronymicObject = new OBJECT.AuthCard(patronymicBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(patronymicObject, "name");
        } else {
            moveObject(patronymicObject.getId(), -100, 0, 0, 500);
            moveObject(lastNameObject.getId(), 0, 200, -0, 500);
            addAuthObject(emailObject, 500);
        }
    });

    let emailBean = new BEAN.AuthBean(UUID.generate(), patronymicObject.getId(), "email", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let emailObject = new OBJECT.AuthCard(emailBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(emailObject, "email");
        } else {
            moveObject(emailObject.getId(), -100, 0, 0, 500);
            moveObject(patronymicObject.getId(), 400, 200, -0, 500);
            addAuthObject(passObject, 500);
        }
    });

    let passBean = new BEAN.AuthBean(UUID.generate(), emailObject.getId(), "Пароль", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let passObject = new OBJECT.AuthCard(passBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidForAuthObjectWithDelay(passObject, "password");
        } else {
            moveObject(passObject.getId(), -100, 0, 0, 500);
            moveObject(emailObject.getId(), 400, -200, -0, 500);
            addAuthObject(confirmPassObject, 500);
        }
    });

    let confirmPassBean = new BEAN.AuthBean(UUID.generate(), passObject.getId(), "Подтвердить", "", 100, 0, 300, ENUM.AuthType.collapsedInput);
    let confirmPassObject = new OBJECT.AuthCard(confirmPassBean, camera, eventBus, menu.theme, redrawConnections, function (isType) {
        if (isType) {
            checkValidConfirmPassword(passObject, confirmPassObject);
        } else {
            moveObject(confirmPassObject.getId(), -100, 0, 0, 500);
            moveObject(passObject.getId(), 0, -200, -0, 500);
            addAuthObject(enterObject, 500);
        }
    });


    let enterBean = new BEAN.AuthBean(UUID.generate(), confirmPassObject.getId(), "Зарегистрировать", "", 100, 0, 300, ENUM.AuthType.collapsedButton);
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
    clearTimeout(timers.get(object.getId()));
    let timer = setTimeout(() => {
        checkValidForObject(object, fieldTypeToValidation);
    }, delay ? delay : 1000);
    timers.set(object.getId(), timer);
}

function checkValidForObject(object, fieldTypeToValidation) {
    let json = JSON.stringify({text: object.getValue(), fieldName: fieldTypeToValidation});
    RequestMappingUtils.postWithResponse(checkValidUrl, json, function (response) {
        if (response.valid) {
            object.setBorderGreen();
            object.setValid(true);
            removeObjectById(infoIds.get(object.getId()));
            infoIds.delete(object.getId());
        } else {
            object.setBorderRed();
            object.setValid(false);
            if (infoIds.get(object.getId())
                && objects.get(infoIds.get(object.getId())).object.getMessage() === response.message) {
                return;
            }
            removeObjectById(infoIds.get(object.getId()));
            infoIds.delete(object.getId());
            let id = createInfoObject(object.getId(), "Инфо", response.message,
                object.getPosX(), object.getPosY() + 100, 300);
            infoIds.set(object.getId(), id);

        }
    });
}

function checkValidConfirmPassword(passObj, confPassObj) {
    if (passObj.getValue() === confPassObj.getValue()) {
        confPassObj.setBorderGreen();
        confPassObj.setValid(true);
        removeObjectById(infoIds.get(confPassObj.getId()));
        infoIds.delete(confPassObj.getId());
    } else {
        confPassObj.setBorderRed();
        confPassObj.setValid(false);
        removeObjectById(infoIds.get(confPassObj.getId()));
        infoIds.delete(confPassObj.getId());
        let id = createInfoObject(confPassObj.getId(), "Инфо", "Пароли не совпадают",
            confPassObj.getPosX(), confPassObj.getPosY() + 100, 300);
        infoIds.set(confPassObj.getId(), id);
    }
}

function moveObject(id, x, y, z, duration) {
    let target = objects.get(id).target.table;
    let object = objects.get(id).object;
    target.position.y = x;
    target.position.x = y;
    target.position.z = z;
    object.setPosX(x);
    object.setPosY(y);
    transform(id, duration ? duration : 1000, function () {
    });
}


function addAuthObject(object, duration) {
    addObjectToScene(object);
    // redrawConnections();
    transform(object.getId(), duration ? duration : 1000, function () {
    });

}

