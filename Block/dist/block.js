var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 38] = "Up";
    Direction[Direction["Down"] = 40] = "Down";
    Direction[Direction["Right"] = 39] = "Right";
    Direction[Direction["Left"] = 37] = "Left";
    Direction[Direction["Space"] = 32] = "Space";
})(Direction || (Direction = {}));
var Game = (function () {
    function Game() {
        this.col = 10;
        this.raw = 10;
        this.score = 0;
        this.block_color = "#008000";
        this.blank_color = "#fff";
        this.wall_color = "#000";
        this.block_width = 50;
        this.interval = 2000;
        this.boardArray = [];
        this.comNum = 0;
        this.wallNum = -1;
        this.blockNum = 1;
    }
    Game.prototype.initialUI = function () {
        this.canvas = document.createElement("canvas");
        this.scorePanel = document.createElement("div");
        this.scorePanel.innerHTML = "score:<label id='score'>" + this.score + "</label>,speed:<label id='speed'>" + Math.floor(this.interval / 1000) + "</label>";
        this.scorePanel.style.margin = "30px";
        this.canvas.height = this.raw * (this.block_width + 0.5) - 4;
        this.canvas.width = this.col * (this.block_width + 0.5) - 4;
        this.canvas.style.margin = "10px auto auto auto";
        document.body.style.margin = "0px";
        document.body.style.textAlign = "center";
        document.body.appendChild(this.scorePanel);
        document.body.appendChild(this.canvas);
        this.drawLine();
        this.DoKeyEvent();
    };
    Game.prototype.drawLine = function () {
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.translate(0.5, 0.5);
        for (var y = 0; y <= this.col; y++) {
            ctx.moveTo(0, y * this.block_width);
            ctx.lineTo(this.col * this.block_width, y * this.block_width);
        }
        for (var x = 0; x <= this.raw; x++) {
            ctx.moveTo(x * this.block_width, 0);
            ctx.lineTo(x * this.block_width, this.raw * this.block_width);
        }
        ctx.stroke();
        for (var y = 0; y < this.col; y++) {
            for (var x = 0; x < this.raw; x++) {
                if (x == 0 || y == 0 || x == this.raw - 1 || y == this.col - 1) {
                    this.boardArray.push(this.wallNum);
                }
                else {
                    this.boardArray.push(this.comNum);
                }
            }
        }
        this.TimeLimit();
    };
    Game.prototype.RandomPosition = function () {
        var p_x = Math.floor(Math.random() * this.col);
        var p_y = Math.floor(Math.random() * this.raw);
        return { x: p_x, y: p_y };
    };
    Game.prototype.DoKeyEvent = function () {
        var _this = this;
        this.canvas.onclick = function (e) {
            if (_this.Position.x === Math.floor((e.x - 425) / 50) && _this.Position.y === Math.floor((e.y - 88) / 50)) {
                _this.score += 2;
                clearTimeout(_this.Timer);
                document.getElementById('score').innerHTML = _this.score + "";
                document.getElementById('speed').innerHTML = Math.ceil(_this.interval / 1000) + "";
                _this.interval *= 1 - _this.score / _this.interval;
                if (_this.score >= 500) {
                    alert("Victory!!!");
                    _this.initialUI();
                }
                _this.eraseBlock(_this.Position);
                _this.TimeLimit();
            }
        };
    };
    Game.prototype.TimeLimit = function () {
        var _this = this;
        this.Position = this.RandomPosition();
        this.drawBlock(this.Position, this.block_color);
        this.Timer = setTimeout(function () {
            _this.eraseBlock(_this.Position);
            _this.TimeLimit();
        }, this.interval);
    };
    Game.prototype.eraseBlock = function (shape) {
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = this.blank_color;
        ctx.fillRect(shape.x * this.block_width + 0.5, shape.y * this.block_width + 0.5, this.block_width - 1, this.block_width - 1);
    };
    Game.prototype.drawBlock = function (shape, color) {
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(shape.x * this.block_width + 0.5, shape.y * this.block_width + 0.5, this.block_width - 1, this.block_width - 1);
    };
    return Game;
}());
window.onload = function () {
    new Game().initialUI();
};
