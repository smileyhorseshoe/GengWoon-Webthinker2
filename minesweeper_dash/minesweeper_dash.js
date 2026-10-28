const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const GROUND_Y = 450;
const GROUND_TOP = GROUND_Y;
const RUN_SPEED = 4.2;
const GRID_START_X = 300;
const SECTOR_WIDTH = 300;
const FINISH_X = 5700;
const FLIGHT_START_X = 2700;
const JUMP_SPEED = -7.8;

const MINE_SECTORS = [
  { sector: 2, lane: 'ground' },
  { sector: 4, lane: 'ground' },
  { sector: 6, lane: 'ground' },
  { sector: 9, lane: 'upper' },
  { sector: 11, lane: 'lower' },
  { sector: 13, lane: 'upper' },
  { sector: 15, lane: 'lower' }
];

const BLOCK_SECTORS = [1, 3, 5, 7];

let runner;
let floor;
let hazards = [];
let stars = [];
let gameState = 'ready';
let flying = false;
let jumpReady = false;

function setup() {
  new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  textFont('monospace');
  textAlign(CENTER, CENTER);
  stars = Array.from({ length: 70 }, (_, index) => ({
    x: (index * 137 + 41) % CANVAS_WIDTH,
    y: (index * 83 + 17) % CANVAS_HEIGHT,
    size: index % 5 === 0 ? 2 : 1
  }));
  createLevel();
}

function createLevel() {
  if (runner) runner.remove();
  if (floor) floor.remove();
  for (const hazard of hazards) hazard.sprite.remove();
  hazards = [];
  flying = false;
  jumpReady = false;
  gameState = 'ready';
  world.gravity.y = 0.75;

  floor = new Sprite(FINISH_X / 2, GROUND_Y + 50, FINISH_X + 1000, 100, 'static');
  floor.color = '#142b3a';
  floor.stroke = '#62f4d2';
  floor.strokeWeight = 2;

  runner = new Sprite(120, GROUND_Y - 17, 34, 34);
  runner.color = '#62f4d2';
  runner.stroke = '#e8ffff';
  runner.strokeWeight = 2;
  runner.friction = 0;
  runner.drag = 0;
  runner.bounciness = 0;
  runner.rotationLock = true;

  const levelHazards = [
    ...MINE_SECTORS.map(mine => ({ ...mine, type: 'mine' })),
    ...BLOCK_SECTORS.map(sector => ({ sector, lane: 'ground', type: 'block' }))
  ];

  for (const hazard of levelHazards) {
    const mineX = GRID_START_X + (hazard.sector + 0.5) * SECTOR_WIDTH;
    let sprite;

    if (hazard.lane === 'ground' && hazard.type === 'block') {
      sprite = new Sprite(mineX, GROUND_Y - 16, 32, 32, 'static');
      sprite.color = '#ffd36e';
    } else if (hazard.lane === 'ground') {
      sprite = new Sprite(mineX, GROUND_Y - 11, 36, 22, 'static');
      sprite.color = '#ff5b4d';
    } else {
      const needsUpperRoute = hazard.lane === 'upper';
      const barrierY = needsUpperRoute ? 420 : 195;
      sprite = new Sprite(mineX, barrierY, 58, 240, 'static');
      sprite.color = '#ff5b4d';
    }

    sprite.stroke = '#ffd36e';
    sprite.strokeWeight = 2;
    sprite.visible = false;
    hazards.push({ sprite, sector: hazard.sector, lane: hazard.lane, type: hazard.type });
  }

  camera.x = 480;
  camera.y = CANVAS_HEIGHT / 2;
}

function draw() {
  background('#070b16');

  if (gameState === 'ready' && kb.presses('space')) startLevel();
  if ((gameState === 'lost' || gameState === 'won') && kb.presses('r')) createLevel();

  if (gameState === 'playing') updateLevel();

  camera.x = gameState === 'playing' ? runner.x + 300 : 480;
  camera.y = CANVAS_HEIGHT / 2;

  drawScreenHud();
  camera.on();
  if (gameState === 'playing') {
    drawSectorClues();
    drawFinishMarker();
  }
}

function startLevel() {
  gameState = 'playing';
  runner.vel.x = RUN_SPEED;
  jumpReady = false;
}

function updateLevel() {
  runner.vel.x = RUN_SPEED;

  if (!flying && runner.x >= FLIGHT_START_X) {
    flying = true;
    world.gravity.y = 0;
    runner.vel.y = 0;
    runner.y = 390;
  }

  if (flying) {
    runner.vel.y = 0;
    runner.y += kb.pressing('space') ? -4 : 4;
    runner.y = constrain(runner.y, 150, 415);
  } else if (!kb.pressing('space')) {
    jumpReady = true;
  } else if (jumpReady && kb.presses('space') && runner.y >= GROUND_TOP - runner.h / 2 - 3 && runner.vel.y >= 0) {
    runner.vel.y = JUMP_SPEED;
    jumpReady = false;
  }

  for (const hazard of hazards) {
    hazard.sprite.visible = hazard.sprite.x < runner.x + 210;
    if (runner.collides(hazard.sprite)) {
      endLevel('lost');
      return;
    }
  }

  if ((flying && runner.y < 120) || runner.y > GROUND_Y - runner.h / 2) {
    endLevel('lost');
  } else if (runner.x >= FINISH_X) {
    endLevel('won');
  }
}

function endLevel(result) {
  gameState = result;
  runner.vel.x = 0;
  runner.vel.y = 0;
}

function drawScreenHud() {
  camera.off();
  noStroke();
  for (const star of stars) {
    fill(star.size === 2 ? '#7ea6bd' : '#38536b');
    circle(star.x, star.y, star.size);
  }

  fill('#62f4d2');
  textAlign(LEFT, CENTER);
  textSize(16);
  text('NEON MINES  //  SPACE: JUMP / ASCEND', 24, 28);
  textAlign(RIGHT, CENTER);
  fill('#a9c5d5');
  textSize(13);
  text('R: RESTART', CANVAS_WIDTH - 24, 28);

  if (gameState === 'playing') {
    const progress = constrain(runner.x / FINISH_X, 0, 1);
    noFill();
    stroke('#38536b');
    rect(24, 49, 220, 7);
    noStroke();
    fill('#62f4d2');
    rect(24, 49, 220 * progress, 7);
    fill('#a9c5d5');
    textAlign(LEFT, CENTER);
    textSize(11);
    text(flying ? 'FLIGHT MODE' : 'RUN MODE', 260, 53);
  }

  if (gameState === 'ready' || gameState === 'lost' || gameState === 'won') {
    fill('rgba(3, 8, 18, 0.82)');
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    textAlign(CENTER, CENTER);
    if (gameState === 'ready') {
      fill('#62f4d2');
      textSize(34);
      text('NEON MINES', CANVAS_WIDTH / 2, 205);
      fill('#e8f7ff');
      textSize(16);
      text('COUNTS SHOW MINES IN THIS SECTOR + THE NEXT TWO', CANVAS_WIDTH / 2, 252);
      text('SPACE TO START  /  JUMP  /  ASCEND IN FLIGHT', CANVAS_WIDTH / 2, 286);
    } else {
      fill(gameState === 'won' ? '#62f4d2' : '#ff756b');
      textSize(34);
      text(gameState === 'won' ? 'SECTOR CLEARED' : 'SIGNAL LOST', CANVAS_WIDTH / 2, 230);
      fill('#e8f7ff');
      textSize(16);
      text(gameState === 'won' ? 'YOU MADE IT THROUGH THE MINEFIELD' : 'A MINE CAUGHT YOUR SIGNAL', CANVAS_WIDTH / 2, 275);
      text('PRESS R TO RUN AGAIN', CANVAS_WIDTH / 2, 315);
    }
  }
  camera.on();
}

function drawSectorClues() {
  const firstSector = Math.max(0, Math.floor((runner.x - GRID_START_X) / SECTOR_WIDTH) - 2);
  const lastSector = Math.ceil((runner.x + 900 - GRID_START_X) / SECTOR_WIDTH);
  textAlign(CENTER, CENTER);

  for (let sector = firstSector; sector <= lastSector; sector++) {
    const sectorX = GRID_START_X + (sector + 0.5) * SECTOR_WIDTH;
    const mineCount = MINE_SECTORS.filter(mine => mine.sector >= sector && mine.sector <= sector + 2).length;
    const nearbyHazard = hazards.find(hazard => hazard.sector === sector);

    stroke('#1d394b');
    strokeWeight(1);
    line(sectorX, 92, sectorX, GROUND_Y);
    noStroke();
    fill(mineCount > 0 ? '#ffd36e' : '#62f4d2');
    textSize(22);
    text(String(mineCount), sectorX, 105);

    if (nearbyHazard && nearbyHazard.sprite.visible) {
      fill('#ffb45c');
      textSize(10);
      const label = nearbyHazard.type === 'block' ? 'BLOCK' : nearbyHazard.lane === 'ground' ? 'MINE' : 'GATE';
      text(label, sectorX, 137);
    }
  }
}

function drawFinishMarker() {
  stroke('#62f4d2');
  strokeWeight(2);
  line(FINISH_X, 110, FINISH_X, GROUND_Y);
  noStroke();
  fill('#62f4d2');
  textAlign(CENTER, CENTER);
  textSize(12);
  text('EXIT', FINISH_X, 95);
}