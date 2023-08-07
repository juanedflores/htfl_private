//////////////////////////////////////////////////////////////
// GLOBAL_VARIABLES:
let currentMediumVideoPlayer = null;
let currentLargeVideoPlayer = null;
let currentAudioPlayer = null;
let video_media_array;
let video_media_array_index;
let audio_media_array;
let currentStartIndex = 0;
let currentEndIndex = 14;
let initialSlide = currentEndIndex / 2;
let bufferSize = 2;

let audio_amounts = [];

let fading_audio = false;

// slides that are unclickable from edge
let unclickable_slides_amount = 4;
let unclickable_slides = [];

move_one_slide_time = 2200;

let is_on_edge_left = false;
let is_on_edge_right = false;

let afterIntro = false;

let swiper;

let fadeMenuTimer;

let menuEnterTimer, menuLeaveTimer, resizeTimer;
let updateInterval;
let onPlayInterval;
let backgroundClick;
let resizing = false;
let menu_item_text_visible = false;
let index_page_clicked = false;
// debugging
let debug_swiper = false;
let indexCells = [];

// video player settings
const playerControls = [
    'play', // shows play icon
];
// vimeo embed player options
const vimeoOptions = {
    responsive: false,
    background: true,
    transparent: true,
};

function vw_convert(percent) {
    var w = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
    );
    return (percent * w) / 100;
}

function showAudioPlayer(i) {
    let audio_player = $(audio_media_array[i].audio_player.children[0]);
    let play_button = $(
        audio_media_array[i].audio_player.children[0].children[0]
    );
    let progress_bar = $(
        audio_media_array[i].audio_player.children[0].children[1]
    );
    let close_button = $(
        audio_media_array[i].audio_player.parentNode.children[2].children[0]
    );

    close_button.css('opacity', '1');
    close_button.css('pointer-events', 'none');
    progress_bar.css('pointer-events', 'none');
    play_button.css('pointer-events', 'auto');

    function animateAudioPlayer() {
        play_button.css('width', '0%');
        play_button.css('padding-left', '0%');
        progress_bar.css('padding-right', '100%');
        close_button.hide();

        setTimeout(function () {
            audio_player.fadeTo(200, 1.0);
            play_button.fadeTo(200, 1.0);
            progress_bar.css('visibility', 'visible');
            progress_bar.fadeTo(200, 1.0);
        }, 250);
        if (!audio_media_array[i].has_click_listener) {
            audio_media_array[i].has_click_listener = true;
            play_button.on('click', function () {
                fade_timer = setTimeout(function () {
                    if (
                        !audio_media_array[i].playing &&
                        parseInt(progress_bar.css('padding-right'))
                    ) {
                        audio_media_array[i].playing = true;
                        // play_button.css('padding-left', "0%");
                        progress_bar.css('padding-right', '0%');
                        progress_bar.fadeTo(100, 1.0);
                        play_button.css('width', '10%');
                        progress_bar.promise().done(function () {
                            if (
                                audio_media_array[i].playing &&
                                audio_media_array[i] == currentAudioPlayer
                            ) {
                                close_button.fadeTo(100, 1.0);
                            }
                        });
                        setTimeout(function () {
                            progress_bar.css('pointer-events', 'auto');
                            play_button.css('pointer-events', 'auto');
                            close_button.css('pointer-events', 'auto');
                        }, 500);
                    } else if (
                        audio_media_array[i].playing &&
                        parseInt(progress_bar.css('padding-right')) == 0
                    ) {
                        audio_media_array[i].playing = false;
                    } else if (
                        !audio_media_array[i].playing &&
                        parseInt(progress_bar.css('padding-right')) == 0
                    ) {
                        audio_media_array[i].playing = true;
                    } else {
                        audio_media_array[i].playing = false;

                        play_button.css('width', '100%');
                        progress_bar.fadeTo(100, 0.0);
                        play_button.fadeTo(100, 0.0);
                        close_button.fadeTo(100, 0.0);

                        progress_bar.css('pointer-events', 'none');
                        play_button.css('pointer-events', 'none');
                        close_button.css('pointer-events', 'none');
                    }
                }, 200);

                close_button.on('click', function () {
                    if (
                        currentAudioPlayer.playing &&
                        currentAudioPlayer != audio_media_array[i]
                    ) {
                        $(
                            currentAudioPlayer.audio_player.children[0]
                                .children[0].children[1]
                        ).click();
                    } else if (audio_media_array[i].playing) {
                        if (
                            currentAudioPlayer &&
                            currentAudioPlayer == audio_media_array[i]
                        ) {
                            $(
                                currentAudioPlayer.audio_player.children[0]
                                    .children[0].children[1]
                            ).click();
                        }
                    }
                    play_button.css('width', '100%');
                    progress_bar.fadeTo(100, 0.0);
                    play_button.fadeTo(100, 0.0);
                    close_button.fadeTo(100, 0.0);

                    progress_bar.css('pointer-events', 'none');
                    play_button.css('pointer-events', 'none');
                    close_button.css('pointer-events', 'none');
                });
            });
        }
    }

    if (!currentAudioPlayer) {
        animateAudioPlayer();
        currentAudioPlayer = audio_media_array[i];
    } else if (currentAudioPlayer != audio_media_array[i]) {
        if (currentAudioPlayer.playing && currentAudioPlayer) {
            $(
                currentAudioPlayer.audio_player.children[0].children[0]
                    .children[1]
            ).click();
            close_button.hide();
        }
        $(currentAudioPlayer.audio_player.children[0]).fadeTo(10, 0.0);
        $(
            currentAudioPlayer.audio_player.parentNode.children[2].children[0]
        ).fadeTo(10, 0.0);
        $(currentAudioPlayer.audio_player.children[0].children[0]).css(
            'pointer-events',
            'none'
        );
        $(currentAudioPlayer.audio_player.children[0].children[1]).css(
            'pointer-events',
            'none'
        );
        // close button
        $(
            currentAudioPlayer.audio_player.parentNode.children[2].children[0]
        ).css('pointer-events', 'none');

        animateAudioPlayer();
        currentAudioPlayer = audio_media_array[i];
    }
}

//////////////////////////////////////////////////////////////
// SLIDER_FUNCTIONS:
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        // console.log(array[currentIndex-1]["Subject Name"]);
        // if (currentIndex < array.length) {
        // if (array[currentIndex-1]["Subject Name"] !== array[currentIndex]["Subject Name"]) {
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        // }
        // }
    }

    return array;
}

function moveToSlide(target_index, dont_make_target_medium, speed = 1000) {
    if (!swiper.animating) {
        if (index_page_clicked && !currentLargeVideoPlayer) {
            $('.swiper-wrapper').css({ transition: 'all 0.5s linear' });
            $('#content_text').fadeTo(1000, 0.4);

            $('#swiper').fadeTo(800, 1.0);
            $('#swiper')
                .promise()
                .done(function () {
                    $('.swiper-wrapper').css({ transition: 'all 0.5s linear' });
                    $('.swiper-wrapper').css({ 'margin-bottom': '10vh' });
                    $('.swiper-button-prev').css({ bottom: '20vh' });
                    $('.swiper-button-next').css({ bottom: '20vh' });
                });
        }

        // if there is any medium video, make it small
        if (currentMediumVideoPlayer) {
            makeSmall(currentMediumVideoPlayer);
        }

        // TODO: find a more efficient way to do this
        let active_index;
        video_media_array.forEach(function (item, index) {
            if (item.player) {
                if (
                    item.player.swiper_slide.classList.contains(
                        'swiper-slide-active'
                    )
                ) {
                    active_index = index;
                }
            }
        });
        let distance_to_left;
        let distance_to_right;
        if (target_index > active_index) {
            distance_to_left =
                active_index + (video_media_array.length - target_index);
            distance_to_right = target_index - active_index;
        } else if (target_index < active_index) {
            distance_to_left = active_index - target_index;
            distance_to_right =
                target_index + (video_media_array.length - active_index);
        }

        let diff = 0;
        // if distance to left is less, do prev
        if (distance_to_left < distance_to_right) {
            diff = distance_to_left;
            if (diff >= Math.round(swiper.visibleSlidesIndexes.length / 2)) {
                for (var i = 0; i < diff - 1; i++) {
                    loadSlidesLeft();
                }
                setTimeout(function () {
                    swiper.slideTo(initialSlide - 1, 1000);

                    setTimeout(function () {
                        // unload the ones on left
                        for (var i = 0; i < diff - 1; i++) {
                            // remove slide to the right
                            swiper.removeSlide(swiper.slides.length - 1);
                        }
                        // update the swiper
                        swiper.update();
                        // make the slides on the edges uninteractable
                        swiper.slides.forEach(function (item, index) {
                            if (unclickable_slides.includes(index)) {
                                if (debug_swiper) {
                                    item.style.background = 'red';
                                }
                                item.style.opacity = '0.5';
                                item.style.pointerEvents = 'none';
                            } else {
                                item.style.opacity = '1';
                                item.style.pointerEvents = 'auto';
                                if (debug_swiper) {
                                    item.style.background = 'black';
                                }
                            }
                        });
                        if (
                            !currentMediumVideoPlayer &&
                            !currentLargeVideoPlayer &&
                            !dont_make_target_medium
                        ) {
                            makeMedium(video_media_array[target_index].player);
                        }
                    }, 2000);
                }, 2000);
            } else {
                for (var i = 0; i < diff - 1; i++) {
                    prev();
                }
                swiper.slideTo(initialSlide - 1, speed);
                if (
                    !currentMediumVideoPlayer &&
                    !currentLargeVideoPlayer &&
                    !dont_make_target_medium
                ) {
                    makeMedium(video_media_array[target_index].player);
                }
            }
        }
        // if distance to right is less, do next
        else if (distance_to_left > distance_to_right) {
            diff = distance_to_right;
            if (diff >= Math.round(swiper.visibleSlidesIndexes.length / 2)) {
                for (var i = 0; i < diff - 1; i++) {
                    loadSlidesRight();
                }
                setTimeout(function () {
                    swiper.slideTo(initialSlide + diff, 1000);

                    setTimeout(function () {
                        // unload the ones on left
                        for (var i = 0; i < diff - 1; i++) {
                            // remove slide to the left
                            swiper.removeSlide(0);
                        }
                        // update the swiper
                        swiper.update();
                        // make the slides on the edges uninteractable
                        swiper.slides.forEach(function (item, index) {
                            if (unclickable_slides.includes(index)) {
                                if (debug_swiper) {
                                    item.style.background = 'red';
                                }
                                item.style.opacity = '0.5';
                                item.style.pointerEvents = 'none';
                            } else {
                                item.style.opacity = '1';
                                item.style.pointerEvents = 'auto';
                                if (debug_swiper) {
                                    item.style.background = 'black';
                                }
                            }
                        });
                        if (
                            !currentMediumVideoPlayer &&
                            !currentLargeVideoPlayer &&
                            !dont_make_target_medium
                        ) {
                            makeMedium(video_media_array[target_index].player);
                        }
                    }, 2000);
                }, 2000);
            } else {
                for (var i = 0; i < diff - 1; i++) {
                    next();
                }
                swiper.slideTo(initialSlide + 1, speed);
                if (
                    !currentMediumVideoPlayer &&
                    !currentLargeVideoPlayer &&
                    !dont_make_target_medium
                ) {
                    makeMedium(video_media_array[target_index].player);
                }
            }
        } else {
            // TODO: do something here?
        }
    }
}

function loadSlidesRight() {
    $('.swiper-wrapper').css({ transition: 'all 0s' });
    // update beginning and ending indices
    currentEndIndex = currentEndIndex + 1;
    currentStartIndex = currentStartIndex + 1;
    // handle wrap around
    if (currentStartIndex > video_media_array.length - 1) {
        currentStartIndex = 0;
    }
    if (currentEndIndex > video_media_array.length - 1) {
        currentEndIndex = 0;
    }
    // returns a string of html for slide
    slide = makeSlide(currentEndIndex);
    // appends the slide to the end
    swiper.appendSlide(slide);
    // this is the swiper_slide dom element
    swiper_slide = swiper.slides[swiper.slides.length - 1];
    // this is the player-js dom element
    player_js = swiper_slide.children[0].childNodes[1].children[0];
    // initialize the player
    player = new Plyr(player_js, {
        controls: playerControls,
        debug: false,
        clickToPlay: false,
        vimeo: vimeoOptions,
        index: currentEndIndex,
    });
    player.media_index = currentEndIndex;
    // update the new slide
    player.swiper_slide = swiper_slide;
    playerOnReady(player);

    video_media_array[currentEndIndex].player = player;
    if (currentStartIndex == 0) {
        // currentStartIndex is 0, then the last index (42) is to be deleted
        video_media_array[video_media_array.length - 1].player = null;
    } else {
        // else just delete the one before the currentStartIndex
        video_media_array[currentStartIndex - 1].player = null;
    }
}

function loadSlidesLeft() {
    $('.swiper-wrapper').css({ transition: 'all 0s' });
    // update beginning and ending indices
    currentEndIndex = currentEndIndex - 1;
    currentStartIndex = currentStartIndex - 1;
    // handle wrap around
    if (currentStartIndex < 0) {
        currentStartIndex = video_media_array.length - 1;
    }
    if (currentEndIndex < 0) {
        currentEndIndex = video_media_array.length - 1;
    }
    // returns a string of html for slide
    slide = makeSlide(currentStartIndex);
    // appends the slide to the end
    swiper.prependSlide(slide);
    // this is the swiper_slide dom element
    swiper_slide = swiper.slides[0];
    // this is the player-js dom element
    player_js = swiper_slide.children[0].childNodes[1].children[0];
    // initialize the player
    player = new Plyr(player_js, {
        controls: playerControls,
        debug: false,
        clickToPlay: false,
        vimeo: vimeoOptions,
        index: currentEndIndex,
    });
    player.media_index = currentStartIndex;
    // update the new slide
    player.swiper_slide = swiper_slide;
    playerOnReady(player);

    video_media_array[currentStartIndex].player = player;
    if (currentEndIndex == video_media_array.length - 1) {
        // if currentEnd is video_media_array.length-1, then 0 should be deleted
        video_media_array[0].player = null;
    } else {
        // else just delete currentEndIndex+1
        video_media_array[currentEndIndex + 1].player = null;
    }
}

function next() {
    $('.swiper-wrapper').css({ transition: 'all 0.5s linear' });
    // update beginning and ending indices
    currentEndIndex = currentEndIndex + 1;
    currentStartIndex = currentStartIndex + 1;
    // handle wrap around
    if (currentStartIndex > video_media_array.length - 1) {
        currentStartIndex = 0;
    }
    if (currentEndIndex > video_media_array.length - 1) {
        currentEndIndex = 0;
    }
    // returns a string of html for slide
    slide = makeSlide(currentEndIndex);
    // appends the slide to the end
    swiper.appendSlide(slide);
    // this is the swiper_slide dom element
    swiper_slide = swiper.slides[swiper.slides.length - 1];
    // this is the player-js dom element
    player_js = swiper_slide.children[0].childNodes[1].children[0];
    // initialize the player
    player = new Plyr(player_js, {
        controls: playerControls,
        debug: false,
        clickToPlay: false,
        vimeo: vimeoOptions,
        index: currentEndIndex,
    });
    player.media_index = currentEndIndex;
    playerOnReady(player);
    // remove slide to the left
    swiper.removeSlide(0);
    // update the swiper
    swiper.update();

    // update the new slide
    player.swiper_slide = swiper_slide;
    video_media_array[currentEndIndex].player = player;
    if (currentStartIndex == 0) {
        // currentStartIndex is 0, then the last index (42) is to be deleted
        video_media_array[video_media_array.length - 1].player = null;
    } else {
        // else just delete the one before the currentStartIndex
        video_media_array[currentStartIndex - 1].player = null;
    }

    // make the slides on the edges uninteractable
    swiper.slides.forEach(function (item, index) {
        if (unclickable_slides.includes(index)) {
            if (debug_swiper) {
                item.style.background = 'red';
            }
            item.style.opacity = '0.5';
            item.style.pointerEvents = 'none';
        } else {
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
            if (debug_swiper) {
                item.style.background = 'black';
            }
        }
        if (
            currentLargeVideoPlayer &&
            currentLargeVideoPlayer.swiper_slide == item
        ) {
            if (
                !currentLargeVideoPlayer.swiper_slide.classList.contains(
                    'swiper-slide-active'
                )
            ) {
                fadeAudio(currentLargeVideoPlayer, audio_amounts[index]);
                if (index < 2 || index > swiper.slides.length - 2) {
                    makeSmall(currentLargeVideoPlayer);
                }
            } else {
                // fadeAudio(currentLargeVideoPlayer, 1);
            }
        }
    });

    // DEBUGGING: for index page
    if (indexCells.length > 0) {
        // make all cells white first
        if (debug_swiper) {
            for (var i = 0; i < indexCells.length; i++) {
                indexCells[i].style.color = 'white';
            }
        }
        video_media_array.forEach(function (item, index) {
            if (item.player) {
                if (
                    item.player.swiper_slide.classList.contains(
                        'swiper-slide-visible'
                    )
                ) {
                    if (debug_swiper) {
                        indexCells[index].style.color = 'green';
                    }
                    if (
                        item.player.swiper_slide.classList.contains(
                            'swiper-slide-active'
                        )
                    ) {
                        if (debug_swiper) {
                            indexCells[index].style.color = 'red';
                        }
                    }
                } else {
                    if (debug_swiper) {
                        indexCells[index].style.color = 'blue';
                    }
                }
            }
        });
    }
    // DEBUGGING:
    active_index = swiper.activeIndex;
    slides_to_left = active_index;
    slides_to_right = swiper.slides.length - (active_index + 1);
    // console.log("total loaded slides: " + swiper.slides.length);
    // console.log("index of active slide: " + active_index);
    // console.log("slides to the left: " + slides_to_left);
    // console.log("slides to the right: " + slides_to_right);
}

function prev() {
    $('.swiper-wrapper').css({ transition: 'all 0.5s linear' });
    // update beginning and ending indices
    currentEndIndex = currentEndIndex - 1;
    currentStartIndex = currentStartIndex - 1;
    // handle wrap around
    if (currentStartIndex < 0) {
        currentStartIndex = video_media_array.length - 1;
    }
    if (currentEndIndex < 0) {
        currentEndIndex = video_media_array.length - 1;
    }
    // returns a string of html for slide
    slide = makeSlide(currentStartIndex);
    // add a slide to the beginning
    swiper.prependSlide(slide);
    // this is the swiper_slide dom element
    swiper_slide = swiper.slides[0];
    // this is the player-js dom element
    player_js = swiper_slide.children[0].childNodes[1].children[0];
    // initialize the player
    player = new Plyr(player_js, {
        controls: playerControls,
        debug: false,
        clickToPlay: false,
        vimeo: vimeoOptions,
        index: currentStartIndex,
    });
    player.media_index = currentStartIndex;
    playerOnReady(player);
    // remove slide to the right
    swiper.removeSlide(swiper.slides.length - 1);
    // update the swiper
    swiper.update();

    // update the players array
    player.swiper_slide = swiper_slide;
    video_media_array[currentStartIndex].player = player;
    if (currentEndIndex == video_media_array.length - 1) {
        // if currentEnd is video_media_array.length-1, then 0 should be deleted
        video_media_array[0].player = null;
    } else {
        // else just delete currentEndIndex+1
        video_media_array[currentEndIndex + 1].player = null;
    }

    // make the slides on the edges uninteractable
    swiper.slides.forEach(function (item, index) {
        if (unclickable_slides.includes(index)) {
            if (debug_swiper) {
                item.style.background = 'red';
            }
            item.style.opacity = '0.5';
            item.style.pointerEvents = 'none';
        } else {
            if (debug_swiper) {
                item.style.background = 'black';
            }
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
        }

        if (
            currentLargeVideoPlayer &&
            currentLargeVideoPlayer.swiper_slide == item
        ) {
            if (
                !currentLargeVideoPlayer.swiper_slide.classList.contains(
                    'swiper-slide-active'
                )
            ) {
                fadeAudio(currentLargeVideoPlayer, audio_amounts[index]);
                if (index < 2 || index > swiper.slides.length - 2) {
                    makeSmall(currentLargeVideoPlayer);
                }
            } else {
                // fadeAudio(currentLargeVideoPlayer, 1);
            }
        }
    });

    // DEBUGGING: for index page
    if (indexCells.length > 0) {
        // make all cells white first
        for (var i = 0; i < indexCells.length; i++) {
            indexCells[i].style.color = 'white';
        }
        video_media_array.forEach(function (item, index) {
            if (item.player) {
                if (
                    item.player.swiper_slide.classList.contains(
                        'swiper-slide-visible'
                    )
                ) {
                    if (debug_swiper) {
                        indexCells[index].style.color = 'green';
                    }
                    if (
                        item.player.swiper_slide.classList.contains(
                            'swiper-slide-active'
                        )
                    ) {
                        if (debug_swiper) {
                            indexCells[index].style.color = 'red';
                        }
                    }
                } else {
                    if (debug_swiper) {
                        indexCells[index].style.color = 'blue';
                    }
                }
            }
        });
    }
    // DEBUGGING:
    active_index = swiper.activeIndex;
    slides_to_left = active_index;
    slides_to_right = swiper.slides.length - (active_index + 1);
    // console.log("total loaded slides: " + swiper.slides.length);
    // console.log("index of active slide: " + active_index);
    // console.log("slides to the left: " + slides_to_left);
    // console.log("slides to the right: " + slides_to_right);
}

// PLAYER_FUNCTIONS:
function playerOnReady(player) {
    player.on('ready', (event) => {
        let player = event.detail.plyr;
        let player_swiper_slide =
            player.elements.wrapper.parentNode.parentNode.parentNode.parentNode;
        let player_card_description =
            player.elements.wrapper.parentNode.parentNode.parentNode.parentNode
                .children[1];
        let player_videocard =
            player.elements.wrapper.parentNode.parentNode.parentNode;
        let player_videoTopDiv =
            player.elements.wrapper.parentNode.parentNode.parentNode.parentNode
                .children[1].children[0];
        let player_durationDiv =
            player.elements.wrapper.parentNode.parentNode.parentNode.parentNode
                .children[1].children[0].children[1];
        let player_controls =
            player_swiper_slide.firstElementChild.firstElementChild
                .firstElementChild.firstElementChild.firstElementChild;
        let player_iframe =
            player_swiper_slide.firstElementChild.firstElementChild
                .firstElementChild.children[1].children[0].children[0];
        let player_plyrposter =
            player_swiper_slide.firstElementChild.firstElementChild
                .firstElementChild.children[1].children[1];

        vimeo_id = video_media_array[player.media_index]['Vimeo ID'];

        if ($(window).width() > 400) {
            // if desktop
            fetch(
                `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeo_id}`
            )
                .then((response) => {
                    return response.text();
                })
                .then((data) => {
                    let { thumbnail_url } = JSON.parse(data);
                    thumbnail_url =
                        thumbnail_url.substring(0, thumbnail_url.length - 7) +
                        '640.png';
                    player_plyrposter.style.background = `url(${thumbnail_url}) no-repeat center center fixed`;
                    player_plyrposter.style.backgroundSize = 'cover';
                    player_plyrposter.style.opacity = '1';
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        // responsive
        if ($(window).width() > 400) {
            // for desktop
            $(player_swiper_slide).css({ 'min-width': '1vw' });
        } else {
            // for mobile
            $(player_swiper_slide).css({ 'min-width': '20vw' });
        }

        // make videos appear randomly on intro
        let random_Time = Math.random() * 1000;
        setTimeout(() => {
            player.elements.container.style.visibility = 'visible';
        }, random_Time + 400);
        // add a transition effect
        player_swiper_slide.style.transition = 'all 1400ms ease';
        // init the volume
        player.volume = 0.0;
        // make unclickable ones
        if (player.unclickable) {
            player_swiper_slide.style.pointerEvents = 'none';
        }
        // add the custom progress bar
        let progressbardiv = document.createElement('div');
        progressbardiv.style.display = 'none';
        progressbardiv.setAttribute('class', 'progress');
        player_videoTopDiv.onclick = function clickEvent(e) {
            var parentwidth = progressbardiv.offsetWidth;
            // if it's not video-title
            if (
                e.target !=
                player.elements.container.offsetParent.offsetParent
                    .lastElementChild.children[0].children[0]
            ) {
                var rect = e.target.getBoundingClientRect();
                var x = e.clientX - rect.right; //x position within the element.
                player.currentTime =
                    player.duration * (1 - Math.abs(x) / parentwidth);
            }
        };
        // append the div to html
        player_videoTopDiv.append(progressbardiv);
        // initialize progressbar
        var progressbar = new ProgressBar.Line(progressbardiv, {
            color: '#FFFFFF',
            trailColor: '#808080',
            strokeWidth: 0.1,
        });
        // set the progressbar to 0
        progressbar.set(0.0);
        // disable double click to fullscreen feature
        player.eventListeners.forEach(function (eventListener) {
            if (eventListener.type === 'dblclick') {
                eventListener.element.removeEventListener(
                    eventListener.type,
                    eventListener.callback,
                    eventListener.options
                );
            }
        });

        // add a entries to the player object
        player.swiper_slide = player_swiper_slide;
        player.card_description = player_card_description;
        player.progressbardiv = progressbardiv;
        player.progressbar = progressbar;
        player.topdiv = player_videoTopDiv;
        player.durationdiv = player_durationDiv;
        player.player_controls = player_controls;
        player.player_poster = player_plyrposter;

        /// add an end event listener
        player.on('ended', function (data) {
            closeAndSwipe(player);
            progressbar.set(0.0);
            player.currentTime = 0;
        });

        // player.on('playing', function (data) {
        //     // data is an object containing properties specific to that event
        //     console.log('onbufferend');
        //
        //     function checkSize() {
        //         console.log('checking size..');
        //         if (
        //             Math.abs(
        //                 vw_convert(70) -
        //                     parseFloat($(player_swiper_slide).css('min-width'))
        //             ) > 0.5
        //         ) {
        //             console.log('running..');
        //             setTimeout(checkSize, 100);
        //         } else if (
        //             Math.abs(
        //                 vw_convert(70) -
        //                     parseFloat($(player_swiper_slide).css('min-width'))
        //             ) < 0.5
        //         ) {
        //             console.log('REACHED.. CLEARING INTERVAL');
        //             player_plyrposter.style.opacity = '0';
        //             player.play();
        //         }
        //     }
        //     checkSize();
        // });

        // add an event listener for when video plays
        // onPlay = function (data) {};

        // add an event listener for when video paused
        const onPause = function (data) {
            // data is an object containing properties specific to that event
            player_plyrposter.style.opacity = '1';
            console.log('onpause');
        };

        player.on('pause', onPause);

        //////////////////////////////////////////////////////////////
        //* [MOUSE EVENTS FOR SLIDER] *//
        // add mouse events
        let showDelay = 700,
            hideDelay = 700;
        player_swiper_slide.addEventListener('mouseenter', function () {
            clearTimeout(menuLeaveTimer);
            // CASE_2: there is already a medium and its different from hovered player
            if (
                currentMediumVideoPlayer &&
                currentMediumVideoPlayer != player
            ) {
                menuEnterTimer = setTimeout(function () {
                    index_page_clicked = false;
                    $('#content_text').fadeTo(1000, 0.0);
                    $('#upButton').fadeTo(1000, 0.0);
                    $('#downButton').fadeTo(1000, 0.0);

                    $('#content_text')
                        .promise()
                        .done(function () {
                            document.getElementById('content_text').innerHTML =
                                '';
                        });

                    if (currentMediumVideoPlayer.playing) {
                        currentMediumVideoPlayer.pause();
                    }
                    makeSmall(currentMediumVideoPlayer);
                    makeMedium(player);

                    setTimeout(function () {
                        clearTimeout(fadeMenuTimer);
                    }, 500);
                }, showDelay);
            }
            // CASE_1: all are small and there is no medium
            else if (!currentMediumVideoPlayer && !currentLargeVideoPlayer) {
                menuEnterTimer = setTimeout(function () {
                    makeMedium(player);
                }, showDelay);
            }

            // CASE_3: there is a large video
            else if (
                !currentMediumVideoPlayer &&
                currentLargeVideoPlayer &&
                currentLargeVideoPlayer != player
            ) {
                menuEnterTimer = setTimeout(function () {
                    makeSmall(currentLargeVideoPlayer);

                    setTimeout(function () {
                        clearTimeout(fadeMenuTimer);
                    }, 500);
                    setTimeout(function () {
                        index_page_clicked = false;
                        $('#content_text').fadeTo(1000, 0.0);
                        $('#upButton').fadeTo(1000, 0.0);
                        $('#downButton').fadeTo(1000, 0.0);

                        $('#content_text')
                            .promise()
                            .done(function () {
                                document.getElementById(
                                    'content_text'
                                ).innerHTML = '';
                            });

                        makeMedium(player);

                        clearTimeout(menuLeaveTimer);
                        clearTimeout(menuEnterTimer);
                        var x = 10;
                        var interval = 300;
                        for (var i = 0; i < x; i++) {
                            setTimeout(function () {
                                clearTimeout(menuLeaveTimer);
                                clearTimeout(menuEnterTimer);
                            }, i * interval);
                        }
                    }, 1000);
                }, showDelay);
            }
        });

        // triggered when user's mouse leaves the swiper item
        player_swiper_slide.addEventListener('mouseleave', function () {
            clearTimeout(menuEnterTimer);
            // CASE_1: mouse left a video that was medium
            if (
                currentMediumVideoPlayer &&
                !currentLargeVideoPlayer &&
                currentMediumVideoPlayer == player
            ) {
                menuLeaveTimer = setTimeout(function () {
                    makeSmall(player);
                }, hideDelay);
            }
        });

        player_videocard.addEventListener('click', function (event) {
            // CASE_1: there is a medium video && user clicked on it
            if (currentMediumVideoPlayer) {
                if (player == currentMediumVideoPlayer) {
                    if ($(player_card_description).is(':visible')) {
                        // if (vw_convert(35) == parseFloat($(currentMediumVideoPlayer.swiper_slide).css("min-width"))) {
                        makeLarge(player);
                        // }
                    }
                }
            }

            // CASE_2: there is a large video && user clicked on it
            // else if (currentLargeVideoPlayer) {
            else if (currentLargeVideoPlayer) {
                if (player == currentLargeVideoPlayer) {
                    if ($(player_card_description).is(':visible')) {
                        // if (vw_convert(70) == parseFloat($(currentLargeVideoPlayer.swiper_slide).css("min-width"))) {
                        makeMedium(player);
                        // }
                    }
                } else {
                    // CASE_4: there is a large video && user clicked on another video
                    clearTimeout(menuLeaveTimer);
                    clearTimeout(menuEnterTimer);
                    var x = 10;
                    var interval = 300;
                    for (var i = 0; i < x; i++) {
                        setTimeout(function () {
                            clearTimeout(menuLeaveTimer);
                            clearTimeout(menuEnterTimer);
                        }, i * interval);
                    }
                    setTimeout(function () {
                        clearTimeout(fadeMenuTimer);
                    }, 500);

                    index_page_clicked = false;
                    $('#content_text').fadeTo(1000, 0.0);
                    $('#upButton').fadeTo(1000, 0.0);
                    $('#downButton').fadeTo(1000, 0.0);

                    $('#content_text')
                        .promise()
                        .done(function () {
                            document.getElementById('content_text').innerHTML =
                                '';
                        });

                    makeSmall(currentLargeVideoPlayer);
                    setTimeout(function () {
                        makeMedium(player);
                    }, 1000);
                }
            }
        });
    });
}

//////////////////////////////////////////////////////////////
// MENU_ITEM_PAGES:
function index() {
    console.log('index');
    // html content string
    indexContent = `
    <div id="indexContent" class="indexcontent">
        <table id="indexTable" style="width: 100%; font-weight:200;">
          <tr style="visibility: hidden">
            <th>Rally in support of Juvenile Lifers</th>
            <th>0:00</th>
            <th>0:00</th>
            <th>0:00</th>
            <th>0:00</th>
          </tr>
        </table>
    </div>
  `;
    document.getElementById('content_text').innerHTML = indexContent;

    indexCells = [];
    currName = '';
    let currRow;
    let rowcount = 0;
    let cellcount = 0;
    table = document.getElementById('indexTable');

    currRow = table.insertRow(rowcount);
    rowcount = rowcount + 1;
    cell = currRow.insertCell(0);
    // typewriter
    typecell = new Typewriter(cell, {
        loop: false,
        cursor: '',
        delay: 50,
    });
    typecell
        .typeString(
            "<span style='font-weight: 400; font-size: 1.2em; line-height: 1em;'>Community<span>"
        )
        .start();
    // currRow = table.insertRow(rowcount);
    // rowcount = rowcount + 1;
    // cell = currRow.insertCell(0);
    // cell.innerHTML = "<br>";

    function task(i) {
        setTimeout(function () {
            let name = video_media_array_index[i]['Subject Name'];
            if (name != currName) {
                if (name == 'Efrén Paredes Jr') {
                    currRow = table.insertRow(rowcount);
                    rowcount = rowcount + 1;
                    cell = currRow.insertCell(0);
                    cell.innerHTML = '<br>';
                    currRow = table.insertRow(rowcount);
                    rowcount = rowcount + 1;
                    cell = currRow.insertCell(0);
                    // typewriter
                    typecell = new Typewriter(cell, {
                        loop: false,
                        cursor: '',
                        delay: 50,
                    });
                    typecell
                        .typeString(
                            "<span style='font-weight: 400; font-size: 1.2em; line-height: 1em;'>Family<span>"
                        )
                        .start();
                } else if (name == 'Jim Gladstone') {
                    currRow = table.insertRow(rowcount);
                    rowcount = rowcount + 1;
                    cell = currRow.insertCell(0);
                    cell.innerHTML = '<br>';
                    currRow = table.insertRow(rowcount);
                    rowcount = rowcount + 1;
                    cell = currRow.insertCell(0);
                    // typewriter
                    typecell = new Typewriter(cell, {
                        loop: false,
                        cursor: '',
                        delay: 50,
                    });
                    typecell
                        .typeString(
                            "<span style='font-weight: 400; font-size: 1.2em; line-height: 1em;'>Jury<span>"
                        )
                        .start();
                } else if (name == 'Andrew Burch') {
                    currRow = table.insertRow(rowcount);
                    rowcount = rowcount + 1;
                    cell = currRow.insertCell(0);
                    cell.innerHTML = '<br>';
                    currRow = table.insertRow(rowcount);
                    rowcount = rowcount + 1;
                    cell = currRow.insertCell(0);
                    // typewriter
                    typecell = new Typewriter(cell, {
                        loop: false,
                        cursor: '',
                        delay: 50,
                    });
                    typecell
                        .typeString(
                            "<span style='font-weight: 400; font-size: 1.2em; line-height: 1em;'>Law<span>"
                        )
                        .start();
                } else if (name == 'Carol Draeger Thomas') {
                    currRow = table.insertRow(rowcount);
                    rowcount = rowcount + 1;
                    cell = currRow.insertCell(0);
                    cell.innerHTML = '<br>';
                    currRow = table.insertRow(rowcount);
                    rowcount = rowcount + 1;
                    cell = currRow.insertCell(0);
                    // typewriter
                    typecell = new Typewriter(cell, {
                        loop: false,
                        cursor: '',
                        delay: 50,
                    });
                    typecell
                        .typeString(
                            "<span style='font-weight: 400; font-size: 1.2em; line-height: 1em;'>Media<span>"
                        )
                        .start();
                }

                cellcount = 0;
                currRow = table.insertRow(rowcount);
                currName = name;
                cell = currRow.insertCell(0);
                // typewriter
                typecell = new Typewriter(cell, {
                    loop: false,
                    cursor: '',
                    delay: 50,
                });

                typecell.typeString(name).start();

                // cell.innerHTML = name;
                rowcount = rowcount + 1;
                cellcount = cellcount + 1;

                // add the time
                cell = currRow.insertCell(cellcount);
                duration = video_media_array_index[i]['Video Duration'];
                a = document.createElement('a');
                indexCells.push(a);
                // cellIndex = indexCells.length-1;
                cellIndex = video_media_array_index[i].slider_index;
                a.setAttribute(
                    'href',
                    `javascript:moveToSlide(${cellIndex}, false, 1000)`
                );
                // a.innerHTML = duration;

                typecell = new Typewriter(a, {
                    loop: false,
                    cursor: '',
                    delay: 50,
                });

                typecell.typeString(duration).start();

                cell.appendChild(a);
                // cell.innerHTML = duration;
                cellcount = cellcount + 1;
            } else {
                cell = currRow.insertCell(cellcount);
                duration = video_media_array_index[i]['Video Duration'];
                a = document.createElement('a');
                indexCells.push(a);
                // cellIndex = indexCells.length-1;
                cellIndex = video_media_array_index[i].slider_index;
                a.setAttribute(
                    'href',
                    `javascript:moveToSlide(${cellIndex}, false, 1000)`
                );
                // a.innerHTML = duration;

                typecell = new Typewriter(a, {
                    loop: false,
                    cursor: '',
                    delay: 50,
                });

                typecell.typeString(duration).start();

                cell.appendChild(a);
                cellcount = cellcount + 1;
            }
            // DEBUGGING:
            if (i == video_media_array_index.length - 1) {
                if (indexCells.length > 0) {
                    for (var j = 0; j < indexCells.length; j++) {
                        indexCells[j].style.color = 'white';
                    }

                    video_media_array.forEach(function (item, index) {
                        if (item.player) {
                            let player_swiper_slide =
                                item.player.elements.wrapper.parentNode
                                    .parentNode.parentNode.parentNode;
                            if (
                                player_swiper_slide.classList.contains(
                                    'swiper-slide-visible'
                                )
                            ) {
                                if (debug_swiper) {
                                    indexCells[index].style.color = 'green';
                                }
                                if (
                                    player_swiper_slide.classList.contains(
                                        'swiper-slide-active'
                                    )
                                ) {
                                    if (debug_swiper) {
                                        indexCells[index].style.color = 'red';
                                    }
                                }
                            } else {
                                if (debug_swiper) {
                                    indexCells[index].style.color = 'blue';
                                }
                            }
                        }
                    });
                }
            }
        }, 100 * i);
    }

    for (var i = 0; i <= video_media_array_index.length - 1; i++) {
        task(i);
    }
}

function aboutTheCase() {
    console.log('about the case');
    // html content string
    aboutCaseContent = `
    <div id="aboutCaseContent" class="text-block-12">
    </div>
  `;
    document.getElementById('content_text').innerHTML = aboutCaseContent;

    typedText = `In 1989, at age 15, Efren Paredes, Jr. was 
  convicted for a murder and armed robbery.   
  The crime took place in St. Joseph, Michigan, at a local store where Efren was 
  working at the time.  According to Efren and his family, on the 
  night of the crime, after completing his work at the store, 
  he was brought home by the store’s manager.  
  A short time later the store was robbed and the manager was murdered.  
  The case against Efren was based primarily on the statements of 
  the other youths who received reduced charges and sentences in 
  exchange for their testimony. Efren was sentenced to two life 
  without parole sentences and one parolable life sentence. 
    `;

    typeString = new Typewriter('#aboutCaseContent', {
        loop: false,
        cursor: '',
        delay: 4,
    });

    stringArray = stringSplitter(typedText);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br><br>He is currently 50 years-old.').start();
}

function aboutTheProject() {
    console.log('about the project');

    // html content string
    aboutInstallContent = `
    <div id="aboutCaseInstallation" class="text-block-13">
    </div>
  `;
    document.getElementById('content_text').innerHTML = aboutInstallContent;

    typedText = 'Half Truths and Full Lies tells a story about story.';
    typedText2 =
        'Stories are at the heart of the American criminal legal system and jury trials are storytelling contests.';
    typedText3 =
        'Every argument is a story and every lawyer and witness are storytellers who craft a narrative from pieces of information that have been deemed evidence. ';
    typedText4 =
        "Half Truths and Full Lies explores the case of Efren Paredes, a Latinx man from Michigan sentenced to life without parole at age 15 for a murder he claims he didn't commit.";
    typedText5 =
        'Although we began this project with the intention of making a long form documentary, we soon decided it would be better served by a nonlinear approach, one that would not focus on harmonizing witness accounts into a single narrative composition, but that allows for “navigational viewing” as filmmaker Harun Farocki describes it—the continuous updating and adjusting of multiple voices and perspectives, a polyphony that in its very form reflects the contingency of truth.';
    typedText6 =
        'Manifested as either a multi-channel installation or an online interactive piece, Half Truths and Full Lies takes on a Rashomon-like quality, as viewers are asked to piece together an array of accounts, from police detectives and a group of teens who appear to have conspired to set up their peer, to family members, teachers, pastors, lawyers, and citizens who sat in judgment as jury members.';
    typedText7 =
        'Through the divergent accounts, the project attempts to recuperate conflicting narrative possibilities, including Efren’s own  story of innocence; to generate reasonable doubt about the version put forward by the prosecutor and to investigate the narrative nature of truth-telling in both media and the law.';

    typedText8 = '*';
    typedText9 =
        'Half Truths and Full Lies is a collaboration between Tirtza Even, Meg McLagan and Elyse Blennerhassett.';
    typedText10 =
        'The site was produced with the support of the Chicago Digital Media Production Fund.';

    typedText11 =
        "<a href='https://chicagofilmmakers.org/' target='_blank'><img width=100 style='display: block; border: solid 2px white;' src='https://ci5.googleusercontent.com/proxy/iS3h5JU76I64hxVg9mjNOnEzMgPwpWPhmOjgTTr75mC5R8iUsxA9gNxn4_4Vuyc1twL5uIN9-Yr-wTaQ2mixHxr79eZczReQ_oObu_kxnF4nCMUq5A3FCU32APlyvL2Zhhde-BPydA5ujKATNSVZdhf3--QtCv8uOEFZ8_N9ik-LcIiaipGwtlZWvSyCL1h2jorCv8jth9BFxnXLmw=s0-d-e1-ft#https://docs.google.com/uc?export=download&id=1FZA0GOlro6EElKCEOD4I2Y62uzEy_Rk_&revid=0Bw4z2vIYIGD0N0FidzYxV2NtV3ZUOTl3RUowWnhsd1p5VCtJPQ'></img><a/><br />";
    typedText12 =
        "<a href='https://vimeo.com/294983167' style='text-decoration: underline;' target='_blank'>Video demo of the installation</a>";

    typeString = new Typewriter('#aboutCaseInstallation', {
        loop: false,
        cursor: '',
        delay: 4,
    });

    stringArray = stringSplitter(typedText);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    stringArray = stringSplitter(typedText2);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    stringArray = stringSplitter(typedText3);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    stringArray = stringSplitter(typedText4);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    stringArray = stringSplitter(typedText5);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    stringArray = stringSplitter(typedText6);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    stringArray = stringSplitter(typedText7);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    stringArray = stringSplitter(typedText8);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    stringArray = stringSplitter(typedText9);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    stringArray = stringSplitter(typedText10);
    for (var i = 0; i < stringArray.length; i++) {
        typeString.pasteString(stringArray[i] + ' ');
    }
    typeString.typeString('<br /><br />');

    typeString.typeString(typedText11).typeString(typedText12).start();
}

function audioFiles() {
    console.log('audio files');

    // html content string
    audioContent = `
    <div id="audioContent" class="indexcontent">
        <table id="audioTable" style="width: 100%;">
        </table>
    </div>
  `;
    document.getElementById('content_text').innerHTML = audioContent;

    function task(i) {
        setTimeout(function () {
            let name = audio_media_array[i]['Name'];
            let slug = audio_media_array[i]['Slug'];
            let audioID = audio_media_array[i]['Google Drive File ID'];
            currRow = table.insertRow(i);
            cell = currRow.insertCell(0);
            cell.style.padding = '0 10px';
            // cell.innerText = name;

            a = document.createElement('a');
            // a.innerText = name;
            a.setAttribute('href', `javascript:showAudioPlayer(${i})`);
            cell.append(a);

            typecell = new Typewriter(a, {
                loop: false,
                cursor: '',
                delay: 50,
            });

            typecell.pasteString(name).start();

            audioPlayerString = `<div id="${slug}" class="audio-player"><audio id="audioPlayer" class="audioAudio"><source src="https://docs.google.com/uc?export=download&id=${audioID}" type="audio/mpeg" /></audio></div>`;

            cell = currRow.insertCell(1);
            cell.innerHTML = audioPlayerString;
            audio_media_array[i].audio_player = cell;
            audio_media_array[i].playing = false;
            audio_media_array[i].has_click_listener = false;
            new GreenAudioPlayer('#' + slug, { stopOthersOnPlay: true });

            cell = currRow.insertCell(2);
            w = $(window).width();
            if (w > 600) {
                x_svg =
                    '<svg class="close_button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="50" height="50" style="min-width: 18px; max-width: 20px; width: 100%; height: 100%; z-index: 0; cursor: pointer; position: relative; left: 2px; top: 2px; opacity: 0;" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="__lottie_element_2"><rect width="500" height="500" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_2)"><g style="display: block;" transform="matrix(0.7071068286895752,-0.7071067690849304,0.7071067690849304,0.7071068286895752,323.93365478515625,331.6793212890625)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,5.4770002365112305,-110.03500366210938)"><path fill="rgb(229,229,229)" fill-opacity="1" d=" M150,-9 C150,-9 150,9 150,9 C150,9 -150,9 -150,9 C-150,9 -150,-9 -150,-9 C-150,-9 150,-9 150,-9z"></path></g></g><g style="display: none;" transform="matrix(1,0,0,1,244.5229949951172,360)" opacity="0.05480000000000018"><g opacity="1" transform="matrix(1,0,0,1,5.4770002365112305,-110.03500366210938)"><path fill="rgb(229,229,229)" fill-opacity="1" d=" M150,-9 C150,-9 150,9 150,9 C150,9 -150,9 -150,9 C-150,9 -150,-9 -150,-9 C-150,-9 150,-9 150,-9z"></path></g></g><g style="display: block;" transform="matrix(0.7071068286895752,0.7071067690849304,-0.7071067690849304,0.7071068286895752,168.3206787109375,323.9336853027344)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,5.4770002365112305,-110.03500366210938)"><path fill="rgb(229,229,229)" fill-opacity="1" d=" M150,-9 C150,-9 150,9 150,9 C150,9 -150,9 -150,9 C-150,9 -150,-9 -150,-9 C-150,-9 150,-9 150,-9z"></path></g></g></g></svg>';
                cell.innerHTML = x_svg;
            }
            // newDiv = document.createElement("div");
            // newDiv.appendChild(x_svg);
        }, 100 * i);
    }

    table = document.getElementById('audioTable');
    for (var i = 0; i <= audio_media_array.length - 1; i++) {
        task(i);
    }
    0;
}

function resources() {
    console.log('resources');

    // html content string
    resourcesContent = `
    <div id="resourcesContent">
    </div>
  `;
    document.getElementById('content_text').innerHTML = resourcesContent;

    typedString = `
  <h2 class="heading-2">Resources</h2>
  <div>
      <div class="collection-list-wrapper-5 w-dyn-list">
          <div role="list" class="w-dyn-items">
              <div role="listitem" class="collection-item-6 w-dyn-item">
                  <h4 class="heading">Supreme Court rulings related to juvenile justice</h4>
                  <a href="https://supreme.justia.com/cases/federal/us/543/03-633/index.pdf"
                      target="_blank" class="link resources-link">Roper v. Simmons (2005)</a><a
                      id="link2"
                      href="https://supreme.justia.com/cases/federal/us/560/08-7412/opinion.pdf"
                      target="_blank" class="link resources-link">Graham v. Roper (2010)</a><a
                      href="https://supreme.justia.com/cases/federal/us/567/10-9646/case.pdf"
                      target="_blank" class="link resources-link">Miller v. Alabama (2012)</a><a
                      href="https://supreme.justia.com/cases/federal/us/577/14-280/"
                      target="_blank" class="link resources-link">Montgomery v. Louisiana (2016)</a>
              </div>
              <div role="listitem" class="collection-item-6 w-dyn-item">
                  <h4 class="heading">State of Michigan Life without parole sentencing rulings</h4>
                  <a href="http://www.legislature.mi.gov/(S(31zcrydck2yfeo2zqrhydjox))/mileg.aspx?page=GetObject&amp;objectname=mcl-769-25"
                      target="_blank" class="link resources-link">Michigan Legislature, Section
                      769.25</a><a id="link2"
                      href="http://www.legislature.mi.gov/(S(xguapetbtjv0ggjermuafgi5))/mileg.aspx?page=GetObject&amp;objectname=mcl-769-25a"
                      target="_blank" class="link resources-link">Michigan Legislature, Section 769.25a</a><a
                      href="https://www.michiganradio.org/criminal-justice-legal-system/2022-07-29/state-supreme-court-sets-new-rules-for-sentencing-youth-to-life"
                      target="_blank" class="link resources-link">State Supreme Court sets new rules for sentencing youth to life</a>
              </div>
              <div role="listitem" class="collection-item-6 w-dyn-item">
                  <h4 class="heading">Efren Paredes trial documents</h4>
                  <a href="#" class="link resources-link w-dyn-bind-empty"></a><a id="link2"
                      href="#" class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630b9c16cd03307a949b7e0f_Preliminary%20Exam%20Transcript%20Vol.%201.pdf"
                      target="_blank" class="link resources-link">Preliminary Exam Transcript Vol
                      1</a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630ba086b123fb2cd0c261a2_Preliminary%20Exam%20Transcript%20Vol.%202.pdf"
                      target="_blank" class="link resources-link">Preliminary Exam Transcript Vol
                      2</a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630ba0f078b484a8be8613df_Trial%20Sentencing%20Transcript%20-%2008%2014%2089_small.pdf"
                      target="_blank" class="link resources-link">Trial Transcript - 08 14
                      1989</a>
              </div>
              <div role="listitem" class="collection-item-6 w-dyn-item">
                  <h4 class="heading">
                      Alex Mui trial documents
                  </h4>
                  <a href="#" class="link resources-link w-dyn-bind-empty"></a><a id="link2"
                      href="#" class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630ba7cd64f09a4331f4b5e7_alex%20mui%20presentencing_all.pdf"
                      target="_blank" class="link resources-link">Presentencing hearing</a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630ba58d98758853cb99f23e_alex%20mui%20guilty%20plea.pdf"
                      target="_blank" class="link resources-link">Guilty plea</a>
              </div>
              <div role="listitem" class="collection-item-6 w-dyn-item">
                  <h4 class="heading">
                      Eric Mui trial documents
                  </h4>
                  <a href="#" class="link resources-link w-dyn-bind-empty"></a><a id="link2"
                      href="#" class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630ba8a9e146c8e466cc6c01_eric%20mui%20guilty%20plea_pg1-51.pdf"
                      target="_blank" class="link resources-link">Eric Mui guilty plea</a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630ba8c0b00126dcc3ddd012_Eric%20Mui%20motion%20to%20suppress.pdf"
                      target="_blank" class="link resources-link">Motion to suppress</a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630baa094fa8ae6f8d04b8f4_Eric%20Mui%20pre%20sentencing%20investigation%20report%20pg%201%20-%2043.pdf"
                      target="_blank" class="link resources-link">Presentencing investigation
                      report</a>
              </div>
              <div role="listitem" class="collection-item-6 w-dyn-item">
                  <h4 class="heading">Evidence</h4>
                  <a href="#" class="link resources-link w-dyn-bind-empty"></a><a id="link2"
                      href="#" class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630bab4e57c56a00cf24650b_MSP%20Crime%20Lab%20Reports%20-%20Part%201.pdf"
                      target="_blank" class="link resources-link">Crime Lab report</a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630bab93cd0330c8779c6d57_Fingerprint_documents_Val1-4.pdf"
                      target="_blank" class="link resources-link">Fingerprints</a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630bac0b7ed27f48a0f360c1_witness_statements_all.pdf"
                      target="_blank" class="link resources-link">Witness statements</a>
              </div>
              <div role="listitem" class="collection-item-6 w-dyn-item">
                  <h4 class="heading">
                      Press coverage
                  </h4>
                  <a href="#" class="link resources-link w-dyn-bind-empty"></a><a id="link2"
                      href="#" class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a href="#"
                      class="link resources-link w-dyn-bind-empty"></a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630bac6ea377265d82889959_Newspaper%20Articles%20RE%20Efren%20Paredes%20Jr1.pdf"
                      target="_blank" class="link resources-link">Newspaper Articles part 1</a><a
                      href="https://uploads-ssl.webflow.com/62d643985f63b74fb0b79da0/630bac80c30273afcdaa63e2_Newspaper%20Articles%20RE%20Efren%20Paredes%20Jr2.pdf"
                      target="_blank" class="link resources-link">Newspaper Articles part 2</a><a
                      href="#" class="link resources-link w-dyn-bind-empty">
              </div>
          </div>
      </div>
  </div>
  `;

    typeString = new Typewriter('#resourcesContent', {
        loop: false,
        cursor: '',
        delay: 3,
    });

    typeString.pasteString(typedString).start();
}
//////////////////////////////////////////////////////////////

// VIDEO_SIZE_FUNCTIONS:
function makeSmall(plyr) {
    clearTimeout(fadeMenuTimer);
    let swiper_slide = $(plyr.swiper_slide);

    fadeMenuTimer = setTimeout(function () {
        if (index_page_clicked) {
            $('#content_text').fadeTo(1000, 1.0);
            $('#upButton').fadeTo(1000, 1.0);
            $('#downButton').fadeTo(1000, 1.0);
        }
    }, 1000);

    // making small from medium
    // CASE_1: there is a medium player and user hovered out of it
    if (
        (swiper_slide.hasClass('mediumVideo') &&
            currentMediumVideoPlayer == plyr) ||
        (swiper_slide.hasClass('largeVideo') && currentLargeVideoPlayer == plyr)
    ) {
        swiper_slide.removeClass('mediumVideo');
        swiper_slide.removeClass('largeVideo');
        vw = Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
        );

        if ($(window).width() > 400) {
            swiper_slide.css({ 'min-width': '1vw' });
        } else {
            swiper_slide.css({ 'min-width': '20vw' });
        }

        // lower volume to 0
        fadeAudio(plyr, 0);
        // pause the video after ms it takes to return to small
        if ($(window).width() > 400) {
            // if desktop
            plyr.player_poster.style.opacity = '1';
        }
        setTimeout(function () {
            // clearInterval(updateInterval);
            plyr.progressbardiv.style.display = 'none';
            plyr.durationdiv.style.display = 'flex';
            // hide controls
            // plyr.player_controls.style.display = "none";
            plyr.restart();
            plyr.pause();
        }, 1000);

        // hide the description
        let description = $(plyr.card_description);
        description.fadeOut(400);
        // update global variables
        currentMediumVideoPlayer = null;
        currentLargeVideoPlayer = null;
    }
}

function closeAndSwipe(plyr) {
    swiper_slide = $(plyr.swiper_slide);
    if (swiper_slide.hasClass('largeVideo')) {
        swiper_slide.removeClass('largeVideo');

        if ($(window).width() > 400) {
            swiper_slide.css({ 'min-width': '1vw' });
        } else {
            swiper_slide.css({ 'min-width': '20vw' });
        }
        // lower volume to 0
        fadeAudio(plyr, 0);
        // pause the video after ms it takes to return to small
        setTimeout(function () {
            plyr.pause();
            clearInterval(updateInterval);
            moveToSlide(plyr.media_index + 4, false, 1000);
        }, 1000);
        // hide the description
        $(plyr.card_description).fadeOut(300);
        // update global variables
        currentLargeVideoPlayer = null;
    }
}

function makeMedium(plyr) {
    clearTimeout(fadeMenuTimer);
    function med() {
        let swiper_slide = $(plyr.swiper_slide);

        // fade audio to 0.4
        fadeAudio(plyr, 0.4);

        $('.swiper-wrapper').css({ 'margin-bottom': '10vh' });
        $('.swiper-wrapper')
            .promise()
            .done(function () {
                $('#swiper').fadeTo(1000, 1);
                $('.swiper-button-prev').css({ bottom: '20vh' });
                $('.swiper-button-next').css({ bottom: '20vh' });
            });

        // making medium from small size
        // CASE_1: there is no medium or large player, make medium from small
        if (
            !swiper_slide.hasClass('mediumVideo') &&
            !swiper_slide.hasClass('largeVideo') &&
            currentMediumVideoPlayer == null &&
            currentLargeVideoPlayer == null
        ) {
            // making current small player to medium..
            swiper_slide.addClass('mediumVideo');
            swiper_slide.css({ 'min-width': '35vw' });

            // fade in the description
            setTimeout(function () {
                if (currentMediumVideoPlayer == plyr) {
                    $(plyr.card_description).fadeIn(600);
                } else {
                    $(plyr.card_description).hide();
                }
            }, 600);
            // update global variable
            currentMediumVideoPlayer = plyr;
            currentLargeVideoPlayer = null;
        }

        // CASE_2: there is a large player and user clicked on it
        if (
            swiper_slide.hasClass('largeVideo') &&
            currentLargeVideoPlayer == plyr
        ) {
            // making current small player to medium..
            swiper_slide.removeClass('largeVideo');
            swiper_slide.addClass('mediumVideo');
            swiper_slide.css({ 'min-width': '35vw' });
            // update global variables
            currentMediumVideoPlayer = plyr;
            currentLargeVideoPlayer = null;
        }
    }

    $('#swiper').fadeTo(1000, 1.0);
    if (menu_item_text_visible) {
        fadeMenuTimer = setTimeout(function () {
            if (index_page_clicked) {
                $('#content_text').fadeTo(1000, 0.3);
                $('#upButton').fadeTo(1000, 0.3);
                $('#downButton').fadeTo(1000, 0.3);
            } else {
                $('#content_text').fadeTo(1000, 0.0);
                $('#upButton').fadeTo(1000, 0.0);
                $('#downButton').fadeTo(1000, 0.0);
            }
        }, 1000);
        med();
    } else {
        med();
    }
    currentLargeVideoPlayer = null;
}

function makeLarge(plyr) {
    clearTimeout(fadeMenuTimer);
    if (index_page_clicked) {
        $('#content_text').fadeTo(1000, 0.0);
        $('#upButton').fadeTo(1000, 0.0);
        $('#downButton').fadeTo(1000, 0.0);
        // $('#content_text').promise().done(function(){
        // $('#content_text').hide();
        // document.getElementById("content_text").innerHTML = "";
        // });
    }

    let swiper_slide = $(plyr.swiper_slide);
    if (swiper_slide.hasClass('mediumVideo')) {
        swiper_slide.removeClass('mediumVideo');
        swiper_slide.addClass('largeVideo');
        currentMediumVideoPlayer = null;
        currentLargeVideoPlayer = plyr;
        swiper_slide.css({ 'min-width': '70vw' });

        // TODO:
        // if ($(window).width() > 400) {
        //     // if desktop
        //     setTimeout(function () {
        //         plyr.player_poster.style.opacity = '0';
        //     }, 700);
        // }

        // play video
        // fade audio to full volume
        fadeAudio(plyr, 1);
        // move largeVideo to center and make it active
        if (initialSlide != plyr.media_index - currentStartIndex) {
            moveToSlide(plyr.media_index, false, 1000);
        }
        // show progress bar
        plyr.progressbardiv.style.display = 'block';
        // hide duration div
        plyr.durationdiv.style.display = 'none';
        // hide controls
        // plyr.player_controls.style.display = "none";
        // update progress baras video is playing
        updateInterval = setInterval(function () {
            currenttime = plyr.currentTime;
            percentage = currenttime / plyr.duration;
            plyr.progressbar.set(percentage);
        }, 20);

        // plyr.play();

        function checkSize() {
            console.log('checking size..');
            if (
                Math.abs(
                    vw_convert(70) - parseFloat(swiper_slide.css('min-width'))
                ) > 0.5
            ) {
                console.log('running..');
                setTimeout(checkSize, 100);
            } else if (
                Math.abs(
                    vw_convert(70) - parseFloat(swiper_slide.css('min-width'))
                ) < 1.5
            ) {
                console.log('REACHED.. CLEARING INTERVAL');
                // player_plyrposter.style.opacity = '0';

                plyr.player_poster.style.opacity = '0';
                plyr.play();
            }
        }
        checkSize();

        // if ($(window).width() > 400) {
        //     // if desktop
        //     plyr.player_poster.style.opacity = '0';
        // }
    }
}

function fadeAudio(plyr, targetVolume) {
    fadeIn = false;
    if (plyr.volume < targetVolume) {
        fadeIn = true;
    } else if (plyr.volue > targetVolume) {
        fadeIn = false;
    }
    var fadeAudio = setInterval(function () {
        fading_audio = true;
        // Only fade if past the fade out point or not at zero already
        // When volume close to zero stop all the intervalling
        if (Math.abs(plyr.volume - targetVolume) >= 0.05) {
            if (fadeIn) {
                plyr.volume += 0.05;
            } else {
                plyr.volume -= 0.05;
            }
        } else {
            fading_audio = false;
            clearInterval(fadeAudio);
        }
    }, 50);
}

function makeSlide(i) {
    let vimeoID = video_media_array[i]['Vimeo ID'];
    let videoTitle = video_media_array[i]['Subject Name'];
    let videoDuration = video_media_array[i]['Video Duration'];
    let videoDescription = video_media_array[i]['Video Description'];

    // <div class='js-player' data-plyr-provider='vimeo' data-plyr-embed-id='${vimeoID}'></div>
    htmlstring = `<div role='listitem' class='swiper-slide'>
        <div class='card_video'>
          <div class='w-embed'>
            <div class="plyr__video-embed js-player">
              <iframe
                src="https://player.vimeo.com/video/${vimeoID}?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media"
                allowfullscreen
                allowtransparency
                allow="autoplay"
              ></iframe>
            </div>
          </div>
        </div>
        <div class='card_description'>
          <div class='video-top-div'>
            <div class='video-title'>${videoTitle}</div>
            <div class='video-duration'>${videoDuration}</div>
          </div>
          <div class='video-description'>
          ${videoDescription}
          </div>
        </div>
      </div>`;

    return htmlstring;
}

//////////////////////////////////////////////////////////////
// INITIALIZE_SWIPER:
function initSwiper() {
    swiper = new Swiper('#swiper', {
        runCallbacksOnInit: false,
        loop: false,
        slidesPerView: currentEndIndex - 1 - bufferSize * 2,
        initialSlide: initialSlide,
        slidesPerGroup: 1,
        // preventInteractionOnTransition: true,
        speed: 1000,
        slideToClickedSlide: false,
        centeredSlides: true,
        setWrapperSize: true,
        watchSlidesProgress: true,
        allowTouchMove: false,
        preloadImages: true,
        fullscreen: { enabled: false },
        on: {
            resize: function () {
                resizing = true;
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    resizing = false;
                }, 100);
            },
            slideNextTransitionEnd: function () {
                next();
                if (is_on_edge_right) {
                    moveToSlide(
                        ((currentStartIndex + initialSlide) %
                            video_media_array.length) +
                            1,
                        true,
                        move_one_slide_time
                    );
                } else if (is_on_edge_left) {
                    moveToSlide(
                        ((currentStartIndex + initialSlide) %
                            video_media_array.length) -
                            1,
                        true,
                        move_one_slide_time
                    );
                }
            },
            slidePrevTransitionEnd: function () {
                prev();
                if (is_on_edge_left) {
                    moveToSlide(
                        ((currentStartIndex + initialSlide) %
                            video_media_array.length) -
                            1,
                        true,
                        move_one_slide_time
                    );
                } else if (is_on_edge_right) {
                    moveToSlide(
                        ((currentStartIndex + initialSlide) %
                            video_media_array.length) +
                            1,
                        true,
                        move_one_slide_time
                    );
                }
            },
        },
        freeMode: {
            enabled: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        spaceBetween: 8,
    });
}

// INITIALIZE_MEDIA:
async function fetchCSV() {
    // get video info from csv file
    const res = await fetch('video_media_neworder.csv');
    video_media_array_text = await res.text();
    video_media_array = $.csv.toObjects(video_media_array_text);
    video_media_array_index = $.csv.toObjects(video_media_array_text);
    // video_media_array_index.sort((a, b) => a["Subject Name"].localeCompare(b["Subject Name"]))
    video_media_array.sort(
        (a, b) => a['Order in Scrolly Reel'] - b['Order in Scrolly Reel']
    );
    // video_media_array = shuffle(video_media_array);

    for (var i = 0; i < video_media_array.length; i++) {
        for (var j = 0; j < video_media_array_index.length; j++) {
            if (
                video_media_array[i]['Subject Name'] ==
                    video_media_array_index[j]['Subject Name'] &&
                video_media_array[i]['Vimeo ID'] ==
                    video_media_array_index[j]['Vimeo ID']
            ) {
                video_media_array_index[j].slider_index = i;
            }
        }
    }

    // console.log(video_media_array_index);
    // get audio info from csv file
    const resaudio = await fetch('audio_media.csv');
    audio_media_array = await resaudio.text();
    audio_media_array = $.csv.toObjects(audio_media_array);
    // create video players
    for (var i = currentStartIndex; i <= currentEndIndex; i++) {
        let vimeoID = video_media_array[i]['Vimeo ID'];
        let videoTitle = video_media_array[i]['Subject Name'];
        let videoDuration = video_media_array[i]['Video Duration'];
        let videoDescription = video_media_array[i]['Video Description'];
        htmlstring = makeSlide(i);
        $('.swiper-wrapper').append(htmlstring);
    }
    // you can init swiper now that the swiper-slide class is in the html
    await initSwiper();
    // determine the unclickable_slides indices
    // for (var i = 0; i < unclickable_slides_amount; i++) {
    //   // unclickable_slides.push((swiper.visibleSlidesIndexes[0 + i])-(bufferSize)-unclickable_slides_amount);
    //   // unclickable_slides.push((swiper.visibleSlidesIndexes[(swiper.visibleSlidesIndexes.length-1) - i] + (bufferSize+1) - unclickable_slides_amount+1));
    //   unclickable_slides.push((swiper.visibleSlidesIndexes[0 + i])-(bufferSize+1));
    //   unclickable_slides.push((swiper.visibleSlidesIndexes[(swiper.visibleSlidesIndexes.length-1) - i] + (bufferSize+1)));
    // }

    // hard coding the unclickable slides
    unclickable_slides = [0, 1, 2, 3, 14, 13, 12, 11];
    // init all video players
    const players = Plyr.setup('.js-player', {
        controls: playerControls,
        debug: false,
        clickToPlay: false,
        vimeo: vimeoOptions,
    });
    // hide all video players to start
    for (var i = 0; i < players.length; i++) {
        player = players[i];
        // console.log(player);

        player.elements.container.style.visibility = 'hidden';

        // add player entry to video_media_array
        if (i < currentEndIndex + 1) {
            video_media_array[i].player = player;
            video_media_array[i].player.media_index = i;
            if (unclickable_slides.includes(i)) {
                video_media_array[i].player.unclickable = true;
            }
        }
        // once player is ready, add its event listeners, etc.
        playerOnReady(player);
    }

    for (var i = 0; i < swiper.slides.length; i++) {
        let volume = 0;

        if (i < 2 || swiper.slides.length - i < 3) {
            volume = 0;
        } else if (i < initialSlide) {
            volume = i / (swiper.slides.length - initialSlide);
        } else if (i == initialSlide) {
            volume = 1;
        } else if (i > initialSlide) {
            volume =
                1 -
                ((i + 1) % initialSlide) /
                    (swiper.slides.length - initialSlide);
        }

        audio_amounts.push(volume);
    }
}

//////////////////////////////////////////////////////////////
// AFTER_DOM_CONTENT_IS_LOADED:
document.addEventListener('DOMContentLoaded', () => {
    // $(".menu-text").css("color", "black");

    $('#menuDiv').hide();
    // hide the border prev and next buttons
    $('.borderprev').hide();
    $('.bordernext').hide();
    // add the move transition behaviour
    // $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
    // hide menu item content text
    $('#content_text').hide();
    // hide menu item content arrow buttons
    $('#upButton').hide();
    $('#downButton').hide();
    scrollDown = $('#downButton');
    scrollUp = $('#upButton');

    scrollDown.mousedown(function () {
        var y = $('#tabContent').scrollTop();
        $('#tabContent').animate({ scrollTop: y + 150 }, 'slow');
    });
    scrollUp.mousedown(function () {
        var y = $('#tabContent').scrollTop();
        $('#tabContent').animate({ scrollTop: y - 150 }, 'slow');
    });
    // hide swiper arrows
    $('.swiper-button-next').hide();
    $('.swiper-button-prev').hide();
    // hide intro screen elements, because they will be faded in
    $('.continue-button').hide();
    $('.tab-content-container').hide();
    // prevent mouse events on swiper
    document.getElementById('swiper').style.pointerEvents = 'none';
    // show the intro text container
    $('.loading-container').show();
    // load videos
    fetchCSV();
    // 2 seconds later after DOMContentent is loaded, add click listener and show intro
    setTimeout(() => {
        // start typewriter animation
        typewriterTitle.start();
        // skip animation after click
        document.addEventListener(
            'click',
            function () {
                // just show all the intro text
                document.getElementById('typedTitle').style.display = 'none';
                document.getElementById('typedTitleSkip').style.display =
                    'block';
                document.getElementById('typedWords').style.display = 'none';
                document.getElementById('typedWordsSkip').style.display =
                    'inline';
                $('.continue-button').show();
                document.addEventListener(
                    'click',
                    function () {
                        $('.continue-button').click();
                    },
                    { once: true }
                );
            },
            { once: true }
        );
    }, 2400);

    $('.borderprev').mouseenter(function () {
        is_on_edge_left = true;
        moveToSlide(
            ((currentStartIndex + initialSlide) % video_media_array.length) - 1,
            true,
            move_one_slide_time
        );

        index_page_clicked = false;
        $('#content_text').fadeTo(1000, 0.0);
        $('#upButton').fadeTo(1000, 0.0);
        $('#downButton').fadeTo(1000, 0.0);

        $('#content_text')
            .promise()
            .done(function () {
                document.getElementById('content_text').innerHTML = '';
            });
    });
    $('.borderprev').mouseleave(function () {
        is_on_edge_left = false;
    });
    $('.bordernext').mouseenter(function () {
        is_on_edge_right = true;
        moveToSlide(
            ((currentStartIndex + initialSlide) % video_media_array.length) + 1,
            true,
            move_one_slide_time
        );

        index_page_clicked = false;
        $('#content_text').fadeTo(1000, 0.0);
        $('#upButton').fadeTo(1000, 0.0);
        $('#downButton').fadeTo(1000, 0.0);

        $('#content_text')
            .promise()
            .done(function () {
                document.getElementById('content_text').innerHTML = '';
            });
    });
    $('.bordernext').mouseleave(function () {
        is_on_edge_right = false;
    });
});

//////////////////////////////////////////////////////////////
// INTRO:
// helper function for splitting strings
function stringSplitter(string) {
    str_array = string.split(/(\s+)/).filter(function (e) {
        return e.trim().length > 0;
    });
    return str_array;
}

// Type the title after video players are loaded
var typedTitle = document.getElementById('typedTitle');
var typewriterTitle = new Typewriter(typedTitle, {
    loop: false,
    cursor: '',
    delay: 50,
});

// Type the project text after the title
var typedWords = document.getElementById('typedWords');
var typewriter = new Typewriter(typedWords, {
    loop: false,
    cursor: '',
    delay: 1,
});

// intro text body
typedText =
    'Half Truths and Full Lies tells a story about story. Stories are at the heart of the American criminal legal system and jury trials are storytelling contests. Every argument is a story and every lawyer and witness are storytellers who craft a narrative from pieces of information that have been deemed evidence.';
stringArray = stringSplitter(typedText);
for (var i = 0; i < stringArray.length; i++) {
    typewriter.pasteString(stringArray[i] + ' ');
}
typewriter
    .pauseFor(1000)
    .typeString(
        ' <br><br> Half Truths and Full Lies explores the case of Efren Paredes, a Latinx man from Michigan sentenced to life without parole at age 15 for a murder he claims he didn&#39;t commit.'
    )
    .pauseFor(1000)
    .callFunction(() => {
        $('.continue-button').show();
    });

// start to write the intro text
typewriterTitle
    .typeString('Half Truths <b>and</b> Full Lies')
    .pauseFor(1000)
    .callFunction(() => {
        typewriter.start();
    });

//////////////////////////////////////////////////////////////
// AFTER_INTRO:
// events that happen after the continue button is clicked
$('.continue-button').on('click', function () {
    menu_button[0].click();
    menu_button[0].click();

    afterIntro = true;
    $('.menu-text').css('color', 'white');

    $('.borderprev').show();
    $('.bordernext').show();

    $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });

    $('.continue-button').fadeOut(200);
    $('.continue-button')
        .promise()
        .done(function () {
            $('.continue-button').hide();
            $('.continue-button').css('opacity', '0');
            setTimeout(function () {
                $('#typedWords').fadeOut(800);
                $('#typedWordsSkip').fadeOut(800);
                // $('.continue-button').css("display", "none");
            }, 600);
            setTimeout(function () {
                $('#typedTitle').fadeOut(1000);
                $('#typedTitleSkip').fadeOut(1000);
            }, 1400);
            setTimeout(function () {
                $('.loading-container').hide();
                // fade in the controls
                $('.tab-content-container').fadeIn(3500);
                $('.swiper-button-prev').fadeIn(3500);
                $('.swiper-button-next').fadeIn(3500);
                $('#menuDiv').fadeIn(3500);
                // $('#upButton').show();
                // $('#downButton').show();
            }, 2600);
        });
    document.getElementById('swiper').style.pointerEvents = 'auto';
});

//////////////////////////////////////////////////////////////
// MENU:
menu_text = document.getElementsByClassName('menu-text');
menu_button = document.getElementsByClassName('lottieanimation');
menu_button[0].onclick = function () {
    if (currentLargeVideoPlayer) {
        makeSmall(currentLargeVideoPlayer);
    }
    let right_padding =
        $(window).width() -
        ($('.menu-button').offset().left + $('.menu-button').width());
    $('.tab-menu').css('padding-right', right_padding);
};
for (var i = 0; i < menu_text.length; i++) {
    menu_text[i].onclick = function () {
        if (afterIntro) {
            $('.swiper-wrapper').css({ transition: 'all 0.5s linear' });
            // reset menu content text
            document.getElementById('content_text').innerHTML = '';
            // temporary fix to make menu close after clicking on a menu item
            menu_button[0].click();
            // get the menu item that was clicked
            let thisItem = $(this);
            // fade in the menu item content
            $('#content_text').fadeTo(1000, 1.0);

            $('.arrow-buttons-div').css('display', 'block');
            $('.arrow-buttons-div').fadeTo(1000, 1.0);
            $('#upButton').fadeTo(1000, 1.0);
            $('#downButton').fadeTo(1000, 1.0);

            // menu item content is now visible
            menu_item_text_visible = true;
            menuItem = thisItem[0].innerText;

            $('#swiper').fadeTo(1000, 0.4);

            if (menuItem == 'Index') {
                index_page_clicked = true;

                $('#swiper')
                    .promise()
                    .done(function () {
                        $('.swiper-wrapper').css({ 'margin-bottom': '0vh' });
                        $('.swiper-button-prev').css({ bottom: '15vh' });
                        $('.swiper-button-next').css({ bottom: '15vh' });
                        index();
                    });
            } else {
                $('#swiper')
                    .promise()
                    .done(function () {
                        $('.swiper-wrapper').css({ 'margin-bottom': '0vh' });
                        $('.swiper-button-prev').css({ bottom: '15vh' });
                        $('.swiper-button-next').css({ bottom: '15vh' });
                    });
                index_page_clicked = false;
            }
            if (menuItem == 'About the case') {
                aboutTheCase();
            }
            if (menuItem == 'About the project') {
                aboutTheProject();
            }
            if (menuItem == 'Audio files') {
                audioFiles();
            }
            if (menuItem == 'Resources') {
                resources();
            }
        }
    };
}

// temporary fix for button on resize bug
function resizedw() {
    document.body.click();
    menu_button[0].click();
    menu_button[0].click();
    let right_padding =
        $(window).width() -
        ($('.menu-button').offset().left + $('.menu-button').width());
    $('.tab-menu').css('padding-right', right_padding);
    // add the move transition behaviour
    $('.swiper-wrapper').css({ transition: 'all 0.5s linear' });
}

let winresizeTimer;
function reportWindowSize() {
    clearTimeout(winresizeTimer);
    winresizeTimer = setTimeout(resizedw, 100);
}

window.onresize = reportWindowSize;

$(document).click(function (event) {
    var target = $(event.target);
    if (target.attr('class')) {
        if (
            !target.hasClass('plyr__poster') &&
            !target.hasClass('video-top-div') &&
            !target.hasClass('video-description') &&
            !target.hasClass('plyr__control') &&
            !target.hasClass('plyr__controls') &&
            currentMediumVideoPlayer
        ) {
            makeSmall(currentMediumVideoPlayer);
        }
        if (
            !target.hasClass('plyr__poster') &&
            !target.hasClass('video-top-div') &&
            !target.hasClass('video-description') &&
            !target.hasClass('plyr__control') &&
            !target.hasClass('plyr__controls') &&
            currentLargeVideoPlayer
        ) {
            makeSmall(currentLargeVideoPlayer);
        }
    }
});

console.log('Hi Nick!');
