const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const GROUND_Y = 450;
const GROUND_TOP = GROUND_Y;
const JUMP_RUN_SPEED = 2.2;
const FINISH_X = 5700;
const JUMP_SPEED = -9.4;
const MAX_JUMP_HEIGHT = 58;
const JUMP_BUFFER_FRAMES = 8;
const COYOTE_FRAMES = 4;
const RUN_GRAVITY = 0.95;

const STAGES = [
  {
    title: 'NEON SPRINT',
    mode: 'run',
    startX: 0,
    endX: 1500,
    speed: 4.4,
    accent: '#62f4d2',
    building: '#0c1a2a',
    buildingFar: '#102535',
    windows: '#18374a',
    hazards: [
      { x: 720, type: 'block', size: 14 },
      { x: 980, type: 'mine' },
      { x: 1250, type: 'block', size: 14 }
    ]
  },
  {
    title: 'MINE RUSH',
    mode: 'run',
    startX: 1500,
    endX: 3000,
    speed: 5,
    accent: '#ffd36e',
    building: '#1e1911',
    buildingFar: '#302416',
    windows: '#75542b',
    hazards: [
      { x: 1660, type: 'mine' },
      { x: 1870, type: 'block', size: 18 },
      { x: 2090, type: 'block', size: 22 },
      { x: 2330, type: 'mine' },
      { x: 2500, type: 'block', size: 18 },
      { x: 2710, type: 'mine' },
      { x: 2860, type: 'block', size: 22 }
    ]
  },
  {
    title: 'SKY CIRCUIT',
    mode: 'flight',
    startX: 3000,
    endX: FINISH_X,
    speed: 5.3,
    accent: '#62d9ff',
    building: '#0b1930',
    buildingFar: '#102844',
    windows: '#235276',
    hazards: [
      { x: 3210, type: 'gate', lane: 'upper' },
      { x: 3540, type: 'gate', lane: 'lower' },
      { x: 3870, type: 'gate', lane: 'upper' },
      { x: 4200, type: 'gate', lane: 'lower' },
      { x: 4530, type: 'gate', lane: 'upper' },
      { x: 4860, type: 'gate', lane: 'lower' },
      { x: 5190, type: 'gate', lane: 'upper' },
      { x: 5520, type: 'gate', lane: 'lower' }
    ]
  }
];

const POWERUP_POSITIONS = [
  { x: 2350, y: GROUND_Y - 28 },
];

let runner;
let floor;
let hazards = [];
let powerups = [];
let stars = [];
let gameState = 'ready';
let flying = false;
let jumpStartY = null;
let jumpBufferUntil = -1;
let lastGroundedFrame = -COYOTE_FRAMES - 1;
let jumpInputArmed = false;
let flightVelocity = 0;
let currentStageIndex = 0;
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
  jumpStartY = null;
  jumpBufferUntil = -1;
  lastGroundedFrame = frameCount;
  jumpInputArmed = false;
  flightVelocity = 0;
  currentStageIndex = 0;
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

  const levelHazards = STAGES.flatMap((stage, stageIndex) =>
    stage.hazards.map(hazard => ({ ...hazard, stageIndex }))
  );

  for (const hazard of levelHazards) {
    const mineX = hazard.x;
    let sprite;

    if (hazard.type === 'block') {
      const blockSize = hazard.size || 16;
      sprite = new Sprite(mineX, GROUND_Y - blockSize / 2, blockSize, blockSize, 'static');
      sprite.color = '#ffd36e';
    } else if (hazard.type === 'mine') {
      sprite = new Sprite(mineX, GROUND_Y - 5, 14, 10, 'static');
      sprite.color = '#ff5b4d';
    } else {
      const barrierY = hazard.lane === 'upper' ? 420 : 195;
      sprite = new Sprite(mineX, barrierY, 58, 240, 'static');
      sprite.color = '#ff5b4d';
    }

    sprite.stroke = '#ffd36e';
    sprite.strokeWeight = 2;
    sprite.visible = false;
    hazards.push({
      sprite,
      sector: Math.floor(hazard.x / 300),
      stageIndex: hazard.stageIndex,
      lane: hazard.lane,
      type: hazard.type
    });
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
    drawPowerupLabels();
    drawFinishMarker();
  }
}

function startLevel() {
  gameState = 'playing';
  runner.vel.x = STAGES[0].speed;
  jumpBufferUntil = -1;
  jumpInputArmed = false;
}

function updateLevel() {
  currentStageIndex = getStageIndex(runner.x);
  const stage = STAGES[currentStageIndex];
  const grounded = runner.y >= GROUND_Y - runner.h / 2 - 2 && runner.vel.y >= 0;
  if (grounded) lastGroundedFrame = frameCount;
  const targetRunSpeed = flying
    ? stage.speed
    : grounded
      ? stage.speed
      : Math.min(stage.speed * 0.72, JUMP_RUN_SPEED);
  runner.vel.x = lerp(runner.vel.x, targetRunSpeed, grounded ? 0.35 : 0.32);

  if (stage.mode === 'flight' && !flying) {
    flying = true;
    jumpStartY = null;
    jumpBufferUntil = -1;
    flightVelocity = 0;
    world.gravity.y = 0;
    runner.vel.y = 0;
    runner.y = 320;
  }

  if (flying) {
    runner.vel.y = 0;
    const targetVelocity = kb.pressing('space') ? -4 : 4;
    flightVelocity = lerp(flightVelocity, targetVelocity, 0.22);
    runner.y += flightVelocity;
    runner.y = constrain(runner.y, 150, 410);
  } else {
    if (!kb.pressing('space')) jumpInputArmed = true;
    if (jumpInputArmed && kb.pressing('space')) {
      jumpBufferUntil = frameCount + JUMP_BUFFER_FRAMES;
    }

    const canJump = grounded || frameCount - lastGroundedFrame <= COYOTE_FRAMES;
    if (jumpBufferUntil >= frameCount && canJump) {
      runner.vel.y = JUMP_SPEED;
      jumpStartY = runner.y;
      jumpBufferUntil = -1;
      lastGroundedFrame = -COYOTE_FRAMES - 1;
      jumpInputArmed = false;
    }
  }

  if (!flying && jumpStartY !== null) {
    const jumpCeiling = jumpStartY - MAX_JUMP_HEIGHT;
    if (runner.y < jumpCeiling) {
      runner.y = jumpCeiling;
      runner.vel.y = 0;
    }
    if (runner.vel.y >= 0 && runner.y >= jumpStartY - 1) jumpStartY = null;
  }

  for (const powerup of powerups) {
    if (powerup.collected) continue;
    powerup.sprite.y = powerup.homeY + Math.sin(frameCount * 0.08 + powerup.phase) * 5;
    powerup.sprite.rotation += 1;
    if (runner.overlaps(powerup.sprite)) {
      powerup.collected = true;
      powerup.sprite.remove();
      invincibleUntil = frameCount + 180;
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

  if ((flying && (runner.y < 130 || runner.y > 430)) || (!flying && runner.y > GROUND_Y - runner.h / 2 + 10)) {
    endLevel('lost');
  } else if (runner.x >= FINISH_X) {
    endLevel('won');
  }
}

function getStageIndex(worldX) {
  const stageIndex = STAGES.findIndex(stage => worldX >= stage.startX && worldX < stage.endX);
  return stageIndex === -1 ? STAGES.length - 1 : stageIndex;
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
  if (gameState === 'playing') {
    fill(STAGES[currentStageIndex].accent);
    text(`STAGE ${currentStageIndex + 1}  //  ${STAGES[currentStageIndex].title}`, 24, 28);
  } else {
    fill(STAGES[0].accent);
    text('NEON MINES  //  SPACE: JUMP / ASCEND', 24, 28);
  }
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
      fill('#62f4d2');
      text('ONE RARE CYAN SHIELD GIVES 3 SECONDS OF INVINCIBILITY', CANVAS_WIDTH / 2, 342);
      fill('#e8f7ff');
      textSize(13);
      text('THREE STAGES: NEON RUN  /  MINE RUSH  /  SKY CIRCUIT', CANVAS_WIDTH / 2, 370);
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
  const firstSector = Math.max(0, Math.floor(runner.x / 300) - 1);
  const lastSector = Math.ceil((runner.x + 900) / 300);
  textAlign(CENTER, CENTER);

  for (let sector = firstSector; sector <= lastSector; sector++) {
    const sectorX = (sector + 0.5) * 300;
    const mineCount = hazards.filter(hazard =>
      hazard.type === 'mine' && hazard.sector >= sector && hazard.sector <= sector + 2
    ).length;
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

function drawPowerupLabels() {
  noStroke();
  fill('#07131f');
  textAlign(CENTER, CENTER);
  textSize(14);
  for (const powerup of powerups) {
    if (!powerup.collected) text('+', powerup.sprite.x, powerup.sprite.y);
  }
}

function drawCityBackdrop() {
  const offset = gameState === 'ready' ? 0 : runner.x * 0.2;
  const stage = STAGES[currentStageIndex];

  for (let layer = 0; layer < 2; layer++) {
    const spacing = layer === 0 ? 76 : 58;
    const shift = (offset * (layer === 0 ? 0.55 : 0.9)) % spacing;
    for (let index = -1; index < 19; index++) {
      const buildingX = index * spacing - shift;
      const buildingHeight = 48 + ((index * 37 + layer * 29 + 900) % (layer === 0 ? 78 : 112));
      const buildingWidth = spacing - 8;
      fill(layer === 0 ? stage.building : stage.buildingFar);
      rect(buildingX, 478 - buildingHeight, buildingWidth, buildingHeight);

      fill(stage.windows);
      for (let windowY = 0; windowY < buildingHeight - 14; windowY += 17) {
        for (let windowX = 8; windowX < buildingWidth - 5; windowX += 16) {
          if ((index + windowX + windowY) % 3 !== 0) {
            rect(buildingX + windowX, 486 - buildingHeight + windowY, 4, 5);
          }
        }
      }
    }
  }
}