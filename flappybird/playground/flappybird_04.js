// Game objects
let bird;
let floor;
let flapUpImg,flapDownImg;
let pipe;
let bottomPipe;
let gameoverimg;
let gameoverlabel;
let startScreenLabel;
let startScreenImg;
let score = 0;
let numberImages = [];
let scoreDigits;
let startGame =false
// Image assets
let pipeGroup;
let birdMidImg;
let day;
let night;
let base;
function preload(){
    birdMidImg = loadImage("assets/yellowbird-midflap.png") ;
    day = loadImage("assets/background-day.png");
    night = loadImage("assets/background-night.png");
    base = loadImage("assets/base.png");
    flapUpImg = loadImage ("assets/yellowbird-upflap.png");
    flapDownImg = loadImage("assets/yellowbird-downflap.png");
    pipe = loadImage("assets/pipe-green.png");
    gameoverimg = loadImage("assets/gameover.png");
    startScreenImg = loadImage("assets/message.png")
    for (let i = 0; i <10; i++) {
      numberImages[i] = loadImage('assets/' + i + '.png')
    }
}


function setup() {
    new Canvas(400,600);
    // background(250)
    //create new sprite
    bird = new Sprite();
    bird.img = birdMidImg;
    bird.width=30;
    bird.height=30;
    pipeGroup = new Group();
    scoreDigits = new Group();
    scoreDigits.collider = 'none';
    scoreDigits.layer = 1000;
    world.gravity.y = 15;
    fill("255,0,0");
    textSize(14);
    // bird.mass = 2;  how heavy, heavier = affected by gravity motr
    bird.drag = 0.02; // air resistance, higher = more resistantce
    bird.bounciness = 1; // higher = bouncier
    bird.collider = "static"; // collidable, movable and affected by physics
    bird.visible = false;
    //create floor sprite
    floor = new Sprite();
    floor.img=base;
    floor.width = width;
    floor.height = 125;
    floor.x = width/2;
    floor.y = height -20;
    floor.collider = "static" // collidable but no move
    startScreenLabel = new Sprite(width/2,height/2,50,50,'none');
    startScreenLabel.img = startScreenImg
}


function draw() {
  image(day,0,0,width,height); // image u drawing, x, y, width, height
  if (kb.presses("space") || mouse.presses()) {
    startGame=true;
    startScreenLabel.visible =false;
    bird.visible = true;
    bird.collider = 'dynamic';
  }
  drawScore(width/2,20,score,24,36);
  if (startGame){
      if (kb.presses("space") || mouse.presses("left")) {
          bird.sleeping =false;
          bird.vel.y = -5; // up velocity
      // debug info
    }
    text("vel.y" + bird.vel.y.toFixed(2),10,20); // text,x,y
    text("isMoving:" + bird.isMOving, 10 ,40);
    text("sleeping:" + bird.sleeping,10,60);
      if (frameCount === 1) {
        spawnPipePair();
      }
      if (bird.vel.y <-1) {
        bird.img = flapUpImg;
        bird.rotation = -30;
      }
      else if (bird.vel.y > 1) {
        bird.img = flapDownImg
        bird.rotation = 30;
      }
      else {
        bird.img = birdMidImg;
        bird.rotation = 0;
      }
      bird.x+=3;
      camera.x=bird.x;
      floor.x=bird.x;//so floor doesnt get left behind
      if (frameCount % 90 ===0) { 
        spawnPipePair();
      }
      for (let pipe of pipeGroup) {
        if (pipe.x < -50){
          pipe.remove();
        }
      }
      if (bird.collides(pipeGroup) || bird.collides(floor) || bird.y < -30)  {
        gameoverlabel = new Sprite(width/2,height/2,192,42);
        gameoverlabel.img = gameoverimg;
        gameoverlabel.layer= 100; // make this come to front
        gameoverlabel.x = camera.x;
        noLoop();
    }
  }
}
function drawScore(x,y,score,digitWidth,digitHeight) {
  //Clear all old digit sprites
  scoreDigits.removeAll();
  // make it a string so we can get each digit individually rather than a value
  let scoreStr = str(score)
  
}
function spawnPipePair() {
    let gap =50;
    let midY = random(250, height-250);
  
    bottomPipe = new Sprite(bird.x +400,midY + gap/2 + 200,52,320,'static');
    bottomPipe.img = pipe;

    pipeGroup.add(bottomPipe);
    pipeGroup.layer= 0// go behind other sprites

    topPipe = new Sprite(bird.x + 400,midY -gap/2-200,52,320,'static');
    topPipe.img = pipe;
    topPipe.rotation = 180;
    pipeGroup.add(topPipe);

}