(function(){
  window.Brown = window.Brown || {};

  Brown.WIDTH = 1000 + 30;
  Brown.HEIGHT = 500 + 30;

  var Game = Brown.Game = function(ctx) {
    this.ctx = ctx;
    this.asteroids = [];
    this.clumpField = [];
    this.waterVels = new Array(Brown.WIDTH);
    this.clumpField = new Array(Brown.WIDTH);
    this.leftSide = 0;

    for(var j = 0; j < Brown.WIDTH; j += 1) {
      this.waterVels[j] = new Array();
      this.clumpField[j] = new Array();
      var arr = this.waterVels[j];
      var carr = this.clumpField[j];
      for(var i = 0; i < Brown.WIDTH; i += 1) {
        arr.push([0, Math.floor(i / 200)]);
        carr.push([0, 0]);
      }
    };

    this.initializeVels();
  };

  Game.prototype.start = function() {
    var asteroids = this.asteroids;
    var that = this;
    this.time = 0;
    setInterval(function(){
      ctx.fillStyle = "#CFF"
      ctx.fillRect(0, 0, Brown.WIDTH, Brown.HEIGHT);

      // for(var i = 0; i < Brown.WIDTH / 50; i += 1) {
      //   for(var j = 0; j < Brown.HEIGHT / 50; j += 1) {
      //     var x = Brown.WIDTH - 50 * i - 1;
      //     var y = 50 * j;
      //     var vels = that.waterVels[x][y];
      //     var velx = vels[0];
      //     var vely = vels[1];
      //
      //     ctx.fillStyle = "#F00";
      //     ctx.lineWidth = 5;
      //     ctx.beginPath();
      //     ctx.arc (
      //       x,
      //       y,
      //       5,
      //       0, 2 * Math.PI,
      //       false
      //     );
      //     ctx.closePath();
      //     ctx.fill();
      //
      //     ctx.strokeStyle = "#A50";
      //     ctx.lineWidth = 5;
      //     ctx.beginPath();
      //     ctx.moveTo(x, y);
      //     ctx.lineTo(x + 20 * velx, y + 20 * vely);
      //     ctx.stroke();
      //
      //   }
      // }

      setTimeout( function() {
        if(asteroids.length < 2000) {
          asteroids.push(new Asteroid(that.ctx));
        }
      }, 5000 * Math.random());


      asteroids.forEach(function(asteroid){
        // asteroid.move();
        //var x = Math.floor(asteroid.pos[0]);
        //var y = Math.floor(asteroid.pos[1]);
        // var vels = that.waterVels[x][y];
        asteroid.draw();
      })
      that.flow();
      // that.time += 1;
      // that.time %= 200;
    }, 30);

  };

  // Game.prototype.scroll = function (direction) {
  //   // 1 for left
  //   // -1 for right
  //
  //   this.asteroids.forEach(function(asteroid){
  //     asteroid.pos[0] += direction;
  //   })
  //
  //   if(direction === 1) {
  //     this.waterVels.unshift(new Array(Brown.HEIGHT));
  //     this.waterVels.pop();
  //     this.leftSide -= 1;
  //     this.fillNewColumn(0);
  //   } else {
  //     this.waterVels.push(new Array(Brown.HEIGHT));
  //     this.waterVels.shift();
  //     this.leftSide += 1;
  //     this.fillNewColumn(Brown.WIDTH - 1);
  //     //fill them
  //   }
  // };

  // Game.prototype.fillNewColumn = function (idx) {
  //   x = idx;
  //
  //   if(idx === 0) {
  //     this.waterVels[0][0] = [-(this.leftSide / Brown.WIDTH) + 2, Math.sin(6 * this.leftSide / Brown.WIDTH) / 1.5] // pick something here
  //     this.waterVels[0][1] = [-(this.leftSide / Brown.WIDTH) + 2, Math.sin(6 * this.leftSide / Brown.HEIGHT - 1/2) / 1.5]
  //
  //     for(var j = 1; j < Brown.HEIGHT; j += 1) {
  //       this.waterVels[0][j] = new Array(2)
  //       // reverse using duydy = -duxdx
  //       // find duxdx for the row and cells above
  //       // then add duydy to the y-val above
  //       var minus_duxdx = - ( this.waterVels[1][j][0] - this.waterVels[0][j][0]);
  //       this.waterVels[0][j][1] = this.waterVels[0][j - 1][1] + minus_duxdx;
  //
  //       // reverse the same way
  //       // find duydy for the row and cells to the right
  //       // then subtract duxdx from the x-val to the right
  //       var minus_duydy = - ( this.waterVels[1][j - 1][1] - this.waterVels[1][j][1] );
  //       this.waterVels[0][j][0] = this.waterVels[1][j][0] - minus_duydy;
  //     }
  //
  //   } else {
  //     var rightSide = this.leftSide + Brown.WIDTH - 1;
  //     this.waterVels[Brown.WIDTH - 1][0] = [-(rightSide) / Brown.WIDTH + 2, Math.sin(6 * rightSide / Brown.WIDTH) / 1.5] // sure wish I knew how to make this reversible
  //
  //     i = Brown.WIDTH - 1;
  //
  //     for(var j = 1; j < Brown.HEIGHT; j += 1) {
  //       this.waterVels[i][j] = new Array(2);
  //       // duy/dy to the left to tell us our dux/dx
  //       var duydy = this.waterVels[i - 1][j][1] - this.waterVels[i - 1][j - 1][1];
  //       this.waterVels[i][j][0] = this.waterVels[i - 1][j][0] - duydy;
  //
  //       // dux/dx above to tell us our duy/dy
  //       var duxdx = this.waterVels[i][j - 1][0] - this.waterVels[i - 1][j - 1][0];
  //       this.waterVels[i][j][1] = this.waterVels[i][j - 1][1] - duxdx;
  //     }
  //
  //   }
  // };

  Game.prototype.flow = function() {
    var that = this;

    if(that.time === 0) {
      // console.log("heyyyy")
      this.updateClumpField();
    } else {
      // console.log("got here at all even a little bit?")
      this.asteroids.forEach(function(asteroid) {
        var x = Math.floor(asteroid.pos[0]);
        var y = Math.floor(asteroid.pos[1]);
        asteroid.pos[0] += that.waterVels[x][y][0];
        asteroid.pos[1] += that.waterVels[x][y][1];
        asteroid.modOut();

        var xClump = that.clumpField[x][y][0];
        var yClump = that.clumpField[x][y][1];
        var shade = 255;
        if(Math.abs(xClump) > 1/6) {
          asteroid.pos[0] += -1 * Math.sign(xClump) * 0.3;
        } else {
          asteroid.pos[0] += xClump;
        }

        if(Math.abs(yClump) > 1/6) {
          asteroid.pos[0] += -1 * Math.sign(yClump) * 0.3;
        } else {
          asteroid.pos[1] += yClump;
        }


        asteroid.modOut();
        if(asteroid.modded) {
          //that.time = 190;
        }
      });

    }
      that.time += 1;
      that.time %= 100;

    // this.preUpdateClumpField(); // Should reset everything to 0
    // this.asteroids.forEach(function(asteroid){
    //   var x = Math.floor(asteroid.pos[0]);
    //   var y = Math.floor(asteroid.pos[1]);
    //
    // });
    // this.updateClumpField();
    //this.updateAccels();
    //this.seed(3, 3);
  };

  // Game.prototype.preUpdateClumpField = function() {
  //   var that = this;
  //
  //   this.asteroids.forEach(function(asteroid){
  //     var x = Math.floor(asteroid.pos[0]);
  //     var y = Math.floor(asteroid.pos[1]);
  //     for(var i = x - 10; i < x + 10; i += 1) {
  //       if((i > -1) && (i < Brown.WIDTH) && (i != x)) {
  //         for(var j = y - 10; j < y + 10; j += 1) {
  //           if((j > -1) && (j < Brown.HEIGHT) && (j != y)) {
  //             that.clumpField[i][j][0] -= 100 / (x - i);
  //             that.clumpField[i][j][1] -= 100 / (y - j);
  //           }
  //         }
  //       }
  //     }
  //   })
  // }

  Game.prototype.updateClumpField = function() {
    var that = this;
    //console.log("running colors");
    // this.clumpField.forEach(function(row){
    //   row.forEach(function(vector) {
    //     vector[0] = 0;
    //     vector[1] = 0;
    //   })
    // })

    for(var a = 0; a < this.asteroids.length; a += 1) {
      var asteroid = this.asteroids[a];
      var x = Math.floor(asteroid.pos[0]);
      var y = Math.floor(asteroid.pos[1]);

      // Relying on everything being initialized at x=0
      // and nothing else lying at x=0
      // NOT ANYMORE BC UNNECESSARY YAAAA
      //if(x !== 0) {

        // THIS RELIES ON MAX TOTAL SPEED BEING LESS THAN 5
        for(var i = Math.max(x - 40, 0); i < Math.min(x + 40, Brown.WIDTH - 1); i += 1) {
          for(var j = Math.max(y - 40, 0); j < Math.min(y + 40, Brown.HEIGHT - 1); j += 1) {
            // if(y != j) {
              // that.clumpField[i][j][1] -= 1 / (y - j);
              that.clumpField[i][j][1] = 0;
            // }
            // if(x != i) {
              // that.clumpField[i][j][0] -= 1 / (x - i);
              that.clumpField[i][j][0] = 0;
            // }
          }
        }

      //}

      asteroid.pos[0] += that.waterVels[x][y][0];
      asteroid.pos[1] += that.waterVels[x][y][1];
      asteroid.modOut();
      if(asteroid.modded) {
        //that.time = 0;
      }

      // if(Math.abs(that.waterVels[x][y][1]) > 3) {
      //   console.log("watervel is HUGE:", that.waterVels[x][y]);
      // }


    };

    for(var a = 0; a < this.asteroids.length; a += 1) {
      var asteroid = this.asteroids[a];
      x = Math.floor(asteroid.pos[0]);
      y = Math.floor(asteroid.pos[1]);
      for(var i = Math.max(x - 30, 0); i < Math.min(x + 30, Brown.WIDTH - 1); i += 1) {
        for(var j = Math.max(y - 30, 0); j < Math.min(y + 30, Brown.HEIGHT - 1); j += 1) {
          if(x != i) {
            that.clumpField[i][j][0] += 10 / (x - i);
          }
          if(y != j) {
            that.clumpField[i][j][1] += 10 / (y - j);
          }
        }
      }

    };

    for(var a = 0; a < this.asteroids.length; a += 1) {
      var asteroid = this.asteroids[a];
      var x = Math.floor(asteroid.pos[0]);
      var y = Math.floor(asteroid.pos[1]);

      var xClump = that.clumpField[x][y][0];
      var yClump = that.clumpField[x][y][1];
      asteroid.pos[0] += (Math.abs(xClump) > 1/6 ? -1 * Math.sign(xClump) * 0.3 : xClump * 10);
      asteroid.pos[1] += (Math.abs(yClump) > 1/6 ? -1 * Math.sign(yClump) * 0.3 : yClump * 10);;      //THIS DOESN'T GO HERE
      // var shade = 255;
      // shade -= 5 * (Math.abs(xClump) + Math.abs(yClump));
      // var opacity = 0.2;
      // opacity += (Math.abs(xClump) + Math.abs(yClump)) / 10;
      // // shade -= Math.abs(25*yClump);
      //
      // shade = Math.max(shade, 0);
      // opacity = Math.min(opacity, 1);
      // asteroid.color = "rgba("+ shade + "," + shade + "," + shade + ",.2)";

      asteroid.modOut();
    }; // will I have modout problems?? I don't think so?
    // this.asteroids.forEach(function(asteroid) {
    //   asteroid.pos[0] += that.clumpField[x][y][0];
    //   asteroid.pos[1] += that.clumpField[x][y][1];    /// OH NO THEN MY UNDOS DON'T WORK!!
    //   asteroid.modOut(); //WILL DOUBLE MODDING OUT BREAK THINGS OH NO!!
    // });
  };

  Game.prototype.initializeVels = function() {

    var param = Math.random() + 0.5;

    // fill the seeds here.
    for(var j = 0; j < Brown.HEIGHT; j += 1) {
      this.waterVels[Brown.WIDTH - 1][j][0] =  (j / Brown.HEIGHT) + 1;
      this.waterVels[Brown.WIDTH - 1][j][1] =  (j / Brown.HEIGHT) + 1/2;
    }

    for(var i = 0; i < Brown.WIDTH; i += 1) {
      this.waterVels[i][0][0] = -(i / Brown.WIDTH) + 2;
      this.waterVels[i][0][1] = (-Math.sin(10 * i / Brown.WIDTH) - 1/2) + 1/2;
    }

    // use the seeds to generate the rest.
    this.seed(1, 1);
  };

  Game.prototype.seed = function(x, y) {
    for(var i = x; i < Brown.WIDTH; i += 1) {
      for(var j = y; j < Brown.HEIGHT; j += 1) {
        // duy/dy to the right to tell us our dux/dx
        var duydy = this.waterVels[Brown.WIDTH - i][j][1] - this.waterVels[Brown.WIDTH - i][j - 1][1];
        this.waterVels[Brown.WIDTH - 1 - i][j][0] = this.waterVels[Brown.WIDTH - i][j][0] - duydy;

        // dux/dx above to tell us our duy/dy
        var duxdx = this.waterVels[Brown.WIDTH - 1 - i][j - 1][0] - this.waterVels[Brown.WIDTH - i][j - 1][0];
        this.waterVels[Brown.WIDTH - 1 - i][j][1] = this.waterVels[Brown.WIDTH - 1 - i][j - 1][1] - duxdx;
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
    this.color = "rgba(255,255,255,.2)";
    this.radius = Math.random() * 10 + 25;
    // this.accel = [0, 0];
    this.vel = [0, 0];
    this.pos = new Array(2);
    this.randomizePos();
    // this.pos = [0, Math.random()*500];
    this.ctx = ctx;
  };

  Asteroid.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.fillStyle = this.color;
  //  console.log(this.color);
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
    // this.vel[0] += this.accel[0];
    // this.vel[1] += this.accel[1];

    // this.accel[0] = Math.round((-this.vel[0] + Math.random() - 1/2) / (this/11) );
    // this.accel[1] = Math.round((-this.vel[1] + Math.random() - 1/2) / (this/11) );

    this.modOut();
  };

  Asteroid.prototype.modOut = function() {
    var pos = this.pos;
    this.modded = false;

    while(pos[0] < 0) {
      //pos[0] += Brown.WIDTH;
      this.randomizePos();
      // pos[0] = Math.random() * Brown.WIDTH * 1/2 + Brown.WIDTH/4;
      // pos[1] = Brown.HEIGHT - 1;
      this.modded = true;
    }

    while(pos[0] >= Brown.WIDTH) {
      // pos[0] -= Brown.WIDTH;
      // pos[0] = Math.random() * Brown.WIDTH * 1/2 + Brown.WIDTH/4;
      // pos[1] = 1;
      this.randomizePos();
      this.modded = true;
    }

    while(pos[1] < 0) {
      // pos[1] = Math.random() * Brown.HEIGHT * 1/2 + Brown.HEIGHT/4;
      // pos[0] = Brown.WIDTH - 1;]
      this.randomizePos();
      this.modded = true;
      //pos[1] += Brown.HEIGHT;
    }

    while(pos[1] >= Brown.HEIGHT) {
      // pos[1] = Math.random() * Brown.HEIGHT * 1/2 + Brown.HEIGHT/4;
      // pos[0] = 1;
      this.randomizePos();
      this.modded = true;
      //pos[1] -= Brown.HEIGHT;
    }
  };

  Asteroid.prototype.randomizePos = function () {
    switch(Math.floor(Math.random() * 4)) {
      case 0:
        this.pos[0] = Math.random() * Brown.WIDTH * (8 - 2)/8 + Brown.WIDTH/8;
        this.pos[1] = Brown.HEIGHT - 1;
        break;
      case 1:
        this.pos[0] = Math.random() * Brown.WIDTH * (8 - 2)/8 + Brown.WIDTH/8;
        this.pos[1] = 1;
        break;
      case 2:
        this.pos[1] = Math.random() * Brown.HEIGHT * (8 - 2)/8 + Brown.HEIGHT/8;
        this.pos[0] = Brown.WIDTH - 1;
        break;
      case 3:
        this.pos[1] = Math.random() * Brown.HEIGHT * (8 - 2)/8 + Brown.HEIGHT/8;
        this.pos[0] = 1;
      break;
    }
  };
})();
