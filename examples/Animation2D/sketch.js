/**
 * Animation 2D.
 * by Jean Pierre Charalambos.
 *
 * Documentation found on the online tutorial: https://github.com/nakednous/fpstiming/wiki/1.1.-Animation2D
 *
 * Press '+' to speed up the animation.
 * Press '-' to speed down the animation.
 * Press ' ' (the space bar) to toggle the animation.
 */

class Particle2D {
  constructor() {
    this.speed = new p5.Vector();
    this.pos = new p5.Vector();
    this.age = 0;
    this.ageMax = 50 + parseInt(random(100));
    this.init();
  }

  init() {
    this.pos = new p5.Vector();
    const angle = 2 * PI * random(1);
    const norm = 0.04 * random(1);
    this.speed = new p5.Vector(norm * cos(angle), norm * sin(angle));
    this.age = 0;
    this.ageMax = 50 + parseInt(random(100));
  }

  animate() {
    this.speed.z -= 0.05;
    this.pos = p5.Vector.add(this.pos, p5.Vector.mult(this.speed, 10));
    if (++this.age === floor(this.ageMax)) {
      this.init();
    }
  }

  draw() {
    stroke(255 * (this.age / this.ageMax), 255 * (this.age / this.ageMax), 255);
    vertex(this.pos.x, this.pos.y);
  }
}

class ParticleSystem extends fpstiming.AnimatorObject {
  constructor(handler) {
    super(handler);
    this.nbPart = 2000;
    this.particle = Array(this.nbPart);
    for (let i = 0; i < this.nbPart; i++) {
      this.particle[i] = new Particle2D();
    }
  }
  animate() {
    for (let i = 0; i < this.nbPart; i++) {
      this.particle[i].animate();
    }
  }
}

let handler, system;

function setup() {
  createCanvas(640, 360);
  handler = new fpstiming.TimingHandler();
  system = new ParticleSystem(handler);
  system.start();
  smooth();
}

function draw() {
  background(0);
  push();
  translate(width/2, height/2);
  strokeWeight(3); // Default
  beginShape();
  for (let i = 0; i < system.particle.length; i++) {
    system.particle[i].draw();
  }
  endShape();
  pop();
  handler.handle();
}
function keyPressed() {
  if (key === 'A' ){
      system.setPeriod(system.animationPeriod-10);
  }

  if (key === 'D' )
    system.setPeriod(system.animationPeriod+10);
  if (key === 'S' )
    system.toggle();
}
