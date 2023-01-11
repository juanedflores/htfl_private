<<<<<<< HEAD
//////////////////////////////////////////////////////////////
//* [GLOBAL VARIABLES] *//
let currentMediumVideo = null;
let currentLargeVideo = null;
let swiper;
let menuEnterTimer, menuLeaveTimer;
let backgroundClick;

//////////////////////////////////////////////////////////////
//* [HELPER FUNCTIONS] *//
function makeMedium(element, plyr) {
  // if video is large and not medium
  if (element.hasClass("largeVideo") && !element.hasClass("mediumVideo")){
    element.removeClass('largeVideo');
    element.addClass('mediumVideo');
    currentLargeVideo = null;
    currentMediumVideo = plyr;
    element.css({ 'min-width' : '35vw' });
    // fade out the audio
    fadeAudio(plyr, 0.6);
  } 
  // if video is not medium or large
  if (!element.hasClass("mediumVideo") && !element.hasClass("largeVideo")){
    element.addClass('mediumVideo');
    let description = $(element[0].children[1]);
    description.delay(100).show(200);
    element.css({ 'min-width' : '35vw' });
    currentMediumVideo = plyr;
  }
}

function removeMedium(element, plyr) {
  if (element.hasClass("mediumVideo")){
    element.removeClass('mediumVideo');
    element.css({ 'min-width' : '10vw' });
    // lower volume to 0
    fadeAudio(plyr, 0);
    // pause the video
    setTimeout(function() {
      plyr.pause();
    }, 1400);
    // hide the description
    let description = $(element[0].children[1]);
    description.hide();
    // update global variables
    currentMediumVideo = null;
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

    currentMediumVideo = null;
    currentLargeVideo = plyr;
    // move largeVideo to center and make it active
    // console.log(swiper.clickedIndex);
    swiper.slideTo(swiper.clickedIndex);
    element.css({ 'min-width' : '70vw' });
    console.log("making large")
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
    console.log(plyr.volume);
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
  slideToClickedSlide: true,
  centerInsufficientSlides: true,
  speed: 1000,
=======
/** SWIPER PREV AND NEXT BUTTONS **/
var next_prev_buttons =
  '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>';
$('.swiper').each(function(index) {
  $(this).append(next_prev_buttons);
});

var swiper = new Swiper('.swiper', {
  loop: true,
  speed: 100,
>>>>>>> e163e304fe808e8ca221c11ec6aacf23622a2e04
  setWrapperSize: true,
  a11y: false,
  // freeMode: true,
  freeMode: {
    enabled: true,
    sticky: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  mousewheel: {
    invert: true,
  },
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

// mySwiper = new Swiper('#swiper', {
//   loop: false,
//   slidesPerView: 11,
//   initialSlide: 5,
//   spaceBetween: 10,
//   navigation: {
//     prevEl: ".swiper-plugin-navigation-prevEl",
//     nextEl: ".swiper-plugin-navigation-nextEl",
//   },
//   freeMode: true,
//   centeredSlides: true,
//   plugins: [SwiperPluginNavigation],
//   slideActiveClass: 'mediumVideo'
// });


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



  //////////////////////////////////////////////////////////////
  //* VIDEO PLAYERS *//
  // video player settings
  const controls = [
    // 'play',     // Play/pause playback
    // 'progress', // The progress bar and scrubber for playback and buffering
    // 'disabled'
  ];

  const vimeoOptions = {
    responsive: true,
    autoplay: false,
    background: true,
    transparent: false,
    centeredSlides: true,
    portrait: false
    // width: 640
  };

  // get all video players
  const players = Plyr.setup('.js-player', { controls, debug: false, clickToPlay: false, vimeo: vimeoOptions });

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
      // start the volume at 0
      player.volume = 0.6;

      //////////////////////////////////////////////////////////////
      //* [MOUSE HOVER FOR SLIDER] *//
      // add mouseEnter and mouseLeave events 
      // delays in milliseconds
      let showDelay = 1000, hideDelay = 1000;
      player_swiper_slide.addEventListener('mouseenter', function() {
        // TODO: Not just enter, but make sure mouse has not moved for 1 sec
        let thisItem = $(this);
        // clear the opposite timer
        if (menuLeaveTimer != null && currentMediumVideo != null) {
          // TODO hide any active video
          console.log("there was a timer");
          clearTimeout(menuLeaveTimer);
          prevPlayer = $(currentMediumVideo.elements.container.offsetParent.offsetParent);
          removeMedium(prevPlayer, currentMediumVideo);
          makeMedium(thisItem, player);
        } else {
          console.log("there was no leavetimer")
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
          removeMedium(thisItem, player);
        }, hideDelay);

        // TODO: add event listener for background click
        if (currentLargeVideo != null && currentMediumVideo == null){
          backgroundClick = document.addEventListener('click', function() {
            let player_swiper_slide = currentLargeVideo.elements.container.offsetParent.offsetParent;
            player_swiper_slide = $(player_swiper_slide);
            makeMedium(player_swiper_slide, currentLargeVideo);
          }, { once: true });
        }

      });

      player_swiper_slide.addEventListener('click', function() {
        let thisItem = $(this);
        if(thisItem.hasClass("mediumVideo")){
          makeLarge(thisItem, player);
        } else if (thisItem.hasClass("largeVideo")){
          console.log("making medium from large");
          makeMedium(thisItem, player);
        } 
      });

      random_Time = Math.random() * 1000;
      // show video players at a random time
      setTimeout(() => {
        player.elements.container.style.visibility = "visible";
        //////////////////////////////////////////////////////////////

        // add a listener to check if it changes. This is to check what class it currently has. 
        // check whether it has mediumVideo, largeVideo, or neither
        // var observer = new MutationObserver(function() {
        //   console.log(player.config.title + " : " + player_swiper_slide.className);
        //   if (player_swiper_slide.classList.contains("mediumVideo")) {
        //     console.log("has medium!\\n")
        //   }
        //   });
        // // observe the element to check if a class has been added or removed
        // observer.observe(player_swiper_slide, { attributeFilter: ['class'] });
        // console.log(player);

        setTimeout(() => {
          $('.loading-container').show();
          typewriterTitle.start();

          // skip animation after click
          document.addEventListener('click', function() {
            document.getElementById('typedTitle').style.display = 'none';
            document.getElementById('typedTitleSkip').style.display = 'block';
            document.getElementById('typedWords').style.display = 'none';
            document.getElementById('typedWordsSkip').style.display = 'inline';
            $('.continue-button').show();
          });

        }, 2000);
        setTimeout(() => {
          typewriter.start()
        }, 3000);
      }, random_Time);

      currentPlayer = player;

    });
  }
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
  delay: 5,
});

typewriterTitle.typeString('Half Truths <b>and</b> Full Lies');

// Type the project text after the title
var typedWords = document.getElementById('typedWords');
var typewriter = new Typewriter(typedWords, {
  loop: false,
  cursor: '',
  delay: 20,
});

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
  });

//////////////////////////////////////////////////////////////
//* [END OF INTRO] *//
// events that happen after the continue button is clicked
$('.continue-button').on('click', function() {
  $('.loading-container').fadeOut(500);
  $('.continue-button').fadeOut(1000);
  $('.tab-content-container').fadeIn(2000);
  afterIntro();
});

//////////////////////////////////////////////////////////////
//* [AFTER INTRO] *//
function afterIntro() {
  // activate video slider (make it interactible with mouse)
  document.getElementById("swiper").style.pointerEvents = 'auto';
  // when upper body is hovered
  $('.section').hover(
    function() {
      $('.tab-content-container').fadeIn(500);
    },
    function() {
      $('.tab-content-container').fadeOut(500);
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
    console.log('down button clicked');
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
    console.log('up button clicked');
  }, 50);

  return false;
});

$(document).mouseup(function() {
  clearInterval(timeoutUp);
  return false;
});
