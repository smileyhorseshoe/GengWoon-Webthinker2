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
    bird.img = birdMIdImg;
    bird.width=30;
    birtd.height=30;
}


function draw() {

}