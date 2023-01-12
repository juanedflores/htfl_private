//////////////////////////////////////////////////////////////
//* [GLOBAL VARIABLES] *//
let currentMediumVideoPlayer = null;
let currentLargeVideoPlayer = null;
let hoverTimerArray = [];
let swiper;
let menuEnterTimer, menuLeaveTimer, resizeTimer;
let backgroundClick;
let resizing = false;
let skipped = false;

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

//////////////////////////////////////////////////////////////
//* [INITIALIZE LIBRARIES] *//
// initialize Swiper
swiper = new Swiper('#swiper', {
  loop: false,
  initialSlide: 5,
  slidesPerView: 'auto',
  slidesPerGroup: 1,
  preventInteractionOnTransition: true,
  centeredSlides: true,
  // centeredSlidesBounds: true,
  slideToClickedSlide: true,
  speed: 1000,
  // setWrapperSize: true,
  a11y: false,
  // observeSlideChildren: true,
  // observer: true,
  // resizeObserver: true,
  rewind: true,
  // watchSlidesProgress: true,
  allowTouchMove: false,
  on: {
    resize: function () {
      resizing = true;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizing = false;
      }, 500);
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
  // mousewheel: false,
  spaceBetween: 8,
  breakpoints: {
    320: {
      slidesPerView: 4,
    },
    640: {
      slidesPerView: 8,
    },
    1024: {
      slidesPerView: 11,
    },
  },
});

// initialize GreenAudioPlayer
GreenAudioPlayer.init({
  selector: '.audio-player', // inits Green Audio Player on each audio container that has class "player"
  stopOthersOnPlay: true,
});

//////////////////////////////////////////////////////////////
//* [AFTER DOM CONTENT IS LOADED] *//
document.addEventListener('DOMContentLoaded', () => {
  $('.continue-button').hide();
  $('.tab-content-container').hide();
  $('.tab-menu').hide();
  $('.swiper-button-next').hide();
  $('.swiper-button-prev').hide();
  document.getElementById("swiper").style.pointerEvents = 'none'; // disable swiper

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

      //////////////////////////////////////////////////////////////
      // start the volume at 0.6
      player.volume = 0.6;

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

      player_swiper_slide.addEventListener('click', function() {
        let thisItem = $(this);
        if(thisItem.hasClass("mediumVideo")){
          makeLarge(thisItem, player);
        } 
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
    $(this).find('.holder').fadeIn(200);
    $(this).find('.controls').fadeIn(200);
  },
  function() {
    $(this).find('.controls').hide();
    $(this).find('.holder').hide();
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
