 //player = pagal.initPlayer();
  

/*player.onFirstPlay(function(){
    win.height = player.height() + 118;
    win.width = player.width();
  });
  player.onMediaChanged(function(){
    console.log("media Changed");
    win.height = player.height() + 118;
    win.width = player.width();
  });
  player.onOpening(function(){
    console.log("opening");
    console.log(player.height());
  });*/
  
  pagal.readDir("C:\\Users\\lenovo");
  

  
  
  
  var menuHo00 =  pagal.insertMenuItem("helpMenu", {
    label: '  Help',
    click: function () {
      alert("Hey dear");
    }
  });
  var menuHo0 =  pagal.insertMenuItem("helpMenu", {
    label: '  Check for updates',
    click: function () {
      alert("Hey dear");
    }
  });
  var menuho2 = pagal.insertMenuItem("helpMenu", { type: 'separator' });
  var menuHo2 =  pagal.insertMenuItem("helpMenu", {
      label: '  About',
      icon: 'lib/img/icon.png',
      click: function () {
        
      }
  });












  /*this.initPlayer = function (){
  var player = new wjs("#player").addPlayer({
    	autoplay: true,
    	wcjs: wcjs_
	});
	
  /*
  player.ui(false);
	player.addPlaylist("file:///E:/pagal/Back up/Animated flims/Brave.2012.720p/Brave.2012.720p.BluRay.x264.AC3-HDChina.mkv");
	player.onFrameSetup(function(){
		if(player.subCount() != 0){
			player.subTrack(1);
			player.pause();

		}
	});

	var playerContainer = $("#PlayerContainer");

	playerContainer.find('.action .play, .action .pause').click(function() {
		player.togglePause();
	});*/
/*
  return player;

}
*/