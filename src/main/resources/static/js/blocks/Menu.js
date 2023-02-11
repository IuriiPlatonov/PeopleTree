import * as ENUM from 'enum';

class MainMenu {

    constructor(eventBus) {
    	this.cssFiles = ['Objects.css', 'Dialogs.css', 'Menu.css'];
    	this.eventBus = eventBus;
    	this.theme = ENUM.ThemeType.dark;
    	this.bind();
        this.init();
        this.initListener();
    }

    bind() {
        this.setVisible = this.setVisible.bind(this);  
        this.setTheme = this.setTheme.bind(this);  
    }
    
    init() {
    	this.initMenuButton();
    	this.initSettingButtonPanel();
    	
    }
    
    initMenuButton() {
    	this.settingButton = document.createElement('img');
        this.settingButton.classList.add('mainMenuButton');
        this.settingButton.setAttribute('src', 'images/darkTheme/menu.svg');
        document.body.appendChild(this.settingButton);
    }

    initSettingButtonPanel() {
        this.mainMenuPanel = document.createElement('div');
        this.mainMenuPanel.classList.add('mainMenuPanel');
        this.mainMenuPanel.style.display = 'none'
        document.body.appendChild( this.mainMenuPanel);
        
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
    }
    
    setVisible() {
        if (this.mainMenuPanel.style.display === 'block') this.mainMenuPanel.style.display = 'none'
        else this.mainMenuPanel.style.display = 'block';
    }

    initListener() {
        let settingButton = this.settingButton;
    	let eventBus = this.eventBus;
    	let cssFiles = this.cssFiles;
    	let setVisible = this.setVisible;
    	let setTheme = this.setTheme;
    	
        this.settingButton.addEventListener('click', function () {
            setVisible();
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
        this.eventBus.addEventListener("changeTheme", function(data){
        	settingButton.setAttribute('src',  'images/' + data.getName() + '/menu.svg');
        	setTheme(data);
        });
    }
    
    setTheme(theme1) {
    	this.theme = theme1;
    }
    
    getTheme() {
    	this.theme;
    }
}


export { MainMenu };