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
    bird.mass = 2;
    bird.drag = 0.02;
    bird.bounciness = 0.5;
    bird.collider = "dynamic";


    //create floor sprite
    floor = new Sprite();
    floor.img=base
    floor.width = width
}


function draw() {
    image(day,0,0,width,height); // image u drawing, x, y, width, height
}