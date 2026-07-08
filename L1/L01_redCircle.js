function setup(){
    createCanvas(600, 400);
    background(220);
    let x =5;
    let y = 10;
    total = x + y
    console.log("Sum: " + total)
}

function draw(){
    fill(255, 0, 0);
    ellipse(300,100,100,100);
    fill("yellow")
    ellipse(300,200,100,100)
    fill(0,255,0)
    ellipse(300,300,100,100)
}