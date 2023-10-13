/* VIDEO BACKGROUND */
var passed = false;
var once_played = false;

// randomly generated start time
var vidlength = 240

function starttime() {
  return Math.ceil(Math.random() * vidlength) + 20
}

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads. 'TJhDvs2_CKY'
var player;

// run when YouTube player is ready
function onYouTubeIframeAPIReady() {

  // _MW6ReBj1Ok
  player = new YT.Player('player', {
    videoId: 'jgm58cbu0kw',
    playerVars: {
      'wmode': 'opaque',
      'start': '200',
      'autoplay': 1,
      'speed': 0.5,
      'controls': 0,
      'vq': '480',
      'mute': 1,
      'showinfo': 0,
      'frameborder': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }

  });
  player.addEventListener('onStateChange', function(event) {

    // OnStateChange Data
    if ([-1, 0, 2, 3, 5].includes(event.data) && !once_played) {
      document.getElementById("player").style.opacity = "0";
      if (event.data == 2) {
        player.playVideo();
      }
    } else {
      once_played = true;
      setTimeout(function() {
        document.getElementById("player").style.opacity = "1";
        document.getElementById("wrapper").style.opacity = "1";
      }, 1000)
      if (!passed) {
        setTimeout(function() {
          var elements = document.getElementsByClassName('typewrite');
          for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new TxtType(elements[i], JSON.parse(toRotate), period);
            }
          }
        }, 1250);
        passed = true;
      }
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

  event.target.playVideo();

  var interval_is_stopped = false;
  setInterval(function() {
    var current_time = event.target.getCurrentTime();

    if (current_time > vidlength && !interval_is_stopped) {
      interval_is_stopped = true;
      jQuery('#player').fadeTo(vidlength, 0.7, function() {
        player.seekTo(starttime());
        passed = true;
        jQuery(this).fadeTo(vidlength, 1, function() {
          interval_is_stopped = false;
        });
      });
    }
  }, 10);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {

  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }

}

function stopVideo() {
  player.stopVideo();
}

// restart the video if it stopped
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    player.playVideo();
  }
}

/* TYPEWRITER */

var bool = false;
/* var x = window.matchMedia("(max-width: 500px)") */

var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

var nameCount = 0
var makerBool = false;

TxtType.prototype.tick = function() {
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

  // if (this.txt == 'Hi, I\'m a Maker.')

  if (!this.isDeleting && this.txt == 'Hi, I\'m Christian.' && bool) {
    return;
  } else if (!this.isDeleting && this.txt === fullTxt) {
    if (!this.isDeleting && this.txt == 'Hi, I\'m a Maker.') {
      bool = true;
    }
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === 'Hi, I\'m') {
    if (bool == true && x.matches) {
      /* document.getElementById("typewritr").style="font-size:8vw"; */
    }
    this.isDeleting = false;
    this.loopNum++;
    delta = 100;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

// INJECT CSS
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff; -webkit-animation: blink .5s step-end infinite alternate; }";
document.body.appendChild(css);

var x = window.matchMedia("(max-width: 700px)")
