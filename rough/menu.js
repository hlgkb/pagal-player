var menu__ = this,
    menus = {},
    submenu = {},
    pagal = null, 
    pagalCore = null;

exports.init = function(core) {
    pagalCore = core;
    pagal = pagalCore.pagal;
    menus = pagal.menues;
    submenu = pagal.submenues;

    pagal.insertmenu = menu__.insertMenuItem;
    pagal.deletemenu = menu__.removeMenuItem;
    pagal.menuStuff = menu__;

    menus.viewMenu = new pagalCore.gui.MenuItem({
        label: 'View',
        submenu: new pagalCore.gui.Menu()
    });

    menus.playMenu = new pagalCore.gui.MenuItem({
        label: 'Play',
        submenu: new pagalCore.gui.Menu()
    });

    menus.videoMenu = new pagalCore.gui.MenuItem({
        label: 'Video',
        submenu: new pagalCore.gui.Menu()
    });

    menus.audioMenu = new pagalCore.gui.MenuItem({
        label: 'Audio',
        submenu: new pagalCore.gui.Menu()
    });

    menus.aaujarMenu = new pagalCore.gui.MenuItem({
        label: 'Aaujar',
        submenu: new pagalCore.gui.Menu()
    });

    menus.pagalMenu = new pagalCore.gui.MenuItem({
        label: 'Pagal',
        submenu: new pagalCore.gui.Menu()
    });

    menus.helpMenu = new pagalCore.gui.MenuItem({
        label: 'Help',
        submenu: new pagalCore.gui.Menu()
    });

/**
 * Audio Menu Sub Menu
 */
  menus.audioMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Decrease Volume",
    tooltip: "Decrease Volume",
    click: function() {
      pagal.keymap().trigger(pagal.keysConfig["volumeDown"]);
    }
  }));
  menus.audioMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Increase Volume",
    tooltip: "Increase Volume",
    click: function() {
      pagal.keymap().trigger(pagal.keysConfig["volumeUp"]);
    }
  }));
  menus.audioMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Mute",
    tooltip: "Mute",
    click: function() {
      pagal.keymap().trigger(pagal.keysConfig["mute"]);
    }
  }));
/**
 * Video Menu Sub Menu
 */
  pagal.menues.videotrack = this.insertMenuItem("videoMenu",{
      label: "Video Track",
      submenu: new pagalCore.gui.Menu(),
      enabled: false
  });
  
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Fullscreen",
    type:  "checkbox",
    click: function() {

    }
  }));
  pagal.menues.onTop = pagal.insertmenu("videoMenu", {
    label: "Always on top",
    type: "checkbox",
    click: function() {
        pagal.setOnTop();
    }
  });

  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));



  pagal.menues.aspectRatio = pagal.insertmenu("videoMenu", {
        label: "Aspect Ratio",
        submenu: new pagalCore.gui.Menu(),
        enabled: false
  });

  pagal.menues.crop = pagal.insertmenu("videoMenu", {
      label: "Crop",
      submenu: new pagalCore.gui.Menu(),
      enabled: false
  });
  
  pagal.menues.zoom = pagal.insertmenu("videoMenu", {
      label: "Zoom",
      submenu: new pagalCore.gui.Menu(),
      enabled: false
  });

  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));

  pagal.menues.deinterlace = pagal.insertmenu("videoMenu", {
      label: "Deinterlace",
      submenu: new pagalCore.gui.Menu(),
      enabled: false
  });

  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Take a Snapshot",
    click: function() {

    }
  }));
/**
 * Play Menu Sub Menu
 */
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Play/Pause",
        enabled: false,
        click: function() {
          console.log("toggle paused");
          //player.togglePause();
        }
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Stop",
        enabled: false,
        click: function() {
          console.log("Stop");
        }
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Next",
        enabled: false,
        click: function() {
          console.log("Next Item");
        }
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Pervious",
        enabled: false,
        click: function() {
          console.log("Pervious Item");
        }
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Speed",
        enabled: false,
        submenu: new pagalCore.gui.Menu()
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Jump Forward",
        enabled: false,
        click: function() {
          console.log("5 second forward");
        }
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Jump Backward",
        enabled: false,
        click: function() {
          console.log("5 second back");
        }
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Jump to specific Time",
        enabled: false,
        click: function() {
          console.log("deko time ma jump garni");
        }
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Subtitle",
        enabled: false,
        submenu: new pagalCore.gui.Menu()
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.playMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "After Playback",
        enabled: false,
        submenu: new pagalCore.gui.Menu()
  }));

/**
  * Pagal Menu Sub Menu Item
  */
  menus.pagalMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Pagal Mode",
        enabled: true,
        type: "checkbox",
        click: function() {
          console.log("bias");
        }
  }));
  menus.pagalMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Don't save to recent",
        enabled: true,
        type: "checkbox"
  }));
  menus.pagalMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Comming Soon",
        enabled: false
  }));

  /**
   * Aaujar Menu
   */
  menus.aaujarMenu.submenu.append(new pagalCore.gui.MenuItem({
        label: "Comming Soon",
        enabled: false
  }));

  







/**
 * Help Menu Sub Menu
 */
  menus.helpMenu.submenu.append( new core.gui.MenuItem({
    label: 'About',
    click: function () {
      console.log("About");
    }
  }));
  menus.helpMenu.submenu.append( new core.gui.MenuItem({
    label: 'Toggle Developer Option',
    click: function () {
      pagal.keymap().trigger(pagal.keysConfig["openDevTools"]);
    }
  }));



    pagal.pagalConfig.aspectRatio.forEach(function(el,i) {
        mnOpts = {
          label: el,
          type: 'checkbox',
          click: function() { 
            pagal.setAspectRatio(i);
          }
        };
        if (i == 0) mnOpts.checked = true;
        //saveCtx._aspectRatioMenu.append(new gui.MenuItem(mnOpts));
        menu = pagal.insertmenu("aspectRatio", mnOpts);
    });

    pagal.pagalConfig.crop.forEach(function(el,i) {
			mnOpts = {
				label: el,
				type: 'checkbox',
				click: function() { 
          pagal.setCrop(i);
         }
			};
			if (i == 0) mnOpts.checked = true;
			//saveCtx._aspectRatioMenu.append(new gui.MenuItem(mnOpts));
      menu = pagal.insertmenu("crop", mnOpts);
		});

    pagal.pagalConfig.zoom.forEach(function(el,i) {
			mnOpts = {
				label: pagal.pagalConfig.zoomText[i],
				type: 'checkbox',
				click: function() { 
          pagal.setZoom(i);
         }
			};
			if (i == 2) mnOpts.checked = true;
			//saveCtx._aspectRatioMenu.append(new gui.MenuItem(mnOpts));
      menu = pagal.insertmenu("zoom", mnOpts);
		});

    pagal.pagalConfig.deinterlace.forEach(function(el,i) {
			mnOpts = {
				label: el,
				type: 'checkbox',
				click: function() { 
          pagal.setDeinterlace(i);
         }
			};
			if (i == 0) mnOpts.checked = true;
			//saveCtx._aspectRatioMenu.append(new gui.MenuItem(mnOpts));
      menu = pagal.insertmenu("deinterlace", mnOpts);
		});



    
};


exports.enableMenues = function() {
  pagal.menues.aspectRatio.enabled = true;
  pagal.menues.crop.enabled = true;
  pagal.menues.zoom.enabled = true;
  pagal.menues.deinterlace.enabled = true;
}

exports.insertMenuItem = function(menu, opts, position ) {

  var nMenu;

  nMenu = new pagalCore.gui.MenuItem(opts);
  if(typeof position === 'undefined') {
    menus[menu].submenu.append(nMenu);
    return nMenu;
  }
  menus[menu].submenu.insert(nMenu,position);

  return nMenu;

};

exports.removeMenuItem = function(name,menu) {

  menus[name].submenu.remove(menu);

};