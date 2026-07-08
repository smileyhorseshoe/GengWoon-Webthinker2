function setup() {
  // Set up the canvas
  new Canvas(800, 400);
  background(250); //background color

  
  // Basic shape testing
  // write your codes here
  // fill("yellow")
  // stroke("black")
  // strokeWeight(10)
  // circle(400,70,100)
  // rect(350,150,100,200)
  // triangle(50,50,400,200,50,350)
  // quad(400,50,700,350,400,250,100,350)
  // End Basic shape testing
  
  // Create a bouncing ball sprite
  // write your codes here
  ball = new Sprite(400, 200, 100);
  ball.color =(124,214,84);
  ball.stroke= ("black")
  ball.strokeWeight =5
}

function draw() {
  // write your codes here
  
  ball.x+=1
}