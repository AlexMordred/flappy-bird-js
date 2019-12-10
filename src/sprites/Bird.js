import Sprite from "./Sprite";

class Bird extends Sprite
{
    constructor(image, overrides = {}) {
        super(image, overrides);

        var $this = this;

        this.state = Object.assign(this.state, {
            gravity: 0.25,
            jump: 4.6,
            rotation: 0,
            radius: 12,

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

                this.rotation = this.dy * 4;

                if (this.rotation > 10) {
                    this.currentFrame = 0;
                }
            },

            // Draw the sprite
            draw: function (ctx, image) {
                ctx.save();

                ctx.translate(this.x, this.y);
                ctx.rotate($this.toRadians(this.rotation));

                ctx.drawImage(image, this.frame.sX, this.frame.sY, this.w, this.h, -(this.w / 2), -(this.h / 2), this.w, this.h);

                ctx.restore();
            },
        });

        this.originalState = Object.assign({}, this.state);
    }

    flap() {
        this.state.dy = -this.state.jump;
    }

    /**
     * Current X position
     */
    x() {
        return this.state.x - (this.state.w / 2);
    }

    /**
     * Current Y position
     */
    y() {
        return this.state.y - (this.state.h / 2);
    }

    /**
     * Convert regular degrees to radians
     * 
     * @param {integer} degrees 
     */
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
}

export default Bird;