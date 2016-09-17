/*menuPlugin.js*/
var menuP= this;
var primaryMenuBar;
var menus = {};
var pagal, pagalCore;

exports.init = function( core ) {
  pagal = core.pagal;
  pagalCore = core;
  menus = pagal.menues;

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
      label: "Audio Track",
      submenu: new pagalCore.gui.Menu(),
      enabled: false,
      click: function() {

      }
  }));
  menus.audioMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.audioMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Decrease Volume",
    tooltip: "Decrease Volume",
    click: function() {

    }
  }));
  menus.audioMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Increase Volume",
    tooltip: "Increase Volume",
    click: function() {

    }
  }));
  menus.audioMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Mute",
    tooltip: "Mute",
    click: function() {

    }
  }));

/**
 * Video Menu Sub Menu
 */
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
      label: "Video Track",
      submenu: new pagalCore.gui.Menu(),
      enabled: false,
      click: function() {

      }
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Fullscreen",
    type:  "checkbox",
    click: function() {

    }
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    label: "Always on top",
    type: "checkbox",
    click: function() {

    }
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
      label: "Aspect Ratio",
      submenu: new pagalCore.gui.Menu(),
      enabled: false,
      click: function() {

      }
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
      label: "Crop",
      submenu: new pagalCore.gui.Menu(),
      enabled: false,
      click: function() {

      }
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
      label: "Zoom",
      submenu: new pagalCore.gui.Menu(),
      enabled: false,
      click: function() {

      }
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
    type:"separator"
  }));
  menus.videoMenu.submenu.append(new pagalCore.gui.MenuItem({
      label: "Deinterlace",
      submenu: new pagalCore.gui.Menu(),
      enabled: false,
      click: function() {

      }
  }));
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
      pagal.win.showDevTools();
    }
  }));
}