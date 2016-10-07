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
    keybinding.doBinging(keyConfig);

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

exports.doBinging = function(keyConfig) {

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
  })


}




