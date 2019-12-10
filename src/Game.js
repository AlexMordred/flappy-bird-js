import Scene from './Scene';

class Game
{
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Scene & sprites
        this.scene = new Scene(this.canvas);
        this.player = null;

        // Rectangle of the "Start" button on the Game Over screen
        this.restartBtn = {
            x: 120,
            y: 263,
            w: 83,
            h: 29,
        };

        // Game loop
        this.loopInterval = null;
        this.fps = 60;
        this.ticks = 0;

        // Game states
        this.states = {
            getReady: 0,
            game: 1,
            gameOver: 2,
        };

        this.state = this.states.getReady;
    }

    /**
     * The game loop
     */
    loop() {
        this.update();
        this.draw();
        this.detectCollisions();

        this.ticks++;
    }
    
    /**
     * Update the scene state
     */
    update() {
        // Determine which sprites should be updated
        this.scene.sprites['getReadyScreen'].state.shouldUpdate =
            this.state === this.states.getReady;

        // Update all the sprites
        for (let name of this.scene.map) {
            let sprite = this.scene.sprites[name];

            if (sprite) {
                // Update the sprite's inGame flag
                sprite.state.inGame = this.state === this.states.game;

                sprite.update(this.ctx, this.ticks);
            }
        }
    }

    /**
     * Draw the scene
     */
    draw() {
        // Draw the background
        this.ctx.fillStyle = '#70c5ce';
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        
        // Determine which sprites should be drawn
        this.scene.sprites['getReadyScreen'].state.shouldDraw =
            this.state === this.states.getReady;
        this.scene.sprites['gameOverScreen'].state.shouldDraw =
            this.state === this.states.gameOver;

        // Draw all the sprites
        for (let name of this.scene.map) {
            let sprite = this.scene.sprites[name];

            if (sprite) {
                sprite.draw(this.ctx);
            }
        }
    }

    /**
     * Detect collisions, update game state on a collision
     */
    detectCollisions() {
        // Floot collision
        if (this.player.y() + this.player.h() >= this.canvas.clientHeight - this.scene.sprites['fg'].h()) {
            this.player.state.y = this.canvas.clientHeight - this.scene.sprites['fg'].h() - this.player.h();
            this.gameOver();
        }
    }

    /**
     * Start the game loop
     */
    run() {
        this.initialize();

        this.player = this.scene.sprites['player'];

        this.loopInterval = setInterval(() => {
            this.loop();
        }, 1000 / this.fps);
    }

    /**
     * Reset the game state
     */
    reset() {
        // Update all the sprites
        for (let name of this.scene.map) {
            let sprite = this.scene.sprites[name];

            if (sprite) {
                sprite.reset();
            }
        }
    }

    /**
     * Start the game
     */
    start() {
        this.state = this.states.game;
    }

    /**
     * The player has lost
     */
    gameOver() {
        this.state = this.states.gameOver;

        this.player.state.moving = false;
        this.player.state.inGame = false;
    }

    /**
     * Initialize the game
     */
    initialize() {
        // Create all the sprites
        this.scene.initialize();

        // Load the sounds
        // TODO:

        // Game controls
        this.canvas.addEventListener('click', (e) => {
            switch (this.state) {
                case this.states.getReady:
                    this.start();
                    
                    break;
                case this.states.game:
                    this.player.flap();

                    // FLAP.pause();
                    // FLAP.currentTime = 0;
                    // FLAP.play();
                    break;
                case this.states.gameOver:
                    // Check if we click on the "start" button on the "game over" sprite
                    let rect = this.canvas.getBoundingClientRect();
                    let clickX = e.clientX - rect.left;
                    let clickY = e.clientY - rect.top;

                    if (clickX >= this.restartBtn.x && clickX <= this.restartBtn.x + this.restartBtn.w && clickY >= this.restartBtn.y && clickY <= this.restartBtn.y + this.restartBtn.h) {
                        this.reset();
                        this.start();
                        
                        this.state = this.states.getReady;
                    }

                    break;
            }
        });
    }
}

export default Game;