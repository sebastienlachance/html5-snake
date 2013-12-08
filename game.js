var key = {
    up:    38,
    down:  40,
    left:  37,
    right: 39
}

function SnakeTail(x, y) {
    //store each position frame
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.nextTail = null;
    this.queue = [];
    this.queue.push({vx: this.vx, vy: this.vy, expiresIn: null});
    SnakeTail.prototype.update = function() {

        this.x += this.queue[0].vx;
        this.y += this.queue[0].vy;

        if (this.queue[0].expiresIn === null) {

        } else {
            if (this.queue[0].expiresIn !== null){
                this.queue[0].expiresIn--;
                if (this.queue[0].expiresIn <= 0) {
                    console.log(this.queue[0].expiresIn);
                    this.queue.shift();
                } else {

                }
            }
        }

    };

    SnakeTail.prototype.render = function(ctx) {
        ctx.setFillColor("red")
        ctx.fillRect(this.x, this.y, 20, 20);
    };

    SnakeTail.prototype.setDirection = function(vx, vy, changesIn) {
        if (this.nextTail != null) {
            this.nextTail.setDirection(this.vx, this.vy, changesIn);
        }
console.log(changesIn);

        this.queue[this.queue.length -1].expiresIn = changesIn;

        if (this.vx == 0 && this.vy == 0)
            this.queue[0].expiresIn = 20;

        this.queue.push({vx: vx , vy: vy, expiresIn: null});



    };
}

function Snake(x, y, keys) {
    //Snake position
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.keys = keys;
    this.tail = null;
    this.step = 0;
    this.lastKey = null;
    this.updatesSinceLastDirectionChange = 0;

    Snake.prototype.update = function() {




        var keyPressed = null;
        if (this.keys[key.up]) {
            this.vy = -1;
            this.vx = 0;

            keyPressed = key.up;

        } else if (this.keys[key.down]) {
            this.vy = 1;
            this.vx = 0;

            keyPressed = key.down;
        }else if (this.keys[key.right]) {
            this.vx = 1;
            this.vy = 0;

            keyPressed = key.right;
        }else if (this.keys[key.left]) {
            this.vx = -1;
            this.vy = 0;

            keyPressed = key.left;
        }

        if (this.vx > 0 || this.vy > 0)
            this.updatesSinceLastDirectionChange++;


        if (keyPressed !== null && keyPressed !== this.lastKey) {
            this.lastKey = keyPressed;
            if (this.tail != null) {
                this.tail.setDirection(this.vx, this.vy, this.updatesSinceLastDirectionChange)
                this.updatesSinceLastDirectionChange = 0;
            }
        }





        this.x += this.vx;
        this.y += this.vy





        if (this.tail != null) {
            this.tail.update();
        }


    },

    Snake.prototype.render = function(ctx) {
        ctx.setFillColor("black")
        ctx.fillRect(this.x, this.y, 20, 20);
        if (this.tail != null) {
            this.tail.render(ctx);
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
    this.snake.tail = new SnakeTail(50, 50)


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



