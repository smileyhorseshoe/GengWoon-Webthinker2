// write your codes here
let background;
let watermelon;
let peach;
let peachWhole;
let watermelonWhole;
function preload(){
    background = loadImage('assets/dojobackground.png');
    watermelonWhole = loadImage('assets/watermelonwhole.png');
    peachWhole = loadImage('assets/peachwhole.png');

}

function setup() {
  new Canvas(800,600);
  world.gravity.y = 10
// Sprites
peach = new Sprite();
peach.img = peachWhole;
peach.width = 200;
peach.height=200;
peach.scale =peach.width/peachWhole.width;
peach.mass=2;
peach.drag=0.02 
peach.collider="dynamic"
watermelon = new Sprite();
watermelon.img = watermelonwhole;
watermelon.width=300;
watermelon.height=300;
watermelon.scale=watermelon.width/watermelonWhole.width;
watermelon.mass=2
watermelon.drag=0.02
watmerlon.collider="dynamic"
}

function draw() {
    image(background,0,0,width,height);
}