/**
 * Animation 3D.
 * by Jean Pierre Charalambos.
 *
 * Documentation found on the online tutorial: https://github.com/nakednous/fpstiming/wiki/1.1.-Animation2D
 *
 * Press '+' to speed up the animation.
 * Press '-' to speed down the animation.
 * Press ' ' (the space bar) to toggle the animation.
 */
class AnimatedParticle extends fpstiming.AnimatorObject {
  constructor(handler){
    super(handler);
    this.speed = new p5.Vector();
    this.pos = new p5.Vector();
    this.age = 0;
    this.ageMax = 50 + parseInt(random(100));
    this.init();
    this.start();
  }

  animate() {
    this.speed.z -= 0.05;
    this.pos = p5.Vector.add(this.pos, p5.Vector.mult(this.speed, 10));
    if (this.pos.z < 0.0) {
      this.speed.z = -0.8 * this.speed.z;
      this.pos.z = 0.0;
    }
    if (++this.age == this.ageMax)
      this.init();
  }

  draw() {
    //stroke( 255 * (this.age * 1.0 / this.ageMax), 255 * (this.age * 1.0 / this.ageMax), 255);
    //vertex(this.pos.x, this.pos.y, this.pos.z);
    push();
    translate(this.pos.x,this.pos.y,this.pos.z);
    noStroke();
    specularMaterial( 255 * (this.age * 1.0 / this.ageMax), 255 * (this.age * 1.0 / this.ageMax), 255);
    sphere(1,3,3);
    pop();
  }

  init() {
    this.pos = new p5.Vector();
    const angle = 2.0 * p5.PI * random(1);
    const norm = 0.04 * random(1);
    this.speed = new p5.Vector(norm * cos(angle), norm  * sin(angle), random(1));
    this.age = 0;
    this.ageMax = 50 + random(100);
  }
}

class ParticleSystem extends fpstiming.AnimatorObject {
  constructor(handler) {
    super(handler);
    this.nbPart = 2000;
    this.particle = Array(this.nbPart);
    this.rotation = 0;
    for (let i = 0; i < this.nbPart; i++) {
      this.particle[i] = new AnimatedParticle(handler);
    }
    this.start();
  }
  animate() {
    const orbitRadius= mouseX/2+50;
    const ypos= mouseY/3;
    const xpos= cos( radians( this.rotation )) * orbitRadius;
    const zpos= sin( radians( this.rotation )) * orbitRadius;
    camera(xpos, ypos, zpos, 0, 0, 0, 0, -1, 0);
    this.rotation++;
  }

  setParticlesAnimationPeriod(period) {
    for (let i = 0; i < particle.length; i++)
      this.particle[i].setPeriod(period);
  }

  particlesAnimationPeriod() {
    return this.particle[0].period();
  }

  toggleParticlesAnimation() {
    for (let i = 0; i < particle.length; i++)
      this.particle[i].toggle();
  }
}

let handler, system;

function setup() {
  createCanvas(640, 360, WEBGL);
  handler = new fpstiming.TimingHandler();
  system = new ParticleSystem(handler);
  //smooth();
}

function draw() {
  background(0);
  ambientLight(100);

  push();
  strokeWeight(3); // Default
  //beginShape();
  for (let i = 0; i < system.particle.length; i++) {
    system.particle[i].draw();
  }
  //endShape();
  pop();


  handler.handle();
}

function keyPressed() {
  if ((key == 'x') || (key == 'X'))
    system.setPeriod(system.period()-2);
  if ((key == 'y') || (key == 'Y'))
    system.setPeriod(system.period()+2);
  if ((key == 'z') || (key == 'Z'))
    system.toggle();
  if (key == '+')
    system.setParticlesAnimationPeriod(system.particlesAnimationPeriod()-2);
  if (key == '-')
    system.setParticlesAnimationPeriod(system.particlesAnimationPeriod()+2);
  if (key == ' ')
    system.toggleParticlesAnimation();
}