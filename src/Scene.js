import Sprite from "./sprites/Sprite";
import Bird from "./sprites/Bird";

class Scene
{
    constructor(canvas) {
        this.canvas = canvas;

        this.srcImage = new Image();

        this.sprites = {};

        this.map = [
            'bg',
            'player',
            'fg',
            'getReadyScreen',
            'gameOverScreen',
        ];
    }

    initialize() {
        this.srcImage.src = 'img/sprite.png';

        // Background
        this.sprites['bg'] = new Sprite(this.srcImage, {
            y: this.canvas.clientHeight - 226,
            w: 275,
            h: 226,
            dx: -1,

            frames: [
                { sX: 0, sY: 0 },
            ],

            update: function (ctx) {
                // Update the position
                if (this.inGame) {
                    this.x = (this.x + this.dx) % this.w;
                }
            },

            draw: function (ctx, image) {
                // Draw 3 same sprites in a row
                for (let i = 0; i < 3; i++) {
                    ctx.drawImage(image, this.frame.sX, this.frame.sY, this.w, this.h, this.x + (this.w * i), this.y, this.w, this.h);

                }
            }
        });

        // Foreground
        this.sprites['fg'] = new Sprite(this.srcImage, {
            y: this.canvas.clientHeight - 112,
            w: 224,
            h: 112,
            dx: -2,

            frames: [
                { sX: 276, sY: 0 },
            ],

            update: function (ctx) {
                // Update the position
                if (this.inGame) {
                    this.x = (this.x + this.dx) % (this.w / 2);
                }
            },

            draw: function (ctx, image) {
                // Draw 2 same sprites in a row
                for (let i = 0; i < 2; i++) {
                    ctx.drawImage(image, this.frame.sX, this.frame.sY, this.w, this.h, this.x + (this.w * i), this.y, this.w, this.h);

                }
            }
        });

        // The bird (player)
        this.sprites['player'] = new Bird(this.srcImage, {
            x: 50,
            y: 150,
            w: 34,
            h: 26,

            frames: [
                { sX: 276, sY: 112 },
                { sX: 276, sY: 139 },
                { sX: 276, sY: 164 },
                { sX: 276, sY: 139 },
            ],
            ticksPerFrame: 5,
        });

        // Get Ready screen
        this.sprites['getReadyScreen'] = new Sprite(this.srcImage, {
            w: 173,
            h: 152,
            x: (this.canvas.clientWidth / 2) - (173 / 2),
            y: 80,

            frames: [
                { sX: 0, sY: 228 },
            ],
        });

        // Game Over screen
        this.sprites['gameOverScreen'] = new Sprite(this.srcImage, {
            w: 225,
            h: 202,
            x: (this.canvas.clientWidth / 2) - (225 / 2),
            y: 90,

            frames: [
                { sX: 175, sY: 228 },
            ],
        });
    }
}

export default Scene;