// write your codes here
let background;
let watermelon;
let peach;
let peachhole
let watermelonhole
function preload(){
    background = loadImage('assets/dojobackground.png');
    watermelonhole = loadImage('assets/watermelonwhole.png');
    peach = loadImage('peachwhole.png')

}

function setup() {
  new Canvas(800,600);
  world.gravity.y = 10
// Sprites

}

function draw() {
    image(background,0,0,width,height);
}