(function(){
  window.Brown = window.Brown || {};

  Brown.WIDTH = 1000;
  Brown.HEIGHT = 500;

  var Game = Brown.Game = function(ctx) {
    this.ctx = ctx;
    this.asteroids = [ new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx) ];
    this.waterVels = new Array(Brown.WIDTH);

    for(var j = 0; j < Brown.WIDTH; j += 1) {
      this.waterVels[j] = new Array();
      var arr = this.waterVels[j];
      for(var i = 0; i < Brown.WIDTH; i += 1) {
        arr.push([0, Math.floor(i / 200)]);
      }
    };

    this.initializeVels();
    console.log("the vels", this.waterVels)
  };

  Game.prototype.start = function() {
    var asteroids = this.asteroids;
    var that = this;
    setInterval(function(){
      ctx.fillStyle = "#CFF"
      ctx.fillRect(0, 0, Brown.WIDTH, Brown.HEIGHT);
      asteroids.forEach(function(asteroid){
        asteroid.move();
        asteroid.draw();
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

  };

  Game.prototype.initializeVels = function() {

    // fill the seeds here.
    for(var j = 0; j < Brown.HEIGHT; j += 1) {
      this.waterVels[0][j][0] = Math.random() * 3;
      this.waterVels[0][j][1] = Math.tan((j / 500 - 3/4) * (-3/2));
    }

    for(var i = 0; i < Brown.WIDTH; i += 1) {
      this.waterVels[i][0][0] = Math.random() * 2 + 3;
      this.waterVels[i][0][1] = (Math.random() * 2 - 1) / 2;
    }

    // use the seeds to generate the rest.
    for(var i = 1; i < Brown.WIDTH; i += 1) {
      for(var j = 1; j < Brown.HEIGHT; j += 1) {
        // var lastUx = this.waterVels[i - 1][j][0];
        // var lastUy = this.waterVels[i - 1][j][1];

        // duy/dy to the left to tell us our dux/dx
        var duydy = this.waterVels[i - 1][j][1] - this.waterVels[i - 1][j - 1][1];
        this.waterVels[i][j][0] = this.waterVels[i - 1][j][0] - duydy;

        // dux/dx above to tell us our duy/dy
        var duxdx = this.waterVels[i][j - 1][0] - this.waterVels[i - 1][j - 1][0];
        this.waterVels[i][j][1] = this.waterVels[i][j - 1][1] - duxdx;


        // this.waterVels[i][j][0] = lastUx;
        // this.waterVels[i][j][1] = lastUy;
      }
    }
  };

  var Asteroid = Game.Asteroid = function(ctx) {
    this.color = "#FFF";
    this.radius = 30;
    this.accel = [0, 0];
    this.vel = [5, 0];
    this.pos = [Math.random()*500, Math.random()*500];
    this.ctx = ctx;
  };

  Asteroid.prototype.draw = function() {
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
  };

  Asteroid.prototype.move = function() {

    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.vel[0] += this.accel[0];
    this.vel[1] += this.accel[1];

    //this.accel[0] = Math.round((-this.vel[0] + Math.random() - 1/2) / (this.radius/11) );
    //this.accel[1] = Math.round((-this.vel[1] + Math.random() - 1/2) / (this.radius/11) );

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
      pos[1] += Brown.HEIGHT;
    }

    while(pos[1] >= Brown.HEIGHT) {
      pos[1] -= Brown.HEIGHT;
    }
  }

})();
