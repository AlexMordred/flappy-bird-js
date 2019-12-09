/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

var cvs = document.getElementById('bird');
var ctx = cvs.getContext('2d'); // Game vars and constants

var frames = 0;
var DEGREE = Math.PI / 180; // Used to convert degrees to radians
// Load the sprites image

var sprite = new Image();
sprite.src = 'img/sprite.png'; // Load audio

var SCORE_S = new Audio();
var FLAP = new Audio();
var HIT = new Audio();
var SWOOSHING = new Audio();
var DIE = new Audio();
SCORE_S.src = 'audio/sfx_point.wav';
FLAP.src = 'audio/sfx_flap.wav';
HIT.src = 'audio/sfx_hit.wav';
SWOOSHING.src = 'audio/sfx_swooshing.wav';
DIE.src = 'audio/sfx_die.wav'; // Game states

var states = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2
};
var startBtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29
}; // Control the game

cvs.addEventListener('click', function (e) {
  switch (states.current) {
    case states.getReady:
      states.current = states.game;
      SWOOSHING.play();
      break;

    case states.game:
      bird.flap();
      FLAP.pause();
      FLAP.currentTime = 0;
      FLAP.play();
      break;

    case states.over:
      // Check if we click on the "start" button on the "game over" sprite
      var rect = cvs.getBoundingClientRect();
      var clickX = e.clientX - rect.left;
      var clickY = e.clientY - rect.top;

      if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
        pipes.reset();
        bird.resetSpeed();
        score.reset();
        states.current = states.getReady;
      }

      break;
  }
}); // Objects

var bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,
  draw: function draw() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }
};
var fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,
  dx: 2,
  draw: function draw() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  },
  update: function update() {
    if (states.current === states.game) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  }
};
var bird = {
  animation: [{
    sX: 276,
    sY: 112
  }, {
    sX: 276,
    sY: 139
  }, {
    sX: 276,
    sY: 164
  }, {
    sX: 276,
    sY: 139
  }],
  frame: 0,
  // sX: 276,
  // sY: 0,
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  radius: 12,
  speed: 0,
  gravity: 0.25,
  jump: 4.6,
  rotation: 0,
  draw: function draw() {
    var bird = this.animation[this.frame];
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -(this.w / 2), -(this.h / 2), this.w, this.h);
    ctx.restore();
  },
  flap: function flap() {
    this.speed = -this.jump;
  },
  update: function update() {
    this.period = states.current === states.getReady ? 10 : 5;
    this.frame += frames % this.period === 0 ? 1 : 0;
    this.frame = this.frame % this.animation.length;

    if (states.current === states.getReady) {
      // Reset the game
      this.y = 150;
      this.rotation = 0;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if (this.y + this.h / 2 >= cvs.height - fg.h) {
        this.y = cvs.height - fg.h - this.h / 2;

        if (states.current === states.game) {
          states.current = states.over;
          DIE.play();
        }
      }

      if (this.speed >= this.jump) {
        this.rotation = 90 * DEGREE;
        this.frame = 1;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }
  },
  resetSpeed: function resetSpeed() {
    this.speed = 0;
  }
};
var getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width / 2 - 173 / 2,
  y: 80,
  draw: function draw() {
    if (states.current == states.getReady) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
};
var gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width / 2 - 225 / 2,
  y: 90,
  draw: function draw() {
    if (states.current == states.over) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
};
var pipes = {
  position: [],
  top: {
    sX: 553,
    sY: 0
  },
  bottom: {
    sX: 502,
    sY: 0
  },
  w: 53,
  h: 400,
  gap: 85,
  maxYPos: -150,
  dx: 2,
  draw: function draw() {
    for (var i = 0; i < this.position.length; i++) {
      var p = this.position[i];
      var topYPos = p.y;
      var bottomYPos = p.y + this.h + this.gap; // Top pipe

      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h); // Bottom pipe

      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
    }
  },
  update: function update() {
    if (states.current !== states.game) {
      return;
    }

    if (frames % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1)
      });
    }

    for (var i = 0; i < this.position.length; i++) {
      var p = this.position[i];
      var bottomPipeYPos = p.y + this.h + this.gap; // Collision detection - top pipe

      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
        states.current = states.over;
        HIT.play();
      } // Collision detection - bottom pipe


      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h) {
        states.current = states.over;
        HIT.play();
      } // Move the pipes to the left


      p.x -= this.dx; // Remove the first pipe if it went beyond the screen to the left

      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        score.best = Math.max(score.value, score.best);
        localStorage.setItem('best', score.best);
        SCORE_S.play();
      }
    }
  },
  reset: function reset() {
    this.position = [];
  }
};
var score = {
  best: parseInt(localStorage.getItem('best')) || 0,
  value: 0,
  draw: function draw() {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';

    if (states.current === states.game) {
      ctx.lineWidth = 2;
      ctx.font = '35px Teko';
      ctx.fillText(this.value, cvs.width / 2, 50);
      ctx.strokeText(this.value, cvs.width / 2, 50);
    } else if (states.current === states.over) {
      ctx.font = '25px Teko'; // Current score

      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186); // Best score

      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },
  reset: function reset() {
    this.value = 0;
  }
}; // Draw the scene

function draw() {
  ctx.fillStyle = '#70c5ce';
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
} // Update the game state


function update() {
  bird.update();
  fg.update();
  pipes.update();
} // The game loop


function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
} // Start the game loop


loop();

/***/ }),

/***/ 0:
/*!**************************!*\
  !*** multi ./src/app.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/alexander/Development/JS/0004. Flappy Bird v2/src/app.js */"./src/app.js");


/***/ })

/******/ });