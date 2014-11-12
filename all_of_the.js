(function(){
  window.Brown = window.Brown || {};

  Brown.WIDTH = 1000;
  Brown.HEIGHT = 500;

  var Game = Brown.Game = function(ctx) {
    this.ctx = ctx;
    this.asteroids = [];
    this.waterVels = new Array(Brown.WIDTH);
    this.waterAccels = new Array(Brown.WIDTH);

    for(var j = 0; j < Brown.WIDTH; j += 1) {
      this.waterVels[j] = new Array();
      this.waterAccels[j] = new Array();
      var arr = this.waterVels[j];
      var aarr = this.waterAccels[j];
      for(var i = 0; i < Brown.WIDTH; i += 1) {
        arr.push([0, Math.floor(i / 200)]);
        aarr.push([0, 0]);
      }
    };

    this.initializeVels();
  };

  Game.prototype.start = function() {
    var asteroids = this.asteroids;
    var that = this;
    setInterval(function(){
      ctx.fillStyle = "#CFF"
      ctx.fillRect(0, 0, Brown.WIDTH, Brown.HEIGHT);

      for(var i = 0; i < Brown.WIDTH / 50; i += 1) {
        for(var j = 0; j < Brown.HEIGHT / 50; j += 1) {
          var x = 50 * i;
          var y = 50 * j;
          var vels = that.waterVels[x][y];
          var velx = vels[0];
          var vely = vels[1];

          ctx.fillStyle = "#F00";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc (
            x,
            y,
            5,
            0, 2 * Math.PI,
            false
          );
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "#A50";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 20 * velx, y + 20 * vely);
          ctx.stroke();

        }
      }

      setTimeout( function() {
        if(asteroids.length < 20) {
          asteroids.push(new Asteroid(that.ctx));
        }
      }, 500000 * Math.random());


      asteroids.forEach(function(asteroid){
        asteroid.move();
        var x = Math.floor(asteroid.pos[0]);
        var y = Math.floor(asteroid.pos[1]);
        var vels = that.waterVels[x][y];
        asteroid.draw(vels[0], vels[1]);
      })
      that.flow();
    }, 30);
  };

  Game.prototype.flow = function() {
    var that = this;
    this.asteroids.forEach(function(asteroid){
      var x = Math.floor(asteroid.pos[0]);
      var y = Math.floor(asteroid.pos[1]);
      asteroid.pos[0] += that.waterVels[x][y][0];
      asteroid.pos[1] += that.waterVels[x][y][1];
      asteroid.modOut();
    });
    //this.updateAccels();
    //this.seed(3, 3);
  };

  Game.prototype.initializeVels = function() {

    // fill the seeds here.
    for(var j = 0; j < Brown.HEIGHT; j += 1) {
      this.waterVels[0][j][0] =  -(j / Brown.HEIGHT) + 2;
      this.waterVels[0][j][1] = Math.sin(6 * j / Brown.HEIGHT - 1/2) / 1.5;
    }

    for(var i = 0; i < Brown.WIDTH; i += 1) {
      this.waterVels[i][0][0] = -(i / Brown.WIDTH) + 2;
      this.waterVels[i][0][1] = Math.sin(6 * i / Brown.WIDTH) / 1.5;
    }

    // use the seeds to generate the rest.
    this.seed(1, 1);
  };

  Game.prototype.seed = function(x, y) {
    for(var i = x; i < Brown.WIDTH; i += 1) {
      for(var j = y; j < Brown.HEIGHT; j += 1) {
        // duy/dy to the left to tell us our dux/dx
        var duydy = this.waterVels[i - 1][j][1] - this.waterVels[i - 1][j - 1][1];
        this.waterVels[i][j][0] = this.waterVels[i - 1][j][0] - duydy;

        // dux/dx above to tell us our duy/dy
        var duxdx = this.waterVels[i][j - 1][0] - this.waterVels[i - 1][j - 1][0];
        this.waterVels[i][j][1] = this.waterVels[i][j - 1][1] - duxdx;
      }
    }
  };

  // Game.prototype.updateAccels = function () {
  //   var x = 2;
  //   var y = 2;
  //
  //   for(var i = 2; i < Brown.WIDTH; i += 1) {
  //     for(var j = 2; j < Brown.HEIGHT; j += 1) {
  //       if( j === 2 || i === 2) {
  //
  //         var ux = this.waterVels[x][y][0];
  //         var duxdx = this.waterVels[x][y][0] - this.waterVels[x - 1][y][0];
  //         var uy = this.waterVels[x][y][1];
  //         var duxdy = this.waterVels[x][y][0] - this.waterVels[x][y - 1][0];
  //
  //         var d2uxdx2 = this.waterVels[x][y][0] - 2 * this.waterVels[x - 1][y][0] + this.waterVels[x - 2][y][0];
  //         var d2uxdy2 = this.waterVels[x][y][0] - 2 * this.waterVels[x][y - 1][0] + this.waterVels[x][y - 2][0];
  //
  //         var duydx = this.waterVels[x][y][1] - this.waterVels[x - 1][y][1];
  //         var duydy = this.waterVels[x][y][1] - this.waterVels[x][y - 1][1];
  //
  //         var d2uxdx2 = this.waterVels[x][y][1] - 2 * this.waterVels[x - 1][y][1] + this.waterVels[x - 2][y][1];
  //         var d2uxdy2 = this.waterVels[x][y][1] - 2 * this.waterVels[x][y - 1][1] + this.waterVels[x][y - 2][1];
  //
  //         var accelX = (d2uxdx2 + d2uxdy2)/100 - ux * duxdx - uy * duxdy;
  //         var accelY = -1/10 + (d2uxdx2 + d2uxdy2)/100 - ux * duydx - uy * duydy;
  //
  //         accelX = accelX > 5 ? 5 : accelX;
  //         accelX = accelX < -5 ? -5 : accelX;
  //         accelY = accelY > 5 ? 5 : accelY;
  //         accelY = accelY < -5 ? -5 : accelY;
  //
  //         this.waterAccels[x][y][0] = accelX / 3;
  //         this.waterAccels[x][y][1] = accelY / 3;
  //
  //         var velX = this.waterVels[x][y][0] + this.waterAccels[x][y][0];
  //         var velY = this.waterVels[x][y][1] + this.waterAccels[x][y][1];
  //
  //         velX = velX > 3 ? 3 : velX;
  //         velX = velX < -3 ? -3 : velX;
  //         velY = velY > 3 ? 3 : velY;
  //         velY = velY < -3 ? -3 : velY;
  //
  //         this.waterVels[x][y][0] = velX;
  //         this.waterVels[x][y][1] = velY;
  //       }
  //     }
  //   }
  // };

  var Asteroid = Game.Asteroid = function(ctx) {
    this.color = "#FFF";
    this.radius = 30;
    this.accel = [0, 0];
    this.vel = [1/5, -1/3];
    this.pos = [0, Math.random()*500];
    this.ctx = ctx;
  };

  Asteroid.prototype.draw = function(velx, vely) {
    var ctx = this.ctx;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc (
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    ctx.closePath();
    ctx.fill();

    // ctx.fillStyle = "#AA5500";
    // ctx.lineWidth = 5;
    // ctx.beginPath();
    // ctx.moveTo(this.pos[0], this.pos[1]);
    // ctx.lineTo(this.pos[0] + 10 * velx, this.pos[1] + 10 * vely);
    // ctx.stroke();
  };

  Asteroid.prototype.move = function() {

    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.vel[0] += this.accel[0];
    this.vel[1] += this.accel[1];

    this.accel[0] = Math.round((-this.vel[0] + Math.random() - 1/2) / (this.radius/11) );
    this.accel[1] = Math.round((-this.vel[1] + Math.random() - 1/2) / (this.radius/11) );

    this.modOut();
  };

  Asteroid.prototype.modOut = function() {
    var pos = this.pos;

    while(pos[0] < 0) {
      pos[0] += Brown.WIDTH;
    }

    while(pos[0] >= Brown.WIDTH) {
      pos[0] -= Brown.WIDTH;
    }

    while(pos[1] < 0) {
      pos[1] = Math.random() * Brown.HEIGHT;
      pos[0] = 0;
      //pos[1] += Brown.HEIGHT;
    }

    while(pos[1] >= Brown.HEIGHT) {
      pos[1] = Math.random() * Brown.HEIGHT;
      pos[0] = 0;
      //pos[1] -= Brown.HEIGHT;
    }
  }

})();
