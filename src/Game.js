import Scene from './Scene';
import Fx from './Fx';

class Game
{
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Game settings
        this.pipesGap = 85;

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

        // Sound effects
        this.fx = null;

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
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
    }

    /**
     * The game loop
     */
    loop() {
        // The pipes
        if (this.state === this.states.game) {
            // Add a pipe every 100 ticks
            if (this.ticks % 100 === 0) {
                const y = -((this.canvas.clientHeight - this.scene.sprites['fg'][0].h()) / 2)
                    * (Math.random() + 1);

                this.scene.addPipes(this.canvas.clientWidth, y, this.pipesGap);
            }

            // Remove pipes that went beyond the screen on the left
            if (this.scene.recyclePipes()) {
                // If any were removed - increase the score
                this.addScore();
            }
        }

        this.update();
        this.draw();
        this.detectCollisions();

        this.ticks++;
    }
    
    /**
     * Update the scene state
     */
    update() {
        // Update all the sprites
        for (let name of this.scene.map) {
            for (let sprite of this.scene.sprites[name]) {
                // Update the sprite's inGame flag
                sprite.state.inGame = this.state === this.states.game;
                sprite.state.shouldUpdate = this.state === this.states.game;

                sprite.update(this.ctx, this.ticks);
            }
        }

        // Let the player fall to the ground after a collision
        if (this.state === this.states.gameOver && this.player.y() + this.player.h() < this.canvas.clientHeight - this.scene.sprites['fg'][0].h()) {
            this.player.state.inGame = true;

            this.player.state.update(this.ctx, this.ticks);
        }

        // The player sprite animation should play on the Get Ready screen
        if (this.state === this.states.getReady) {
            this.player.state.shouldUpdate = true;

            this.player.state.update(this.ctx, this.ticks);
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
        this.scene.sprites['getReadyScreen'][0].state.shouldDraw =
            this.state === this.states.getReady;
        this.scene.sprites['gameOverScreen'][0].state.shouldDraw =
            this.state === this.states.gameOver;

        // Draw all the sprites
        for (let name of this.scene.map) {
            for (let sprite of this.scene.sprites[name]) {
                sprite.draw(this.ctx);
            }
        }

        // Draw the score in game
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#000';

        if (this.state === this.states.game) {
            this.ctx.lineWidth = 2;
            this.ctx.font = '35px Teko';
            this.ctx.fillText(this.score, this.canvas.width / 2, 50);
            this.ctx.strokeText(this.score, this.canvas.width / 2, 50);
        } else if (this.state === this.states.gameOver) {
            this.ctx.font = '25px Teko';

            // Current score
            this.ctx.fillText(this.score, 225, 186);
            this.ctx.strokeText(this.score, 225, 186);

            // Best score
            this.ctx.fillText(this.bestScore, 225, 228);
            this.ctx.strokeText(this.bestScore, 225, 228);
        }
    }

    /**
     * Detect collisions, update game state on a collision
     */
    detectCollisions() {
        // Floor
        if (this.player.y() + this.player.h() >= this.canvas.clientHeight - this.scene.sprites['fg'][0].h()) {
            this.player.state.y = this.canvas.clientHeight - this.scene.sprites['fg'][0].h() - (this.player.h() / 2);

            this.gameOver();
        }

        for (let p of this.scene.sprites['pipes']) {
            // Check if any of the 4 player sprite corners overlap with a pipe
            const collision =
                // Player's top right corner
                (
                    this.player.x() + this.player.w() >= p.x()
                    && this.player.x() + this.player.w() <= p.x() + p.w()
                    && this.player.y() >= p.y()
                    && this.player.y() <= p.y() + p.h()
                )
                || 
                // Player's bottom right corner
                (
                    this.player.x() + this.player.w() >= p.x()
                    && this.player.x() + this.player.w() <= p.x() + p.w()
                    && this.player.y() + this.player.h() >= p.y()
                    && this.player.y() + this.player.h() <= p.y() + p.h()
                )
                || // Player's top left corner
                (
                    this.player.x() >= p.x()
                    && this.player.x() <= p.x() + p.w()
                    && this.player.y() >= p.y()
                    && this.player.y() <= p.y() + p.h()
                )
                ||
                // Player's bottom left corner
                (
                    this.player.x() >= p.x()
                    && this.player.x() <= p.x() + p.w()
                    && this.player.y() + this.player.h() >= p.y()
                    && this.player.y() + this.player.h() <= p.y() + p.h()
                );

            if (collision) {
                this.gameOver();
            }
        }
    }

    /**
     * Increment the game score by 1
     */
    addScore() {
        this.score++;
        this.bestScore = Math.max(this.score, this.bestScore);

        localStorage.setItem('bestScore', this.bestScore);
        
        this.fx.play('score');
    }

    /**
     * Start the game loop
     */
    run() {
        this.initialize();

        this.player = this.scene.sprites['player'][0];

        this.loopInterval = setInterval(() => {
            this.loop();
        }, 1000 / this.fps);
    }

    /**
     * Reset the game state
     */
    reset() {
        // Remove all the pipes
        this.scene.resetPipes();

        // Update all the sprites
        for (let name of this.scene.map) {
            for (let sprite of this.scene.sprites[name]) {
                sprite.reset();
            }
        }

        // Reset the current score
        this.score = 0;
    }

    /**
     * Start the game
     */
    start() {
        this.ticks = 0;
        this.state = this.states.game;

        this.fx.play('swoosh');
    }

    /**
     * The player has lost
     */
    gameOver() {
        if (this.state !== this.states.gameOver) {
            this.fx.play('hit');

            this.state = this.states.gameOver;
        }
    }

    /**
     * Initialize the game
     */
    initialize() {
        // Create all the sprites
        this.scene.initialize();

        // Load the sounds
        this.fx = new Fx({
            score: 'audio/sfx_point.wav',
            flap: 'audio/sfx_flap.wav',
            hit: 'audio/sfx_hit.wav',
            swoosh: 'audio/sfx_swooshing.wav',
        });

        // Game controls
        this.canvas.addEventListener('click', (e) => {
            switch (this.state) {
                case this.states.getReady:
                    this.start();
                    
                    break;
                case this.states.game:
                    this.player.flap();
                    this.fx.play('flap');

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