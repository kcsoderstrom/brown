(function(){
  window.Brown = window.Brown || {};

  Brown.WIDTH = 1000;
  Brown.HEIGHT = 500;

  var Game = Brown.Game = function(ctx) {
    this.ctx = ctx;
    this.asteroids = [ new Asteroid(ctx), new Asteroid(ctx), new Asteroid(ctx) ];
    this.waterVel = [2,0];
  };

  Game.prototype.start = function() {
    var asteroids = this.asteroids;
    var that = this;
    setInterval(function(){
      ctx.fillStyle = "#CFF"
      ctx.fillRect(0, 0, Brown.WIDTH, Brown.HEIGHT);
      that.flow();
      asteroids.forEach(function(asteroid){
        asteroid.move();
        asteroid.draw();
      })
    }, 30);
  };

  Game.prototype.flow = function() {
    var that = this;
    this.asteroids.forEach(function(asteroid){
      asteroid.pos[0] += that.waterVel[0];
      asteroid.pos[1] += that.waterVel[1];
    });
  };

  var Asteroid = Game.Asteroid = function(ctx) {
    this.color = "#FFF";
    this.radius = 10;
    this.accel = [50, 50];
    this.vel = [5, 0];
    this.pos = [Math.random()*500,Math.random()*500];
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

    this.accel[0] = Math.round((-this.vel[0] + Math.random() - 1/2) / (this.radius/11) );
    this.accel[1] = Math.round((-this.vel[1] + Math.random() - 1/2) / (this.radius/11) );

    this.modOut();
  };

  Asteroid.prototype.modOut = function() {
    var pos = this.pos;

    while(pos[0] < 0) {
      pos[0] += Brown.WIDTH;
    }

    while(pos[0] > Brown.WIDTH) {
      pos[0] -= Brown.WIDTH;
    }

    while(pos[1] < 0) {
      pos[1] += Brown.HEIGHT;
    }

    while(pos[1] > Brown.HEIGHT) {
      pos[1] -= Brown.HEIGHT;
    }
  }

})();
