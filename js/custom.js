/** SWIPER PREV AND NEXT BUTTONS **/
var next_prev_buttons =
  '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>';
$('.swiper').each(function(index) {
  $(this).append(next_prev_buttons);
});

var swiper = new Swiper('.swiper', {
  loop: true,
  speed: 100,
  setWrapperSize: true,
  a11y: false,
  // initialSlide: 0,
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


document.addEventListener('DOMContentLoaded', () => {
  const controls = [
    'play', // Play/pause playback
    'progress', // The progress bar and scrubber for playback and buffering
  ];
  const player = Plyr.setup('.js-player', { controls });
});

GreenAudioPlayer.init({
  selector: '.audio-player', // inits Green Audio Player on each audio container that has class "player"
  stopOthersOnPlay: true,
});

{
  /* show the loading screen */
}
document.addEventListener('DOMContentLoaded', () => {
  $('.loading-container').show();
  $('.continue-button').show();
  $('.tab-content-container').hide();
  $('.tab-menu').hide();
  $('.arrow-buttons-div').hide();
  $('.swiper-section').hide();
  $('.controls').hide();
  $('.holder').hide();
});

{
  /* what happens after you press the Continue button on the loading screen */
}
$('.continue-button').on('click', function() {
  $('.loading-container').fadeOut(500);
  $('.continue-button').fadeOut(1000);
  $('.tab-content-container').fadeIn(2000);
  $('.arrow-buttons-div').hide();
  $('.swiper-section').fadeIn(2000);
});

{
  /* settings for the loading screen typewriter effect */
}
var typedWords = document.getElementById('typedWords');

var typewriter = new Typewriter(typedWords, {
  loop: false,
  cursor: '',
  delay: 5,
});
{
  /* this where you edit the text on the loading screen */
}
typewriter
  .typeString(
    'In 1989, at age 15, Efrén Paredes, Jr. was convicted for a murder and armed robbery.'
  )
  .pauseFor()
  .typeString(
    ' The crime took place in St. Joseph, Michigan, at a local store where Efrén was working at the time.'
  )
  .pauseFor()
  .typeString(
    ' According to Efrén and his family, on the night of the crime, after completing his work at the store, he was brought home by the store’s manager. '
  )
  .pauseFor()
  .typeString(
    ' A short time later the store was robbed and the manager was murdered. '
  )
  .pauseFor()
  .typeString(
    ' The case against Efrén was based primarily on the statements of other youths who received reduced charges and sentences in exchange for their testimony. '
  )
  .pauseFor()
  .typeString(
    ' Efrén’s mother’s testimony, who claims that she had witnessed his return home before the murder was committed, was discarded. '
  )
  .pauseFor()
  .typeString(
    ' Efrén was sentenced to two life without parole sentences and one parolable life sentence.  '
  )
  .pauseFor(500)
  .typeString(' <br><br> He is currently 49 years-old.')
  .pauseFor(1000)
  .start();

$('.section').hover(
  function() {
    $('.tab-content-container').fadeIn(500);
    $('.swiper-button-next').hide();
    $('.swiper-button-prev').hide();
    $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
    $('.swiper-wrapper').css('opacity', '0.4');
    $('.swiper-wrapper').css({ 'margin-bottom': '5vh' });
  },
  function() {
    $('.tab-content-container').fadeOut(500);
    $('.swiper-button-next').show();
    $('.swiper-button-prev').show();
    $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
    $('.swiper-wrapper').css('opacity', '1');
    $('.swiper-wrapper').css({ 'margin-bottom': '10vh' });
  }
);

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
          .delay(600)
          .show(500);
        $(this).children('.plyr__controls').fadeIn(1100);
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
  $(this).removeClass('mediumVideo');
  $(this).css({ transformOrigin: 'center left' });
  $(this).css({ transition: 'all 0.7s linear' });
  $(this).addClass('largeVideo');
  console.log('the video is playing');
  // swiper.getTranslate()
  // swiper.setTranslate(-3500);
  // translateValue == swiper.getTranslate();

  // console.log(swiper.clickedIndex);
  // $('.swiper-wrapper').css({'transform' : 'translate3d(20px, 0, 0)'});
  // console.log(translateValue);
});

$('.swiper-slide').on('pause', function() {
  $(this).removeClass('largeVideo');
  $(this).css({ transformOrigin: 'center bottom' });
  $(this).addClass('mediumVideo');
  console.log('the video is paused');
  $(this).css({ transition: 'all 0.7s linear' });
  // $('.swiper-wrapper').css({'transform' : 'translate3d(-20px, 0, 0)'});
  // console.log(translateValue);
});

$('.swiper-slide').on('end', function() {
  $(this).css({ transition: 'all 0.7s linear' });
  $(this).removeClass('largeVideo');
  $(this).css({ transformOrigin: 'center bottom' });
  console.log('the video is ended');
});

{
  /* AUDIO PLAYER */
}
$('.audio-container').hover(
  function() {
    console.log('audio player hover');
    $(this).find('.holder').fadeIn(500);
    $(this).find('.controls').fadeIn(500);
  },
  function() {
    console.log('audio player hide');
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
