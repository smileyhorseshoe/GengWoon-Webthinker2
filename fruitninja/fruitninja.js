// write your codes here
let background;

function preload(){
    background = loadImage('assets/dojobackground.png');
}

function setup() {
  new Canvas(800,600);
  world.gravity.y = 10
}

function draw() {
    image(background,0,0,width,height);
}