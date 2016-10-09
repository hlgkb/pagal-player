var keybinding = this,
    pagalCore = null,
    pagal = null,
    keyConfig = {},
    fs = null;

exports.init = function(core) {
    pagalCore = core;
    pagal = pagalCore.pagal;
    keyConfig = pagal.keysConfig;
    fs = pagal.fs;


    pagal.dispatcher.getKeymap();
    keybinding.loadKeyConfig();
    keybinding.doBinding(keyConfig);

}


exports.loadKeyConfig = function() {

    console.log("Loading key-binding...");
  var configJson, configObject, key, fileFound = true;
  try {
    configJson = fs.readFileSync(pagal.keysConfigLocaiton+"keybinding-"+pagal.config["key-binding"]+".json", {
      encoding: "utf-8"
    });
  } catch (err) {
    console.log("No keybinding-*.json file found");
    console.log(err.message);
    fileFound = false;
  }

  if ( fileFound === true ) {
    try {
      configObject = JSON.parse(configJson);
    } catch (err) {
      console.log("Invalid keybinding.json file.");
    }

    for ( key in configObject ) {
      keyConfig[key] = configObject[key];
    }
  }

};

exports.doBinding = function(keyConfig) {

  pagal.dispatcher.on(keyConfig["play/pause"],function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1){
        pagal.player.togglePause();
      }
    }
  }).on(keyConfig["next"], function(e) {
    if(pagal.doHotkey(e)) {
      pagal.elements.FooterControls.find(".track-info .action .forward").click();
    }

  }).on(keyConfig["perv"], function(e) {
    if(pagal.doHotkey(e)) {
      pagal.elements.FooterControls.find(".track-info .action .backward").click();
    }
  }).on(keyConfig["stop"], function(e) {
    if(pagal.doHotkey(e)) {
      pagal.elements.FooterControls.find(".track-info .action .stop").click();
    }
  }).on(keyConfig["mute"], function(e) {
    if(pagal.doHotkey(e)) {
      pagal.elements.FooterControls.find('.volume-icon').click();
    }
  }).on(keyConfig["veryShortSkip"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime + pagal.pagalConfig.skip.veryShort * 1000) >= pagal.player.length())  {
          pagal.player.time(pagal.player.length());
          return;
        }
        pagal.player.time(currentTime + pagal.pagalConfig.skip.veryShort * 1000);
      }
    }
  }).on(keyConfig["veryShortBack"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime - pagal.pagalConfig.skip.veryShort * 1000) <= 0)  {
          pagal.player.time(0);
          return;
        }
        pagal.player.time(currentTime - pagal.pagalConfig.skip.veryShort * 1000);
      }
    }
  }).on(keyConfig["shortSkip"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime + pagal.pagalConfig.skip.short * 1000) >= pagal.player.length())  {
          pagal.player.time(pagal.player.length());
          return;
        }
        pagal.player.time(currentTime + pagal.pagalConfig.skip.short * 1000);
      }
    }
  }).on(keyConfig["shortBack"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime - pagal.pagalConfig.skip.short * 1000) <= 0)  {
          pagal.player.time(0);
          return;
        }
        pagal.player.time(currentTime - pagal.pagalConfig.skip.short * 1000);
      }
    }
  }).on(keyConfig["middleSkip"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime + pagal.pagalConfig.skip.middle * 1000) >= pagal.player.length())  {
          pagal.player.time(pagal.player.length());
          return;
        }
        pagal.player.time(currentTime + pagal.pagalConfig.skip.middle * 1000);
      }
    }
  }).on(keyConfig["middleBack"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime - pagal.pagalConfig.skip.middle * 1000) <= 0)  {
          pagal.player.time(0);
          return;
        }
        pagal.player.time(currentTime - pagal.pagalConfig.skip.middle * 1000);
      }
    }
  }).on(keyConfig["longSkip"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime + pagal.pagalConfig.skip.long * 1000) >= pagal.player.length())  {
          pagal.player.time(pagal.player.length());
          return;
        }
        pagal.player.time(currentTime + pagal.pagalConfig.skip.long * 1000);
      }
    }
  }).on(keyConfig["longBack"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime - pagal.pagalConfig.skip.long * 1000) <= 0)  {
          pagal.player.time(0);
          return;
        }
        pagal.player.time(currentTime - pagal.pagalConfig.skip.long * 1000);
      }
    }
  }).on(keyConfig["volumeUp"], function(e) {
    volume = 0 + 5;
    if(pagal.player.volume() >= 0 && pagal.player.volume() < 100) {
      if((pagal.player.volume() + 5) >= 100) {
        pagal.player.volume(100);
        console.log("volume set to 100");
        return;
      }
      pagal.player.volume(pagal.player.volume() + 5);
    }
  }).on(keyConfig["volumeDown"], function(e) {
    
    if(pagal.player.volume() > 10 && pagal.player.volume() <= 100) {
      if(pagal.player.volume() - pagal.pagalConfig.volume <= 10) {
        pagal.player.volume(10);
        console.log("volume set to 10");
        return;
      }
      pagal.player.volume(pagal.player.volume() - pagal.pagalConfig.volume);
      console.log("volume down: " + pagal.player.volume());
    }
  })


}




