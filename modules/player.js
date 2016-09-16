var playerApi = {

    

    init: function () {
        var player = new wjs("#player").addPlayer({
    	    autoplay: false,
    	    wcjs: wcjs_
	    });
        var currentItem = null;
        player.onPlaying(playerApi.listeners.isPlaying);
        player.onOpening(playerApi.listeners.isOpening);
        player.onPosition(playerApi.listeners.changedPosition);
        player.onTime(function (ms) {
            playerApi.listeners.updateUi(ms);            
		});
        player.onState(playerApi.listeners.changedState);
        player.onError(playerApi.listeners.handleErrors);
        player.onFrameSetup(playerApi.listeners.gotVideoSize);
        player.onMediaChanged(function() {
            
        });
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
            nowPlayingTitle = nameParser(path.basename(asd)).name;
            pagal.elements.FooterControls.find(".currentHolder span.title").text(nowPlayingTitle);
        },
        updateUi: function(ms) {
            pagal.elements.FooterControls.find(".info .controls .current-time").text(pagal.parseTime(ms));
            pagal.elements.FooterControls.find('.progress-current').css({
			    'width': (player.time() / player.length()) * 100 + '%'
		    });
        },
        isOpening: function() {

        },
        changedPosition: function() {

        },
        changedState: function() {

        },
        handleErrors: function() {

        }
    }

}