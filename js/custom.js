//////////////////////////////////////////////////////////////
// GLOBAL_VARIABLES:
let currentMediumVideoPlayer = null;
let currentLargeVideoPlayer = null;
let currentActivePlayer = null;
let video_media_array;
let audio_media_array;
let currentStartIndex = 0;
let currentEndIndex = 12;
let initialSlide = 6;

// slides that are unclickable from edge
let unclickable_slides_amount = 1;
let unclickable_slides = [];

let swiper;

let menuEnterTimer, menuLeaveTimer, resizeTimer;
let updateInterval;
let backgroundClick;
let resizing = false;
let menu_item_text_visible = false;
let index_page_clicked = false;
// debugging
let debug_swiper = false;
let indexCells = [];

// video player settings
const playerControls = [
  // 'play', // shows play icon
];
// vimeo embed player options
const vimeoOptions = {
  responsive: false,
  background: true,
  transparent: true,
};

//////////////////////////////////////////////////////////////
// SLIDER_FUNCTIONS:
function moveToSlide(target_index, dont_make_target_medium) {
  if (index_page_clicked) {
    $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
    $('#swiper').fadeTo(1000, 1.0);
    $('#content_text').fadeTo(1000, 0.4);

    $('#swiper').promise().done(function(){
      $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
      $('.swiper-wrapper').css({ 'margin-bottom': '5vh' });
    });
  }

  // if there is any medium video, make it small
  if (currentMediumVideoPlayer) {
    makeSmall(currentMediumVideoPlayer);
  }

  // TODO: find a more efficient way to do this
  let active_index;
  video_media_array.forEach(function(item, index) {
    if (item.player) {
      if (item.player.swiper_slide.classList.contains("swiper-slide-active")) {
        active_index = index;
      }
    }
  })
  let distance_to_left;
  let distance_to_right;
  if (target_index > active_index) {
    distance_to_left = active_index + (video_media_array.length - target_index);
    distance_to_right = target_index - active_index;
  } else if (target_index < active_index) {
    distance_to_left = active_index - target_index;
    distance_to_right = target_index + (video_media_array.length - active_index);
  }

  let diff = 0
  // if distance to left is less, do prev
  if (distance_to_left < distance_to_right) {
    diff = distance_to_left;
    for (var i = 0; i < diff-1; i++) {
      prev();
    }
    swiper.slideTo(initialSlide-1);
  }
  // if distance to right is less, do next
  else if (distance_to_left > distance_to_right) {
    diff = distance_to_right;
    for (var i = 0; i < diff-1; i++) {
      next();
    }
    swiper.slideTo(initialSlide+1);
  } else {
    console.log("must be same indexx?");
  }

  // if there are currently no medium or large video, make it medium (clicked from index page)
  if (!currentMediumVideoPlayer && !currentLargeVideoPlayer && !dont_make_target_medium) {
    makeMedium(video_media_array[target_index].player);
  }
}

function next() {
  // update beginning and ending indices
  currentEndIndex = currentEndIndex+1;
  currentStartIndex = currentStartIndex+1;
  // handle wrap around
  if (currentStartIndex > video_media_array.length-1) { 
    currentStartIndex = 0;
  }
  if (currentEndIndex > video_media_array.length-1) { 
    currentEndIndex = 0;
  }
  // returns a string of html for slide
  slide = makeSlide(currentEndIndex);
  // appends the slide to the end
  swiper.appendSlide(slide);
  // this is the swiper_slide dom element
  swiper_slide = swiper.slides[swiper.slides.length-1];
  // this is the player-js dom element
  player_js = swiper_slide.children[0].childNodes[1].children[0];
  // initialize the player
  player = new Plyr(player_js, { controls: playerControls, debug: false, clickToPlay: false, vimeo: vimeoOptions, index: currentEndIndex });
  player.media_index = currentEndIndex;
  playerOnReady(player);
  // remove slide to the left
  swiper.removeSlide(0);
  // update the swiper
  swiper.update()

  // update the new slide
  player.swiper_slide = swiper_slide;
  video_media_array[currentEndIndex].player = player;
  if (currentStartIndex == 0) {
    // currentStartIndex is 0, then the last index (42) is to be deleted
    video_media_array[video_media_array.length-1].player = null;
  } else {
    // else just delete the one before the currentStartIndex
    video_media_array[currentStartIndex-1].player = null;
  }

  // make the slides on the edges uninteractable
  swiper.slides.forEach(function(item, index) {
    if (unclickable_slides.includes(index)) {
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
    } else {
      item.style.opacity = '1';
      item.style.pointerEvents = 'auto';
    }
  });

  // DEBUGGING: for index page
  if (indexCells.length > 0) {
    // make all cells white first
    if (debug_swiper) {
      for (var i = 0; i < indexCells.length; i++) {
        indexCells[i].style.color = "white";
      }
    }
    video_media_array.forEach(function(item, index) {
      if (item.player) {
        if (item.player.swiper_slide.classList.contains("swiper-slide-visible")) {
          if (debug_swiper) {
            indexCells[index].style.color = "green";
          }
          if (item.player.swiper_slide.classList.contains("swiper-slide-active")) {
            if (debug_swiper) {
              indexCells[index].style.color = "red";
            }
          }
        } else {
          if (debug_swiper) {
            indexCells[index].style.color = "blue";
          }
        }
      }
    });
  }
  // DEBUGGING:
  active_index = swiper.activeIndex;
  slides_to_left = active_index;
  slides_to_right = swiper.slides.length - (active_index+1);
  // console.log("total loaded slides: " + swiper.slides.length);
  // console.log("index of active slide: " + active_index);
  // console.log("slides to the left: " + slides_to_left);
  // console.log("slides to the right: " + slides_to_right);
}

function prev() {
  // update beginning and ending indices
  currentEndIndex = currentEndIndex-1;
  currentStartIndex = currentStartIndex-1;
  // handle wrap around
  if (currentStartIndex < 0) { 
    currentStartIndex = video_media_array.length-1;
  }
  if (currentEndIndex < 0) { 
    currentEndIndex = video_media_array.length-1;
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
  player = new Plyr(player_js, { controls: playerControls, debug: false, clickToPlay: false, vimeo: vimeoOptions, index: currentStartIndex });
  player.media_index = currentStartIndex;
  playerOnReady(player);
  // remove slide to the right
  swiper.removeSlide(swiper.slides.length-1);
  // update the swiper
  swiper.update()

  // update the players array
  player.swiper_slide = swiper_slide;
  video_media_array[currentStartIndex].player = player;
  if ((currentEndIndex) == video_media_array.length-1) {
    // if currentEnd is video_media_array.length-1, then 0 should be deleted
    video_media_array[0].player = null;
  } else {
    // else just delete currentEndIndex+1
    video_media_array[currentEndIndex+1].player = null;
  }

  // make the slides on the edges uninteractable
  swiper.slides.forEach(function(item, index) {
    if (unclickable_slides.includes(index)) {
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
    } else {
      item.style.opacity = '1';
      item.style.pointerEvents = 'auto';
    }
  });

  // DEBUGGING: for index page
  if (indexCells.length > 0) {
    // make all cells white first
    for (var i = 0; i < indexCells.length; i++) {
      indexCells[i].style.color = "white";
    }
    video_media_array.forEach(function(item, index) {
      if (item.player) {
        if (item.player.swiper_slide.classList.contains("swiper-slide-visible")) {
          if (debug_swiper) {
            indexCells[index].style.color = "green";
          }
          if (item.player.swiper_slide.classList.contains("swiper-slide-active")) {
            if (debug_swiper) {
              indexCells[index].style.color = "red";
            }
          }
        } else {
          if (debug_swiper) {
            indexCells[index].style.color = "blue";
          }
        }
      }
    })
  }
  // DEBUGGING:
  active_index = swiper.activeIndex;
  slides_to_left = active_index;
  slides_to_right = swiper.slides.length - (active_index+1);
  // console.log("total loaded slides: " + swiper.slides.length);
  // console.log("index of active slide: " + active_index);
  // console.log("slides to the left: " + slides_to_left);
  // console.log("slides to the right: " + slides_to_right);
}

// PLAYER_FUNCTIONS:
function playerOnReady(player) {
  // when player is ready...
  player.on('ready', (event) => {
    let player = event.detail.plyr 
    let player_swiper_slide = player.elements.wrapper.parentNode.parentNode.parentNode.parentNode;
    let player_card_description = player.elements.wrapper.parentNode.parentNode.parentNode.parentNode.children[1];
    let player_videocard = player.elements.wrapper.parentNode.parentNode.parentNode;
    let player_videoTopDiv = player.elements.wrapper.parentNode.parentNode.parentNode.parentNode.children[1].children[0];
    let player_durationDiv = player.elements.wrapper.parentNode.parentNode.parentNode.parentNode.children[1].children[0].children[1];
    let player_controls = player_swiper_slide.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
    let player_iframe = player_swiper_slide.firstElementChild.firstElementChild.firstElementChild.children[1].children[0].children[0];
    let player_plyrposter = player_swiper_slide.firstElementChild.firstElementChild.firstElementChild.children[1].children[1];

    // console.log(player.media);

    // make videos appear randomly on intro
    // TODO: do this only on page enter
    let random_Time = Math.random() * 1000;
    setTimeout(() => {
      player.elements.container.style.visibility = "visible";
    }, random_Time);
    // add a transition effect
    player_swiper_slide.style.transition = "all 1400ms ease";
    // init the volume
    player.volume = 0.0;
    // make unclickable ones
    if (player.unclickable) {
      console.log("true")
      player_swiper_slide.style.pointerEvents = "none";
    }
    // add the custom progress bar
    let progressbardiv = document.createElement('div');
    progressbardiv.style.display = "none";
    progressbardiv.setAttribute("class", "progress");
    player_videoTopDiv.onclick = function clickEvent(e) {
      var parentwidth = progressbardiv.offsetWidth;
      // if it's not video-title
      if (e.target != player.elements.container.offsetParent.offsetParent.lastElementChild.children[0].children[0]) {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.right; //x position within the element.
        player.currentTime = player.duration * (1-(Math.abs(x) / parentwidth));
        // player.progressbar.set((1-(Math.abs(x) / parentwidth)));
        console.log("set a new value")
      }
    }
    // append the div to html
    player_videoTopDiv.append(progressbardiv);
    // initialize progressbar
    var progressbar = new ProgressBar.Line(progressbardiv, {
      color: '#FFFFFF',
      trailColor: '#808080',
      strokeWidth: 0.1
    });
    // set the progressbar to 0
    progressbar.set(0.0);

    // disable double click to fullscreen feature
    player.eventListeners.forEach(function(eventListener) {
      if(eventListener.type === 'dblclick') {
        eventListener.element.removeEventListener(eventListener.type, eventListener.callback, eventListener.options);
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


    /// add an end event listener
    player.on('ended', function(data) {
      closeAndSwipe(player);
      progressbar.set(0.0);
      player.currentTime = 0;
    });

    //////////////////////////////////////////////////////////////
    //* [MOUSE EVENTS FOR SLIDER] *//
    // add mouse events 
    let showDelay = 500, hideDelay = 500;
    player_swiper_slide.addEventListener('mouseenter', function() {
      clearTimeout(menuLeaveTimer);
      menuEnterTimer = setTimeout(function() {
        // if (player.media_index == currentStartIndex+1 || player.media_index == currentStartIndex+2) {
        //   player.swiper_slide.style.pointerEvents = 'none';
        //   moveToSlide(currentStartIndex+4, true);
        // } 
        // else if (player.media_index == currentEndIndex-1 || player.media_index == currentEndIndex-2) {
        //   player.swiper_slide.style.pointerEvents = 'none';
        //   moveToSlide(player.media_index, true);
        // } 
        // else {
        // CASE_1: there is already a medium
        if (currentMediumVideoPlayer) {
          makeSmall(currentMediumVideoPlayer);
        }
        // CASE_2: making medium from small
        if (!currentMediumVideoPlayer && !currentLargeVideoPlayer) {
          makeMedium(player);
        }
        // }

      }, showDelay);

      // if (!currentMediumVideoPlayer && !currentLargeVideoPlayer) {
      //   makeMedium(player);
      // }
      // if (!resizing) {
        // if (menuLeaveTimer != null && currentMediumVideoPlayer != null) {
        //   clearTimeout(menuLeaveTimer);
        //   prevPlayer = $(currentMediumVideoPlayer.elements.wrapper.parentNode.parentNode);
        //   makeSmall(currentMediumVideoPlayer.swiper_slide, currentMediumVideoPlayer);
        //   makeMedium(thisItem, player);
        // } 
        // else {
        //   // add active class after a delay
        // }
      // }
    });

    // triggered when user's mouse leaves the swiper item
    player_swiper_slide.addEventListener('mouseleave', function() {
      clearTimeout(menuEnterTimer);
      if (currentMediumVideoPlayer && !currentLargeVideoPlayer) {
        menuLeaveTimer = setTimeout(function() {
          makeSmall(player);
        }, hideDelay);
      }

      // TODO: add event listener for background click
      // if (currentLargeVideoPlayer != null && currentMediumVideoPlayer == null){
      //   backgroundClick = document.addEventListener('click', function() {
      //     console.log("clicked the background");
      //     let player_swiper_slide = currentLargeVideoPlayer.elements.container.offsetParent.offsetParent;
      //     player_swiper_slide = $(player_swiper_slide);
      //     makeMedium(player_swiper_slide, currentLargeVideoPlayer);
      //   }, { once: true });
      // }

    });

    player_videocard.addEventListener('click', function(event) {
      // CASE_1: there is a medium video && user clicked on it
      if (currentMediumVideoPlayer) {
        if (player == currentMediumVideoPlayer) {
          console.log("make large..");
          makeLarge(player);
        }
      }

      // CASE_2: there is a large video && user clicked on it
      else if (currentLargeVideoPlayer) {
        if (player == currentLargeVideoPlayer) {
          makeMedium(player);
        }
      }

      // CASE_3: user clicked on a small player
      // else if (!currentMediumVideoPlayer && !currentLargeVideoPlayer) {
      //   clearTimer(menuEnterTimer);
      //   clearTimer(menuLeaveTimer);
      //   makeMedium(player);
      // }


      // if (currentMediumVideoPlayer || currentLargeVideoPlayer) {
      //   // if the clicked video is currently small, make medium
      //   if(currentMediumVideoPlayer == null && currentLargeVideoPlayer == null) {
      //     makeMedium(thisItem, player);
      //   } 
      //   // if the clicked video is currently medium, make large
      //   else if(thisItem.hasClass("mediumVideo")) {
      //     makeLarge(thisItem, player);
      //   } 
      //   // if the clicked video is currently large, make medium
      //   else if (thisItem.hasClass("largeVideo")){
      //     makeMedium(thisItem, player);
      //   } 
      //   else if (currentLargeVideoPlayer) {
      //     if (thisItem != currentLargeVideoPlayer.elements.container.offsetParent.offsetParent) {
      //       // console.log("different")
      //     } else {
      //       // console.log("same")
      //     }
      //     let player_swiper_slide = $(currentLargeVideoPlayer.elements.container.offsetParent.offsetParent);
      //     makeSmallLarge(player_swiper_slide, currentLargeVideoPlayer, thisItem, player);
      //   }
      // }
    });
  });
}

//////////////////////////////////////////////////////////////
// MENU_ITEM_PAGES:
function index() {
  console.log("index");
  // html content string
  indexContent = 
  `
    <div id="indexContent" class="indexcontent">
        <table id="indexTable" style="width: 100%;">
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
  document.getElementById("content_text").innerHTML = indexContent;

  indexCells = [];
  currName = "";
  let currRow;
  let rowcount = 0;
  let cellcount = 0;
  table = document.getElementById("indexTable");

  function task(i) {
    setTimeout(function() {
      let name = video_media_array[i]["Subject Name"];
      if (name != currName) {
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

        typecell
          .typeString(name)
          .start();

        // cell.innerHTML = name;
        rowcount = rowcount + 1;
        cellcount = cellcount + 1;

        // add the time
        cell = currRow.insertCell(cellcount);
        duration = video_media_array[i]["Video Duration"];
        a = document.createElement('a');
        indexCells.push(a);
        cellIndex = indexCells.length-1;
        a.setAttribute('href', `javascript:moveToSlide(${cellIndex})`);
        // a.innerHTML = duration;

        typecell = new Typewriter(a, {
          loop: false,
          cursor: '',
          delay: 50,
        });

        typecell
          .typeString(duration)
          .start();

        cell.appendChild(a);
        // cell.innerHTML = duration;
        cellcount = cellcount + 1;
      }
      else {
        cell = currRow.insertCell(cellcount);
        duration = video_media_array[i]["Video Duration"];
        a = document.createElement('a');
        indexCells.push(a);
        cellIndex = indexCells.length-1;
        a.setAttribute('href', `javascript:moveToSlide(${cellIndex})`);
        // a.innerHTML = duration;

        typecell = new Typewriter(a, {
          loop: false,
          cursor: '',
          delay: 50,
        });

        typecell
          .typeString(duration)
          .start();

        cell.appendChild(a);
        cellcount = cellcount + 1;
      }
      // DEBUGGING:
      if (i == video_media_array.length - 1) {
        if (indexCells.length > 0) {
          for (var j = 0; j < indexCells.length; j++) {
            indexCells[j].style.color = "white";
          }

          video_media_array.forEach(function(item, index) {
            if (item.player) {
              let player_swiper_slide = item.player.elements.wrapper.parentNode.parentNode.parentNode.parentNode;
              if (player_swiper_slide.classList.contains("swiper-slide-visible")) {
                if (debug_swiper) {
                  indexCells[index].style.color = "green";
                }
                if (player_swiper_slide.classList.contains("swiper-slide-active")) {
                  if (debug_swiper) {
                    indexCells[index].style.color = "red";
                  }
                }
              } else {
                if (debug_swiper) {
                  indexCells[index].style.color = "blue";
                }
              }
            }
          })
        }
      }
    }, 100 * i);
  }

  for (var i = 0; i <= video_media_array.length - 1; i++) {
    task(i);
  }
}

function aboutTheCase() {
  console.log("about the case")
  // html content string
  aboutCaseContent = `
    <div id="aboutCaseContent" class="text-block-12">
    </div>
  `;
  document.getElementById("content_text").innerHTML = aboutCaseContent;

  typedText = `
    In 1989, at age 15, Efrén Paredes, Jr. was
    convicted for a murder and armed robbery. The
    crime took place in St. Joseph, Michigan, at a
    local store where Efrén was working at the time.
    According to Efrén and his family, on the night
    of the crime, after completing his work at the
    store, he was brought home by the store’s
    manager. A short time later the store was robbed
    and the manager was murdered. The case against
    Efrén was based primarily on the statements of
    other youths who received reduced charges and
    sentences in exchange for their testimony.
    Efrén’s mother’s testimony, who claims that she
    had witnessed his return home before the murder
    was committed, was discarded. Efrén was
    sentenced to two life without parole sentences
    and one parolable life sentence.
    `

  typeString = new Typewriter("#aboutCaseContent", {
    loop: false,
    cursor: '',
    delay: 4,
  });

  stringArray = stringSplitter(typedText);
  for (var i = 0; i < stringArray.length; i++) {
    typeString.pasteString(stringArray[i] + " ");
  }
  typeString
    .typeString(' <br><br> He is currently 49 years-old.')
    .start();
}

function aboutTheInstallation() {
  console.log("about the installation")

  // html content string
  aboutInstallContent = 
  `
    <div id="aboutCaseInstallation" class="text-block-13">
    </div>
  `;
  document.getElementById("content_text").innerHTML = aboutInstallContent;

  typedText = "A collaborative project between nonfiction filmmakers Tirtza Even and Meg McLagan and audio producer Elyse Blennerhassett."
  typedText2 = "Half Truths and Full Lies depicts, through documentation and reenactment, the case of Efrén Paredes Jr., a Latinx man from Michigan, who was sentenced to life without parole in 1989 at age fifteen, for a murder he claims he did not commit."
  typedText3 = "The multi-channel installation takes on a Rashomon-like quality, as divergent accounts of the crime accrue, forming multiple portraits of Efren. These accounts reflect perspectives of a range of individuals, from a police detective to key witnesses from the tight-knit small town community who singled Paredes out, as well as those whose lives — over the past 30 years — were most affected by the teen’s conviction: family members, teachers, and citizens who sat in judgment as jury members."
  typedText4 = "Half Truths and Full Lies tells a story about a story; one constructed by a group of teens who appear to have conspired to set up their peer, and whose narrative played on stereotypical assumptions about racial minorities. This account became the only one the public, and the jury, got to hear, and the one upon which the local police and prosecutor relied."
  typedText5 = "<a href='https://vimeo.com/294983167' target='_blank'>Full story.</a>"

  typeString = new Typewriter("#aboutCaseInstallation", {
    loop: false,
    cursor: '',
    delay: 4,
  });

  stringArray = stringSplitter(typedText);
  for (var i = 0; i < stringArray.length; i++) {
    typeString.pasteString(stringArray[i] + " ");
  }
  typeString.typeString("<br /><br />")

  stringArray = stringSplitter(typedText2);
  for (var i = 0; i < stringArray.length; i++) {
    typeString.pasteString(stringArray[i] + " ");
  }
  typeString.typeString("<br /><br />")

  stringArray = stringSplitter(typedText3);
  for (var i = 0; i < stringArray.length; i++) {
    typeString.pasteString(stringArray[i] + " ");
  }
  typeString.typeString("<br /><br />")

  stringArray = stringSplitter(typedText4);
  for (var i = 0; i < stringArray.length; i++) {
    typeString.pasteString(stringArray[i] + " ");
  }
  typeString.typeString("<br /><br />")

  typeString
    .typeString(typedText5)
    .start();
}

function audioFiles() {
  console.log("audio files")

  // html content string
  audioContent = 
  `
    <div id="audioContent" class="indexcontent">
        <table id="audioTable" style="width: 100%;">
        </table>
    </div>
  `;
  document.getElementById("content_text").innerHTML = audioContent;


  function task(i) {
    setTimeout(function() {
      let name = audio_media_array[i]["Name"];
      let slug = audio_media_array[i]["Slug"];
      let audioID = audio_media_array[i]["Google Drive File ID"];
      currRow = table.insertRow(i);
      cell = currRow.insertCell(0);
      cell.style.padding = "10px";
      cell.innerText = name;

      audioPlayerString = `<div id="${slug}" class="audio-player"><audio id="audioPlayer" class="audioAudio"><source src="https://docs.google.com/uc?export=download&id=${audioID}" type="audio/mpeg" /></audio></div>`

      cell = currRow.insertCell(1);
      cell.innerHTML = audioPlayerString;
      new GreenAudioPlayer('#' + slug);
    }, 100 * i);
  }

  table = document.getElementById("audioTable");
  for (var i = 0; i <= audio_media_array.length - 1; i++) {
    task(i);
  }

  // initialize GreenAudioPlayer
  // GreenAudioPlayer.init({
  //   selector: '.audio-player', // inits Green Audio Player on each audio container that has class "player"
  //   stopOthersOnPlay: true,
  //   showTooltips: true,
  // });
}

function resources() {
  console.log("resources")

  // html content string
  resourcesContent =
  `
    <div id="resourcesContent">
    </div>
  `;
  document.getElementById("content_text").innerHTML = resourcesContent;

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
  `

  typeString = new Typewriter("#resourcesContent", {
    loop: false,
    cursor: '',
    delay: 3,
  });

  typeString
    .pasteString(typedString)
    .start();
}
//////////////////////////////////////////////////////////////

// VIDEO_SIZE_FUNCTIONS:
function makeSmall(plyr) {
  let swiper_slide = $(plyr.swiper_slide);

  // making small from medium
  // CASE_1: there is a medium player and user hovered out of it
  if ((swiper_slide.hasClass("mediumVideo") && currentMediumVideoPlayer == plyr) || (swiper_slide.hasClass("largeVideo") && currentLargeVideoPlayer == plyr)) {
    swiper_slide.removeClass('mediumVideo');
    swiper_slide.removeClass('largeVideo');
    swiper_slide.css({ 'min-width' : '1vw' });

    // lower volume to 0
    fadeAudio(plyr, 0);
    // pause the video after ms it takes to return to small
    setTimeout(function() {
      clearInterval(updateInterval);
      plyr.progressbardiv.style.display = "none";
      plyr.durationdiv.style.display = "flex";
      // hide controls
      // plyr.player_controls.style.display = "none";
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
  if (swiper_slide.hasClass("largeVideo")){
    swiper_slide.removeClass('largeVideo');
    swiper_slide.css({ 'min-width' : '1vw' });
    // lower volume to 0
    fadeAudio(plyr, 0);
    // pause the video after ms it takes to return to small
    setTimeout(function() {
      plyr.pause();
      clearInterval(updateInterval);
      moveToSlide(plyr.media_index+6);
    }, 1000);
    // hide the description
    $(plyr.card_description).fadeOut(300);
    // update global variables
    currentLargeVideoPlayer = null;
  } 
}

function makeMedium(plyr) {
  function med() {
    let swiper_slide = $(plyr.swiper_slide);

    // fade audio to 0.4
    fadeAudio(plyr, 0.4);

    // making medium from small size
    // CASE_1: there is no medium or large player, make medium from small
    if (!swiper_slide.hasClass("mediumVideo") && !swiper_slide.hasClass("largeVideo") && currentMediumVideoPlayer == null && currentLargeVideoPlayer == null){
      // making current small player to medium..
      swiper_slide.addClass('mediumVideo');
      swiper_slide.css({ 'min-width' : '35vw' });
      // fade in the description
      setTimeout(function() {
        $(plyr.card_description).fadeIn(600);
      }, 400);
      // update global variable
      currentMediumVideoPlayer = plyr;
      currentLargeVideoPlayer = null;
    }

    // CASE_2: there is a large player and user clicked on it
    if (swiper_slide.hasClass("largeVideo") && currentLargeVideoPlayer == plyr){
      // making current small player to medium..
      swiper_slide.removeClass('largeVideo');
      swiper_slide.addClass('mediumVideo');
      swiper_slide.css({ 'min-width' : '35vw' });
      // update global variables
      currentMediumVideoPlayer = plyr;
      currentLargeVideoPlayer = null;
    }
  }

  $('#swiper').fadeTo(1000, 1.0);
  if (menu_item_text_visible) {
    menu_item_text_visible = false;
    if (index_page_clicked) {
      $('#content_text').fadeTo(1000, 0.3);
      $('#upButton').fadeTo(1000, 0.3);
      $('#downButton').fadeTo(1000, 0.3);
    } else {
      $('#content_text').fadeTo(1000, 0.0);
      $('#content_text').promise().done(function(){
        document.getElementById("content_text").innerHTML = "";
        $('#upButton').hide();
        $('#downButton').hide();
      });
    }
    $('#content_text').promise().done(function(){
      med();
    });
  } else {
    med();
  }
  currentLargeVideoPlayer = null;
}

function makeLarge(plyr) {
  if (index_page_clicked) {
    $('#content_text').fadeTo(1000, 0.0);
    $('#upButton').fadeTo(1000, 0.0);
    $('#downButton').fadeTo(1000, 0.0);
    $('#content_text').promise().done(function(){
      document.getElementById("content_text").innerHTML = "";
    });
  } 

  let swiper_slide = $(plyr.swiper_slide);
  if (swiper_slide.hasClass("mediumVideo")){
    swiper_slide.removeClass('mediumVideo');
    swiper_slide.addClass('largeVideo');
    console.log("added large class")
    currentMediumVideoPlayer = null;
    currentLargeVideoPlayer = plyr;
    swiper_slide.css({ 'min-width' : '70vw' });
    // play video
    // fade audio to full volume
    fadeAudio(plyr, 1);
    // move largeVideo to center and make it active
    console.log("CLICKED INDEX: " + plyr.media_index);
    if (initialSlide != (plyr.media_index-currentStartIndex)) {
      moveToSlide(plyr.media_index);
    }
    // show progress bar
    plyr.progressbardiv.style.display = "block";
    // hide duration div
    plyr.durationdiv.style.display = "none";
    // hide controls
    // plyr.player_controls.style.display = "none";
    // update progress baras video is playing
    updateInterval = setInterval(function() {
      currenttime = plyr.currentTime;
      percentage = (currenttime / plyr.duration);
      plyr.progressbar.set(percentage);
    }, 20);

    plyr.play();
    // setTimeout(function() {
    // }, 2000);
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

  // <div class='js-player' data-plyr-provider='vimeo' data-plyr-embed-id='${vimeoID}'></div>
  htmlstring = 
    `<div role='listitem' class='swiper-slide'>
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
      </div>`


  return htmlstring;
}

//////////////////////////////////////////////////////////////
// INITIALIZE_SWIPER:
function initSwiper() {
  swiper = new Swiper('#swiper', {
    runCallbacksOnInit: false,
    loop: false,
    slidesPerView: (currentEndIndex-1),
    initialSlide: initialSlide,
    slidesPerGroup: 1,
    preventInteractionOnTransition: true,
    speed: 1000,
    slideToClickedSlide: false,
    centeredSlides: true,
    setWrapperSize: true,
    watchSlidesProgress: true,
    allowTouchMove: false,
    preloadImages: true,
    fullscreen: {enabled: false},
    on: {
      resize: function () {
        resizing = true;
        clearTimeout(resizeTimer);
        clearTimeout(menuEnterTimer);
        clearTimeout(menuLeaveTimer);
        resizeTimer = setTimeout(() => {
          resizing = false;
        }, 100);
      },
      slideNextTransitionEnd: function () {
        next();
      },
      slidePrevTransitionEnd: function () {
        prev();
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
async function fetchCSV () {
  // get video info from csv file
  const res = await fetch('video_media.csv');
  video_media_array = await res.text();
  video_media_array = $.csv.toObjects(video_media_array)
  video_media_array.sort((a, b) => a["Order in Scrolly Reel"] - b["Order in Scrolly Reel"])
  // get audio info from csv file
  const resaudio = await fetch('audio_media.csv');
  audio_media_array = await resaudio.text();
  audio_media_array = $.csv.toObjects(audio_media_array)
  // create video players
  for (var i = currentStartIndex; i <= currentEndIndex; i++) { 
    let vimeoID = video_media_array[i]["Vimeo ID"];
    let videoTitle = video_media_array[i]["Subject Name"];
    let videoDuration = video_media_array[i]["Video Duration"];
    let videoDescription = video_media_array[i]["Video Description"];
    htmlstring = makeSlide(i);
    $('.swiper-wrapper').append(htmlstring);
  }
  // you can init swiper now that the swiper-slide class is in the html
  await initSwiper();
  // determine the unclickable_slides indices
  for (var i = 0; i < unclickable_slides_amount; i++) {
    unclickable_slides.push(swiper.visibleSlidesIndexes[0 + i]);
    unclickable_slides.push(swiper.visibleSlidesIndexes[(swiper.visibleSlidesIndexes.length-1) - i]);
  }
  // init all video players
  const players = Plyr.setup('.js-player', { controls: playerControls, debug: false, clickToPlay: false, vimeo: vimeoOptions, loadSprite: false, hideControls: true });
  // hide all video players to start
  for (var i = 0; i < players.length; i++) {
    player = players[i];
    player.elements.container.style.visibility = "hidden";

    // add player entry to video_media_array
    if (i < currentEndIndex+1) {
      video_media_array[i].player = player;
      video_media_array[i].player.media_index = i;
      if (unclickable_slides.includes(i)) {
        video_media_array[i].player.unclickable = true;
      }
      if (i == initialSlide) {
        currentActivePlayer = player;
      }
    }
    // once player is ready, add its event listeners, etc.
    playerOnReady(player);
  }
}

//////////////////////////////////////////////////////////////
// AFTER_DOM_CONTENT_IS_LOADED:
document.addEventListener('DOMContentLoaded', () => {
  // hide menu item content text
  $('#content_text').hide();
  // hide menu item content arrow buttons
  $('#upButton').hide();
  $('#downButton').hide();
  scrollDown = $('#downButton');
  scrollUp = $('#upButton');

  scrollDown.mousedown(function() {
    var y = $('#tabContent').scrollTop();
    $('#tabContent').animate({ scrollTop: y + 150 }, 'slow')
  });
  scrollUp.mousedown(function() {
    var y = $('#tabContent').scrollTop();
    $('#tabContent').animate({ scrollTop: y - 150 }, 'slow')
  });
  // hide swiper arrows
  $('.swiper-button-next').hide();
  $('.swiper-button-prev').hide();
  // hide intro screen elements, because they will be faded in
  $('.continue-button').hide();
  $('.tab-content-container').hide();
  // prevent mouse events on swiper
  document.getElementById("swiper").style.pointerEvents = 'none';
  // show the intro text container
  $('.loading-container').show();
  // load videos
  fetchCSV();
  // 2 seconds later after DOMContentent is loaded, add click listener and show intro
  setTimeout(() => {
    // start typewriter animation
    typewriterTitle.start();
    // skip animation after click
    document.addEventListener('click', function() {
      // just show all the intro text
      document.getElementById('typedTitle').style.display = 'none';
      document.getElementById('typedTitleSkip').style.display = 'block';
      document.getElementById('typedWords').style.display = 'none';
      document.getElementById('typedWordsSkip').style.display = 'inline';
      $('.continue-button').show();
      document.addEventListener('click', function() {
        $('.continue-button').click();
      }, {once: true});
    }, { once: true });
  }, 2000);

  // $(".borderprev").mouseover(function() {
  //   moveToSlide(((currentStartIndex+initialSlide)%video_media_array.length)-3, true);
  // });
  // $(".bordernext").mouseover(function() {
  //   moveToSlide(((currentStartIndex+initialSlide)%video_media_array.length)+3, true);
  // });
});

//////////////////////////////////////////////////////////////
// INTRO:
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
  });

// start to write the intro text
typewriterTitle.typeString('Half Truths <b>and</b> Full Lies').pauseFor(1000).callFunction(() => {
  typewriter.start();
});

//////////////////////////////////////////////////////////////
// AFTER_INTRO:
// events that happen after the continue button is clicked
$('.continue-button').on('click', function() {
  menu_button[0].click();
  menu_button[0].click();

  $('.continue-button').fadeOut(600);
  setTimeout(function() {
    $('#typedWords').fadeOut(800);
    $('#typedWordsSkip').fadeOut(800);
    $('.continue-button').css("display", "none");
  }, 600);
  setTimeout(function() {
    $('#typedTitle').fadeOut(1000);
    $('#typedTitleSkip').fadeOut(1000);
  }, 1400);
  setTimeout(function() {
    $('.loading-container').hide();
    // fade in the controls
    $('.tab-content-container').fadeIn(3500);
    $('.swiper-button-prev').fadeIn(3500);
    $('.swiper-button-next').fadeIn(3500);
    // $('#upButton').show();
    // $('#downButton').show();
  }, 2600);
  document.getElementById("swiper").style.pointerEvents = 'auto';
});

//////////////////////////////////////////////////////////////
// MENU:
menu_text = document.getElementsByClassName("menu-text");
menu_button = document.getElementsByClassName("lottieanimation");
for (var i = 0; i < menu_text.length; i++) {
  menu_text[i].onclick = function() {
    // reset menu content text
    document.getElementById("content_text").innerHTML = "";
    // temporary fix to make menu close after clicking on a menu item
    menu_button[0].click();
    // get the menu item that was clicked
    let thisItem = $(this);
    // fade in the menu item content
    $('#content_text').fadeTo(1000, 1.0);
    $('#upButton').fadeTo(1000, 1.0);
    $('#downButton').fadeTo(1000, 1.0);
    // menu item content is now visible
    menu_item_text_visible = true;
    menuItem = thisItem[0].innerText;
    if (menuItem == "Index") {
      index_page_clicked = true;
      $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
      $('#swiper').fadeTo(1000, 0.4);
      $('#swiper').promise().done(function(){
        $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
        $('.swiper-wrapper').css({ 'margin-bottom': '0vh' });
        index();
      });
    } 
    else {
      index_page_clicked = false;
      $('.swiper-wrapper').css({ transition: 'all 0.7s linear' });
      $('#swiper').fadeTo(1000, 1.0);
      $('.swiper-wrapper').css({ 'margin-bottom': '5vh' });
    }
    if (menuItem == "About the case") {
      aboutTheCase();
    }
    if (menuItem == "About the installation") {
      aboutTheInstallation();
    }
    if (menuItem == "Audio files") {
      audioFiles();
    }
    if (menuItem == "Resources") {
      resources();
    }
  }
}

// temporary fix for button on resize bug
function resizedw(){
  document.body.click();
}

let winresizeTimer;
function reportWindowSize() {
  clearTimeout(winresizeTimer);
  winresizeTimer = setTimeout(resizedw, 100);
}

window.onresize = reportWindowSize;


$(document).click(function(event) {
  var target = $(event.target);
  if (target.attr("class")) {
    if (!target.hasClass("plyr__poster") && !target.hasClass("video-top-div") && !target.hasClass("video-description") && !target.hasClass("plyr__control") && !target.hasClass("plyr__controls") && currentMediumVideoPlayer){
      makeSmall(currentMediumVideoPlayer);
    }
    if (!target.hasClass("plyr__poster") && !target.hasClass("video-top-div") && !target.hasClass("video-description") && !target.hasClass("plyr__control") && !target.hasClass("plyr__controls") && currentLargeVideoPlayer){
      makeSmall(currentLargeVideoPlayer);
    }
  }
});

$(".section").hover(function(event) {
  if (index_page_clicked && !currentMediumVideoPlayer && !currentLargeVideoPlayer) {
    $('#content_text').fadeTo(500, 1.0);
  }
});
