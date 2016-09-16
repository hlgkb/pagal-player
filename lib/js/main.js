var gui = require('nw.gui'),
	fs = require("fs"),
	win = gui.Window.get(),
	args = window.gui.App.argv,
	plugins = {},
	config = {};
	try{
		var path = require("path");
	}
	catch(err){
		console.log(err);
	}

	log(path.resolve(path.dirname()));

	function init(){
		if (args.length > 0) {
			switch ( args.length ) {
        case 1:

          //Is first arg file or directory?
          try {
            argCountType = fs.lstatSync(args[0]);
            if (argCountType.isDirectory()) {
              console.log("Working dir" + args[0]);
            } else if (argCountType.isFile()) {
              //Get the file's working directory.
              //boson.working_dir = path.dirname(args[0]);
              //bs.openFileFromPath(args[0]);
              console.log("File");
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
	}


	function readDir(location){

		var finder = require('findit')(location);
		console.time(path.basename(location));
		log("Location: "+location);
		

		finder.on('directory', function (dir, stat, stop) {
			var base = path.basename(dir);
			//log("Directory Name: "+ dir);
		});
		finder.on('file', function (file, stat) {
			if(checkExtension(file, 'mp4,webm,mkv')){
				var base = path.basename(file);
				//log(file);
			}	
				
		});
		finder.on('error',function(err){
			console.log(err);
			next();

		});
		finder.on('end',function(){
			console.timeEnd(path.basename(location));
		});
		
		
	}



	function log(message){
		$("#log").append("<li>"+message + "</li>");
	}
	function checkExtension(str, ext) {
		extArray = ext.split(',');
		for(i=0; i < extArray.length; i++) {
			if(str.toLowerCase().split('.').pop() == extArray[i]) {
				return true;
			}
		}
		return false;
	}



	 function loadConfig() {

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

	  }

	   function pluginInit() {

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
                   	insertPlugin( currentPlugin );
                  } else {
                    log("Plugin " + currentPlugin + " is missing package.json, therefor, it was not activated.");
                  }
                });


              }
            }
          });

        })(uid,currentPlugin);

      }

    });

  };

  /*
   * Inserts a verified plugin into the plugins object.
   */
  function insertPlugin ( plugin ) {

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
            if ( isPluginActive( jsonP.name ) ) {
              plugins[jsonP.name].active = true;
              bootPluginByName( jsonP.name );
            } else {
              plugins[jsonP.name].active = false;
              config.plugins[jsonP.name] = {
                active: false
              };
              log("Plugin is not yet active: " + plugin);
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

  /*
   * Checks to see if a plugin is active in config.
   */
  function isPluginActive( plugin ) {


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

  /*
   * Properly requires the plugin and calls the plugins init() function.
   */
  function bootPluginByName( plugin ) {

    var passObject;

    plugins[plugin].entryPoint = require( process.cwd() + "/plugins/" + plugin + "/" + plugins[plugin].main );

    passObject = {
      gui: gui,
      win: win,
      config: config
    };

    if ( typeof plugins[plugin].entryPoint.init === "function" ) {
      plugins[plugin].entryPoint.init(passObject);
    }

  }