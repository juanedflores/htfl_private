/** SWIPER PREV AND NEXT BUTTONS **/
var next_prev_buttons =
  '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>';
$('.swiper').each(function(index) {
  $(this).append(next_prev_buttons);
});

var swiper = new Swiper('.swiper', {
  loop: false,
  speed: 100,
  setWrapperSize: true,
  a11y: false,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  spaceBetween: 4,
  breakpoints: {
    320: {
      slidesPerView: 4,
      slidesPerGroup: 2,
    },
    640: {
      slidesPerView: 8,
      slidesPerGroup: 5,
    },
    1024: {
      slidesPerView: 10,
      slidesPerGroup: 6,
    },
  },
});

GreenAudioPlayer.init({
  selector: '.audio-player', // inits Green Audio Player on each audio container that has class "player"
  stopOthersOnPlay: true,
});


document.addEventListener('DOMContentLoaded', () => {

  // $('.loading-container').show();
  $('.continue-button').hide();
  $('.tab-content-container').hide();
  $('.tab-menu').hide();
  $('.swiper-button-next').hide();
  $('.swiper-button-prev').hide();
  // document.getElementById("swiper").style.pointerEvents = 'none'; // disable swiper

  // $('.arrow-buttons-div').hide();
  // $('.swiper-section').hide();
  // $('.controls').hide();
  // $('.holder').hide();
});

{
  /* what happens after you press the Continue button on the loading screen */
}
$('.continue-button').on('click', function() {
  $('.loading-container').fadeOut(500);
  $('.continue-button').fadeOut(1000);
  $('.tab-content-container').fadeIn(2000);
  afterIntro();
  // $('.arrow-buttons-div').hide();
  // $('.swiper-section').fadeIn(2000);
});

{
  /* settings for the loading screen typewriter effect */
}

var typedTitle = document.getElementById('typedTitle');
var typewriterTitle = new Typewriter(typedTitle, {
  loop: false,
  cursor: '',
  delay: 5,
});

function stringSplitter(string) {
  str_array = string.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );;
  console.log(str_array);
  return str_array;
}

typewriterTitle.typeString('Half Truths <b>and</b> Full Lies');

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
    console.log('String typed out!');
    $('.continue-button').show();
  });

// what is loaded after the intro text
function afterIntro() {
  document.getElementById("swiper").style.pointerEvents = 'auto';
  $('.section').hover(
    function() {
      $('.tab-content-container').fadeIn(500);
      $('.swiper-button-next').hide();
      $('.swiper-button-prev').hide();
      // $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
      // $('.swiper-wrapper').css('opacity', '0.4');
      // $('.swiper-wrapper').css({ 'margin-bottom': '5vh' });
    },
    function() {
      $('.tab-content-container').fadeOut(500);
      // $('.swiper-button-next').show();
      // $('.swiper-button-prev').show();
      // $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
      // $('.swiper-wrapper').css('opacity', '1');
      // $('.swiper-wrapper').css({ 'margin-bottom': '10vh' });
    }
  );
  $('.siper-button-next').show();
  $('.siper-button-prev').show();
}

let currentPlayer = null;

document.addEventListener('DOMContentLoaded', () => {

  // video player settings
  const controls = [
    'play',     // Play/pause playback
    'progress', // The progress bar and scrubber for playback and buffering
    'disabled'
  ];

  // get all video players
  const players = Plyr.setup('.js-player', { controls });

  // hide all video players to start
  for (var i = 0; i < players.length; i++) {
    players[i].elements.container.style.visibility = "hidden";
  }

  // make video player visible when fully loaded (random between 1 second)
  for (var i = 0; i < players.length; i++) {
    players[i].on('ready', (event) => {
      const player = event.detail.plyr 
      random_Time = Math.random() * 1000;
      setTimeout(() => {
        player.elements.container.style.visibility = "visible";
        console.log("show");

        // add a listener to see if it changes
        // var observer = new MutationObserver(function() {
        //   console.log("You changed the style of: " + player) 
        // // if ($(this).hasClass('largeVideo') != true) {
        // //   console.log("PAUSED VIDEO");
        // // }
        // });
        // observer.observe(player.elements.container, { attributeFilter: ['style'] });

        setTimeout(() => {
          $('.loading-container').show();
          typewriterTitle.start();
        }, 2000);
        setTimeout(() => {
          typewriter.start();
        }, 3000);
      }, random_Time);

      currentPlayer = player;
    });
  }
});

let timeoutID;

$(document).ready(function() {
  let timer;
  $('.swiper-slide').hover(
    function() {
      timer = setTimeout(() => {
        $('.swiper-button-next').hide();
        $('.swiper-button-prev').hide();
        $('.card-description').stop(true, false);
        console.log('Delayed for 0.5 seconds.');
        $(this).css({ transformOrigin: 'center left' });
        $(this).addClass('mediumVideo');

        // $('.swiper-wrapper').css({'transform' : 'translate3d(100px, 0px, 0px)'});
        $(this)
          .children('.card_description')
          .delay(400)
          .show(500);
        $(this).children('.plyr__controls').fadeIn(2000);
        // if ($(this).attr('data-swiper-slide-index') === '0' || $(this).attr('data-swiper-slide-index') === '3') {
      }, 1000);
    },
    function() {
      $('.card-description').stop(false, true);
      $(this).children('.card_description').hide();
      clearTimeout(timer);
      $('.swiper-button-next').show(1500);
      $('.swiper-button-prev').show(1500);
      $(this).removeClass('largeVideo');
      $(this).css({ transformOrigin: 'center left' });
      $(this).removeClass('mediumVideo');
      // $('.swiper-wrapper').css({'transform' : 'translate3d(-100px, 0px, 0px)'});
    }
  );
});

$('.swiper-slide').on('play', function() {
  if ($(this).hasClass('mediumVideo')) {
    console.log("Video is medium sized");
    console.log('the video is playing');
    $(this).removeClass('mediumVideo');
    $(this).addClass('largeVideo');
  } else {
    console.log("does not have it");
    console.log('the video is NOT playing');
  }
  // swiper.getTranslate()
  // swiper.setTranslate(-3500);
  // translateValue == swiper.getTranslate();

  // console.log(swiper.clickedIndex);
  // $('.swiper-wrapper').css({'transform' : 'translate3d(20px, 0, 0)'});
  // console.log(translateValue);
});

$('.swiper-slide').on('pause', function() {
  $(this).removeClass('largeVideo');
  // $(this).css({ transformOrigin: 'center bottom' });
  $(this).addClass('mediumVideo');
  console.log('the video is paused');
  // $(this).css({ transition: 'all 0.7s linear' });
  // $('.swiper-wrapper').css({'transform' : 'translate3d(-20px, 0, 0)'});
  // console.log(translateValue);
});

$('.swiper-slide').on('end', function() {
  // $(this).css({ transition: 'all 0.7s linear' });
  $(this).removeClass('largeVideo');
  // $(this).css({ transformOrigin: 'center bottom' });
  console.log('the video is ended');
});

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

console.log("Hello World");
