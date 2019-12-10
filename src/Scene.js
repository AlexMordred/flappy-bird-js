import Sprite from "./sprites/Sprite";
import Bird from "./sprites/Bird";

class Scene
{
    constructor(canvas) {
        this.canvas = canvas;

        this.srcImage = new Image();

        this.sprites = {
            bg: [],
            pipes: [],
            player: [],
            fg: [],
            getReadyScreen: [],
            gameOverScreen: [],
        };

        this.map = [
            'bg',
            'pipes',
            'player',
            'fg',
            'getReadyScreen',
            'gameOverScreen',
        ];

        this.pipe = {
            w: 53,
            h: 400,
            x: 0,
            y: -150,
            dx: -2,
        };

        this.topPipe = Object.assign({}, this.pipe, {
            frames: [
                { sX: 553, sY: 0 },
            ],
        });

        this.bottomPipe = Object.assign({}, this.pipe, {
            frames: [
                { sX: 502, sY: 0 },
            ],
        });
    }

    initialize() {
        this.srcImage.src = 'img/sprite.png';

        // Background
        this.sprites['bg'].push(new Sprite(this.srcImage, {
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
        }));

        // Foreground
        this.sprites['fg'].push(new Sprite(this.srcImage, {
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
        }));

        // The bird (player)
        this.sprites['player'].push(new Bird(this.srcImage, {
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
        }));

        // Get Ready screen
        this.sprites['getReadyScreen'].push(new Sprite(this.srcImage, {
            w: 173,
            h: 152,
            x: (this.canvas.clientWidth / 2) - (173 / 2),
            y: 80,

            frames: [
                { sX: 0, sY: 228 },
            ],
        }));

        // Game Over screen
        this.sprites['gameOverScreen'].push(new Sprite(this.srcImage, {
            w: 225,
            h: 202,
            x: (this.canvas.clientWidth / 2) - (225 / 2),
            y: 90,

            frames: [
                { sX: 175, sY: 228 },
            ],
        }));
    }

    /**
     * Add a set of pipes at an X position and a random Y position
     * @param {integer} x
     * @param {integer} y
     * @param {integer} gap
     */
    addPipes(x, y, gap) {
        const topPipe = new Sprite(this.srcImage, Object.assign({}, this.topPipe, {
            x: x,
            y: y,
        }));

        const bottomPipe = new Sprite(this.srcImage, Object.assign({}, this.bottomPipe, {
            x: x,
            y: topPipe.y() + topPipe.h() + gap,
        }));
        
        this.sprites['pipes'].push(topPipe);
        this.sprites['pipes'].push(bottomPipe);
    }

    /**
     * Remove pipes that went beyond the screen on the left
     */
    recyclePipes() {
        if (this.sprites['pipes'].length >= 2 && this.sprites['pipes'][0].x() + this.sprites['pipes'][0].w() < 0) {
            // Remove the first two pips (top and bottom)
            this.sprites['pipes'].shift();
            this.sprites['pipes'].shift();

            return true;
        }

        return false;
    }

    /**
     * Remove all the pipes
     */
    resetPipes() {
        this.sprites['pipes'].splice(0, this.sprites['pipes'].length);
    }
}

export default Scene;