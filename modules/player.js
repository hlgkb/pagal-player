var playerApi = {

    

    init: function () {
        var player = new wjs("#player").addPlayer({
    	    autoplay: false,
    	    wcjs: wcjs_
	    });
        var currentItem = null;
        player.onPlaying(playerApi.listeners.isPlaying);
        player.onPaused(playerApi.listeners.handlePause);
        player.onOpening(playerApi.listeners.isOpening);
        player.onPosition(playerApi.listeners.changedPosition);
        player.onTime(function (ms) {
            playerApi.listeners.updateUi(ms);            
		});
        player.onEnded(playerApi.listeners.handleEnded);
        player.onStopped(playerApi.listeners.handleEnded);
        player.onState(playerApi.listeners.changedState);
        player.onError(playerApi.listeners.handleErrors);
        player.onFrameSetup(playerApi.listeners.gotVideoSize);
        player.onMediaChanged(playerApi.listeners.handleMediaChange);
        playerApi.controls();
        pagal.player = player;
    },

    listeners: {

        gotVideoSize: function() {
            pagal.manageWindow(player.width(), player.height() + 118);
        },

        isPlaying: function() {
        
            if(player.subCount() > 1) {
                if(player.subDesc(1).language != "Disable") {
                    player.subTrack(1);
                }
            }
            pagal.elements.FooterControls.find('.info .track-info .action i.play').hide();
		    pagal.elements.FooterControls.find('.info .track-info .action i.pause').show();
            pagal.elements.FooterControls.find(".info .controls .duration").text(pagal.parseTime(player.length()));
            pagal.elements.FooterControls.find('.progress-bg').on('mousemove', function(e) {
                var margin, minutes, percentage, seconds, time;
                if (player.time() !== 0) {
                    percentage = (e.pageX - $(this).offset().left) / $(this).width();
                    time = percentage * player.length();
                    time = pagal.parseTime(time);
                    $('.mouse-time').show();
                    $('.mouse-time span').text(time);

                    var ad = (($('.mouse-time').width())/2) - 8;
                    $('.mouse-time:before').css("left",ad - 1);
                    $('.mouse-time:after').css("left",ad);


                    margin = e.pageX-48-parseInt(($('.mouse-time').width())/2);
                    return $('.mouse-time').css({
                        'margin-left': margin + 'px'
                    });
                }
            }).on('mouseout', function(e) {
	            return $('#PlayerContainer .mouse-time').hide();
            });
            pagal.elements.FooterControls.find('.progress-bg').click(function(e) {
               if(player.playing() == true) {
                    var percentage, selectedTime;
                    percentage = (e.pageX - $(this).offset().left) / $(this).width();
                    selectedTime = percentage * player.length();
                    player.time(selectedTime);
                    return pagal.elements.FooterControls.find('.progress-current').animate({
                        'width': percentage * 100 + '%'
                    });
                }
            });
            currentItem = player.itemDesc(player.currentItem());
            asd = pagal.loadedFiles[player.currentItem()];
            //nowPlayingTitle = nameParser(path.basename(asd)).name;
            pagal.elements.FooterControls.find(".currentHolder span.title").text(path.basename(asd));
            pagal.win.title = path.basename(currentItem.title);
        },
        handleMediaChange: function() {
            iaa = player.currentItem() + 1;
            $('.track-container').removeClass("playing");
            $('[data-id="'+iaa+'"]').addClass("playing");
        },
        handlePause: function() {
            pagal.elements.FooterControls.find('.info .track-info .action i.play').show();
		    pagal.elements.FooterControls.find('.info .track-info .action i.pause').hide();
        },
        handleEnded: function() {
            playerApi.resetUi();
            pagal.elements.FooterControls.find(".track-info .playlist").trigger("click");
        },
        handleStopped: function() {
        
        },
        updateUi: function(ms) {
            pagal.elements.FooterControls.find(".info .controls .current-time").text(pagal.parseTime(ms));
            pagal.elements.FooterControls.find('.progress-current').css({
			    'width': (player.time() / player.length()) * 100 + '%'
		    });
            percentage = (player.time() / player.length());
            pagal.setProgessBar(percentage);
        },
        isOpening: function() {

        },
        changedPosition: function() {

        },
        changedState: function() {

        },
        handleErrors: function() {

        }
    },
    controls: function() {
        pagal.elements.FooterControls.find(".track-info .action .play").click(function(){
            if(player.itemCount() != 0) {
                player.play();
            }
        });
        pagal.elements.FooterControls.find(".track-info .action .pause").click(function(){
            if(player.itemCount() != 0) {
                player.togglePause();
            }
        });
        pagal.elements.FooterControls.find(".track-info .action .stop").click(function(){
            if(player.itemCount() != 0) {
                player.stop();
            }
        });
        pagal.elements.FooterControls.find(".track-info .action .backward").click(function(){
            if(player.itemCount() == 1) {
                player.time(0);
            } else if(player.itemCount() > 1) {
                player.prev();
            }
        });
        pagal.elements.FooterControls.find(".track-info .action .forward").click(function(){
            if(player.itemCount() == 1) {
                player.time(0);
            } else if(player.itemCount() > 1) {
                player.next();
            }
        });






        pagal.elements.FooterControls.find('.volume-icon').on('click', function(e) {
            if (player.mute() == true) {
                player.mute(false);
                $(this).find("i").removeClass("fa-volume-off").addClass("fa fa-volume-up");
            } else {
                player.mute(true);
                $(this).find("i").removeClass("fa-volume-up").addClass("fa fa-volume-off");
                
            }
        });
    },
    resetUi: function() {
        pagal.elements.FooterControls.find('.info .track-info .action i.play').show();
		pagal.elements.FooterControls.find('.info .track-info .action i.pause').hide();
        pagal.elements.FooterControls.find(".info .controls .duration").text("0:00:00");
        pagal.elements.FooterControls.find(".info .controls .current-time").text("0:00:00");
        pagal.elements.FooterControls.find('.progress-current').css({
			    'width': 0 * 100 + '%'
		});
        pagal.win.setProgressBar(-1);
        pagal.elements.FooterControls.find(".currentHolder span.title").text("");
        pagal.win.title = pagal.appname;
    }

}