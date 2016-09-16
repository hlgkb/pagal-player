/*menuPlugin.js*/
var menuP= this;
var primaryMenuBar;
var menus = {};
var pagal, pagalCore;

exports.init = function( core ) {
  pagal = core.pagal;
  pagalCore = core;
 	 primaryMenuBar = new pagalCore.gui.Menu({ type: 'menubar' });

 	 /*
   * Media menu
   */
	menus.mediaMenu = new pagalCore.gui.MenuItem({
		label: 'Media',
    click:function(){
      alert("hawa");
    },
		submenu: new pagalCore.gui.Menu()
	});

  menus.mediaMenu.submenu.append(new core.gui.MenuItem({
  	label: 'New file',
    tooltip: "Ctrl + N",
  	click: function () {
      bs.createNewFile();
  	}
  }));

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

  menus.aaujarMenu = new pagalCore.gui.MenuItem({
    label: 'Aaujar',
    //submenu: new pagalCore.gui.Menu()
  });

  menus.pagalMenu = new pagalCore.gui.MenuItem({
    label: 'Pagal',
    submenu: new pagalCore.gui.Menu()
  });


  menus.helpMenu = new pagalCore.gui.MenuItem({
    label: 'Help',
    submenu: new pagalCore.gui.Menu()
  });


  for(key in menus){
    primaryMenuBar.append( menus[key] );
  }
	pagalCore.win.menu = primaryMenuBar;
  pagal.insertMenuItem = menuP.insertMenuItem;
 }


 exports.insertMenuItem = function (menu, opts) {

  var nMenu;

  nMenu = new pagalCore.gui.MenuItem(opts);

  menus[menu].submenu.append(nMenu);

  return nMenu;

};