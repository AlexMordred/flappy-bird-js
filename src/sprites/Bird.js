import Sprite from "./Sprite";

class Bird extends Sprite
{
    constructor(image, overrides = {}) {
        super(image, overrides);

        this.state = Object.assign(this.state, {
            gravity: 0.25,
            jump: 4.6,
            rotation: 0,

            // Update the sprite state
            update: function (ctx, ticks) {
                if (this.inGame) {
                    // Update the speed
                    this.dy += this.gravity;

                    // Update the position
                    this.x += this.dx;
                    this.y += this.dy;
                }

                if (ticks % this.ticksPerFrame === 0) {
                    this.currentFrame++;
                    this.currentFrame = this.currentFrame % this.frames.length;
                    this.frame = this.frames[this.currentFrame];
                }
            },
        });

        this.originalState = Object.assign({}, this.state);
    }

    flap() {
        this.state.dy = -this.state.jump;
    }
}

export default Bird;