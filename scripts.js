/* VIDEO BACKGROUND */
var typewriterInitialized = false;
var cssInjected = false;
var initCalled = false;

// Initialize content immediately
function initContent() {
  // Prevent multiple calls
  if (initCalled) return;
  initCalled = true;

  // Initialize video background
  initVideoBackground();

  // Start typewriter effect after 1 second delay
  if (!typewriterInitialized) {
    setTimeout(function () {
      startTypewriter();
      typewriterInitialized = true;
    }, 1000);
  }
}

// Initialize video background with random start time
function initVideoBackground() {
  var video = document.getElementById('bg-video');
  if (video) {
    // Set video to loop
    video.loop = true;

    // When video metadata is loaded, set random start time
    video.addEventListener('loadedmetadata', function () {
      var duration = video.duration; // Duration in seconds
      var randomTime = Math.random() * (duration - 60); // Random time, but leave 60 seconds buffer
      video.currentTime = randomTime;
      video.play();
    });

    // Ensure video plays when it can
    video.addEventListener('canplay', function () {
      video.play();
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  initContent();
});

// Also handle window load as backup
window.addEventListener('load', function () {
  if (!initCalled) {
    initContent();
  }
});

/* TYPEWRITER */

var bool = false;
var typewriterInstance = null;

function startTypewriter() {
  // Prevent multiple initializations
  if (typewriterInstance) return;

  var element = document.getElementById('typewritr');
  if (element) {
    // Check if typewriter is already running
    if (element.getAttribute('data-typewriter-active') === 'true') return;

    // Mark as active
    element.setAttribute('data-typewriter-active', 'true');

    // Clear any existing content
    element.innerHTML = '';

    var toRotate = element.getAttribute('data-type');
    var period = element.getAttribute('data-period');

    if (toRotate) {
      typewriterInstance = new TxtType(element, JSON.parse(toRotate), period);
    }
  }
}

var TxtType = function (el, toRotate, period) {
  // Prevent multiple instances on the same element
  if (el._typewriterInstance) {
    return el._typewriterInstance;
  }

  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.isDeleting = false;

  // Store instance reference
  el._typewriterInstance = this;

  // Start the tick
  this.tick();
};

var nameCount = 0
var makerBool = false;

TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  // Check if we've reached the end of the current text
  if (!this.isDeleting && this.txt === fullTxt) {
    // Set flag when we reach "Hi, I'm a Maker."
    if (this.txt == 'Hi, I\'m a Maker.') {
      bool = true;
    }
    // If we've reached "Hi, I'm Christian." and bool is true, stop here permanently
    if (this.txt == 'Hi, I\'m Christian.' && bool) {
      // Clear the instance to prevent any further ticks
      this.el._typewriterInstance = null;
      typewriterInstance = null;
      return; // Stop the cycle, keep "Hi, I'm Christian."
    }
    // Pause before starting to delete
    delta = this.period;
    this.isDeleting = true;
  }
  // Check if we've deleted back to the common prefix
  else if (this.isDeleting && this.txt === 'Hi, I\'m') {
    // Move to next text
    this.isDeleting = false;
    this.loopNum++;
    delta = 100;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

// INJECT CSS (only once)
if (!cssInjected) {
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff; -webkit-animation: blink .5s step-end infinite alternate; }";
  document.body.appendChild(css);
  cssInjected = true;
}

var x = window.matchMedia("(max-width: 700px)")
