//方向枚举，数值对应键盘键值
enum Direction {
  Up = 38,
  Down = 40,
  Right = 39,
  Left = 37,
  Space = 32
}

interface Point {
  x: number;
  y: number;
}

class Game {
  canvas: HTMLCanvasElement;
  scorePanel: HTMLElement;
  col: number = 10;
  raw: number = 10;
  score: number = 0;
  block_color: string = "#008000";
  blank_color: string = "#fff";
  wall_color: string = "#000";
  block_width: number = 50;
  current_shape: Point;
  Next_Position: Point;
  Position: Point;
  Timer: number;
  interval: number = 2000;
  boardArray: number[] = [];
  comNum: number = 0;
  wallNum: number = -1;
  blockNum: number = 1;
  BombTimer: number;


  initialUI() {
    this.canvas = document.createElement("canvas");
    this.scorePanel = document.createElement("div");
    this.scorePanel.innerHTML="score:<label id='score'>"+this.score+"</label>,speed:<label id='speed'>"+Math.floor(this.interval/1000)+"</label>";
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
  }
  drawLine() {
    let ctx = this.canvas.getContext("2d");
    //画横线
    ctx.beginPath();
    ctx.translate(0.5, 0.5);
    for (var y = 0; y <= this.col; y ++) {
      ctx.moveTo(0, y * this.block_width);
      ctx.lineTo(this.col * this.block_width, y * this.block_width);
    }
    //画竖线
    for (var x = 0; x <= this.raw; x ++) {
      ctx.moveTo(x * this.block_width, 0);
      ctx.lineTo(x * this.block_width, this.raw * this.block_width);
    }

    ctx.stroke();

    //数学化面板，以行序存储
    for (var y = 0; y < this.col; y ++) {
      for (var x = 0; x < this.raw; x ++) {
        //如果是四周，则设置值为墙的值
        if (x == 0 || y == 0 || x == this.raw - 1 || y == this.col - 1) {
          this.boardArray.push(this.wallNum);
        } else {
          this.boardArray.push(this.comNum);
        }
      }
    }
    this.TimeLimit();

  }

  RandomPosition(): Point {
    var p_x = Math.floor(Math.random()*this.col);
    var p_y = Math.floor(Math.random()*this.raw);
    return {x:p_x,y:p_y};
  }

  DoKeyEvent() {
    this.canvas.onclick = (e) => {
      if(this.Position.x===Math.floor((e.x - 425)/50)&&this.Position.y===Math.floor((e.y - 88)/50)) {
        this.score += 2;
        clearTimeout(this.Timer);
        document.getElementById('score').innerHTML = this.score+"";
        document.getElementById('speed').innerHTML = Math.ceil(this.interval/1000) +"";
        this.interval *= 1 - this.score/this.interval;
        if (this.score >= 500) {
          alert("Victory!!!");
          this.initialUI();
        }
        this.eraseBlock(this.Position);
        this.TimeLimit();
      }
    }
  }

  TimeLimit() {
    this.Position = this.RandomPosition();
    this.drawBlock(this.Position,this.block_color);
    this.Timer = setTimeout(() => {
      this.eraseBlock(this.Position);
      this.TimeLimit();
    }, this.interval);
  }

  eraseBlock(shape: Point) {
    let ctx = this.canvas.getContext("2d");
    ctx.fillStyle = this.blank_color;

    ctx.fillRect(shape.x * this.block_width + 0.5 , shape.y * this.block_width + 0.5, this.block_width - 1, this.block_width - 1);
  }

  drawBlock(shape: Point,color: string) {
    let ctx = this.canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(shape.x * this.block_width + 0.5 , shape.y * this.block_width + 0.5, this.block_width - 1, this.block_width - 1);
  }

}

window.onload = () => {
  new Game().initialUI();

}
