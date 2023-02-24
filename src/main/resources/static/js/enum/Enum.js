class DialogType {

    static Ok = new DialogType("ok");
    static OkNo = new DialogType("okno");
    static OkNoCancel = new DialogType("oknocancel");

    constructor(name) {
        this.name = name
    }

    getName() {
        return this.name;
    }
}

class ThemeType {

    static dark = new ThemeType("darkTheme");
    static light = new ThemeType("lightTheme");

    constructor(name) {
        this.name = name
    }

    getName() {
        return this.name;
    }
}

class AuthType {
    static input = new AuthType("input");
    static button = new AuthType("button");
    static collapsedInput = new AuthType("collapsedInput");
    static collapsedButton = new AuthType("collapsedButton");

    constructor(name) {
        this.name = name
    }

    getName() {
        return this.name;
    }
}

class InfoType {
    static info = new InfoType("info");
    static error = new InfoType("error");

    constructor(name) {
        this.name = name
    }

    getName() {
        return this.name;
    }
}
export {DialogType, ThemeType, AuthType, InfoType};