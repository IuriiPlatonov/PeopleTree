class DomUtils {
    constructor() {
    }

    static addDiv(parent, elementClass) {
    	 let div = DomUtils.createDiv(elementClass);
    	 parent.appendChild(div);
    	 return div;
    }
    
    static addDivWithText(parent, elementClass, text) {
   	  	let div = DomUtils.createDivWithText(elementClass, text);
   	  	parent.appendChild(div);
   	  	return div;
    }
    
    static addDivWithClasses(parent, elementClasses) {    	
    	let div = DomUtils.createElementWithClasses('div', elementClasses);
      	parent.appendChild(div);
      	return div;
    }
    
    static createDiv(elementClass) {
    	return DomUtils.createElementWithClass('div', elementClass);
    }
    
    static createDivWithText(elementClass, text) {
    	return DomUtils.createElementWithClassAndInnerText('div', elementClass, text);
    }
    
    static addImg(parent, elementClass, src) {
    	let img = DomUtils.createImg(elementClass, src);
    	parent.appendChild(img);
    	return img;
    }
    
    static addImgWithClasses(parent, elementClasses, src) {
    	let img = DomUtils.createImgWithClasses(elementClasses, src);
    	parent.appendChild(img);
    	return img;
    }
    
    static createImg(elementClass, src) {
    	let img = document.createElement('img');
    	img.setAttribute('src', src)
        img.classList.add(elementClass);
    	return img;
    }
    
    static createImgWithClasses(elementClasses, src) {
    	let img = document.createElement('img');
    	img.setAttribute('src', src)
        elementClasses.forEach(function (item, i, arr) {
            img.classList.add(item);
        });
    	return img;
    }    
    
    
    
    
    
    
    
    
    
    static createElementWithClass(tag, elementClass) {
        let element = document.createElement(tag);
        element.classList.add(elementClass);
        return element;
    }

    static createElementWithClassAndInnerText(tag, elementClass, innerText) {
        let element = document.createElement(tag);
        element.classList.add(elementClass);
        element.innerHTML = innerText;
        return element;
    }

    static createElementWithClasses(tag, elementClasses) {
        let element = document.createElement(tag);
        elementClasses.forEach(function (item, i, arr) {
            element.classList.add(item);
        });
        return element;
    }

    static createElementWithClassesAndText(tag, elementClasses, innerText) {
        let element = document.createElement(tag);
        elementClasses.forEach(function (item, i, arr) {
            element.classList.add(item);
        });
        element.innerHTML = innerText;
        return element;
    }

}