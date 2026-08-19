// write your codes here
let background;
let watermelon;
let peach;
function preload(){
    background = loadImage('assets/dojobackground.png');
    watermelon = loadImage('assets/watermelonwhole.png');
    peach = loadImage('peachwhole.png')
    
}

function setup() {
  new Canvas(800,600);
  world.gravity.y = 10
}

function draw() {
    image(background,0,0,width,height);
}