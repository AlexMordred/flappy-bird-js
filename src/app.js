import Game from "./Game";

const game = new Game(document.getElementById('canvas'));

game.run();

// // Load audio
// const SCORE_S = new Audio();
// const FLAP = new Audio();
// const HIT = new Audio();
// const SWOOSHING = new Audio();
// const DIE = new Audio();

// SCORE_S.src = 'audio/sfx_point.wav';
// FLAP.src = 'audio/sfx_flap.wav';
// HIT.src = 'audio/sfx_hit.wav';
// SWOOSHING.src = 'audio/sfx_swooshing.wav';
// DIE.src = 'audio/sfx_die.wav';

// // Objects
// const score = {
//     best: parseInt(localStorage.getItem('best')) || 0,
//     value: 0,

//     draw: function () {
//         ctx.fillStyle = '#fff';
//         ctx.strokeStyle = '#000';

//         if (states.current === states.game) {
//             ctx.lineWidth = 2;
//             ctx.font = '35px Teko';
//             ctx.fillText(this.value, cvs.width / 2, 50);
//             ctx.strokeText(this.value, cvs.width / 2, 50);
//         } else if (states.current === states.over) {
//             ctx.font = '25px Teko';
//             // Current score
//             ctx.fillText(this.value, 225, 186);
//             ctx.strokeText(this.value, 225, 186);

//             // Best score
//             ctx.fillText(this.best, 225, 228);
//             ctx.strokeText(this.best, 225, 228);
//         }
//     },

//     reset() {
//         this.value = 0;
//     }
// };
