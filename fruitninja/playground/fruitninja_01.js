// Variables
let background;
let fruitGroup; // group for whole fruits
let fruitTypes  = []; // store fruit image objects
let trail;
let fruitHalves; // new group for sliced halves
let score=0;
let missed = 0;
let gameState="start"; // "start", "playing", "win" , lose
function preload() {
    // Load image
    background = loadImage("assets/dojobackground.png");
    // decalre the peach object
    let peach = {
        whole: loadImage("assets/peachwhole.png"),
        half1: loadImage("assets/peachhalf.png"),
        half2: loadImage("assets/peachhalf2.png"),
                // add scaleMod
        scaleMod:1
    }

    // declare the watermelon object
    let watermelon = {
        whole: loadImage("assets/watermelonwhole.png"),
        half1: loadImage("assets/watermelonhalf.png"),
        half2: loadImage("assets/watermelonhalf.png"),
                // add scaleMod
        scaleMod:1
    }
    let strawberry = {
        whole: loadImage("assets/strawberry1.png"),
        half1: loadImage("assets/strawberry3.png"),
        half2: loadImage("assets/strawberry3.png"),
                // add scaleMod
        scaleMod:2.5,


    }
    let corn = {
        whole: loadImage("assets/corn4.png"),
        half1: loadImage("assets/corn5.png"),
        half2: loadImage("assets/corn5.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let dragonfruit = {
        whole: loadImage("assets/dragonfruit1.png"),
        half1: loadImage("assets/dragonfruit2.png"),
        half2: loadImage("assets/dragonfruit2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let kiwi = {
        whole: loadImage("assets/kiwi1.png"),
        half1: loadImage("assets/kiwi2.png"),
        half2: loadImage("assets/kiwi2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let apple = {
        whole: loadImage("assets/apple1.png"),
        half1: loadImage("assets/apple2.png"),
        half2: loadImage("assets/apple2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let orange = {
        whole:loadImage("assets/orange1.png"),
        half1:loadImage("assets/orange2.png"),
        half2:loadImage("assets/orange2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let garlic = {
        whole:loadImage("assets/garlic1.png"),
        half1:loadImage("assets/garlic2.png"),
        half2:loadImage("assets/garlic2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let lemon = {
        whole:loadImage("assets/lemon1.png"),
        half1:loadImage("assets/lemon2.png"),
        half2:loadImage("assets/lemon2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let lime = {
        whole:loadImage("assets/lime1.png"),
        half1:loadImage("assets/lime2.png"),
        half2:loadImage("assets/lime2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let mango = {
        whole:loadImage("assets/mango1.png"),
        half1:loadImage("assets/mango2.png"),
        half2:loadImage("assets/mango2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let pear = {
        whole:loadImage("assets/pear1.png"),
        half1:loadImage("assets/pear3.png"),
        half2:loadImage("assets/pear3.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let potato = {
        whole:loadImage("assets/potato1.png"),
        half1:loadImage("assets/potato2.png"),
        half2:loadImage("assets/potato2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let pumpkin = {
        whole:loadImage("assets/pumpkin1.png"),
        half1:loadImage("assets/pumpkin3.png"),
        half2:loadImage("assets/pumpkin3.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let tomato = {
        whole:loadImage("assets/tomato1.png"),
        half1:loadImage("assets/tomato2.png"),
        half2:loadImage("assets/tomato2.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let banana = {
        whole:loadImage("assets/banana1.png"),
        half1:loadImage("assets/banana3.png"),
        half2:loadImage("assets/banana3.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let papaya = {
        whole:loadImage("assets/papaya1.png"),
        half1:loadImage("assets/papaya2.png"),
        half2:loadImage("assets/papaya3.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let coconut = {
        whole:loadImage("assets/coconut1.png"),
        half1:loadImage("assets/coconut3.png",),
        half2:loadImage("assets/coconut3.png"),
        // add scaleMod
        scaleMod:2.5,

    }
    let fig = {
        whole:loadImage("assets/fig1.png"),
        half1:loadImage("assets/fig2.png"),
        half2:loadImage("assets/fig3.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let onion = {
        whole:loadImage("assets/onion1.png"),
        half1:loadImage("assets/onion3.png"),
        half2:loadImage("assets/onion3.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let redOnion = {
        whole:loadImage("assets/red_onion1.png"),
        half1:loadImage("assets/red_onion3.png"),
        half2:loadImage("assets/red_onion3.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let mangoSteen = {
        whole:loadImage("assets/mangosteen1.png"),
        half1:loadImage("assets/mangosteen2.png"),
        half2:loadImage("assets/mangosteen3.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let starfruit = {
        whole:loadImage("assets/starfruit1.png"),
        half1:loadImage("assets/starfruit2.png"),
        half2:loadImage("assets/starfruit2.png"),
        // add scaleMOd
        scaleMod:2.5
    }
    let cherry = {
        whole:loadImage("assets/cherry2.png"),
        half1:loadImage("assets/cherry1.png"),
        half2:loadImage("assets/cherry1.png"),
        //add scaleMod
        scaleMod:2.5,
    }
    let avocado = {
        whole: loadImage("assets/avocado1.png"),
        half1: loadImage("assets/avocado2.png"),
        half2: loadImage("assets/avocado3.png"),
        // add scaleMod
        scaleMod:2.5,
    }
    let CT = {
        whole: loadImage("assets/cherry_tomato1.png"),
        half1: loadImage("assets/cherry_tomato2.png"),
        half2: loadImage("assets/cherry_tomato2.png"),
        // add scaleMod
        scaleMod:2.5,
    }

    // store the fruit objects into an array
    fruitTypes = [peach, watermelon,strawberry,corn,dragonfruit,kiwi,apple,orange,garlic,lemon,lime,mango,pear,potato,pumpkin,tomato,banana,papaya,coconut,fig,onion,redOnion,mangoSteen,starfruit,cherry,avocado,CT];
    
}

function setup() {
    // Create canvas
    new Canvas(800, 600);
    world.gravity.y = 10;
    fruitGroup = new Group();
    fruitGroup.w = 50;
    fruitGroup.h = 50;
    fruitHalves = new Group(); // group for fruit halves
}

function draw() {
    clear();
    image(background, 0, 0, width, height); // image(image, x, y, width, height)
    // draw depending on gameState
    if(gameState === "start"){
        fill("rgb(100,255,100)") // text colour
        textSize(100)
        // stroke("rgb(0,0,0)")
        strokeWeight(10);
        textAlign(CENTER,CENTER); // (horizontal,vertical) - LEFT, RIGHT, TOP, BOTTOM note it is in da american spelling
        // start menu
        text("Fruit Ninja", width/2,height /2); // string, xpos, ypos
        if (kb.presses(" ") || mouse.presses()) {
            gameState = "playing"
        }
        
        
        
        
        return;
        
    } else if (gameState === "playing") {
        // Gameplay
        // // Debug text
        // fill("#dadada") // Text colour
    // textSize(50);
    // text("frameCount:"+ frameCount, 10, 40);
    textAlign(LEFT, BOTTOM) // default alignment
    
    textSize(50)
    fill("rgb(0,255,0)")
    text("Score:"+ score, 10, 50);
    fill("rgba(136,9,9,0.5") // ("rgba(red,green,blue,alpba)") alpha=  transparency the lower the number the more transparent it is. fully opaque is one can also use slider to control
    text("Missed: " + missed,10,110)
    
    
    
    // check if fruits fall 
    missedFruit();
    // call spawnFruit function
    if (frameCount % 1 == 0) {
        // 60 frames =1 second
        spawnFruit();
    }
    
    // handle slicing when mouse is pressed
    if (mouse.pressing()){
        noStroke();
        strokeWeight(0);
        trail = new Sprite(mouse.x, mouse.y, 7);
        trail.collider = 'none';
        trail.color = 'red';
        trail.life = 10;
        noStroke() // remove outline
        sliceFruit(); // add this line to call function
    }
    
    // win / lose condition
    if (score === 50) {
        gameState = "win";

    }
    else if (missed === 25) {
        gameState = "lose"
    }
    
    
    return;
} else if (gameState === "lose") {
    // Game Over Screen
    fill("rgb(255,0,0)");
    stroke("rgb(20,20,20)");
    strokeWeight(20);
    textSize(100);
    textAlign(CENTER,CENTER);
    text("Game Over!", width/2, height/2, height * 0.3)
    text("You Lose!", width/2, height/2, height * 0.5)
    text("Score: "+ score, width/2,height/2)
    return;
}

}

// check if any fruit is sliced by the mouse
function sliceFruit(){
    for (let fruit of fruitGroup) {
        if (fruit.sliced){
            continue; // skip already sliced fruits
        }

        // calculate distance between mouse and fruit
        let d = dist(mouse.x, mouse.y, fruit.x, fruit.y);
        // fruit is sliced
        if (d < ((fruit.d / 2) + 5)) {
            fruit.sliced = true; // prevent repeat slicing
            score+=1 // increment score(shorthand)
            const fx = fruit.x; // x coordinate for the sliced food
            const fy = fruit.y; // y coordinate for the sliced food

            fruit.remove(); // remove whole fruit

            splitFruit(fx, fy, fruit.type); // spawn halves

            break; // only slice one fruit per frame
        }
    }
}

function spawnFruit() {
    let fruitData = random(fruitTypes); // pick one at random
    let randomX = random(300, 500); // random X to spawn. Rem that canvas width is 800
    let fruit = new fruitGroup.Sprite(randomX, height+20, 40); // spawn at bottom
    fruit.image = fruitData.whole; // load image for whole
    fruit.type = fruitData; // store reference to its type i.e. peach or watermelon
    fruit.vel.y = random(-10, -14); // shoot upward at random velocity. Adjust to try!
    fruit.vel.x = random(-2, 2); // sideways curve. Adjust to try!
    // size fix -scalemod
    fruit.scale = fruitData.scaleMod;
    fruit.friction = 0; // no friction
    fruit.collider = "dynamic"; // dynamic -- yes gravity and yes collision / static - no gravity and yes collision / none - no gravity and no collision
    fruit.overlaps(allSprites); // disable collision
    fruit.layer = 2; // layer, the bigger the number the more in front it is, default is 0
}

// split a fruit into two halves and animate them
function splitFruit(x, y, fruitData) {
    // create left half
    let left = new fruitHalves.Sprite(x - 10, y, 40, 40);
    left.img  = fruitData.half1;
    left.vel.x = -3; // veer left
    left.vel.y = random(-5, -2);
    left.rotationSpeed = -5;
    left.life = 60; // remove after 30 frames
    left.collider = "dynamic"; // dynamic -- yes gravity and yes collision / static - no gravity and yes collision / none - no gravity and no collision
    left.overlaps(allSprites);  // disable collision 
    left.layer= 1;
    // sizefix - scalemod
    left.scale = fruitData.scaleMod;
    // create right half
    let right = new fruitHalves.Sprite(x + 10, y, 40, 40);
    right.img = fruitData.half2;
    right.vel.x = 3; // veer right
    right.vel.y = random(-5, -2);
    right.rotationSpeed = 5;
    //size fix- scalemod
    right.scale = fruitData.scaleMod
    right.life = 60; // remove after 30 frames
    right.collider = "dynamic"; // dynamic -- yes gravity and yes collision / static - no gravity and yes collision / none - no gravity and no collision
    right.overlaps(allSprites); // disable collision 
    right.layer=1;
}
function missedFruit() {
    // loop through spawn fruits
    for (let fruit of fruitGroup) {
        if (fruit.y > height +50) {
            fruit.remove();
            missed+=1
        }
    }

}
