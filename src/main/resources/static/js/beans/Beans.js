class PersonBean {
    constructor(id, parentId, workspaceId, name, secondName, patronymic, age, email, address, x, y) {
        this.parentId = parentId;
        this.firstName = name;
        this.secondName = secondName;
        this.patronymic = patronymic;
        this.age = age;
        this.email = email;
        this.address = address;
        this.id = id;
        this.posX = x;
        this.posY = y;
        this.workspaceId = workspaceId;
    }
}

class AuthBean {
    constructor(id, parentId, caption, value, x, y, width, authType) {
        this.id = id;
        this.parentId = parentId;
        this.caption = caption;
        this.value = value;
        this.posX = x;
        this.posY = y;
        this.width = width;
        this.authType = authType;
    }
}

export {PersonBean, AuthBean};