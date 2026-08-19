// write your codes here
let background;
let watermelon;
let peach;
let peachhole
let watermelonwhole
function preload(){
    background = loadImage('assets/dojobackground.png');
    watermelonwhole = loadImage('assets/watermelonwhole.png');
    peachwhole = loadImage('peachwhole.png')

}

function setup() {
  new Canvas(800,600);
  world.gravity.y = 10
// Sprites

}

function draw() {
    image(background,0,0,width,height);
}