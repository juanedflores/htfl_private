# HTFLs Tasks Done - Juan

--- 

**Task**:  
Remove the visual artifacts that are visible in the audio player section.
![](https://i.imgur.com/Zy9bXDV.png)
**Fix**:  

```css
.green-audio-player {
/**
	-webkit-box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.07);
	box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.07);
*/
}
```
--- 

**Problem**:  
Audio player bar extended the size of the div, making it scrollable horizontally when it shouldn't be.
![](https://i.imgur.com/R1arfGb.png)
**Task**:  
Shorten the width of the audio player to fit within the div container.  
**Fix**:  
```css
.green-audio-player {
	width: 100%;
}
```


---

**Problem**:  
Hovering in and out quickly in the div containing the audio players will cause some of them to stay visible when they shouldn’t be.
![](https://i.imgur.com/oAZSRUv.png)
**Task**:  
Either make all of them visible at all times, or make the one that is being played the only one that is visible.
**Fix**: <mark style="background: #FFF3A3A6;">TODO:</mark>

---

**Task**:  
Video thumbnails are semi-transparent. Should be fully visible.
![](https://i.imgur.com/pfR59Oe.png)
**Solution**:  
```css
body {
	.swiper-wrapper { opacity: 1 !important; }
}
```

![](https://i.imgur.com/AqXLhit.png)

--- 

**Task**:  
Make the cursor a dot.  
**Solution**:
```css
/* loads a dot image that is 4px by 4px */
body { 
	cursor: url('../assets/cursor.png'), pointer !important; }
```
![|300](https://i.imgur.com/XhlXxMm.png)

---

**Task**:  
Animate cursor on click.

**Solution**:  
<mark style="background: #FFF3A3A6;">TODO:</mark>

---

**Task**:  
Disable the video slider functionality until the continue button is clicked.

**Solution:**  
```javascript
document.addEventListener('DOMContentLoaded', () => {
	document.getElementById("swiper").style.pointerEvents = 'none'; 
}

$('.continue-button').on('click', function() {
	document.getElementById("swiper").style.pointerEvents = 'auto';
}
```

---

**Task**:  
Video slider should appear when the page is loaded. Because the video players require time to properly load and be positioned, they should be hidden until fully loaded. Can be made more efficient by only loading the ones that would fit within the page. 10 out of 43. Load the rest in the background when the Continue button is clicked.

**Solution**:  

---

**Task**:  
Skip typewriter animation by clicking on the screen once.

**Solution**:  
Make a div intended for typewriter animation, and one for skipping. If clicked, hide the animation and show the skip element. Make it skippable only after the animation starts.
```javascript
document.addEventListener('click', function() {
	document.getElementById('typedTitle').style.display = 'none';
	document.getElementById('typedTitleSkip').style.display = 'block';
	document.getElementById('typedWords').style.display = 'none';
	document.getElementById('typedWordsSkip').style.display = 'inline';
	$('.continue-button').show();
});

```

---

**Task**:  
Make Video Thumbnails loaded at different times. “Staggered arrival of images”

**Solution**:  

```javascript
const players = Plyr.setup('.js-player', { controls });

// when video player is ready, make it visible
for (var i = 0; i < players.length; i++) {
	players[i].on('ready', (event) => {
		const player = event.detail.plyr
		random_Time = Math.random() * 1000;
		setTimeout(() => {
			player.elements.container.style.visibility = "visible";
		}, random_Time);
	});
}
```

---

**Task**:
Play video only if it is hovered and changed to medium size to see video info.

---

**Task**:
Stop video if mouse hovers over another video or if clicks any of the background.

--- 

**Task**:  
Figure out why video player looks jittery when resizing in Firefox. It seems to work best in Chrome browser.

---

