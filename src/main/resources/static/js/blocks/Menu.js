import * as ENUM from 'enum';

class MainMenu {

    constructor(eventBus) {
        this.cssFiles = ['Objects.css', 'Dialogs.css', 'Menu.css'];
        this.eventBus = eventBus;
        this.theme = ENUM.ThemeType.dark;
        this.bind();
        this.init();
    }

    bind() {
        this.setVisibleMenuButton = this.setVisibleMenuButton.bind(this);
        this.setVisibleOtherButtons = this.setVisibleOtherButtons.bind(this);
        this.setTheme = this.setTheme.bind(this);
        this.updateMenuData = this.updateMenuData.bind(this);
    }

    init() {
        this.initMenuButton();
        this.initSettingButtonPanel();
        this.initHomeButton();
        this.initAddButton();
        this.initListener();

    }

    initMenuButton() {
        this.settingButton = document.createElement('img');
        this.settingButton.classList.add('mainMenuButton');
        this.settingButton.setAttribute('src', 'images/darkTheme/settings.svg');
        document.body.appendChild(this.settingButton);
    }

    initHomeButton() {
        this.homeButton = document.createElement('img');
        this.homeButton.classList.add('mainMenuHomeButton');
        this.homeButton.style.display = 'none';
        this.homeButton.setAttribute('src', 'images/darkTheme/menu.svg');
        document.body.appendChild(this.homeButton);
    }

    initAddButton() {
        this.addButton = document.createElement('img');
        this.addButton.classList.add('mainMenuPlusButton');
        this.addButton.style.display = 'none';
        this.addButton.setAttribute('src', 'images/darkTheme/plus.svg');
        document.body.appendChild(this.addButton);
    }

    initSettingButtonPanel() {
        this.mainMenuPanel = document.createElement('div');
        this.mainMenuPanel.classList.add('mainMenuPanel');
        this.mainMenuPanel.style.display = 'none';
        document.body.appendChild(this.mainMenuPanel);

        let themePanel = document.createElement('fieldSet');
        themePanel.classList.add('mainMenuThemePanel');
        this.mainMenuPanel.appendChild(themePanel);

        let legend = document.createElement('legend');
        legend.classList.add('mainMenuThemePanelLegend');
        legend.innerHTML = 'Тема';
        themePanel.appendChild(legend);

        this.whiteThemeButton = document.createElement('div');
        this.whiteThemeButton.classList.add('mainMenuLightThemeButton');
        this.whiteThemeButton.innerHTML = '<span class="mainMenuThemeButtonText">Светлая</span>';
        themePanel.appendChild(this.whiteThemeButton);

        this.darkThemeButton = document.createElement('div');
        this.darkThemeButton.classList.add('mainMenuDarkThemeButton');
        this.darkThemeButton.innerHTML = '<span class="mainMenuDarkThemeButtonText">Тёмная</span>';
        themePanel.appendChild(this.darkThemeButton);

        let loginPanel = document.createElement('fieldSet');
        loginPanel.classList.add('mainMenuLoginPanel');
        this.mainMenuPanel.appendChild(loginPanel);

        this.loginLegend = document.createElement('legend');
        loginPanel.appendChild(this.loginLegend);

        this.logoutButton = document.createElement('div');
        this.logoutButton.classList.add('mainMenuButtons');
        this.logoutButton.style.display = 'none';
        this.logoutButton.innerHTML = '<span class="mainMenuThemeButtonText">Выход</span>';
        loginPanel.appendChild(this.logoutButton);

        this.updateMenuData();
    }

    updateMenuData() {
        let username = localStorage.getItem('username');
        this.loginLegend.innerHTML = username ? username : "Гость";
        this.logoutButton.style.display = username ? 'block' : 'none';
    }

    setVisibleOtherButtons() {
        let isAuthorised = sessionStorage.getItem('isAuthorised') === 'true';

        if (this.mainMenuPanel.style.display === 'none' && isAuthorised) this.homeButton.style.display = 'block'
        else this.homeButton.style.display = 'none';
        if (this.mainMenuPanel.style.display === 'none' && isAuthorised) this.addButton.style.display = 'block'
        else this.addButton.style.display = 'none';
    }

    setVisibleMenuButton() {
        if (this.mainMenuPanel.style.display === 'block') this.mainMenuPanel.style.display = 'none'
        else this.mainMenuPanel.style.display = 'block';
    }

    initListener() {
        let settingButton = this.settingButton;
        let eventBus = this.eventBus;
        let cssFiles = this.cssFiles;
        let setVisibleMenuButton = this.setVisibleMenuButton;
        let setTheme = this.setTheme;
        let loginLegend = this.loginLegend;
        let logoutButton = this.logoutButton;
        let homeButton = this.homeButton;
        let addButton = this.addButton;
        let updateMenuData = this.updateMenuData;
        let setVisibleOtherButtons = this.setVisibleOtherButtons;


        this.settingButton.addEventListener('pointerdown', function () {
            setVisibleMenuButton();
            setVisibleOtherButtons();
        });

        this.homeButton.addEventListener('pointerdown', function () {
            if (sessionStorage.getItem('workspaceId')) {
                sessionStorage.setItem('workspaceId', '');
                eventBus.fireEvent("checkAuth");
            }
        });
        this.eventBus.fireEvent("openAddCardDialog",
            {parentId: this.id, posX: this.posX, posY: this.posY, posZ: this.posZ});

        this.addButton.addEventListener('pointerdown', function () {
            let cardId = sessionStorage.getItem('cardId');
            let posX = sessionStorage.getItem('posX');
            let posY = sessionStorage.getItem('posY');
            let posZ = sessionStorage.getItem('posZ');
                eventBus.fireEvent("openAddCardDialog",
                    {parentId: cardId, posX: posX, posY: posY, posZ: posZ});
        });


        this.whiteThemeButton.addEventListener('click', function () {
            let link = 'css/lightTheme/';
            for (let i = 0; i < cssFiles.length; i++) {
                let oldlink = document.getElementsByTagName("link").item(i);
                let newlink = document.createElement("link");
                newlink.setAttribute("rel", "stylesheet");
                newlink.setAttribute("type", "text/css");
                newlink.setAttribute("href", link + cssFiles[i]);

                document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);

            }
            eventBus.fireEvent("changeTheme", ENUM.ThemeType.light);

        });
        this.darkThemeButton.addEventListener('click', function () {
            let link = 'css/darkTheme/';
            for (let i = 0; i < cssFiles.length; i++) {
                let oldlink = document.getElementsByTagName("link").item(i);
                let newlink = document.createElement("link");
                newlink.setAttribute("rel", "stylesheet");
                newlink.setAttribute("type", "text/css");
                newlink.setAttribute("href", link + cssFiles[i]);

                document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
            }
            eventBus.fireEvent("changeTheme", ENUM.ThemeType.dark);

        });

        this.logoutButton.addEventListener('click', function () {
            RequestMappingUtils.postWithoutBodyResponse("/logout", function () {
                eventBus.fireEvent("checkAuth", null);
                loginLegend.innerHTML = 'Гость';
                logoutButton.style.display = 'none';
                setVisibleOtherButtons();
                setVisibleMenuButton();
            });
        });

        this.eventBus.addEventListener("changeTheme", function (data) {
            settingButton.setAttribute('src', 'images/' + data.getName() + '/settings.svg');
            homeButton.setAttribute('src', 'images/' + data.getName() + '/menu.svg');
            addButton.setAttribute('src', 'images/' + data.getName() + '/plus.svg');
            setTheme(data);
        });
        this.eventBus.addEventListener("changeUserName", function () {
            updateMenuData();
            setVisibleOtherButtons();
        });
    }

    setTheme(theme1) {
        this.theme = theme1;
    }

    getTheme() {
        this.theme;
    }
}


export {MainMenu};