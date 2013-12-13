var key = {
    up: 38,
    down: 40,
    left: 37,
    right: 39
}

var SCALE = 20;

function Food(x, y) {
    this.position = {
        x: x,
        y: y
    };

    Food.prototype.update = function() {

    };

    Food.prototype.render = function(graphics) {
        graphics.drawRect("red", this.position.x , this.position.y, 10, 10);
    };

    Food.prototype.collideWith = function(snake) {

        var position = snake.parts[0];
        var headX = (position.x);
        var headY = (position.y) ;

        var foodX = (this.position.x);
        var foodY = (this.position.y );

        if (headX >= foodX - 5 && headX <= foodX + 5) {
            if (headY >= foodY - 5 && headY <= foodY + 5) {
                console.log('colliding')
                return true;
            }
        }

        return false;
    };

    Food.prototype.reset = function() {
        this.position.x = Math.floor(Math.random() * 400);
        this.position.y = Math.floor(Math.random() * 400);


    };
}

function Snake(x, y, keys, game) {
    //Snake position
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.keys = keys;
    this.parts = [];
    this.speed = 0.1;
    this.game = game;
    this.size = 10;

    this.parts.push({
        x: x,
        y: y
    });

    Snake.prototype.update = function() {

        var keyPressed = null;
        if (this.keys[key.up]) {
            this.vy = -this.speed;
            this.vx = 0;

            keyPressed = key.up;

        } else if (this.keys[key.down]) {
            this.vy = this.speed;
            this.vx = 0;

            keyPressed = key.down;
        } else if (this.keys[key.right]) {
            this.vx = this.speed;
            this.vy = 0;

            keyPressed = key.right;
        } else if (this.keys[key.left]) {
            this.vx = -this.speed;
            this.vy = 0;

            keyPressed = key.left;
        }

       
        var head = {x: this.parts[0].x += this.vx, y: this.parts[0].y += this.vy};
        if (game.food.collideWith(this)) {
            this.addPart();
            console.log("add part");
            game.food.reset();
        } else {
            this.parts.pop();
        }
        this.parts.unshift(head);
     
    },

    Snake.prototype.render = function(graphics) {
        for(var i = 0; i < this.parts.length; i++) {
            graphics.drawRect("black", this.parts[i].x * 10, this.parts[i].y * 10, 10, 10)
        }
    }

    Snake.prototype.addPart = function() {


        document.getElementById("size").innerHTML = ((this.parts.length - 1) / 10) + 1;
        
    }
}

function Graphics(ctx) {
    this.ctx = ctx;

    Graphics.prototype.drawLine = function(color, path, width) {
        console.log(path[0])
        this.ctx.setFillColor(color);
        i/*
        this.ctx.lineWidth= width;
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y );*/
        for(var i = 0; i < path.length; i++) {
            var point = path[i];
            this.drawRect(color, point.x, point.y, 10, 10);    
        }/*
        this.ctx.stroke();*/
    }

    Graphics.prototype.drawRect = function(color, x, y, width, height) {
        this.ctx.setFillColor(color)
        this.ctx.fillRect(x - (width / 2), y - (height / 2), width, height);
    };

}

function Game() {
    var game = this;
    this.keys = [];
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    this.graphics = new Graphics(this.ctx);

    window.addEventListener("keydown", function(e) {
        game.keys[e.keyCode] = true;
    }, true);

    window.addEventListener("keyup", function(e) {
        game.keys[e.keyCode] = false;
    }, true);


    this.food = new Food(30, 30);
    this.snake = new Snake(1, 1, this.keys, game);

    Game.prototype.start = function() {
        (function loop() {
            requestAnimationFrame(loop);
            game.render();
            game.update();
        })();

       
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
    }

}

new Game().start();
