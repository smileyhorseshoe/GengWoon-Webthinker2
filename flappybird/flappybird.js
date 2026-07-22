// Game objects
let bird;
let floor;

// Image assets
let birdMidImg;
let day;
let night;
let base;
function preload(){
    birdMidImg = loadImage("assets/yellowbird-midflap.png") 
    day = loadImage("assets/background-day.png")
    night = loadImage("assets/background-night.png")
    base = loadImage("assets/base.png")
}


function setup() {
    new Canvas(400,600);
    // background(250)
    //create new sprite
    bird = new Sprite();
    bird.img = birdMidImg;
    bird.width=30;
    bird.height=30;

    world.gravity.y = 10;
    // fill("red")
    // textSize(14);
    console.log("vel.y" + bird.vel.y.toF)
    // bird.mass = 2;  how heavy, heavier = affected by gravity motr
    bird.drag = 0.02; // air resistance, higher = more resistantce
    bird.bounciness = 1; // higher = bouncier
    bird.collider = "dynamic"; // collidable, movable and affected by physics

    //create floor sprite
    floor = new Sprite();
    floor.img=base
    floor.width = width;
    floor.height = 125;
    floor.x = width/2;
    floor.y = height -20;
    floor.collider = "static" // collidable but no move
}


function draw() {
    image(day,0,0,width,height); // image u drawing, x, y, width, height

    if (kb.presses("space") || mouse.presses("left")) {
        bird.sleeping =false
        bird.vel.y = -5; // up velocity
    }
}