var gui = require('nw.gui'),
	fs = require("fs"),
	path = require("path"),
	peerflix = require("peerflix"),
	wjs = require("wcjs-player"),
	wcjs_ = require('wcjs-prebuilt'),
	nameParser = require("video-name-parser"),
  pkg = require("./package.json"),
  appname = pkg.window.title,
	win = gui.Window.get(),
	args = window.gui.App.argv,
	plugins = {},
	config = {},
	modules = {},
	loadedFiles = [],
	elements = {},
	mode = 0,
	player = null,
	menues = {},
	winx = {},
  played = [],
  primaryMenuBar = new gui.Menu({ type: 'menubar' });
  

	


(function(window) {
  
  elements.search = $(".search-bar");
  elements.FooterControls = $("#PlayerContainer");
  elements.wrapper = $(".wrapper");
  elements.player = $("#player");
  elements.dropFiles = $("#dragOrDropFile");


this.readDir = function (location){ 
    var files__ = [];
    var finder = require('findit')(location);
    console.time(path.basename(location));
    pagal.log("Location: "+location);
    

    finder.on('directory', function (dir, stat, stop) {
      var base = path.basename(dir);
      //pagal.log("Directory Name: "+ dir);
    });
    finder.on('file', function (file, stat) {
      if(pagal.checkExtension(file, 'mp4,webm,mkv')){
        var base = path.basename(file);
        files__.push(file);
      }      
    });
    finder.on('error',function (err){
      console.log(err);
      next();
    });
    finder.on('end',function (){
      console.timeEnd(path.basename(location))
      pagal.loadFiles(files__);
      loadedFiles = files__;
    });
};

this.loadFiles = function(filesH){
    var node, i = 1;
    filesH.sort();
    $(filesH).each(function(key,data){
        node = pagal.makeNode(data, i);
        $("#ContentWrapper").css("display","flex").append(node);
        elements.dropFiles.css("display","none");
        node = null;
        i++;
    });
    console.log("Initating search module");
    pagal.node_Init();
    pagal.initPlaylist(filesH);
    pagal.elements.FooterControls.find(".track-info .playlist").trigger("click");
    player.play();
    
    //iaa = player.currentItem() + 1;
    // /console.log(iaa);
    //$('[data-id="'+iaa+'"]').addClass("playing");
    pagal.elements.FooterControls.find(".track-info .playlist").trigger("click");
};

this.makeNode = function(data, id) {
  return '<div class="track-container grid__item" data-id="'+id+'" data-src="'+data+'">'
              +'<div class="cover" title="'+path.basename(data)+'"></div>'
              +'<div class="info">'
              +'<div class="title">'+path.basename(data)+'</div>'
              +'</div>'
              +'<div class="clear"></div>'
              +'</div>';   
};

this.log = function(message) {
  $("#log").append("<li>"+message + "</li>");
};

this.checkExtension = function(str, ext) {
  extArray = ext.split(',');
  for(i=0; i < extArray.length; i++) {
    if(str.toLowerCase().split('.').pop() == extArray[i]) {
      return true;
    }
  }
  return false;
};

this.loadConfig = function() {

  var configJson, configObject, key, fileFound = true;
  try {
    configJson = fs.readFileSync("config.json", {
      encoding: "utf-8"
    });
  } catch (err) {
    console.log("No config.json file found");
    fileFound = false;
  }

  if ( fileFound === true ) {
    try {
      configObject = JSON.parse(configJson);
    } catch (err) {
      console.log("Hawa Invalid config.json file.");
    }

    for ( key in configObject ) {
      config[key] = configObject[key];
    }
  }

};

this.pluginInit = function() {

    //Scan plugins directory.
    fs.readdir(process.cwd() + "/plugins", function(err, files){

      var i = 0, max = files.length, stat, cwd = process.cwd(), uid, currentPlugin;

      for ( i; i<max; i++ ) {

        uid = cwd + "/plugins/" + files[i];
        currentPlugin = files[i];

        //Protect the scope while in the loop.
        (function(uid,currentPlugin){

          fs.stat(uid, function(err, stats) {

            var fuid;

            if (! err ) {
              if(! stats.isFile() ) {

                //Plugin folder found.
                //Check it for a package.json.
                fuid = uid + "/package.json";
                fs.exists(fuid, function(exists){
                  if ( exists ) {
                    //Add it to plugin list.
                    pagal.insertPlugin( currentPlugin );
                  } else {
                    pagal.log("Plugin " + currentPlugin + " is missing package.json, therefor, it was not activated.");
                  }
                });


              }
            }
          });

        })(uid,currentPlugin);

      }

    });

};

  
this.insertPlugin = function(plugin) {

    var uid;

    uid = process.cwd() + "/plugins/" + plugin + "/";
    fs.readFile(uid + "package.json", {
      encoding: "utf-8"
    }, function(err, data){

      var jsonP;

      if (! err ) {

        try {
          jsonP = JSON.parse(data);
        } catch( e ) {
          console.error("Invalid package.json on plugin " + plugin);
          return;
        }

        if ( jsonP.hasOwnProperty("name") && jsonP.hasOwnProperty("description") && jsonP.hasOwnProperty("version") && jsonP.hasOwnProperty("main") ) {

          //Inject the plugin.
          if (! plugins.hasOwnProperty(jsonP.name) ) {

            plugins[jsonP.name] = jsonP;

            //Is the plugin active?
            if ( pagal.isPluginActive( jsonP.name ) ) {
              plugins[jsonP.name].active = true;
              pagal.bootPluginByName( jsonP.name );
            } else {
              plugins[jsonP.name].active = false;
              config.plugins[jsonP.name] = {
                active: false
              };
            }

          } else {
            console.error("A plugin with the same name already exists");
            return;
          }

        } else {
          console.error("Invalid manifest format on plugins package.json, " + plugin);
          return;
        }

      } else {
        log("There was an error reading package.json from " + plugin);
        return;
      }

    });

};

this.isPluginActive = function(plugin) {

    if ( config.plugins.hasOwnProperty(plugin) ) {
      if ( config.plugins[plugin].hasOwnProperty("active") ) {
        if ( config.plugins[plugin].active === true ) {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }

};

this.bootPluginByName = function(plugin) {

    var passObject;

    plugins[plugin].entryPoint = require( process.cwd() + "/plugins/" + plugin + "/" + plugins[plugin].main );

    passObject = {
      gui: gui,
      win: win,
      config: config,
      elements: elements,
      pagal: this
    };

    if ( typeof plugins[plugin].entryPoint.init === "function" ) {
      plugins[plugin].entryPoint.init(passObject);
    }

};

this.moduleReInitByName = function(name) {

    var passObject;

    passObject = {
      gui: gui,
      win: win,
      config: config,
      elements: elements,
      pagal: this
    };

    modules[name].init(passObject);

};

this.moduleInit = function() {

    var passObject, key;
    modules["nativemenu"] = require(process.cwd() + "/modules/menu/index.js");

    passObject = {
      gui: gui,
      win: win,
      config: config,
      elements: elements,
      pagal: this
    };

    for (key in modules) {
      modules[key].init(passObject);
    }

};

this.search = function(){
  var search = elements.search,
      track = elements.track;
      search.on("keyup",function(){
        var g = $(this).val().toLowerCase();
        $(".track-container").each(function() {
          var s = $(this).text().toLowerCase();
          $(this).closest('.track-container')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
        });
      });
};

this.setMode = function(){
  mode = (mode == 0) ? 1 : 0;
  if(mode == 1){
    win.on("resize",function(){
      if(win.height <= 480 && mode == 1){
        win.height = 480;
        win.setResizable(false);
      }
      if(win.width <= 555 && mode == 1){
        win.width = 555;
        win.setResizable(false);

      }
    });
  }
  else{
    win.setResizable(true);
  }  
};

this.setSize = function(){
  if(mode == 1){
    if(win.height <= 480 && mode == 1){
        win.height = 480;
        win.setResizable(false);
      }
      if(win.width <= 555 && mode == 1){
        win.width = 555;
        win.setResizable(false);
      }
  }
  else{
    win.setResizable(true);
  }
};

this.setProgessBar = function(value){
  if(value >= 0 && value <= 1){
    pagal.win.setProgressBar(value);
    return 1;
  }
  return 0;
};

this.showWrapper = function(){
  pagal.setMode();
  pagal.setSize();
  elements.player.toggleClass("playerSmall");
  elements.wrapper.toggleClass("display-block");
  //player.refreshSize(100).refreshSize(500).refreshSize(1000);
  return 0;
}

this.insertMenu = function(menu, opts, position ) {
  var item = null;
  if(typeof position === 'undefined') {
    item = new gui.MenuItem(opts);
    menues[menu].submenu.append(item);
    return 0;
  }
  item = opts;
  menues[menu].submenu.insert(item,position);
  return 1;
};

this.parseTime = function(t,total) {
    if (typeof total === 'undefined') total = t;
    var tempHour = ("0" + Math.floor(t / 3600000)).slice(-2);
    var tempMinute = ("0" + (Math.floor(t / 60000) %60)).slice(-2);
    var tempSecond = ("0" + (Math.floor(t / 1000) %60)).slice(-2);
    if (total >= 3600000) return tempHour + ":" + tempMinute + ":" + tempSecond;
    else return tempMinute + ":" + tempSecond;
};

this.initPlaylist = function (file_list){
  if ( file_list.length > 0){
    for(x in file_list){
      player.addPlaylist("file:///" + file_list[x]);
    }
  }
};

this.node_Init = function (){

/*TODO::
**  A lot to be done in here.
*/
$(".track-container").click(function (){
    var id = $(this).attr("data-id");
    //$(".track-container").removeClass("playing");
    //$(this).addClass("playing");
    currentItem = player.currentItem();
    if(player.playing() == true && currentItem == id - 1) {
        player.time(0);
        player.refreshSize(200).refreshSize(500).refreshSize(1000);
        return;
    }
    pagal.showWrapper();
    elements.player.css("display","block");
    player.playItem(id - 1);
  });
};

this.manageWindow = function(width, height) {

  winx = {
	onTop: false,
	focused: true,
	gui: gui.Window.get(),
	findScreen: function() {
		backupScreen = -1;
		gui.Screen.screens.some(function(screen,i) {
			
			// check if the window is horizontally inside the bounds of this screen
			if (winx.gui.x >= screen.bounds.x && winx.gui.x + winx.gui.width <= screen.bounds.x + screen.work_area.width) {
			// window is fully inside the screen
			winScreen = i;
			} else if (winx.gui.x <= screen.bounds.x && winx.gui.x + winx.gui.width >= screen.bounds.x) {
			// window is partially inside the left side of screen
			if (winx.gui.x + winx.gui.width - screen.bounds.x >= winx.gui.width /2) {
				// more then half the window is in this screen
				winScreen = i;
			} else {
				// less then half the window is in this screen
				// should still search for a better match
				backupScreen = i;
			}
			
			} else if (winx.gui.x >= screen.bounds.x && winx.gui.x <= screen.bounds.x + screen.bounds.width && winx.gui.x + winx.gui.width >= screen.bounds.x + screen.bounds.width) {

			// window is partially inside the right side of screen
			if (screen.bounds.x + screen.bounds.width - winx.gui.x >= winx.gui.width /2) {
				// more then half the window is in this screen
				winScreen = i;
			} else {
				// less then half the window is in this screen
				// should still search for a better match
				backupScreen = i;
			}

			}

			if (winScreen > -1) return true;
			
		});
		
		if (winScreen > -1) return gui.Screen.screens[winScreen];
		else if (backupScreen > -1) return gui.Screen.screens[backupScreen];
		else return false;
	},
	resizeInBounds: function(newWidth,newHeight) {
			
		scr = winx.findScreen();
		var win = winx;
			
			if (scr) {

				if (newWidth >= scr.work_area.width) {
					if (newHeight >= scr.work_area.height) {
						// width and height are larger then the screen
						// resize to window screen size
						win.gui.resizeTo(scr.work_area.width, scr.work_area.height);
						win.gui.moveTo(scr.bounds.x, scr.bounds.y);
					} else {
						// width is larger then the screen width
						// resize to window width size, vertically center height
						win.gui.resizeTo(scr.work_area.width, newHeight);
						win.gui.moveTo(scr.bounds.x, (scr.work_area.height - newHeight) /2);
					}
					player.refreshSize(200).refreshSize(500).refreshSize(1000);
				} else {

					/*if (win.gui.x == scr.bounds.x + ((scr.work_area.width - win.gui.width) /2) && win.gui.y == scr.bounds.y + ((scr.work_area.height - win.gui.height) /2)) {
						// if perfectly centered, keep it centered
			//console.log("centered");
						//win.gui.moveTo(scr.bounds.x + ((scr.work_area.width - newWidth) /2), scr.bounds.y + (scr.work_area.height - newHeight)/2);
						//win.gui.resizeTo(newWidth, newHeight);
					} else {*/
						// resize the window, but keep it in bounds
						if (newHeight >= scr.work_area.height) {
							win.gui.resizeTo(newWidth, scr.work_area.height);
							win.gui.moveTo(scr.bounds.x+((scr.work_area.width - newWidth)/2), scr.bounds.y);
						} else {
							win.gui.resizeTo(newWidth, newHeight);
							if (win.gui.x + newWidth > scr.bounds.x + scr.work_area.width) {
								if (win.gui.y + newHeight > scr.work_area.height) {
									win.gui.moveTo((scr.bounds.x + scr.work_area.width - newWidth), (scr.work_area.height - newHeight));
								} else if (win.gui.y < scr.bounds.y) {
									win.gui.moveTo((scr.bounds.x + scr.work_area.width - newWidth), scr.bounds.y);
								} else {
									win.gui.moveTo((scr.bounds.x + scr.work_area.width - newWidth), win.gui.y);
								}
							} else {
								if ((win.gui.y + newHeight) > scr.work_area.height) {
									if (win.gui.x < scr.bounds.x) {
										win.gui.moveTo(scr.bounds.x, (scr.work_area.height - newHeight));
									} else {
										win.gui.moveTo(win.gui.x, (scr.work_area.height - newHeight));
									}
								} else if (win.gui.y < scr.bounds.y) {
									if (win.gui.x < scr.bounds.x) {
										win.gui.moveTo(scr.bounds.x, scr.bounds.y);
									} else {
										win.gui.moveTo(win.gui.x, scr.bounds.y);
									}
								} else {
									if (win.gui.x < scr.bounds.x) {
										win.gui.moveTo(scr.bounds.x, win.gui.y);
									}
								}
							}
						}
					$(player.canvas).css('width','100%').css('height','100%');
				}
				return false;
			}
		}
  }
  
  winx.resizeInBounds(width,height);

};


this.openSingleFile = function(fileLocation) {

  //TODO::search for the subtitle file and load if present
  pagal.addToPlayList(fileLocation);
  pagal.addToRecentList(fileLocation);
  loadedFiles.push(fileLocation);
  player.addPlaylist("file:///" + fileLocation);
  player.play();
  
};

this.addToRecentList = function(file) {
  
  try{
    played.push(file);
    localStorage.setItem("recent", JSON.stringify(played));
  } catch(e) {
    console.log(e.message);
  }

   hawa = new gui.MenuItem({
     label: file,
    click: function () {
      alert(file);
    }
   });
   pagal.insertMenu("Recent", hawa, 0);   
}

this.addToPlayList = function(file) {
  var node = pagal.makeNode(file,1);
  $("#ContentWrapper").css("display","flex").append(node);
  pagal.node_Init();
}

this.manageMenu = function() {
  menues.mediaMenu = new gui.MenuItem({
    label: 'Media',
    submenu: new gui.Menu()
   });

   menues.Recent = new gui.MenuItem({
     "label": 'Recent',
     submenu: new gui.Menu()
   });   
   pagal.loadMediaMenu();
   pagal.loadRecentMenu();
}

this.loadMediaMenu = function() {
  pagal.insertMenu("mediaMenu", {
    label: "Open File",
    click: function() {
      console.log("bibash ta hawa ho ka nappadera k gardai xas");;
    },
    icon: "lib/img/file.png"
  });
  pagal.insertMenu("mediaMenu", {
    label: "Open Folder",
    click: function() {
      console.log("bibash ta hawa ho ka nappadera k gardai xas");;
    },
    icon: "lib/img/folder.png"
  });
};

this.loadRecentMenu = function() {
  try{
    if(JSON.parse(localStorage.getItem("recent"))) {
      played = JSON.parse(localStorage.getItem("recent"));
      hawa = played.reverse();
      for(x in hawa) {
        pagal.insertMenu("Recent", {
          label: hawa[x],
          click: function () {
            console.log(hawa[x]);
          }
        });
      }
    }
  } catch(e) {
    console.log(e.message);
  };  
  
};


this.init = function() {

  gui.Screen.Init();
	pagal.loadConfig();
	pagal.moduleInit();
	pagal.pluginInit();
  pagal.manageMenu();
	playerApi.init();

	if (args.length > 0) {
		switch ( args.length ) {
			case 1:
				//Is first arg file or directory?
				try {
					argCountType = fs.lstatSync(args[0]);
					if (argCountType.isDirectory()) {
            console.log("Reading Directory "+ args[0]);
            pagal.readDir(args[0]);
					} else if (argCountType.isFile()) {
					  pagal.openSingleFile(args[0]);
					}
				} catch(err) {
					console.log(err);
				}
				break;
			case 2:
				//Open file and directory.
				console.log("Folder: "+ args[0] + " File: " + args[1]);
        
				break;
		}
	}

	
	//pagal.readDir("E:\\pagal\\Back up\\Animated flims");
	//pagal.readDir("C:\\Users\\lenovo\\Downloads\\Compressed\\recup_dir.1");
	pagal.search();
 


    var controls = elements.FooterControls;
    controls.find(".track-info .playlist").click(function () {
      pagal.showWrapper();
    });

    pagal.insertMenu("Recent",{
      type:"separator"
    });
    pagal.insertMenu("Recent", {
      label: "Clear List",
      click: function () {
        console.log("Clearing...");
      }
    });


    pagal.menues.mediaMenu.submenu.append(menues.Recent);
    pagal.primaryMenuBar.append(menues.mediaMenu);
    pagal.primaryMenuBar.append(menues.viewMenu);
    pagal.primaryMenuBar.append(menues.playMenu);
    pagal.primaryMenuBar.append(menues.videoMenu);
    pagal.primaryMenuBar.append(menues.audioMenu);
    pagal.primaryMenuBar.append(menues.aaujarMenu);
    pagal.primaryMenuBar.append(menues.pagalMenu);
    pagal.primaryMenuBar.append(menues.helpMenu);
    win.menu = pagal.primaryMenuBar;



};


  console.time("init");
  window.pagal = this;
  pagal.init();	
  console.timeEnd("init");
  win.on("loaded",function() {
    win.show();
    //win.showDevTools();
  });
	
	

  
})(window);
  