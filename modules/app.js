var gui = require('nw.gui'),
	fs = require("fs"),
	path = require("path"),
	wjs = require("wcjs-player"),
	wcjs_ = require('wcjs-prebuilt'),
	nameParser = require("video-name-parser"),
  pkg = require("./package.json"),
  hotkeys = require('hotkeys'),
  drop = require("drag-and-drop-files"),
  xml2js = require('xml2js'),
  xmlbuilder = require("xmlbuilder"),
  dispatcher = new hotkeys.Dispatcher(),
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
  submenues = {},
	winx = {},
  played = [],
  primaryMenuBar = new gui.Menu({ type: 'menubar' }),
  audiotrackMenu = [],
  keysConfig = {},
  keysConfigLocaiton = process.cwd() + "/modules/keybinding/config/",
  alwaysOnTop = false,
  pagalConfig = {
    maximized:  false,
    audioChanInt: [1, 2, 3, 4, 5 ],
    audioChan: ["stereo", "reverseStereo", "left", "right", "dolby" ],
    aspectRatio: ["Default", "1:1", "4:3", "16:9", "16:10", "2.21:1", "2.35:1", "2.39:1", "5:4"],
    crop: ["Default", "16:10", "16:9", "1.85:1", "2.21:1", "2.35:1", "2.39:1", "5:3", "4:3", "5:4", "1:1"],
    zoom: [0.25, 0.5, 1, 2],
    zoomText: ["1:4 Quater", "1:2 Half", "1:1 Orginal", "2:1 Double"],
    deinterlace: ['disabled', 'blend', 'bob', 'discard', 'linear', 'mean', 'x', 'yadif', 'yadif2x'],
    speed: ["Faster", "Faster (fine)", "Normal Speed", "Slower (fine)", "Slower"],
    speedValue: [1, 0.10, 0, 0.10, 1],
    speedKeys: ["speedFaster", "speedFineFast", "speedNormal", "speedFineSlow", "speedSlower"]
  },
  pagalDefault = {
    enableSubOnPlay: true,
    maximizeOnPlay: false,
    skip: {
      veryShort:  3,
      short:      10,
      middle:     60,
      long:       300    
    },
    volume: 5,
    audioDelay: 50,
    subtitleDelay: 50
  }
  openedDir = null,
  openedDirBase = "",
  currentSub = 0,
  mainSub = 0,
  doneDrop = [];





(function(window) {

  elements.search = $(".search-bar");
  elements.FooterControls = $("#PlayerContainer");
  elements.wrapper = $(".wrapper");
  elements.player = $("#player");
  elements.dropFiles = $("#dragOrDropFile");
  elements.openFile = $("#pagal-open-file");
  elements.openDir = $("#pagal-select-directory");
  elements.saveAs = $("#pagal-save-file");
  elements.openPlaylist = $("#pagal-open-playlist-file");
  elements.openDirec = $("aside.sidebar .content ul.mediaFiles");

  acceptableFile = "mkv,avi,mp4,mpg,mpeg,webm,flv,ogg,ogv,mov,wmv,3gp,3g2,m4v";
  acceptablePlaylist = "xspf, pagalist";
  playlistType = {xspf:1, pagalist: 2};

  this.setOnTop = function() {
    if(pagal.alwaysOnTop == false) {
      pagal.menues.onTop.checked = true;
      pagal.win.setAlwaysOnTop(true);
      pagal.alwaysOnTop = true;
      return;
    }
    pagal.menues.onTop.checked = false;
    pagal.win.setAlwaysOnTop(false);
    pagal.alwaysOnTop == false;
  }

  this.keymap = function() {
    return pagal.dispatcher;
  }

  this.handleDrop = function(e) {
    var filesDrop = [];
    window.ondragover = function(e) { e.preventDefault(); return false };
    window.ondrop = function(e) { e.preventDefault(); return false };
    drop($('body')[0], function (files) {
      for(i = 0; i < files.length; i++) {        
        filesDrop.push(files[i].path);        
      }
      filesDrop.sort();
      for(i = 0; i < filesDrop.length; i++) {
        if (fs.lstatSync(filesDrop[i]).isDirectory()) {
          if(i != 0){
            readDir(filesDrop[i], true);            
          } else {
            readDir(filesDrop[i]);
          }          
        } else if(fs.lstatSync(filesDrop[i]).isFile()) {
          pagal.openSingleFile(filesDrop[i]);
        } else {
          console.log(files[i].path);
        }
      }    
      filesDrop = [];  
    });
  }



this.readDir = function (location, flag){
    var files__ = [];
    var finder = require('findit')(location);
    console.time(path.basename(location));
    pagal.log("Location: "+location);


    finder.on('directory', function (dir, stat, stop) {
      var base = path.basename(dir);
      //pagal.log("Directory Name: "+ dir);
    });
    finder.on('file', function (file, stat) {
      if(pagal.checkExtension(file, acceptableFile)){
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
      pagal.loadFiles(files__,flag);
      files__.forEach(function(data, i) {
        loadedFiles.push(data);
      });
    });
};

this.loadFiles = function(filesH, play){
    var node, i = loadedFiles.length + 1;
    filesH.sort();
    $(filesH).each(function(key,data){
        node = pagal.makeNode(data, i);
        $("#ContentWrapper").css("display","flex").append(node);
        elements.dropFiles.css("display","none");
        node = null;
        i++;
    });
    //console.log("Initating search module");
    pagal.node_Init();
    pagal.initPlaylist(filesH);
    pagal.elements.FooterControls.find(".track-info .playlist").trigger("click");
    player.play();
    

    //iaa = player.currentItem() + 1;
    // /console.log(iaa);
    //$('[data-id="'+iaa+'"]').addClass("playing");
    //pagal.elements.FooterControls.find(".track-info .playlist").trigger("click");
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

this.doHotkey = function(e) {
    if (!elements.search.is(':focus')) {
        if (e) e.preventDefault();
        return true;
    } else return false;
}

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

    console.log("read config file");
    console.log(config);
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
    modules["nativemenu"] = require(process.cwd() + "/rough/menu.js");
    //modules["nativemenu"] = require(process.cwd() + "/modules/menu/index.js");
    modules["keybinding"] = require(process.cwd() + "/modules/keybinding/index.js");
    //modules["treeView"] = require(process.cwd() + "/modules/treeview/index.js");

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
  if(elements.player.attr("class") == "webchimeras playerSmall") { 
    player.refreshSize(100);
  }
  elements.player.toggleClass("playerSmall");
  elements.wrapper.toggleClass("display-block");
  player.refreshSize(100).refreshSize(500).refreshSize(1000);
  return 0;
}
this.openFileDialougeBox = function() {
  elements.openFile.click();
};

this.insertMenu = function(menu, opts, position ) {
  var item = null;
  if(typeof position === 'undefined') {
    item = new gui.MenuItem(opts);
    menues[menu].submenu.append(item);
    return item;
  }
  item = opts;
  menues[menu].submenu.insert(item,position);
  return item;
};

this.removeMenu = function(name, menu) {

  menues[name].submenu.remove(menu);

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

this.node_Init = function () {

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


this.exitApp =  function(countdown) {
  setTimeout(function() {
    pagal.win.close(true);
  },countdown);
}

this.handleTreeView = function(fileLocation) {

  (function(pathsToFile) {
    ha = path.dirname(pathsToFile);
    ha = ha.split("\\");
    pagal.openedDirBase = ha.pop();
    x = "";
    for(c = 0; c < ha.length; c++) {
      if(c != ha.length - 1)  x += ha[c] + "\\";
      else x += ha[c];
    }
    pagal.openedDir = x;
    console.log(x);

  })(fileLocation);

  //this.moduleReInitByName("treeView");
}

this.openSingleFile = function(fileLocation) {

  //TODO::search for the subtitle file and load if present
  //loadedFiles = null;
  pagal.handleTreeView(fileLocation);
  pagal.addToPlayList(fileLocation);
  pagal.addToRecentList(fileLocation);
  loadedFiles.push(fileLocation);
  player.addPlaylist("file:///" + fileLocation);
  //pagal.createPlaylist(loadedFiles);
  count = player.itemCount();
  if(count > 0) {
    player.currentItem(count - 1);
  }  
  player.play();

};

this.createPlaylist = function(files) {
  if(files.length != 0) {
    for(x in files) {
      player.addPlaylist("file:///" + files[x]);
    }
  }
}

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
   //pagal.insertMenu("Recent", hawa, 0);
}

this.addToPlayList = function(file) {
  var node = pagal.makeNode(file,loadedFiles.length + 1);
  $("#ContentWrapper").css("display","flex").append(node);
  pagal.node_Init();
}

this.loadfile = function(fileLocation) {
  if(pagal.checkExtension(fileLocation, acceptableFile)){
    pagal.openSingleFile(fileLocation);
  }
}

this.loadmultiple = function(files) {
  files_ = [];
  files.forEach(function(data, i) {
    if(pagal.checkExtension(data, acceptableFile)){
      files_.push(data);
    }
  });
  pagal.loadedFiles = files_;
  pagal.loadFiles(files_);


}

this.openFolder = function() {
  elements.openDir.click();
};

this.con_ = function() {
  elements.openFile.change(function() {
    if ($(this).val().indexOf(";") > -1) pagal.loadmultiple($(this).val().split(";"));
	  else pagal.loadfile($(this).val());
  });

  elements.openDir.change(function() {
    try{
      pagal.openedDir = $(this).val();
      pagal.readDir(pagal.openedDir);
    } catch(err) {
      console.log(err.message);
    }
  });

  elements.openPlaylist.change(function() {
    try{
      palylistOpened = $(this).val();
      pagal.openPlaylist(palylistOpened);
      delete palylistOpened; 
    } catch(e) {
      console.log(e.message);
    }
  });

  elements.saveAs.change(function() {
    try{
      fie = $(this).val();
      pagal.processSavingList(fie);
    } catch(e) {
      console.log(e.message);
    }
  })
}

this.setAspectRatio = function(i) {
  pagal.menues.aspectRatio.submenu.items.forEach(function(el,il) {
    el.checked = false;
    if(i == il) {
      el.checked = true;
    }
  });

  player.aspectRatio(pagal.pagalConfig.aspectRatio[i]);  
}

this.setCrop = function(i) {
  pagal.menues.crop.submenu.items.forEach(function(el,il) {
    el.checked = false;
    if(i == il) {
      el.checked = true;
    }
  });

  player.crop(pagal.pagalConfig.crop[i]);
}

this.setZoom = function(i) {
  pagal.menues.zoom.submenu.items.forEach(function(el,il) {
    el.checked = false;
    if(i == il) {
      el.checked = true;
    }
  });

  player.zoom(pagal.pagalConfig.zoom[i]);
}

this.setDeinterlace = function(i) {
  pagal.menues.deinterlace.submenu.items.forEach(function(el,il) {
    el.checked = false;
    if(i == il) {
      el.checked = true;
    }
  });
  player.deinterlace(pagal.pagalConfig.deinterlace[i]);
}
this.setAudioChannel = function(i) {
  a = "";
  pagal.menues.audioChanel.submenu.items.forEach(function(el,il) {
    el.checked = false;
    if(i == il) {
      el.checked = true;
      a = el.label;
    }
  });
  current = player.audioChanInt();
  if(current == -1) {
    console.error("Error!!! Audio Channel Error");
  }
  player.audioChanInt(i + 1);
  current = player.audioChanInt();
  if(current != i + 1) {
    if(i == 4) {
      console.warn("Dobly not available");
      pagal.setAudioChannel(0);
    }
  }
  player.notify("Audio Channel: " + a );
  delete a;
  console.log("Audio Channel Set to : " + player.audioChanInt());
}

this.binarySearch = function(array, key, low, high) {
  console.log("key = " + key);
    mid = parseInt((low + high) / 2);
    console.log("mid = " + mid);
    if(key < array[mid]) {
      high = mid - 1;
      console.log("high = " + high);
      search(array, key, low, high);
    } else if(key > array[mid]) {
      low = mid + 1;
      console.log("low = " + low);
      search(array, key, low, high);
    } else if(key == array[mid]) {
      console.log("returned mid = " + mid);
      return mid;
    } else {
      console.log("false");
      return false;
    }
}

this.searchArray = function(data, key) {
  for(x in data) {
    if(data[x] == key) {
      return x;
    }
  }
  return false;
}

this.deleteDataFromArray = function(array, searched) {
  key = pagal.searchArray(array, searched);
  newarray = [];
  if(key !== false) {
    for(x in array) {
      if(x == key) continue;
      else newarray.push(array[x]);
    }
  }
  array = newarray;
  delete key;
  delete newarray;
  return array;  
}

this.savePlaylist = function() {
  var xmlOutput = xmlbuilder.create('pagalist')
      .ele("trackList");
  $(".track-container").each(function(i) {
        xmlOutput.ele("media")
          .ele("path", loadedFiles[i]);
  });
  xmlOutput = xmlOutput.end({ pretty: true});
  pagal.xmlOutput = xmlOutput;
  pagal.elements.saveAs.click(); 
}

this.processSavingList = function(fineName) {
  fs.writeFile(fineName, pagal.xmlOutput, function(err) {
    if(err) {
      console.log(err);
    }
  })
}

this.openPlaylist = function(file) {
  var parser = new xml2js.Parser(),
      type = "",
      holder = file;

  type = holder.toLowerCase().split('.').pop();
  delete holder;
  console.time("reading");
  fs.readFile(file, function(err, data) {
    parser.parseString(data, function (err, result) {
      if(err) {
        console.log(err);
        return;
      }
      pagal.processPlaylist(type, result);
      console.timeEnd("reading");
    });
  });
}

this.processPlaylist = function(type, datas) {
  _Tracks_ = [];
  if (playlistType[type] == 1) {
    console.log("Its a vlc type playlist");
    tracks = datas.playlist.trackList[0].track;
    if (tracks.length > 0) {
      tracks.forEach(function (el, i) {
        _Tracks_.push(el.location[0]);
      });
    }
  } else if(playlistType[type] == 2) {
    console.log("aafnai playlist");
    tracks = datas.pagalist.trackList[0].media
    if (tracks.length > 0) {
      tracks.forEach(function (el, i) {
        _Tracks_.push("file:///"+el.path[0]);
      });
      console.log(_Tracks_);
    }
  }
  length = pagal.loadedFiles.length + 1;
  _Tracks_.sort().forEach(function (el, i) {
    node = makeNode(decodeURI(el), length);
    elements.dropFiles.css("display", "none");
    $("#ContentWrapper").css("display", "flex").append(node);
    pagal.player.addPlaylist(el);
    delete node;
    length++;
    loadedFiles.push(decodeURI(el));
  });
  pagal.node_Init();
  if(elements.player.attr("class") == "webchimeras playerSmall") {
    pagal.elements.FooterControls.find(".track-info .playlist").trigger("click");
  }
  pagal.player.play();
  delete _Tracks_, length, track;
}

this.init = function() {

  if(typeof localStorage.settings === "undefined" || localStorage.settings == "\"\"") {
    localStorage.settings = JSON.stringify(pagalDefault);
  }

  pagal.pagalConfig = $.extend(pagalConfig, JSON.parse(localStorage.settings));
  gui.Screen.Init();
  pagal.handleDrop(event);
  pagal.con_();  
	pagal.loadConfig();  
  pagal.moduleInit();
	pagal.pluginInit();
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
            if(pagal.checkExtension(file, acceptableFile)) pagal.openSingleFile(args[0]);
					}
				} catch(err) {
					console.log(err);
				}
				break;
			case 2:
        if(args[0] == "--playlist-file") {
          pagal.openPlaylist(args[1]);
        }
				

				break;
		}
	}
  
  gui.App.on("open",function(msg) {
    console.log(msg);
    if (msg.match(/\"/g).length > 2) {
      pathToFile = msg.substr(msg.split('"', 3).join('"').length).split('"').join('');
      if(pagal.checkExtension(pathToFile, acceptableFile)) pagal.openSingleFile(pathToFile);
    }
  });

	pagal.search();


    //pagal.menues.mediaMenu.submenu.append(menues.Recent);
    pagal.primaryMenuBar.append(menues.mediaMenu);
    //pagal.primaryMenuBar.append(menues.viewMenu);
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
        
  });




})(window);
