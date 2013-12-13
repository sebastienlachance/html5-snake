var key = {
    up: 38,
    down: 40,
    left: 37,
    right: 39
}

var SCALE = 10;

function Food() {

    this.position = {};
    this.reset();

    Food.prototype.update = function() {

    };

    Food.prototype.render = function(graphics) {
        graphics.drawRect("red", this.position.x  * SCALE , this.position.y * SCALE, SCALE, SCALE);
    };

    Food.prototype.collideWith = function(snake) {
        var head = snake.parts[0];
        var headX = head.x;
        var headY = head.y;

        var foodX = (this.position.x);
        var foodY = (this.position.y );

        if (headX == foodX && headY == foodY) { 
            return true;
        }

        return false;
    };

   
}
Food.prototype.reset = function() {
    this.position.x = Math.round(Math.random() * (game.width - SCALE) / SCALE);
    this.position.y = Math.round(Math.random() * (game.height - SCALE) / SCALE);
};


function Snake(x, y, keys, game) {
    //Snake position
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.keys = keys;
    this.parts = [];
    this.speed = 1;
    this.game = game;
    this.lastDirection = null;

    this.parts.push({
        x: x,
        y: y
    });

    Snake.prototype.update = function() {

        
        if (this.keys[key.up]) {
            if (this.lastDirection != key.down) {
                this.vy = -this.speed;
                this.vx = 0;
                this.lastDirection = key.up;    
            }

        } else if (this.keys[key.down]) {
            if (this.lastDirection != key.up) {
                this.vy = this.speed;
                this.vx = 0;
                this.lastDirection = key.down;    
            }
            
        } else if (this.keys[key.right]) {
            if (this.lastDirection != key.left) {
                this.vx = this.speed;
                this.vy = 0;
                this.lastDirection = key.right;     
            }
        
        } else if (this.keys[key.left]) {
            if (this.lastDirection != key.right) {
                this.vx = -this.speed;
                this.vy = 0;
                this.lastDirection = key.left;      
            }
            
        }

        //Calculate the new position of the head
        var head = {x: this.parts[0].x + this.vx, y: this.parts[0].y + this.vy};
        var collided = false;
        if (game.food.collideWith(this)) {
            //Do not remove last part if colliding
            collided = true;
            game.food.reset();
        } else {
            //Remove the last part of the tail
            this.parts.pop();
        }

        //Add the new head
        this.parts.unshift(head);

        //Check for collision with itself
        for (var i = 1; i < this.parts.length; i++) {
            if (head.x == this.parts[i].x && head.y == this.parts[i].y) {
                game.newGame();
            }
        }        

        //Check for out of canvas position
        if (head.x < 0 || head.y < 0 || head.x > game.width / SCALE || head.y > game.height / SCALE) {
            game.newGame();
        }
     
    },

    Snake.prototype.render = function(graphics) {
        for(var i = 0; i < this.parts.length; i++) {
            graphics.drawRect("black", this.parts[i].x * SCALE, this.parts[i].y * SCALE, SCALE, SCALE)
        }
    }
}

function Graphics(ctx) {
    this.ctx = ctx;
}

Graphics.prototype.drawRect = function(color, x, y, width, height) {
    this.ctx.setFillColor(color)
    this.ctx.fillRect(x, y, width, height);
};

function Game() {
    var game = this;
    this.keys = [];
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    this.graphics = new Graphics(this.ctx);
    this.food = [];
    this.height = this.canvas.height;
    this.width = this.canvas.width;

    window.addEventListener("keydown", function(e) {
        game.keys[e.keyCode] = true;
    }, true);

    window.addEventListener("keyup", function(e) {
        game.keys[e.keyCode] = false;
    }, true);

    this.newGame();

    Game.prototype.start = function() {
        var last = 0;
        (function loop() {
            requestAnimationFrame(loop);
            game.render();
        })();

        setInterval(game.update, 1000/20);
    };

    Game.prototype.update = function() {
        game.snake.update();
    };

    Game.prototype.render = function() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        game.snake.render(this.graphics );
        game.food.render(this.graphics);

        this.ctx.fillText("Score: " + (this.snake.parts.length - 1), 10, 10)
    }
}

Game.prototype.newGame = function() {
    this.food = new Food(); 
    this.food.reset();
    this.snake = new Snake(1, 1, this.keys, this);
    this.snake.nx = 1;
}

new Game().start();
