var key = {
    up:    38,
    down:  40,
    left:  37,
    right: 39
}

function SnakePart() {
    //store each position frame
}

function Snake(x, y, keys) {
    //Snake position
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.keys = keys;
    this.parts = [{x:x, y:y}];
    this.snakeLenght = 1;

    Snake.prototype.update = function() {
        if (this.keys[key.up]) {
            this.vy = -1;
            this.vx = 0;
        }

        if (this.keys[key.down]) {
            this.vy = 1;
            this.vx = 0;
        }

        if (this.keys[key.right]) {
            this.vx = 1;
            this.vy = 0;
        }

        if (this.keys[key.left]) {
            this.vx = -1;
            this.vy = 0;
        }
    },

    Snake.prototype.render = function(ctx) {
        for (var i = 0; i < this.parts.length; i++) {
            var part = this.parts[i];
            part.x += this.vx;
            part.y += this.vy
            ctx.fillRect(part.x, part.y, 10, 10);
        }

    }
}

function Game() {
    var game = this;
    this.keys = [];

    window.addEventListener("keydown", function (e) {
        game.keys[e.keyCode] = true;
    });

    window.addEventListener("keyup", function (e) {
        game.keys[e.keyCode] = false;
    });

    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    this.snake = new Snake(50, 50, this.keys);


    Game.prototype.start = function() {
        (function loop() {
            requestAnimationFrame(loop);
            game.render();
        })();
    };

    Game.prototype.render = function() {
        game.snake.update();
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        game.snake.render(game.ctx);
    }

}

new Game().start();



