class Sprite
{
    constructor(image, overrides = {}) {
        this.image = image;

        this.state = Object.assign({
            // Current position on the canvas
            x: 0,
            y: 0,

            // Sprite size
            w: 0,
            h: 0,

            // Deltas
            dx: 0,
            dy: 0,

            // Frames / Animation
            frames: [
                // Array of source positions (inside the sprites image)
                { sX: 0, sY: 0 },
            ],
            currentFrame: 0,
            frame: null,
            ticksPerFrame: 1,

            // Update the sprite state
            update: function (ctx, ticks) {
                // Update the position
                if (this.inGame) {
                    this.x += this.dx;
                    this.y += this.dy;
                }

                if (ticks % this.ticksPerFrame === 0) {
                    this.currentFrame++;
                    this.currentFrame = this.currentFrame % this.frames.length;
                    this.frame = this.frames[this.currentFrame];
                }
            },

            // Draw the sprite
            draw: function (ctx, image) {
                ctx.drawImage(image, this.frame.sX, this.frame.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            },

            // Whether to update the sprite state
            shouldUpdate: true,
            
            // Whether to draw the sprite
            shouldDraw: true,

            // Whether the sprite should/can move (around the scene)
            moving: false,
        }, overrides);

        this.state.frame = this.state.frames[this.state.currentFrame];

        this.originalState = Object.assign({}, this.state);
    }
    
    /**
     * Draw the sprite
     * 
     * @param {2D Context} ctx 
     */
    draw(ctx) {
        if (this.state.shouldDraw) {
            this.state.draw(ctx, this.image);
        }
    }

    /**
     * Update the sprite state
     * 
     * @param {2D Context} ctx
     */
    update(ctx, ticks) {
        if (this.state.shouldUpdate) {
            this.state.update(ctx, ticks);
        }
    }

    /**
     * Reset the sprite state
     */
    reset() {
        this.state = Object.assign({}, this.originalState);
    }

    /**
     * Current X position
     */
    x() {
        return this.state.x;
    }

    /**
     * Current Y position
     */
    y() {
        return this.state.y;
    }

    /**
     * Current width
     */
    w() {
        return this.state.w;
    }

    /**
     * Current height
     */
    h() {
        return this.state.h;
    }
}

export default Sprite;
