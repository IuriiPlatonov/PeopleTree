class Desktop {
	constructor()
	{
		this.delta_x = 0;
		this.delta_y = 0;
		
		this.ie = 0;
		this.bind();
	    this.init();
	    
	    this.canvasSize = {
	    		  x1: 0,
	    		  y1: 0,
	    		  x2: 0,
	    		  y2: 0
	    		};
	}
	
	bind() {
		this.moveDesktopPanel = this.moveDesktopPanel.bind(this);	
		this.saveXY = this.saveXY.bind(this);	
		this.clearXY = this.clearXY.bind(this);
	}

	init() {
		if (navigator.userAgent.indexOf("MSIE") != -1) this.ie = 1;  
		this.initDesktopPanels();
		this.initListener();
	}

	initDesktopPanels() {
		this.desktopPanel = DomUtils.addDivWithClasses(document.body, ['desktopPanel', 'noselect'] );
		this.buttonPanel = DomUtils.addDivWithClasses(document.body, ['buttonPanel', 'noselect'] );
	}
	
	initListener() {
		if (this.ie) {
			document.onmousedown = this.saveXY;
		    document.onmouseup = this.clearXY;
		} else {
			document.addEventListener('mousedown', this.saveXY);
		    document.addEventListener('mouseup', this.clearXY);
		}
	}
	
	moveDesktopPanel(event) {
	      var  x = event.pageX;
	      var  y = event.pageY;

	      let new_x = this.delta_x + x;
	      let new_y = this.delta_y + y;
	      this.desktopPanel.style.top = new_y + 'px';
	      this.desktopPanel.style.left = new_x + 'px';
	    
	    }
	  
	saveXY(event) {
	    var x = event.pageX;
	    var y = event.pageY;

	    let x_block = this.desktopPanel.offsetLeft;
	    let y_block = this.desktopPanel.offsetTop;

	    this.delta_x = x_block - x;
	    this.delta_y = y_block - y;

	    if (this.ie) {
	    	document.onmousemove = this.movePersonCard;
	    } else {
	    	document.addEventListener("mousemove", this.moveDesktopPanel, false);
	    }
	}
	  
	clearXY() {
		  
	      if (this.ie) {
	        document.onmousemove = null;
	      } else {
	        document.removeEventListener("mousemove", this.moveDesktopPanel, false);
	      }
	}	
	
	getDesktopPanel() {
		return this.desktopPanel;
	}
	
	getCanvasSize() {
		return this.canvasSize;
	}
}