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
peach.width = 100;
peach.height=100;
peach.scale =peach.width/peachWhole.width;
peach.mass=2;
peach.drag=0.02 
peach.collider="dynamic"
watermelon = new Sprite();
watermelon.img = watermelonWhole;
watermelon.width=100;
watermelon.height=100;
watermelon.scale=watermelon.width/watermelonWhole.width;
watermelon.mass=2
watermelon.drag=0.02
watermelon.collider="dynamic"
// group
peachGroup = new Group();

}

function draw() {
    image(background,0,0,width,height);
    setInterval(1); //=wait(1)
}
function spawnPeach() {
    // create peach sprite
    let peach = new peachGroup.Sprite();

}