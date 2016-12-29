var playerApi = {

    suffle_Repaeat: [],

    init: function () {
        var player = new wjs("#player").addPlayer({
            autoplay: false,
            wcjs: wcjs
        });
        var currentItem = null;
        player.onFirstPlay(playerApi.listeners.onFirstPlay);
        player.onPlaying(playerApi.listeners.isPlaying);
        player.onPaused(playerApi.listeners.handlePause);
        player.onOpening(playerApi.listeners.isOpening);
        player.onPosition(playerApi.listeners.changedPosition);
        player.onTime(function (ms) {
            playerApi.listeners.updateUi(ms);
        });
        player.onVolume(playerApi.listeners.handleVolume);
        player.onEnded(playerApi.listeners.handleEnded);
        player.onStopped(playerApi.listeners.handleStopped);
        player.onState(playerApi.listeners.changedState);
        player.onError(playerApi.listeners.handleErrors);
        player.onFrameSetup(playerApi.listeners.gotVideoSize);
        player.onMediaChanged(playerApi.listeners.handleMediaChange);
        playerApi.controls();
        playerApi.updateUiviaStored();
        pagal.player = player;
    },

    listeners: {

        onFirstPlay: function () {
            if (elements.player.attr("class") == "webchimeras playerSmall") {
                pagal.elements.FooterControls.find(".track-info .playlist").trigger("click");
            }
            if (pagal.pagalConfig.searchCoverArt === true) {
                if (pagal.workerInit == false) {
                    console.log('loading worker');
                    pagal.findCover();
                    pagal.workerInit = true;
                }
            }

        },
        handleVolume: function (volume) {
            pagal.elements.FooterControls.find('.volume-bg .volume-current').animate({
                width: volume + "%"
            })
            player.notify("Volume: " + player.volume() + "%");
        },
        gotVideoSize: function () {
            if (pagal.pagalConfig.maximized == false) {
                pagal.manageWindow(player.width(), player.height() + 118);
            }

            //pagal.audioTrackmenuStuff();
            pagal.menuStuff.enableMenues();
        },

        isPlaying: function () {

            if (player.subCount() > 1 && pagal.pagalConfig.enableSubOnPlay == true) {
                //if(player.subDesc(1).language != "Disable") {
                //    player.subTrack(1);
                //}
                if (pagal.menues.subtitle.submenu.items[2].checked != true) {
                    player.subTrack(player.subCount() - 1);
                }

                pagal.currentSub = player.subTrack();
                pagal.mainSub = pagal.currentSub;
            } else {
                player.subTrack(0);
                pagal.currentSub = 0;
                pagal.mainSub = player.subCount() - 1;
            }
            pagal.elements.FooterControls.find('.info .track-info .action i.play').hide();
            pagal.elements.FooterControls.find('.info .track-info .action i.pause').show();
            pagal.elements.FooterControls.find(".info .controls .duration").text(pagal.parseTime(player.length()));
            pagal.elements.FooterControls.find('.progress-bg').on('mousemove', function (e) {
                var margin, minutes, percentage, seconds, time;
                if (player.time() !== 0) {
                    percentage = (e.pageX - $(this).offset().left) / $(this).width();
                    time = percentage * player.length();
                    time = pagal.parseTime(time);
                    $('.mouse-time').show();
                    $('.mouse-time span').text(time);

                    var ad = (($('.mouse-time').width()) / 2) - 5;
                    console.log("ad = " + ad);
                    $('.mouse-time:before').css("left", ad - 1);
                    $('.mouse-time:after').css("left", ad);

                    console.log("page x = " + e.pageX);
                    margin = e.pageX - 62 - parseInt(($('.mouse-time').width()) / 2);
                    return $('.mouse-time').css({
                        'margin-left': margin + 'px'
                    });
                }
            }).on('mouseout', function (e) {
                return $('#PlayerContainer .mouse-time').hide();
            });
            pagal.elements.FooterControls.find('.progress-bg').click(function (e) {
                if (["playing", "paused"].indexOf(player.state()) > -1) {
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
            pagal.elements.FooterControls.find(".currentHolder span.title").attr("title", path.basename(asd));
            pagal.win.title = path.basename(currentItem.title) + " - " + pagal.appname;
        },
        handleMediaChange: function () {
            iaa = player.currentItem() + 1;
            if (pagal.config.itemMode === 0) $('.track-container').removeClass("playing");
            $('.movie-wrap').removeClass("playing");
            $('[data-id="' + iaa + '"]').addClass("playing");


        },
        handlePause: function () {
            pagal.elements.FooterControls.find('.info .track-info .action i.play').show();
            pagal.elements.FooterControls.find('.info .track-info .action i.pause').hide();
        },
        handleEnded: function () {
            if (player.currentItem() + 1 == player.itemCount()) {
                if (playerApi.isRepeat() === true) {
                    var play = 0;
                    /*if (playerApi.isShuffle() === true) {
                        play = playerApi.getRandom();
                    }*/
                    return player.playItem(play);
                }
                pagal.elements.FooterControls.find(".track-info .playlist").trigger("click");
            }
            /*if (playerApi.isShuffle() === true) {
                return player.playItem(playerApi.getRandom());
            }*/
            if (pagal.pagalConfig.afterPlayback === 1) {
                pagal.win.hide();
                return pagal.keymap().trigger(pagal.keysConfig["quit"]);
            }
            playerApi.resetUi();
            //Disable enabled menues after playlist ended.
            pagal.menuStuff.enableMenues(0);
        },
        handleStopped: function () {
            playerApi.resetUi();
            pagal.menuStuff.enableMenues(0);
            if (pagal.config.itemMode === 0) $('.track-container').removeClass("playing");
            $('.movie-wrap').removeClass("playing");
            pagal.elements.FooterControls.find(".track-info .playlist").trigger("click");
        },
        updateUi: function (ms) {
            pagal.elements.FooterControls.find(".info .controls .current-time").text(pagal.parseTime(ms));
            pagal.elements.FooterControls.find('.progress-current').css({
                'width': (player.time() / player.length()) * 100 + '%'
            });
            percentage = (player.time() / player.length());
            pagal.setProgessBar(percentage);
        },
        isOpening: function () {

        },
        changedPosition: function () {

        },
        changedState: function () {

        },
        handleErrors: function () {

        }
    },
    controls: function () {
        pagal.elements.FooterControls.find(".track-info .playlist").click(function () {
            pagal.showWrapper();
        });
        pagal.elements.FooterControls.find(".track-info .action .play").click(function () {
            if (player.itemCount() != 0) {
                player.notify("<i class=\"fa fa-play fa-3x\"></i>", true);
                player.play();
            }
        });
        pagal.elements.FooterControls.find(".track-info .action .pause").click(function () {
            if (player.itemCount() != 0) {
                player.togglePause();
            }
        });
        pagal.elements.FooterControls.find(".track-info .action .stop").click(function () {
            if (player.itemCount() != 0) {
                player.stop();
            }
        });
        pagal.elements.FooterControls.find(".track-info .action .backward").click(function () {
            if (player.itemCount() == 1) {
                player.notify("Pervious");
                player.time(0);
            } else if (player.itemCount() > 1) {
                player.notify("Pervious");
                player.prev();
            }
        });
        pagal.elements.FooterControls.find(".track-info .action .forward").click(function () {
            if (player.itemCount() == 1) {
                player.notify("Next");
                player.time(0);
            } else if (player.itemCount() > 1) {
                player.notify("Next");
                player.next();
            }
        });
        pagal.elements.FooterControls.find('.track-info .random').on('click', function (e) {
            //pagal.suffleAndRepeat("suffle");
            //return $(this).closest(".action").toggleClass("active");
            return;
        });
        pagal.elements.FooterControls.find('.track-info .repeat').on('click', function (e) {
            pagal.suffleAndRepeat("repeat");
            return $(this).closest(".action").toggleClass("active");
        });
        pagal.elements.FooterControls.find('.volume-bg').click(function (e) {
            var percentage, volume;
            percentage = (e.pageX - $(this).offset().left) / $(this).width();
            volume = percentage * 100;
            pagal.player.volume(volume);
            return pagal.elements.FooterControls.find('.volume-current').animate({
                'width': percentage * 100 + '%'
            });
        });

        pagal.elements.FooterControls.find('.volume-icon').on('click', function (e) {
            if (player.mute() == true) {
                player.mute(false);
                player.notify("<i class=\"fa fa fa-volume-up fa-3x\"></i>", true);
                $(this).find("i").removeClass("fa-volume-off").addClass("fa fa-volume-up");
            } else {
                player.mute(true);
                player.notify("<i class=\"fa fa fa-volume-off fa-3x\"></i>", true);
                $(this).find("i").removeClass("fa-volume-up").addClass("fa fa-volume-off");
            }
        });
    },
    resetUi: function () {
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
    },
    updateUiviaStored: function () {
        if (pagal.pagalConfig.repeat === 1) {
            pagal.elements.FooterControls.find('.track-info .repeat').closest(".action").toggleClass("active");
        }
        if (pagal.pagalConfig.suffle === 1) {
            pagal.elements.FooterControls.find('.track-info .random').closest(".action").toggleClass("active");
        }
    },
    isRepeat: function () {
        return pagal.elements.FooterControls.find(".repeat").closest(".action").hasClass("active");
    },
    isShuffle: function () {
        return pagal.elements.FooterControls.find(".random").closest(".action").hasClass("active");
    },
    getRandom: function () {
        return parseInt(Math.random() * player.itemCount());
    },
    manageShuffle: function () {
        if (playerApi.isShuffle === true) {
            if (player.itemCount() > 1) {
                var x = playerApi.getRandom();
                return player.playItem(x);
            } else if (player.itemCount() === 1) {
                return player.time(0);
            }
        }
    }

}