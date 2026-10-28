const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const GROUND_Y = 450;
const GROUND_TOP = GROUND_Y;
const JUMP_RUN_SPEED = 4;
const FINISH_X = 11000;
const JUMP_SPEED = -10;
const MAX_JUMP_HEIGHT = 44;
const JUMP_BUFFER_FRAMES = 8;
const COYOTE_FRAMES = 4;
const RUN_GRAVITY = 1.5;
const FALL_GRAVITY_SCALE = 2.6;

const STAGES = [
  {
    title: 'NEON SPRINT',
    mode: 'run',
    startX: 0,
    endX: 2200,
    speed: 4.2,
    accent: '#62f4d2',
    building: '#0c1a2a',
    buildingFar: '#102535',
    windows: '#18374a',
    hazards: [
      { x: 520, type: 'spike' },
      { x: 710, type: 'block', size: 14 },
      { x: 960, type: 'mine' },
      { x: 1170, type: 'spike' },
      { x: 1380, type: 'block', size: 16 },
      { x: 1620, type: 'mine' },
      { x: 1810, type: 'spike' },
      { x: 1980, type: 'block', size: 14 },
      { x: 2130, type: 'mine' }
    ]
  },
  {
    title: 'MINE RUSH',
    mode: 'run',
    startX: 2200,
    endX: 4400,
    speed: 4.6,
    accent: '#ffd36e',
    building: '#1e1911',
    buildingFar: '#302416',
    windows: '#75542b',
    hazards: [
      { x: 2360, type: 'mine' },
      { x: 2510, type: 'spike' },
      { x: 2670, type: 'block', size: 18 },
      { x: 2870, type: 'block', size: 22 },
      { x: 3060, type: 'spike' },
      { x: 3220, type: 'mine' },
      { x: 3390, type: 'block', size: 18 },
      { x: 3570, type: 'spike' },
      { x: 3730, type: 'block', size: 22 },
      { x: 3950, type: 'mine' },
      { x: 4090, type: 'spike' },
      { x: 4260, type: 'block', size: 18 }
    ]
  },
  {
    title: 'PULSE PARKOUR',
    mode: 'run',
    startX: 4400,
    endX: 6600,
    speed: 4.9,
    accent: '#ff8b67',
    building: '#26131b',
    buildingFar: '#3b1b24',
    windows: '#853e43',
    hazards: [
      { x: 4560, type: 'block', size: 18 },
      { x: 4740, type: 'spike' },
      { x: 4910, type: 'mine' },
      { x: 5060, type: 'block', size: 22 },
      { x: 5210, type: 'spike' },
      { x: 5360, type: 'block', size: 18 },
      { x: 5520, type: 'mine' },
      { x: 5670, type: 'spike' },
      { x: 5820, type: 'block', size: 22 },
      { x: 5970, type: 'mine' },
      { x: 6130, type: 'spike' },
      { x: 6280, type: 'block', size: 18 },
      { x: 6440, type: 'mine' },
      { x: 6520, type: 'spike' }
    ]
  },
  {
    title: 'SKY CIRCUIT',
    mode: 'flight',
    startX: 6600,
    endX: 8800,
    speed: 5.1,
    accent: '#62d9ff',
    building: '#0b1930',
    buildingFar: '#102844',
    windows: '#235276',
    hazards: [
      { x: 6780, type: 'gate', lane: 'upper' },
      { x: 7110, type: 'gate', lane: 'lower' },
      { x: 7440, type: 'gate', lane: 'upper' },
      { x: 7770, type: 'gate', lane: 'lower' },
      { x: 8100, type: 'gate', lane: 'upper' },
      { x: 8430, type: 'gate', lane: 'lower' },
      { x: 8760, type: 'gate', lane: 'upper' }
    ]
  },
  {
    title: 'FINAL FREQUENCY',
    mode: 'flight',
    startX: 8800,
    endX: FINISH_X,
    speed: 5.4,
    accent: '#c19cff',
    building: '#171332',
    buildingFar: '#261d4a',
    windows: '#6150a0',
    hazards: [
      { x: 8940, type: 'gate', lane: 'lower' },
      { x: 9230, type: 'gate', lane: 'upper' },
      { x: 9520, type: 'gate', lane: 'lower' },
      { x: 9810, type: 'gate', lane: 'upper' },
      { x: 10100, type: 'gate', lane: 'lower' },
      { x: 10390, type: 'gate', lane: 'upper' },
      { x: 10680, type: 'gate', lane: 'lower' },
      { x: 10970, type: 'gate', lane: 'upper' }
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
let flightVelocity = 0;
let currentStageIndex = 0;
let invincibleUntil = 0;

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
  flightVelocity = 0;
  currentStageIndex = 0;
  invincibleUntil = 0;
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
    } else if (hazard.type === 'spike') {
      sprite = new Sprite(mineX, GROUND_Y - 10, 32, 20, 'static');
      sprite.visible = false;
    } else if (hazard.type === 'mine') {
      sprite = new Sprite(mineX, GROUND_Y - 5, 14, 10, 'static');
      sprite.color = '#ff5b4d';
    } else {
      const barrierY = hazard.lane === 'upper' ? 420 : 195;
      sprite = new Sprite(mineX, barrierY, 58, 240, 'static');
      sprite.color = '#ff5b4d';
    }

    sprite.collider = 'none';
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

  if (gameState === 'ready' && (kb.presses('space') || mouse.presses('left'))) {
    startLevel();
    return;
  }
  if (gameState === 'stageClear' && (kb.presses('space') || mouse.presses('left'))) {
    startNextStage();
    return;
  }
  if ((gameState === 'lost' || gameState === 'won') && kb.presses('r')) createLevel();

  if (gameState === 'playing') updateLevel();

  camera.x = gameState === 'ready' ? 480 : runner.x + 300;
  camera.y = CANVAS_HEIGHT / 2;

  drawScreenHud();
  camera.on();
  if (gameState === 'playing' || gameState === 'stageClear') {
    drawSpikeArt();
  }
  if (gameState === 'playing') {
    drawPowerupLabels();
    drawFinishMarker();
  }
}

function startLevel() {
  gameState = 'playing';
  currentStageIndex = 0;
  flying = false;
  world.gravity.y = RUN_GRAVITY;
  runner.vel.x = STAGES[0].speed;
  runner.vel.y = 0;
  jumpBufferUntil = -1;
}

function startNextStage() {
  currentStageIndex += 1;
  const stage = STAGES[currentStageIndex];
  runner.x = stage.startX + 30;
  runner.vel.x = stage.speed;
  runner.vel.y = 0;
  runner.y = stage.mode === 'flight' ? 320 : GROUND_Y - runner.h / 2;
  flying = stage.mode === 'flight';
  world.gravity.y = flying ? 0 : RUN_GRAVITY;
  runner.gravityScale = 1;
  jumpStartY = null;
  jumpBufferUntil = -1;
  lastGroundedFrame = frameCount;
  flightVelocity = 0;
  gameState = 'playing';
}

function updateLevel() {
  currentStageIndex = getStageIndex(runner.x);
  const stage = STAGES[currentStageIndex];
  const floorPosition = GROUND_Y - runner.h / 2;
  let grounded = !flying && runner.y >= floorPosition - 4 && runner.vel.y >= -1;

  if (grounded) {
    runner.y = floorPosition;
    runner.vel.y = 0;
    runner.gravityScale = 1;
  }
  if (grounded) lastGroundedFrame = frameCount;
  const targetRunSpeed = flying
    ? stage.speed
    : grounded
      ? stage.speed
      : Math.min(stage.speed * 0.72, JUMP_RUN_SPEED);
  runner.vel.x = lerp(runner.vel.x, targetRunSpeed, grounded ? 0.35 : 0.32);
  if (!flying) runner.gravityScale = runner.vel.y > 0 ? FALL_GRAVITY_SCALE : 1;

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
    const targetVelocity = kb.pressing('space') || mouse.pressing('left') ? -4 : 4;
    flightVelocity = lerp(flightVelocity, targetVelocity, 0.22);
    runner.y += flightVelocity;
    runner.y = constrain(runner.y, 150, 410);
  } else {
    if (kb.presses('space') || mouse.presses('left')) {
      jumpBufferUntil = frameCount + JUMP_BUFFER_FRAMES;
    }

    const canJump = grounded || frameCount - lastGroundedFrame <= COYOTE_FRAMES;
    if (jumpBufferUntil >= frameCount && canJump) {
      runner.vel.y = JUMP_SPEED;
      jumpStartY = runner.y;
      jumpBufferUntil = -1;
      lastGroundedFrame = -COYOTE_FRAMES - 1;
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

  for (const hazard of hazards) {
    hazard.isRevealed = hazard.sprite.x < runner.x + 520;
    hazard.sprite.visible = hazard.type !== 'spike' && hazard.isRevealed;
    if (!invincible && runner.overlaps(hazard.sprite)) {
      endLevel('lost');
      return;
    }
  }

  if ((flying && (runner.y < 130 || runner.y > 430)) || (!flying && runner.y > GROUND_Y - runner.h / 2 + 10)) {
    endLevel('lost');
  } else if (runner.x >= stage.endX) {
    runner.vel.x = 0;
    runner.vel.y = 0;
    gameState = currentStageIndex === STAGES.length - 1 ? 'won' : 'stageClear';
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

  if (gameState === 'playing' || gameState === 'stageClear') {
    const stage = STAGES[currentStageIndex];
    const progress = constrain((runner.x - stage.startX) / (stage.endX - stage.startX), 0, 1);
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

  if (gameState === 'ready' || gameState === 'stageClear' || gameState === 'lost' || gameState === 'won') {
    fill('rgba(3, 8, 18, 0.82)');
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    textAlign(CENTER, CENTER);
    if (gameState === 'ready') {
      fill('#62f4d2');
      textSize(34);
      text('NEON MINES', CANVAS_WIDTH / 2, 205);
      fill('#e8f7ff');
      textSize(16);
      text('FIVE LONG STAGES, EACH WITH ITS OWN COURSE', CANVAS_WIDTH / 2, 252);
      text('SPACE OR CLICK TO START  /  RELEASE, THEN TAP TO JUMP', CANVAS_WIDTH / 2, 282);
      text('FLIGHT: HOLD SPACE OR CLICK TO RISE', CANVAS_WIDTH / 2, 312);
      fill('#62f4d2');
      text('ONE RARE CYAN SHIELD GIVES 3 SECONDS OF INVINCIBILITY', CANVAS_WIDTH / 2, 342);
      fill('#e8f7ff');
      textSize(13);
      text('SPRINT  /  MINE RUSH  /  PARKOUR  /  SKY  /  FINAL FREQUENCY', CANVAS_WIDTH / 2, 370);
    } else if (gameState === 'stageClear') {
      const nextStage = STAGES[currentStageIndex + 1];
      fill(STAGES[currentStageIndex].accent);
      textSize(32);
      text(`STAGE ${currentStageIndex + 1} CLEARED`, CANVAS_WIDTH / 2, 220);
      fill('#e8f7ff');
      textSize(18);
      text(STAGES[currentStageIndex].title, CANVAS_WIDTH / 2, 265);
      fill(nextStage.accent);
      textSize(20);
      text(`NEXT: ${nextStage.title}`, CANVAS_WIDTH / 2, 310);
      fill('#e8f7ff');
      textSize(15);
      text('PRESS SPACE WHEN READY', CANVAS_WIDTH / 2, 355);
    } else {
      fill(gameState === 'won' ? '#62f4d2' : '#ff756b');
      textSize(34);
      text(gameState === 'won' ? 'ALL FIVE STAGES CLEARED' : 'SIGNAL LOST', CANVAS_WIDTH / 2, 230);
      fill('#e8f7ff');
      textSize(16);
      text(gameState === 'won' ? 'YOU MADE IT THROUGH THE MINEFIELD' : 'A MINE CAUGHT YOUR SIGNAL', CANVAS_WIDTH / 2, 275);
      text('PRESS R TO RUN AGAIN', CANVAS_WIDTH / 2, 315);
    }
  }
  camera.on();
}

function drawFinishMarker() {
  const markerX = STAGES[currentStageIndex].endX;
  noStroke();
  fill('#142b3a');
  rect(markerX - 38, 112, 76, 28);
  stroke('#62f4d2');
  strokeWeight(2);
  noFill();
  rect(markerX - 38, 112, 76, 28);
  noStroke();
  fill('#62f4d2');
  textAlign(CENTER, CENTER);
  textSize(14);
  text('STAGE EXIT', markerX, 126);
}

function drawSpikeArt() {
  for (const hazard of hazards) {
    if (hazard.type !== 'spike' || !hazard.isRevealed) continue;

    const spikeX = hazard.sprite.x;
    const spikeBaseY = GROUND_Y;
    const spikeTopY = GROUND_Y - 23;
    fill('#ff5b4d');
    stroke('#ffd36e');
    strokeWeight(2);
    triangle(spikeX - 16, spikeBaseY, spikeX, spikeTopY, spikeX + 16, spikeBaseY);
    noStroke();
    fill('#ffb45c');
    triangle(spikeX - 6, spikeBaseY - 2, spikeX, spikeTopY + 9, spikeX + 6, spikeBaseY - 2);
  }
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