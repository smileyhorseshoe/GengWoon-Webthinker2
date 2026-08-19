// write your codes here
let background;
let watermelon;
let peach;
let peachwhole;
let watermelonwhole;
function preload(){
    background = loadImage('assets/dojobackground.png');
    watermelonwhole = loadImage('assets/watermelonwhole.png');
    peachwhole = loadImage('peachwhole.png');

}

function setup() {
  new Canvas(800,600);
  world.gravity.y = 10
// Sprites
peach = new Sprite();
peach.img = peachWhole;
peach.width = 50;
peach.height=50;
peach.mass=2;

}

function draw() {
    image(background,0,0,width,height);
}