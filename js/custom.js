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
let audio_media_array;
let currentStartIndex = 0;
let currentEndIndex = 24;
let initialSlide = 7;
let panes_visible = false;
// debugging
let debug_swiper = true;
let indexCells = [];

// menu items (Temporary Fix) TODO: create non webflow menu
panes = document.getElementsByClassName("w-tab-pane");

//////////////////////////////////////////////////////////////
//* [HELPER FUNCTIONS] *//
function index() {
  console.log("index")
  document.getElementById("content_text").innerHTML = indexContent;

  function task(i) {
    setTimeout(function() {
      let name = video_media_array[i]["Subject Name"];
      if (name != currName) {
        cellcount = 0;
        currRow = table.insertRow(rowcount);
        currName = name;
        cell = currRow.insertCell(0);
        // cell.style.fontWeight = "bold";
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
        a.setAttribute('href', "https://google.com");
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
        a.setAttribute('href', "https://google.com");
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
      // debugging slider TODO
      // all loaded slides will be in blue
      // all slides in viewport will be in red
      if (debug_swiper) {
        if (i == video_media_array.length - 1) {
          for (var j = currentStartIndex; j < currentEndIndex; j++) {
            indexCells[j].style.color = "blue";
          }

          video_media_array.forEach(function(item, index) {
            if (item.player) {
              console.log(item.player);
              let player_swiper_slide = item.player.elements.wrapper.offsetParent.offsetParent.offsetParent;
              if (player_swiper_slide.classList.contains("swiper-slide-visible")) {
                console.log("VISIBLE");
                console.log(player_swiper_slide);
                console.log("index: " + (index));
                indexCells[index].style.color = "green";
                if (index == initialSlide) {
                  indexCells[index].style.color = "red";
                }
              } else {
                console.log("NOT VISIBLE");
                console.log(player_swiper_slide);
              }
            }
          })
        }
      }
    }, 100 * i);
  }

  currName = "";
  let currRow;
  let rowcount = 0;
  let cellcount = 0;
  table = document.getElementById("indexTable");

  for (var i = 0; i <= video_media_array.length - 1; i++) {
    task(i);
  }
}

function aboutTheCase() {
  console.log("about the case")
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
  document.getElementById("content_text").innerHTML = audioContent;


  function task(i) {
    setTimeout(function() {
      let name = audio_media_array[i]["Name"];
      let slug = audio_media_array[i]["Slug"];
      let audioID = audio_media_array[i]["Google Drive File ID"];
      console.log(audioID)
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

function makeSmall(element, plyr) {
  if (element.hasClass("mediumVideo")){
    element.removeClass('mediumVideo');
    element.css({ 'min-width' : '1vw' });
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
    element.css({ 'min-width' : '1vw' });
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

function makeSmallLarge2(element, plyr) {
  if (element.hasClass("largeVideo")){
    element.removeClass('largeVideo');
    element.css({ 'min-width' : '1vw' });
    // lower volume to 0
    fadeAudio(plyr, 0);
    // pause the video after ms it takes to return to small
    setTimeout(function() {
      // plyr.pause();
      clearInterval(updateInterval);
      for (let i = 0; i < 5; i++) {
        swiper.slideNext();
      }
    }, 1400);
    // hide the description
    let description = $(element[0].children[1]);
    description.fadeOut(300);
    // update global variables
    currentLargeVideoPlayer = null;
  } 
}

function makeMedium(element, plyr) {
    // will be called when all the animations on the queue finish

  // $('.w--tab-active').fadeOut('slow', function() {
    // will be called when the element finishes fading out
    // if selector matches multiple elements it will be called once for each

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
  $('#content_text').fadeOut(1000);
  $('#content_text').promise().done(function(){
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
  });
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
    <div role="listitem" class="swiper-slide" style="width: 97px; min-width: 1vw; margin-right: 8px">
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

function getCurrentActivePane() {
  return $('.w--tab-active');
}

//////////////////////////////////////////////////////////////
//* [INITIALIZE LIBRARIES] *//
// initialize Swiper
swiper = new Swiper('#swiper', {
  runCallbacksOnInit: false,
  loop: false,
  slidesPerView: 11,
  initialSlide: initialSlide,
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
      currentStartIndex = currentStartIndex+1;
      if (debug_swiper) {
        console.log("currentStartIndex: " + currentStartIndex);
        console.log("currentEndIndex: " + currentEndIndex);
      }
      if (currentStartIndex > video_media_array.length) { 
        currentStartIndex = 0;
        if (debug_swiper) {
          console.log("currentStartIndex WRAPPED!: " + currentStartIndex);
        }
      }
      if (currentEndIndex > video_media_array.length) { 
        currentEndIndex = 0;
        if (debug_swiper) {
          console.log("currentEndIndex WRAPPED!: " + currentEndIndex);
        }
      }

      // add slide to the right
      slide = makeSlide(currentEndIndex);
      swiper.appendSlide(slide);
      // remove slide to the left
      swiper.removeSlide(0);
      // update the swiper
      swiper.update()

      // debugging slider TODO
      // all loaded slides will be in blue
      // all slides in viewport will be in red

      // if (debug_swiper) {
      //   for (var k = 0; k <= video_media_array.length - 1; k++) {
      //     if (k == video_media_array.length - 1) {
      //       for (var j = currentStartIndex; j < currentEndIndex; j++) {
      //         indexCells[j].style.color = "blue";
      //       }
      //
      //       video_media_array.forEach(function(item, index) {
      //         if (item.player) {
      //           console.log(item.player);
      //           let player_swiper_slide = item.player.elements.wrapper.offsetParent.offsetParent.offsetParent;
      //           if (player_swiper_slide.classList.contains("swiper-slide-visible")) {
      //             console.log("VISIBLE");
      //             console.log(player_swiper_slide);
      //             console.log("index: " + (index));
      //             indexCells[index].style.color = "green";
      //             if (index == initialSlide) {
      //               indexCells[index].style.color = "red";
      //             }
      //           } else {
      //             console.log("NOT VISIBLE");
      //             console.log(player_swiper_slide);
      //           }
      //         }
      //       })
      //     }
      //   }
      // }
    },
    slidePrevTransitionEnd: function () {
      console.log("prev");
      currentEndIndex = currentEndIndex-1;
      currentStartIndex = currentStartIndex-1;
      if (currentStartIndex < 0) { 
        currentStartIndex = video_media_array.length-1;
      }
      if (currentEndIndex > 0) { 
        currentEndIndex = video_media_array.length-1;
      }

      slide = makeSlide(currentStartIndex);
      // add a slide to the beginning
      swiper.prependSlide(slide);
      // delete the slide on the end
      swiper.removeSlide(swiper.slides.length-1);
      // update swiper
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


// load CSV data
async function fetchCSV () {
  // video
  const res = await fetch('video_media.csv');
  video_media_array = await res.text();
  video_media_array = $.csv.toObjects(video_media_array)
  video_media_array.sort((a, b) => a["Order in Scrolly Reel"] - b["Order in Scrolly Reel"])
  // audio
  const resaudio = await fetch('audio_media.csv');
  audio_media_array = await resaudio.text();
  audio_media_array = $.csv.toObjects(audio_media_array)
  // audio_media_array.sort((a, b) => a["Order in Scrolly Reel"] - b["Order in Scrolly Reel"])

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

    // add player to video_media_array
    if (i < currentEndIndex+1) {
      video_media_array[i].player = players[i];
    }
  }

  // make video player visible when fully loaded (random between 1 second)
  for (var i = 0; i < players.length; i++) {
    // after a video player is ready
    players[i].on('ready', (event) => {
      let player = event.detail.plyr 
      let player_swiper_slide = player.elements.container.offsetParent.offsetParent;
      let player_videocard = player.elements.container.offsetParent.offsetParent.children[0];
      let player_videoTopDiv = player.elements.container.offsetParent.offsetParent.lastElementChild.children[0];


      // debug mode
      if (debug_swiper) {
        var styles = `
        .swiper-slide-active {
          background: red;
        }
        `
        var styleSheet = document.createElement("style")
        styleSheet.innerText = styles
        document.head.appendChild(styleSheet)
      }

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
          // clearInterval(updateInterval);
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

      /// add end event listener
      player.on('ended', function(data) {
        // data is an object containing properties specific to that event
        let thisItem = $(this);
        let swiper_slide = $(thisItem[0].offsetParent.offsetParent);
        makeSmallLarge2(swiper_slide, thisItem);
        progressbar.set(0.0);
        player.currentTime = 0;
      });

      //////////////////////////////////////////////////////////////
      //* [MOUSE EVENTS FOR SLIDER] *//
      // add mouse events 
      let showDelay = 1000, hideDelay = 1000;
      player_swiper_slide.addEventListener('mouseenter', function() {
        let thisItem = $(this);

        // clearTimeout(resizeTimer);
        if (!resizing) {
          if (menuLeaveTimer != null && currentMediumVideoPlayer != null) {
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
        }
        // })
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

  // variables (TODO: Temporary fix)
  test = document.getElementsByClassName("menu-text");
  menu1_index = test[0];
  menu2_aboutcase = test[1];
  menu3_aboutinstall = test[2];
  menu4_audio = test[3];
  menu5_resources = test[4];
  currently_active_menu = menu5_resources;

  // hide menu text
  $('.w--tab-active').hide();
  // $('.w--tab-active').fadeOut(1000);
  $('#upButton').hide();
  $('#downButton').hide();

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

  // if (debug_swiper) {
    $(".swiper-slide-active").css("border", "1px solid red !important");
  // }
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
  // $('.swiper-button-next').show();
  // $('.swiper-button-prev').show();
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

// temporary fix for button bug
menu_text = document.getElementsByClassName("menu-text");
menu_button = document.getElementsByClassName("lottieanimation");
for (var i = 0; i < menu_text.length; i++) {
  menu_text[i].onclick = function() { //asign a function
    let thisItem = $(this);
    menu_button[0].click();

    $('#content_text').fadeIn(1000);
    menuItem = thisItem[0].innerText;
    if (menuItem == "Index") {
      index();
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
    // pane = getCurrentActivePane();
    // pane.fadeIn(1000);
  }
}

indexContent = `
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

aboutCaseContent = `
  <div id="aboutCaseContent" class="text-block-12">
  </div>
`

aboutInstallContent = 
`
  <div id="aboutCaseInstallation" class="text-block-13">
  </div>
`;

audioContent = 
`
  <div id="audioContent" class="indexcontent">
      <table id="audioTable" style="width: 100%;">
      </table>
  </div>
`

resourcesContent =
`
  <div id="resourcesContent">
  </div>
`

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

