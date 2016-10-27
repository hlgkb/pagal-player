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

  pagal.dispatcher.on(keyConfig["openDevTools"], function(e) {
    if(pagal.win.isDevToolsOpen() == true) {
      pagal.win.closeDevTools();
    } else {
      pagal.win.showDevTools();
    }
  }).on(keyConfig["openFile"], function(e) {
    pagal.openFileDialougeBox();
  }).on(keyConfig["openFolder"], function(e) {
    pagal.openFolder();
  }).on(keyConfig["quit"], function(e) {
    pagal.exitApp(1500);
  })

  .on(keyConfig["cycleSubtitle"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        if(pagal.currentSub < pagal.player.subCount() - 1) pagal.currentSub++;
        else if(pagal.currentSub == pagal.player.subCount() - 1) {
            console.log("in if " +pagal.currentSub);
            pagal.currentSub = 0;
        }
        console.log(pagal.currentSub);
        pagal.player.subTrack(pagal.currentSub);        
        pagal.player.notify("Subtitle" + ": " + pagal.player.subDesc(pagal.currentSub).language);
        if(pagal.player.subTrack() == 0) {
          pagal.menues.subtitle.submenu.items[1].checked = false;
          pagal.menues.subtitle.submenu.items[2].checked = true;
        } else {
          pagal.menues.subtitle.submenu.items[2].checked = false;
          pagal.menues.subtitle.submenu.items[1].checked = true;
        }
      }
    }
  }).on(keyConfig["toggleSubtitle"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        if(pagal.player.subTrack() == 0) pagal.currentSub = pagal.mainSub;
        else {
          pagal.mainSub = pagal.currentSub;
          pagal.currentSub = 0;
        }
        pagal.player.subTrack(pagal.currentSub);        
        pagal.player.notify("Subtitle" + ": " + pagal.player.subDesc(pagal.currentSub).language);
        if(pagal.player.subTrack() == 0) {
          pagal.menues.subtitle.submenu.items[1].checked = false;
          pagal.menues.subtitle.submenu.items[2].checked = true;
        } else {
          pagal.menues.subtitle.submenu.items[2].checked = false;
          pagal.menues.subtitle.submenu.items[1].checked = true;
        }
      }
    }
  })

  .on(keyConfig["speedFaster"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        curRate = pagal.player.rate();
        newRate = curRate + pagal.pagalConfig.speedValue[0];
        pagal.player.rate(newRate);
        delete curRate;
        delete newRate; 
        pagal.player.notify("Speed" + ": " + parseFloat(Math.round(pagal.player.rate() * 100) / 100).toFixed(2) + "x");
      }
    }
  }).on(keyConfig["speedSlower"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        curRate = pagal.player.rate();
        newRate = curRate - pagal.pagalConfig.speedValue[4];
        pagal.player.rate(newRate);
        delete curRate;
        delete newRate; 
        pagal.player.notify("Speed" + ": " + parseFloat(Math.round(pagal.player.rate() * 100) / 100).toFixed(2) + "x");
      }
    }
  }).on(keyConfig["speedFineFast"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        curRate = pagal.player.rate();
        newRate = curRate + pagal.pagalConfig.speedValue[1];
        pagal.player.rate(newRate);
        delete curRate;
        delete newRate; 
        pagal.player.notify("Speed" + ": " + parseFloat(Math.round(pagal.player.rate() * 100) / 100).toFixed(2) + "x");
      }
    }
  }).on(keyConfig["speedFineSlow"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        curRate = pagal.player.rate();
        newRate = curRate - pagal.pagalConfig.speedValue[3];
        pagal.player.rate(newRate);
        delete curRate;
        delete newRate; 
        pagal.player.notify("Speed" + ": " + parseFloat(Math.round(pagal.player.rate() * 100) / 100).toFixed(2) + "x");
      }
    }
  }).on(keyConfig["speedNormal"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        pagal.player.rate(1.00);
        pagal.player.notify("Speed" + ": " + parseFloat(Math.round(pagal.player.rate() * 100) / 100).toFixed(2) + "x");
      }
    }
  })

  .on(keyConfig["play/pause"],function(e) {
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
        pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
      }
    }
  }).on(keyConfig["veryShortBack"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime - pagal.pagalConfig.skip.veryShort * 1000) <= 0)  {
          pagal.player.time(0);
          pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
          return;
        }
        pagal.player.time(currentTime - pagal.pagalConfig.skip.veryShort * 1000);
        pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
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
        pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
      }
    }
  }).on(keyConfig["shortBack"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime - pagal.pagalConfig.skip.short * 1000) <= 0)  {
          pagal.player.time(0);
          pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
          return;
        }
        pagal.player.time(currentTime - pagal.pagalConfig.skip.short * 1000);
        pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
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
        pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
      }
    }
  }).on(keyConfig["middleBack"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime - pagal.pagalConfig.skip.middle * 1000) <= 0)  {
          pagal.player.time(0);
          pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
          return;
        }
        pagal.player.time(currentTime - pagal.pagalConfig.skip.middle * 1000);
        pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
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
        pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
      }
    }
  }).on(keyConfig["longBack"], function(e) {
    if(pagal.doHotkey(e)) {
      if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
        currentTime = pagal.player.time();
        if((currentTime - pagal.pagalConfig.skip.long * 1000) <= 0)  {
          pagal.player.time(0);
          pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
          return;
        }
        pagal.player.time(currentTime - pagal.pagalConfig.skip.long * 1000);
        pagal.player.notify(pagal.parseTime(pagal.player.time()) + " / " + pagal.parseTime(pagal.player.length()));
      }
    }
  }).on(keyConfig["volumeUp"], function(e) {
    volume = 0 + 5;
    if(pagal.player.volume() >= 0 && pagal.player.volume() < 100) {
      if((pagal.player.volume() + pagal.pagalConfig.volume) >= 100) {
        pagal.player.volume(100);
        return;
      }
      pagal.player.volume(pagal.player.volume() + pagal.pagalConfig.volume);
    }
  }).on(keyConfig["volumeDown"], function(e) {
    
    if(pagal.player.volume() > 10 && pagal.player.volume() <= 100) {
      if(pagal.player.volume() - pagal.pagalConfig.volume <= 10) {
        pagal.player.volume(10);
        return;
      }
      pagal.player.volume(pagal.player.volume() - pagal.pagalConfig.volume);
    }
  }).on(keyConfig["cycleVideoAspect"], function(e) {
    if(pagal.doHotkey(e)) {
        pagal.menues.aspectRatio.submenu.items.forEach(function(el,il) {
          if(el.checked == true) {
            currentChecked = el;
            currentId = il;
          }
        });

        total = pagal.menues.aspectRatio.submenu.items.length - 1;
        if(currentId + 1  > total) {
          currentId = 0;
        } else {
          currentId++;
        }
        if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
          pagal.setAspectRatio(currentId);
          pagal.player.notify("Aspect ratio: " + pagal.pagalConfig.aspectRatio[currentId]);
        }
    }
  }).on(keyConfig["cycleVideoCrop"], function(e) {
    if(pagal.doHotkey(e)) {
        pagal.menues.crop.submenu.items.forEach(function(el,il) {
          if(el.checked == true) {
            currentChecked = el;
            currentId = il;
          }
        });

        total = pagal.menues.crop.submenu.items.length - 1;
        if(currentId + 1  > total) {
          currentId = 0;
        } else {
          currentId++;
        }
        if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
          pagal.setCrop(currentId);
          pagal.player.notify("Crop: " + pagal.pagalConfig.crop[currentId]);
        }
    }
  }).on(keyConfig["cycleZoom"], function(e) {
    if(pagal.doHotkey(e)) {
        pagal.menues.zoom.submenu.items.forEach(function(el,il) {
          if(el.checked == true) {
            currentChecked = el;
            currentId = il;
          }
        });

        total = pagal.menues.zoom.submenu.items.length - 1;
        if(currentId + 1  > total) {
          currentId = 0;
        } else {
          currentId++;
        }
        if(pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1) {
          pagal.setZoom(currentId);
          pagal.player.notify("Zoom: " + pagal.pagalConfig.zoomText[currentId]);
        }
    }
  }).on(keyConfig["unZoom"], function(e) {
    if(pagal.doHotkey(e)) {
      pa_ = false;
        pagal.menues.zoom.submenu.items.forEach(function(el,il) {
          if(el.checked ==  true && il != 2) {
            pa_ = true;
          }
        });
        if(pa_ == true && (pagal.player.itemCount() > 0 && pagal.player.currentItem() != -1)) {
          pagal.setZoom(2);
          pagal.player.notify("Zoom: Default");
        }
    }
  })

  .on(keyConfig["cycleAudioTrack"], function(e) {
    if(pagal.doHotkey(e)) {
      if(["playing", "paused"].indexOf(pagal.player.state()) > -1) {
        _current_ = pagal.player.audioTrack();
        total = pagal.player.audioCount();
        if((_current_ + 1)  == total) {
          _current_ = 1;
        } else if(_current_ == -1) {
          _current_ = 1;
        } else {
          _current_ = _current_ + 1;
        }
        pagal.player.audioTrack(_current_);
        pagal.player.notify("Audio Track: "+ pagal.player.audioDesc(_current_));
        delete _current_, total;
      }
    }
    
  }).on(keyConfig["audioDelayUp"], function(e) {
    if(pagal.doHotkey(e)) {
      if(["playing", "paused"].indexOf(pagal.player.state()) > -1) {
        _audioDelay_ = pagal.player.audioDelay();
        _audioDelay_ += pagal.pagalConfig.audioDelay;
        pagal.player.audioDelay(_audioDelay_);
        pagal.player.notify("Audio Delay " + pagal.player.audioDelay() + "ms");
        delete _audioDelay_;
      }
    }
  }).on(keyConfig["audioDelayDown"], function(e) {
    if(pagal.doHotkey(e)) {
      if(["playing", "paused"].indexOf(pagal.player.state()) > -1) {
        _audioDelay_ = pagal.player.audioDelay();
        _audioDelay_ -= pagal.pagalConfig.audioDelay;
        pagal.player.audioDelay(_audioDelay_);
        pagal.player.notify("Audio Delay " + pagal.player.audioDelay() + "ms");
        delete _audioDelay_;
      }
    }
  }).on(keyConfig["subtitleDelayUp"], function(e) {
    if(pagal.doHotkey(e)) {
      if(["playing", "paused"].indexOf(pagal.player.state()) > -1) {
        if(player.subTrack() != 0) {
          subtitleDelay = pagal.player.subDelay();
          subtitleDelay += pagal.pagalConfig.subtitleDelay;
          pagal.player.subDelay(subtitleDelay);
          pagal.player.notify("Subtitle Delay " + pagal.player.subDelay() + "ms")
          delete subtitleDelay;
        } else {
          pagal.player.notify("No Active Subtitle");
        }
        
      }
    }
  }).on(keyConfig["subtitleDelayDown"], function(e) {
    if(pagal.doHotkey(e)) {
      if(["playing", "paused"].indexOf(pagal.player.state()) > -1) {
        if(player.subTrack() != 0) {
          subtitleDelay = pagal.player.subDelay();
          subtitleDelay -= pagal.pagalConfig.subtitleDelay;
          pagal.player.subDelay(subtitleDelay);
          pagal.player.notify("Subtitle Delay " + pagal.player.subDelay() + "ms")
          delete subtitleDelay;
        } else {
          pagal.player.notify("No Active Subtitle");
        }
      }
    }
  })

}




