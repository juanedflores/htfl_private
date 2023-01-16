//////////////////////////////////////////////////////////////
//* [GLOBAL VARIABLES] *//
let currentMediumVideoPlayer = null;
let currentLargeVideoPlayer = null;
let hoverTimerArray = [];
let swiper;
let menuEnterTimer, menuLeaveTimer, resizeTimer;
let updateInterval;
let backgroundClick;
let resizing = false;
let skipped = false;
let video_media_array;
let currentStartIndex = 0;
let currentEndIndex = 20;

//////////////////////////////////////////////////////////////
//* [HELPER FUNCTIONS] *//
function makeSmall(element, plyr) {
  if (element.hasClass("mediumVideo")){
    element.removeClass('mediumVideo');
    element.css({ 'min-width' : '10vw' });
    // lower volume to 0
    fadeAudio(plyr, 0);
    // pause the video after ms it takes to return to small
    setTimeout(function() {
      plyr.pause();
      clearInterval(updateInterval);
      let progressbar = plyr.elements.container.offsetParent.offsetParent.lastElementChild.children[0].children[2];
      let durationdiv = plyr.elements.container.offsetParent.offsetParent.lastElementChild.children[0].children[1];
      progressbar.style.display = "none";
      durationdiv.style.display = "flex";
    }, 1400);
    // hide the description
    let description = $(element[0].children[1]);
    description.fadeOut(400);
    // update global variables
    currentMediumVideoPlayer = null;
  } 
}

function makeSmallLarge(element, plyr, element2, plyr2) {
  if (element.hasClass("largeVideo")){
    element.removeClass('largeVideo');
    element.css({ 'min-width' : '10vw' });
    // lower volume to 0
    fadeAudio(plyr, 0);
    // pause the video after ms it takes to return to small
    setTimeout(function() {
      plyr.pause();
      clearInterval(updateInterval);
      makeMedium(element2, plyr2);
    }, 1400);
    // hide the description
    let description = $(element[0].children[1]);
    description.fadeOut(300);
    // update global variables
    currentLargeVideoPlayer = null;
  } 
}

function makeMedium(element, plyr) {
  // if video is large and not medium
  if (element.hasClass("largeVideo") && !element.hasClass("mediumVideo")){
    element.removeClass('largeVideo');
    element.addClass('mediumVideo');
    currentLargeVideoPlayer = null;
    currentMediumVideoPlayer = plyr;
    element.css({ 'min-width' : '35vw' });
    // fade out the audio
    fadeAudio(plyr, 0.6);
  } 
  // if video is not medium or large
  if (!element.hasClass("mediumVideo") && !element.hasClass("largeVideo") && currentMediumVideoPlayer == null){
    console.log("from small");
    element.addClass('mediumVideo');
    let description = $(element[0].children[1]);
    // fade in the description
    setTimeout(function() {
      if (plyr == currentMediumVideoPlayer) { 
        description.fadeIn(600);
      }
    }, 400);
    // set the size
    element.css({ 'min-width' : '35vw' });
    // update global variable
    currentMediumVideoPlayer = plyr;
  }
}

function makeLarge(element, plyr) {
  if (element.hasClass("mediumVideo")){
    element.removeClass('mediumVideo');
    element.addClass('largeVideo');
    // play video
    plyr.play();
    // fade in audio
    fadeAudio(plyr, 1);

    currentMediumVideoPlayer = null;
    currentLargeVideoPlayer = plyr;
    // move largeVideo to center and make it active
    swiper.slideTo(swiper.clickedIndex);
    element.css({ 'min-width' : '70vw' });
    // show progress bar
    let progressbar = plyr.elements.container.offsetParent.offsetParent.lastElementChild.children[0].children[2];
    let durationdiv = plyr.elements.container.offsetParent.offsetParent.lastElementChild.children[0].children[1];
    progressbar.style.display = "block";
    durationdiv.style.display = "none";

    updateInterval = setInterval(function() {
      currenttime = plyr.currentTime;
      percentage = (currenttime / plyr.duration);
      plyr.progressbar.set(percentage);
    }, 100);
  } 
}

function fadeAudio (plyr, targetVolume) {
  fadeIn = false;
  if (plyr.volume < targetVolume) {
    fadeIn = true;
  } else if (plyr.volue > targetVolume) {
    fadeIn = false;
  }
  var fadeAudio = setInterval(function () {
    // Only fade if past the fade out point or not at zero already
    // When volume close to zero stop all the intervalling
    if (Math.abs(plyr.volume - targetVolume) >= 0.05) {
      if (fadeIn) { 
        plyr.volume += 0.05;
      } else {
        plyr.volume -= 0.05;
      }
    } else {
      clearInterval(fadeAudio);
    }
  }, 100);
}

function makeSlide(i) {
  let vimeoID = video_media_array[i]["Vimeo ID"];
  let videoTitle = video_media_array[i]["Subject Name"];
  let videoDuration = video_media_array[i]["Video Duration"];
  let videoDescription = video_media_array[i]["Video Description"];
  htmlstring = 
    `
    <div role="listitem" class="swiper-slide" style="width: 97px; min-width: 10vw; margin-right: 8px">
      <div class="card_video">
        <div class="w-embed">
          <div tabindex="0"
            class="plyr plyr--full-ui plyr--video plyr--vimeo plyr--fullscreen-enabled plyr--paused plyr--stopped plyr--captions-enabled"
            style="visibility: visible">
            <div class="plyr__controls"></div>
            <div class="plyr__video-wrapper plyr__video-embed" style="aspect-ratio: 16 / 9">
              <div class="plyr__video-embed__container" style="transform: translateY(-38.2943%)">
                <iframe
                  src="https://player.vimeo.com/video/${vimeoID}?loop=false&amp;autoplay=false&amp;muted=false&amp;gesture=media&amp;playsinline=true&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=false&amp;customControls=true&amp;background=true"
                  allowfullscreen=""
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
                  title="Player for Stu" data-ready="true" tabindex="-1"></iframe>
              </div>
              <div class="plyr__poster"></div>
            </div>
            <div class="plyr__captions" dir="auto"></div>
          </div>
        </div>
      </div>
      <div class="card_description" style="display: none">
        <div class="video-top-div">
          <div class="video-title">${videoTitle}</div>
          <div class="video-duration" style="display: flex">${videoDuration}</div>
          <div style="display: none" class="progress">
            <svg viewBox="0 0 100 0.1" preserveAspectRatio="none" style="display: block; width: 100%">
              <path d="M 0,0.05 L 100,0.05" stroke="#808080" stroke-width="0.1" fill-opacity="0"></path>
              <path d="M 0,0.05 L 100,0.05" stroke="#FFFFFF" stroke-width="0.1" fill-opacity="0" style="
                                stroke-dasharray: 100px, 100px;
                                stroke-dashoffset: 100px;
                            "></path>
            </svg>
          </div>
        </div>
        <div class="video-description">${videoDescription}</div>
      </div>
    </div>
    `

  return htmlstring;
}

//////////////////////////////////////////////////////////////
//* [INITIALIZE LIBRARIES] *//
// initialize Swiper
swiper = new Swiper('#swiper', {
  runCallbacksOnInit: false,
  loop: false,
  slidesPerView: 9,
  initialSlide: 7,
  slidesPerGroup: 1,
  preventInteractionOnTransition: true,
  speed: 1000,
  slideToClickedSlide: true,
  centeredSlides: true,
  // centeredSlidesBounds: true,
  // centerInsufficientSlides: true,
  setWrapperSize: true,
  // observeSlideChildren: true,
  // observer: true,
  // resizeObserver: true,
  // rewind: true,
  watchSlidesProgress: true,
  allowTouchMove: false,
  // normalizeSlideIndex: false,
  on: {
    resize: function () {
      resizing = true;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizing = false;
      }, 500);
    },
    slideNextTransitionEnd: function () {
      console.log("next");
      currentEndIndex = currentEndIndex+1;
      currentStartIndex = currentStartIndex-1;
      if (currentStartIndex < 0) { 
        currentStartIndex = video_media_array.length-1;
      }
      if (currentEndIndex > video_media_array.length) { 
        currentEndIndex = 0;
      }

      slide = makeSlide(currentEndIndex);
      swiper.appendSlide(slide);
      swiper.removeSlide(0);
      swiper.update()
    },
    slidePrevTransitionEnd: function () {
      console.log("prev");
      currentEndIndex = currentEndIndex+1;
      currentStartIndex = currentStartIndex-1;
      console.log(currentStartIndex);
      console.log(currentEndIndex);
      if (currentStartIndex < 0) { 
        console.log("lower than 0: ");
        currentStartIndex = video_media_array.length-1;
      }
      if (currentEndIndex > video_media_array.length) { 
        console.log("lower than 0: ");
        currentEndIndex = 0;
      }

      slide = makeSlide(currentStartIndex);
      swiper.prependSlide(slide);
      swiper.removeSlide(swiper.slides.length-1);
      swiper.update()
    },
  },
  freeMode: {
    enabled: false,
    // sticky: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  mousewheel: {
    invert: true,
  },
  spaceBetween: 8,
  // breakpoints: {
  //   320: {
  //     // slidesPerView: 4,
  //   },
  //   640: {
  //     // slidesPerView: 8,
  //   },
  //   1024: {
  //     // slidesPerView: 12,
  //   },
  // },
});

// initialize GreenAudioPlayer
GreenAudioPlayer.init({
  selector: '.audio-player', // inits Green Audio Player on each audio container that has class "player"
  stopOthersOnPlay: true,
});

// load CSV data
async function fetchCSV () {
  const res = await fetch('video_media.txt');
  video_media_array = await res.text();
  video_media_array = $.csv.toObjects(video_media_array)
  video_media_array.sort((a, b) => a["Order in Scrolly Reel"] - b["Order in Scrolly Reel"])
  // video_media_array = video_media_array.sort((a,b)=> (a.name > b.name ? 1 : -1))
  // console.log(video_media_array);

  // create video players
  for (var i = currentStartIndex; i <= currentEndIndex; i++) { 
    let vimeoID = video_media_array[i]["Vimeo ID"];
    let videoTitle = video_media_array[i]["Subject Name"];
    let videoDuration = video_media_array[i]["Video Duration"];
    let videoDescription = video_media_array[i]["Video Description"];
    htmlstring = 
      `<div role='listitem' class='swiper-slide'>
        <div class='card_video'>
          <div class='w-embed'>
            <div
              class='js-player'
              data-plyr-provider='vimeo'
              data-plyr-embed-id='${vimeoID}'></div>
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
      </div>`
    // console.log(htmlstring);
    $('.swiper-wrapper').append(htmlstring);
  }

  //* VIDEO PLAYERS *//
  // video player settings
  const playerControls = [
    // 'play',     // Play/pause playback
    // 'progress', // The progress bar and scrubber for playback and buffering
    // 'disabled'
  ];

  const vimeoOptions = {
    // responsive: true,
    // autoplay: false,
    background: true,
    // transparent: false,
    // portrait: false
    // width: 640
  };

  // get all video players
  const players = Plyr.setup('.js-player', { controls: playerControls, debug: false, clickToPlay: false, vimeo: vimeoOptions });

  // hide all video players to start
  for (var i = 0; i < players.length; i++) {
    players[i].elements.container.style.visibility = "hidden";
  }

  // make video player visible when fully loaded (random between 1 second)
  for (var i = 0; i < players.length; i++) {
    // after a video player is ready
    players[i].on('ready', (event) => {
      let player = event.detail.plyr 
      let player_swiper_slide = player.elements.container.offsetParent.offsetParent;
      let player_videocard = player.elements.container.offsetParent.offsetParent.children[0];
      let player_videoTopDiv = player.elements.container.offsetParent.offsetParent.lastElementChild.children[0];
      console.log(player_videocard);

      // add a transition effect
      player_swiper_slide.style.transition = "all 1400ms ease";

      //////////////////////////////////////////////////////////////
      // start the volume at 0.6
      player.volume = 0.6;

      //////////////////////////////////////////////////////////////
      // add the custom progress bar
      progressbardiv = document.createElement('div');
      progressbardiv.style.display = "none";
      progressbardiv.setAttribute("class","progress");
      player_videoTopDiv.onclick = function clickEvent(e) {
        let progressbar = player.elements.container.offsetParent.offsetParent.lastElementChild.children[0].children[2];
        var parentwidth = progressbar.offsetWidth;
        if (e.target != player.elements.container.offsetParent.offsetParent.lastElementChild.children[0].children[0]) {
          clearInterval(updateInterval);
          var rect = e.target.getBoundingClientRect();
          var x = e.clientX - rect.right; //x position within the element.
          player.currentTime = player.duration * (1-(Math.abs(x) / parentwidth));
          player.progressbar.set((1-(Math.abs(x) / parentwidth)));
          // updateInterval = setInterval(function() {
          //   currenttime = player.currentTime;
          //   percentage = (currenttime / player.duration);
          //   player.progressbar.set(percentage);
          // }, 100);
        } else {
          console.log("no match");
        }
      }
      player_videoTopDiv.append(progressbardiv);

      var progressbar = new ProgressBar.Line(progressbardiv, {
        color: '#FFFFFF',
        trailColor: '#808080',
        strokeWidth: 0.1
      });

      progressbar.set(0.0);
      player.progressbar = progressbar;

      //////////////////////////////////////////////////////////////
      //* [MOUSE EVENTS FOR SLIDER] *//
      // add mouse events 
      let showDelay = 1000, hideDelay = 1000;
      player_swiper_slide.addEventListener('mouseenter', function() {
        let thisItem = $(this);
        // whenever any video slide is hovered hide the upper body except menu
        $('#tabContent').fadeOut(500);
        // update hoverTimer to prevent fast moving of mouse
        // TODO

        // clearTimeout(resizeTimer);
        if (menuLeaveTimer != null && currentMediumVideoPlayer != null && !resizing) {
          clearTimeout(menuLeaveTimer);
          prevPlayer = $(currentMediumVideoPlayer.elements.container.offsetParent.offsetParent);
          // if any other medium is active
          makeSmall(prevPlayer, currentMediumVideoPlayer);
          // make the currently hovered video medium
          makeMedium(thisItem, player);
        } 
        else if (currentLargeVideoPlayer) {
          console.log("return");
        }
        else {
          // add active class after a delay
          menuEnterTimer = setTimeout(function() {
            makeMedium(thisItem, player);
          }, showDelay);
        }
      });

      // triggered when user's mouse leaves the menu item
      player_swiper_slide.addEventListener('mouseleave', function() {
        let thisItem = $(this);
        // clear the opposite timer
        clearTimeout(menuEnterTimer);
        // remove active class after a delay
        menuLeaveTimer = setTimeout(function() {
          makeSmall(thisItem, player);
        }, hideDelay);

        // TODO: add event listener for background click
        if (currentLargeVideoPlayer != null && currentMediumVideoPlayer == null){
          backgroundClick = document.addEventListener('click', function() {
            let player_swiper_slide = currentLargeVideoPlayer.elements.container.offsetParent.offsetParent;
            player_swiper_slide = $(player_swiper_slide);
            makeMedium(player_swiper_slide, currentLargeVideoPlayer);
          }, { once: true });
        }

      });

      player_videocard.addEventListener('click', function() {
        let thisItem = $(player_swiper_slide);
        // if the clicked video is currently small, make medium
        if(currentMediumVideoPlayer == null && currentLargeVideoPlayer == null) {
          makeMedium(thisItem, player);
        } 
        // if the clicked video is currently medium, make large
        else if(thisItem.hasClass("mediumVideo")) {
          makeLarge(thisItem, player);
        } 
        // if the clicked video is currently large, make medium
        else if (thisItem.hasClass("largeVideo")){
          makeMedium(thisItem, player);
        } 
        else if (currentLargeVideoPlayer) {
          if (thisItem != currentLargeVideoPlayer.elements.container.offsetParent.offsetParent) {
            console.log("different")
          } else {
            console.log("same")
          }
          let player_swiper_slide = $(currentLargeVideoPlayer.elements.container.offsetParent.offsetParent);
          makeSmallLarge(player_swiper_slide, currentLargeVideoPlayer, thisItem, player);
        }
      });

      random_Time = Math.random() * 1000;
      // show video players at a random time
      setTimeout(() => {
        player.elements.container.style.visibility = "visible";
      }, random_Time);
    });
  }
}


//////////////////////////////////////////////////////////////
//* [AFTER DOM CONTENT IS LOADED] *//
document.addEventListener('DOMContentLoaded', () => {
  $('.continue-button').hide();
  $('.tab-content-container').hide();
  $('.tab-menu').hide();
  $('.swiper-button-next').hide();
  $('.swiper-button-prev').hide();
  document.getElementById("swiper").style.pointerEvents = 'none'; // disable swiper

  // load videos
  fetchCSV();

  // after DOMContentent is loaded, add click listener
  setTimeout(() => {
    $('.loading-container').show();
    // start typewriter animatino after the container is loaded
    typewriterTitle.start();
    // skip animation after click
    document.addEventListener('click', function() {
      if (!skipped) {
        skipped = true;
        document.getElementById('typedTitle').style.display = 'none';
        document.getElementById('typedTitleSkip').style.display = 'block';
        document.getElementById('typedWords').style.display = 'none';
        document.getElementById('typedWordsSkip').style.display = 'inline';
        $('.continue-button').show();
        skipped = true;
      } else if (skipped) {
        $(".continue-button").click();
      }
    });
  }, 2000);
});

//////////////////////////////////////////////////////////////
//* [TYPEWRITER] *//
// helper function for splitting strings
function stringSplitter(string) {
  str_array = string.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );;
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
typedText = "In 1989, at age 15, Efrén Paredes, Jr. was convicted for a murder and armed robbery. The crime took place in St. Joseph, Michigan, at a local store where Efrén was working at the time. According to Efrén and his family, on the night of the crime, after completing his work at the store, he was brought home by the store’s manager. A short time later the store was robbed and the manager was murdered. The case against Efrén was based primarily on the statements of other youths who received reduced charges and sentences in exchange for their testimony. Efrén’s mother’s testimony, who claims that she had witnessed his return home before the murder was committed, was discarded. Efrén was sentenced to two life without parole sentences and one parolable life sentence."
stringArray = stringSplitter(typedText);
for (var i = 0; i < stringArray.length; i++) {
  typewriter.pasteString(stringArray[i] + " ");
}
typewriter
  .pauseFor(1000)
  .typeString(' <br><br> He is currently 49 years-old.')
  .pauseFor(1000)
  .callFunction(() => {
    $('.continue-button').show();
    skipped = true;
  });

// start to write the intro text
typewriterTitle.typeString('Half Truths <b>and</b> Full Lies').pauseFor(1000).callFunction(() => {
  typewriter.start();
});


//////////////////////////////////////////////////////////////
//* [END OF INTRO] *//
// events that happen after the continue button is clicked
$('.continue-button').on('click', function() {
  $('.continue-button').fadeOut(600);
  setTimeout(function() {
    $('#typedWords').fadeOut(800);
    $('#typedWordsSkip').fadeOut(800);
  }, 600);
  setTimeout(function() {
    $('#typedTitle').fadeOut(1000);
    $('#typedTitleSkip').fadeOut(1000);
  }, 1400);
  setTimeout(function() {
    $('.loading-container').hide();
    $('.tab-content-container').fadeIn(3500);
  }, 2600);
  afterIntro();
});

//////////////////////////////////////////////////////////////
//* [AFTER INTRO] *//
function afterIntro() {
  // activate video slider (make it interactible with mouse)
  document.getElementById("swiper").style.pointerEvents = 'auto';
  // when upper body is hovered
  $('.section').hover(
    // if there is no current medium or large video, fade in body info
    function() {
      if (currentLargeVideoPlayer == null && currentMediumVideoPlayer == null) {
        $('#tabContent').fadeIn(500);
      }
    }
  );
  // show swiper buttons
  $('.swiper-button-next').show();
  $('.swiper-button-prev').show();
}

//////////////////////////////////////////////////////////////




























{
  /* AUDIO PLAYER */
}
$('.audio-container').hover(
  function() {
    // $(this).find('.holder').fadeIn(200);
    // $(this).find('.controls').fadeIn(200);
  },
  function() {
    // $(this).find('.controls').hide();
    // $(this).find('.holder').hide();
  }
);

{
  /* up/down button settings */
}
var timeoutDown,
  clickerDown = $('#downButton');
var timeoutUp,
  clickerUp = $('#upButton');
var count = 0;

clickerDown.mousedown(function() {
  timeoutDown = setInterval(function() {
    document.getElementById('tabContent').scrollTop += 5;
  }, 50);

  return false;
});

$(document).mouseup(function() {
  clearInterval(timeoutDown);
  return false;
});

clickerUp.mousedown(function() {
  timeoutUp = setInterval(function() {
    document.getElementById('tabContent').scrollTop -= 5;
  }, 50);

  return false;
});

$(document).mouseup(function() {
  clearInterval(timeoutUp);
  return false;
});
