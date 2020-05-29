const object = {
  rocket: { x: 0, y: 0, height: 100, width: 100, orientation: "front" },
  meteorite: [],
};

const game = {
  rocketSpeed: 12,
  stoppedSeconds: 0,
  gameOver: false,
};

const hud = {
  level: 1,
  hearts: 4,
  score: 0,
};

const gameScreen = { root: null, canvas: null, context: null };

constructWindow();
generateInitialLife();
requestAnimationFrame(start);

function constructWindow() {
  gameScreen.root = document.getElementById("root");
  gameScreen.canvas = document.getElementsByTagName("canvas")[0];
  gameScreen.canvas.setAttribute("height", gameScreen.root.offsetHeight);
  gameScreen.canvas.setAttribute("width", gameScreen.root.offsetWidth);

  object.rocket.x = gameScreen.root.offsetWidth - 100;
  object.rocket.y = gameScreen.root.offsetHeight / 2;

  gameScreen.context = gameScreen.canvas.getContext("2d");
}

function generateInitialLife() {
  const heartsContainer = document.getElementById("hearts");

  const heart = document.createElement("IMG");
  heart.setAttribute("height", 25);
  heart.setAttribute("width", 35);
  heart.setAttribute("src", "images/heart.png");
  heart.setAttribute("class", "heart");

  for (let index = 0; index < hud.hearts; index++) {
    heartsContainer.innerHTML += heart.outerHTML;
  }
}

function gameOver() {
  game.gameOver = true;
}

function startLevel() {
  drawRocket({
    positionX: object.rocket.x,
    positionY: object.rocket.y,
    orientation: object.rocket.orientation,
  });

  window.onkeydown = addManipulationHandler;

  for (let index = 0; index < 100; index++) {
    object.meteorite.push(levelProps());
  }

  for (let index = 0; index < hud.level; index++) {
    drawMeteorite(index);
  }
}

function start() {
  startLevel();

  checkGameOver(gameOver);

  if (game.gameOver) {
    const response = confirm("Game Over!!! Deseja continuar?");
    return response ? location.reload() : null;
  }

  requestAnimationFrame(start);
}

function checkGameOver(callBack) {
  for (let index = 0; index < hud.level; index++) {
    if (checkCollision(index)) callBack();
  }
}

function checkCollision(index) {
  return (
    object.meteorite[index].x + object.meteorite[index].width >
      object.rocket.x &&
    object.meteorite[index].x < object.rocket.x + object.rocket.width &&
    object.meteorite[index].y + object.meteorite[index].height >
      object.rocket.y &&
    object.meteorite[index].y < object.rocket.y + object.rocket.height
  );
}

function levelProps() {
  return {
    x: Math.random() * (30 - -100 * hud.level) + -100 * hud.level,
    y: parseInt(Math.random() * gameScreen.root.offsetHeight),
    width: Math.random() * (55 - 30) + 90,
    height: Math.random() * (40 - 25) + 50,
    delay: parseInt(Math.random() * 1501),
  };
}

async function drawMeteorite(index) {
  const meteorite = document.createElement("IMG");
  meteorite.setAttribute("src", "images/meteorite.png");

  const meteoritePat = gameScreen.context.createPattern(meteorite, "no-repeat");

  gameScreen.context.fillStyle = meteoritePat;

  gameScreen.context.drawImage(
    meteorite,
    object.meteorite[index].x,
    object.meteorite[index].y,
    object.meteorite[index].width,
    object.meteorite[index].height
  );

  object.meteorite[index].x += hud.level + 5;

  if (object.meteorite[index].x >= gameScreen.root.offsetWidth)
    object.meteorite[index] = levelProps();
}

function drawRocket({ positionX, positionY, orientation = "front" }) {
  const rocketImage = document.createElement("IMG");

  switch (orientation) {
    case "front":
      rocketImage.setAttribute("src", "images/rocket.png");
      break;

    case "back":
      rocketImage.setAttribute("src", "images/rocket_back.png");
      break;

    case "left":
      rocketImage.setAttribute("src", "images/rocket_left.png");
      break;

    case "right":
      rocketImage.setAttribute("src", "images/rocket_right.png");
      break;
  }

  const rocketPat = gameScreen.context.createPattern(rocketImage, "no-repeat");

  gameScreen.context.clearRect(
    0,
    0,
    gameScreen.root.offsetWidth,
    gameScreen.root.offsetHeight
  );
  gameScreen.context.fillStyle = rocketPat;

  gameScreen.context.drawImage(
    rocketImage,
    positionX,
    positionY,
    object.rocket.width,
    object.rocket.height
  );
}

function addManipulationHandler(key) {
  if (key.keyCode == 38 && object.rocket.y >= hud.level + 4) {
    object.rocket.y -= hud.level + game.rocketSpeed;
    object.rocket.orientation = "right";
  }

  if (
    key.keyCode == 40 &&
    object.rocket.y <= gameScreen.root.offsetHeight - 70 + hud.level + 4
  ) {
    object.rocket.y += hud.level + game.rocketSpeed;
    object.rocket.orientation = "left";
  }

  if (
    key.keyCode == 39 &&
    object.rocket.x <= gameScreen.root.offsetWidth - 100 + hud.level + 4
  ) {
    object.rocket.x += hud.level + game.rocketSpeed;
    object.rocket.orientation = "back";
  }

  if (key.keyCode == 37 && object.rocket.x >= hud.level + 4) {
    object.rocket.x -= hud.level + game.rocketSpeed;
    object.rocket.orientation = "front";
  }

  if (key.keyCode >= 37 && key.keyCode <= 40) game.stoppedSeconds = 0;
}

function checkDamage() {
  if (game.stoppedSeconds == 10) {
    document.getElementsByClassName("heart")[0].remove();
    hud.gameOver = document.getElementsByClassName("heart").length;
    game.stoppedSeconds = 0;
    hud.score - 10;
  }
}

function checkLevel() {
  if (hud.score % 10 == 0 && hud.score != 0) {
    hud.level++;
    game.rocketSpeed += 10;
    document.getElementById("level").innerHTML = `Level ${hud.level}`;
  }
}

function updateScore() {
  let scoreText = document.getElementById("score").innerHTML;
  let actualSecond = scoreText.split(" ")[1];
  hud.score = ++actualSecond;
  document.getElementById("score").innerHTML = `Score ${hud.score}`;
}

function checkHearts() {
  if (hud.gameOver === 0) gameOver();
}

const interval = setInterval(() => {
  if (!game.gameOver) {
    game.stoppedSeconds++;

    updateScore();
    checkDamage();
    checkLevel();
    checkHearts();
  }
}, 1000);
