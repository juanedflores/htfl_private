window.onload = function onLoad() {
  var circle = new ProgressBar.Line('#progress', {
    color: '#FCB03C',
    duration: 3000,
    easing: 'easeInOut',
    trailColor: '#f4f4f4',
  });

  circle.animate(1);
};
