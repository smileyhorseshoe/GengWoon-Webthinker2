const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const GROUND_Y = 450;
const GROUND_TOP = GROUND_Y;
const RUN_SPEED = 4.2;
const GRID_START_X = 300;
const SECTOR_WIDTH = 300;
const FINISH_X = 5700;
const FLIGHT_START_X = 2700;
const JUMP_SPEED = -6;
const RUN_GRAVITY = 0.65;

const MINE_SECTORS = [
  { sector: 2, lane: 'ground' },
  { sector: 4, lane: 'ground' },
  { sector: 6, lane: 'ground' }
];

const BLOCK_SECTORS = [1, 3, 5, 7];
const GATE_SECTORS = [
  { sector: 8, lane: 'lower' },
  { sector: 9, lane: 'upper' },
  { sector: 10, lane: 'lower' },
  { sector: 11, lane: 'upper' },
  { sector: 12, lane: 'lower' },
  { sector: 13, lane: 'upper' },
  { sector: 14, lane: 'lower' },
  { sector: 15, lane: 'upper' },
  { sector: 16, lane: 'lower' }
];
const POWERUP_POSITIONS = [
  { x: 1850, y: GROUND_Y - 28 },
  { x: 2350, y: GROUND_Y - 28 }
];

let runner;
let floor;
let hazards = [];
let powerups = [];
let stars = [];
let gameState = 'ready';
let flying = false;
let jumpReady = false;
let invincibleUntil = 0;
let invincibilityActive = false;

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
  for (const powerup of powerups) powerup.sprite.remove();
  hazards = [];
  powerups = [];
  flying = false;
  jumpReady = false;
  invincibleUntil = 0;
  invincibilityActive = false;
  gameState = 'ready';
  world.gravity.y = RUN_GRAVITY;

  floor = new Sprite(FINISH_X / 2, GROUND_Y + 50, FINISH_X + 1000, 100, 'static');
  floor.color = '#142b3a';
  floor.stroke = '#62f4d2';
  floor.strokeWeight = 2;

  runner = new Sprite(120, GROUND_Y - 12, 24, 24);
  runner.color = '#62f4d2';
  runner.stroke = '#e8ffff';
  runner.strokeWeight = 2;
  runner.friction = 0;
  runner.drag = 0;
  runner.bounciness = 0;
  runner.rotationLock = true;

  const levelHazards = [
    ...MINE_SECTORS.map(mine => ({ ...mine, type: 'mine' })),
    ...BLOCK_SECTORS.map(sector => ({ sector, lane: 'ground', type: 'block' })),
    ...GATE_SECTORS.map(gate => ({ ...gate, type: 'gate' }))
  ];

  for (const hazard of levelHazards) {
    const mineX = GRID_START_X + (hazard.sector + 0.5) * SECTOR_WIDTH;
    let sprite;

    if (hazard.lane === 'ground' && hazard.type === 'block') {
      sprite = new Sprite(mineX, GROUND_Y - 9, 18, 18, 'static');
      sprite.color = '#ffd36e';
    } else if (hazard.lane === 'ground') {
      sprite = new Sprite(mineX, GROUND_Y - 7, 18, 14, 'static');
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

  for (const [index, position] of POWERUP_POSITIONS.entries()) {
    const sprite = new Sprite(position.x, position.y, 22, 22, 'none');
    sprite.color = '#62f4d2';
    sprite.stroke = '#e8ffff';
    sprite.strokeWeight = 2;
    sprite.rotation = 45;
    powerups.push({ sprite, homeY: position.y, phase: index * 2 });
  }

  camera.x = 480;
  camera.y = CANVAS_HEIGHT / 2;
}

function draw() {
  background('#070b16');

  if (gameState === 'ready' && kb.presses('space')) startLevel();
  if ((gameState === 'lost' || gameState === 'won') && kb.presses('r')) createLevel();

  if (gameState === 'playing') updateLevel();

  camera.x = gameState === 'ready' ? 480 : runner.x + 300;
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

  for (const powerup of powerups) {
    if (powerup.collected) continue;
    powerup.sprite.y = powerup.homeY + sin(frameCount * 0.08 + powerup.phase) * 5;
    powerup.sprite.rotation += 1;
    if (runner.overlaps(powerup.sprite)) {
      powerup.collected = true;
      powerup.sprite.remove();
      invincibleUntil = frameCount + 300;
    }
  }

  const invincible = frameCount < invincibleUntil;
  if (invincible !== invincibilityActive) {
    for (const hazard of hazards) {
      hazard.sprite.collider = invincible ? 'none' : 'static';
    }
    invincibilityActive = invincible;
  }

  for (const hazard of hazards) {
    hazard.sprite.visible = hazard.sprite.x < runner.x + 210;
    if (!invincible && runner.collides(hazard.sprite)) {
      endLevel('lost');
      return;
    }
  }

  if ((flying && runner.y < 120) || runner.y > GROUND_Y - runner.h / 2 + 10) {
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
  drawCityBackdrop();
  noStroke();
  for (const star of stars) {
    fill(star.size === 2 ? '#7ea6bd' : '#38536b');
    const offset = gameState === 'ready' ? 0 : runner.x * 0.12;
    const starX = ((star.x - offset) % CANVAS_WIDTH + CANVAS_WIDTH) % CANVAS_WIDTH;
    circle(starX, star.y, star.size);
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
    if (frameCount < invincibleUntil) {
      fill('#62f4d2');
      textAlign(RIGHT, CENTER);
      textSize(12);
      text(`SHIELD ${Math.ceil((invincibleUntil - frameCount) / 60)}s`, CANVAS_WIDTH - 24, 53);
    }
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
      text('PRESS SPACE TO START, THEN RELEASE', CANVAS_WIDTH / 2, 282);
      text('TAP TO JUMP  /  HOLD TO GO HIGH  /  RELEASE TO GO LOW', CANVAS_WIDTH / 2, 312);
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

    noStroke();
    fill(mineCount > 0 ? '#ffd36e' : '#62f4d2');
    textSize(22);
    text(String(mineCount), sectorX, 105);

    if (nearbyHazard && nearbyHazard.sprite.visible) {
      fill('#ffb45c');
      textSize(10);
      let label = 'MINE';
      if (nearbyHazard.type === 'block') label = 'BLOCK';
      if (nearbyHazard.type === 'gate') label = nearbyHazard.lane === 'upper' ? 'GO HIGH' : 'GO LOW';
      text(label, sectorX, 137);
    }
  }
}

function drawFinishMarker() {
  noStroke();
  fill('#142b3a');
  rect(FINISH_X - 38, 112, 76, 28);
  stroke('#62f4d2');
  strokeWeight(2);
  noFill();
  rect(FINISH_X - 38, 112, 76, 28);
  noStroke();
  fill('#62f4d2');
  textAlign(CENTER, CENTER);
  textSize(14);
  text('EXIT', FINISH_X, 126);
}

function drawCityBackdrop() {
  const offset = gameState === 'ready' ? 0 : runner.x * 0.2;

  for (let layer = 0; layer < 2; layer++) {
    const spacing = layer === 0 ? 76 : 58;
    const shift = (offset * (layer === 0 ? 0.55 : 0.9)) % spacing;
    for (let index = -1; index < 19; index++) {
      const buildingX = index * spacing - shift;
      const buildingHeight = 48 + ((index * 37 + layer * 29 + 900) % (layer === 0 ? 78 : 112));
      const buildingWidth = spacing - 8;
      fill(layer === 0 ? '#0c1a2a' : '#102535');
      rect(buildingX, 478 - buildingHeight, buildingWidth, buildingHeight);

      fill(layer === 0 ? '#18374a' : '#1a4850');
      for (let windowY = 0; windowY < buildingHeight - 14; windowY += 17) {
        for (let windowX = 8; windowX < buildingWidth - 5; windowX += 16) {
          if ((index + windowX + windowY) % 3 !== 0) {
            rect(buildingX + windowX, 470 - buildingHeight + windowY, 4, 5);
          }
        }
      }
    }
  }
}