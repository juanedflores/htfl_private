// after a video player is ready
players[i].on('ready', (event) => {
  // START:
  let player = event.detail.plyr 
  let player_swiper_slide = player.elements.container.offsetParent.offsetParent;
  let player_videocard = player.elements.container.offsetParent.offsetParent.children[0];
  let player_videoTopDiv = player.elements.container.offsetParent.offsetParent.lastElementChild.children[0];

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
    if (!resizing) {
      if (menuLeaveTimer != null && currentMediumVideoPlayer != null) {
        clearTimeout(menuLeaveTimer);
        // prevPlayer = $(currentMediumVideoPlayer.elements.container.offsetParent.offsetParent);
        // console.log("medium player: ");
        // console.log(currentMediumVideoPlayer[0]);
        prevPlayer = $(currentMediumVideoPlayer.elements.wrapper.parentNode.parentNode);
        console.log(prevPlayer)
        // if any other medium is active
        makeSmall(prevPlayer, currentMediumVideoPlayer);
        // make the currently hovered video medium
        makeMedium(thisItem, player);
      } 
      else if (currentLargeVideoPlayer) {
        // console.log("return");
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
        console.log("background click");
        let player_swiper_slide = currentLargeVideoPlayer.elements.container.offsetParent.offsetParent;
        player_swiper_slide = $(player_swiper_slide);
        makeMedium(player_swiper_slide, currentLargeVideoPlayer);
      }, { once: true });
    }

  });

  player_videocard.addEventListener('click', function() {
    let thisItem = $(player_swiper_slide);
    // console.log(thisItem);

    // index of clicked slide before updating
    clicked_index = 0;
    for (var i = 0; i < swiper.slides.length; i++) {
      if (swiper.slides[i] == thisItem[0]) {
        clicked_index = i;
      }
    }

    swiper.update();
    // console.log("clickedIndex: " + clicked_index);
    if (clicked_index < initialSlide) {
      diff = initialSlide - clicked_index;
      // console.log("diff prev: " + diff);
      for (var i = 0; i < diff-1; i++) {
        prev();
      }
      swiper.slideTo(initialSlide-1);
    }
    else if (clicked_index > initialSlide) {
      diff = clicked_index - initialSlide;
      // console.log("diff next: " + diff);
      for (var i = 0; i < diff-1; i++) {
        next();
      }
      swiper.slideTo(initialSlide+1);
    } else {
      // swiper.slideTo(clicked_index+(diff-1));
    }


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
        // console.log("different")
      } else {
        // console.log("same")
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
  // END:
});
