import * as THREE from 'https://cdn.jsdelivr.net/npm/three/build/three.module.js';
import { addBlurBackground } from '../utility/blurBackGround.js';

export const localGame = {
  async init() {
    addBlurBackground();
    const root = document.getElementById('app');
    while (root.childNodes.length > 0) {
      root.removeChild(root.firstChild);
    }
    const $div = document.createElement('div');
    $div.id = 'scoreBoard';
    const player1Score = document.createElement('div');
    player1Score.id = 'player1Score';
    const player2Score = document.createElement('div');
    player2Score.id = 'player2Score';
    $div.appendChild(player2Score);
    $div.appendChild(player1Score);
    root.appendChild($div);
    let WIDTH = root.offsetWidth / 2,
      HEIGHT = root.offsetHeight / 1.2,
      VIEW_ANGLE = 100,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 15000,
      FIELD_WIDTH = 1200,
      FIELD_LENGTH = 3000,
      BALL_RADIUS = 25,
      PADDLE_WIDTH = 200,
      PADDLE_HEIGHT = 30,
      scoreBoard = document.getElementById('scoreBoard'),
      container,
      renderer,
      camera,
      mainLight,
      scene,
      ball,
      paddle1,
      paddle2,
      field,
      running,
      score = {
        player1: 0,
        player2: 0,
      };

    function startBallMovement() {
      let direction = Math.random() > 0.5 ? -1 : 1;
      ball.$velocity = {
        x: 0,
        z: direction * 20,
      };
      ball.$stopped = false;
    }

    function processBallMovement() {
      if (!ball.$velocity) {
        startBallMovement();
      }

      if (ball.$stopped) {
        return;
      }

      updateBallPosition();

      if (isSideCollision()) {
        ball.$velocity.x *= -1;
      }

      if (isPaddle1Collision()) {
        hitBallBack(paddle1);
      }

      if (isPaddle2Collision()) {
        hitBallBack(paddle2);
      }

      if (isPastPaddle1()) {
        scoreBy('player2');
      }

      if (isPastPaddle2()) {
        scoreBy('player1');
      }
    }

    function isPastPaddle1() {
      return ball.position.z > paddle1.position.z + 100;
    }

    function isPastPaddle2() {
      return ball.position.z < paddle2.position.z - 100;
    }

    function updateBallPosition() {
      var ballPos = ball.position;

      ballPos.x += ball.$velocity.x;
      ballPos.z += ball.$velocity.z;

      ballPos.y = -(((ballPos.z - 1) * (ballPos.z - 1)) / 5000) + 435;
    }

    function isSideCollision() {
      var ballX = ball.position.x,
        halfFieldWidth = FIELD_WIDTH / 2;
      return ballX - BALL_RADIUS < -halfFieldWidth || ballX + BALL_RADIUS > halfFieldWidth;
    }

    function hitBallBack(paddle) {
      ball.$velocity.x = (ball.position.x - paddle.position.x) / 5;
      ball.$velocity.z *= -1;
    }

    function isPaddle2Collision() {
      return ball.position.z - BALL_RADIUS <= paddle2.position.z && isBallAlignedWithPaddle(paddle2);
    }

    function isPaddle1Collision() {
      return ball.position.z + BALL_RADIUS >= paddle1.position.z && isBallAlignedWithPaddle(paddle1);
    }

    function isBallAlignedWithPaddle(paddle) {
      var halfPaddleWidth = PADDLE_WIDTH / 2,
        paddleX = paddle.position.x,
        ballX = ball.position.x;
      return ballX > paddleX - halfPaddleWidth && ballX < paddleX + halfPaddleWidth;
    }

    function scoreBy(playerName) {
      addPoint(playerName);
      updateScoreBoard();
      stopBall();
      setTimeout(reset, 2000);
    }

    function updateScoreBoard() {
      document.getElementById('player1Score').innerText = 'Player 1: ' + score.player1;
      document.getElementById('player2Score').innerText = 'Player 2: ' + score.player2;
    }

    function stopBall() {
      ball.$stopped = true;
    }

    function addPoint(playerName) {
      score[playerName]++;
    }

    function startRender() {
      running = true;
      render();
    }

    function stopRender() {
      running = false;
    }
    let paddle1LeftPressed = false;
    let paddle1RightPressed = false;
    let paddle2LeftPressed = false;
    let paddle2RightPressed = false;

    function containerKeyDown(e) {
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        paddle1LeftPressed = true;
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        paddle1RightPressed = true;
      } else if (e.code === 'KeyA') {
        e.preventDefault();
        paddle2LeftPressed = true;
      } else if (e.code === 'KeyD') {
        e.preventDefault();
        paddle2RightPressed = true;
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
    }

    function containerKeyUp(e) {
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        paddle1LeftPressed = false;
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        paddle1RightPressed = false;
      } else if (e.code === 'KeyA') {
        e.preventDefault();
        paddle2LeftPressed = false;
      } else if (e.code === 'KeyD') {
        e.preventDefault();
        paddle2RightPressed = false;
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
    }

    function updatePaddlePosition() {
      if (paddle1LeftPressed) {
        paddle1.position.x -= 10;
      }
      if (paddle1RightPressed) {
        paddle1.position.x += 10;
      }

      if (paddle2LeftPressed) {
        paddle2.position.x -= 10;
      }
      if (paddle2RightPressed) {
        paddle2.position.x += 10;
      }
      const halfFieldWidth = FIELD_WIDTH / 2;
      const halfPaddleWidth = PADDLE_WIDTH / 2;
      if (paddle1.position.x - halfPaddleWidth < -halfFieldWidth) {
        paddle1.position.x = -halfFieldWidth + halfPaddleWidth;
      }
      if (paddle1.position.x + halfPaddleWidth > halfFieldWidth) {
        paddle1.position.x = halfFieldWidth - halfPaddleWidth;
      }

      if (paddle2.position.x - halfPaddleWidth < -halfFieldWidth) {
        paddle2.position.x = -halfFieldWidth + halfPaddleWidth;
      }
      if (paddle2.position.x + halfPaddleWidth > halfFieldWidth) {
        paddle2.position.x = halfFieldWidth - halfPaddleWidth;
      }
    }

    function gameEnd(player) {
      const $win = document.createElement('div');
      $win.classList.add('win');
      $win.innerHTML = `${player} wins!!!`;

      const $score = document.createElement('div');
      $score.classList.add('win');
      $score.innerHTML = `${score.player1} : ${score.player2}`;

      const againButton = document.createElement('button');
      againButton.classList.add('gameButton');
      againButton.innerHTML = 'Play Again';
      againButton.setAttribute('tabindex', '0');
      const mainButton = document.createElement('button');
      mainButton.classList.add('gameButton');
      mainButton.innerHTML = 'Main';
      mainButton.setAttribute('tabindex', '0');
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('buttonContainer');
      document.getElementById('app').appendChild(buttonContainer);
      buttonContainer.appendChild($score);
      buttonContainer.appendChild($win);
      buttonContainer.appendChild(againButton);
      buttonContainer.appendChild(mainButton);
      againButton.addEventListener('click', () => {
        localGame.init();
      });
      againButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          localGame.init();
        }
      });
      mainButton.addEventListener('click', () => {
        window.location.href = '/';
      });
      mainButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          window.location.href = '/';
        }
      });
    }

    function render() {
      if (running) {
        if (score.player1 === 7 || score.player2 === 7) {
          stopRender();
          document.removeEventListener('keydown', containerKeyDown);
          document.removeEventListener('keyup', containerKeyUp);
          if (score.player1 === 7) {
            gameEnd('Player 1');
          } else {
            gameEnd('Player 2');
          }
          renderer.domElement.style.cursor = 'auto';
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);

        processBallMovement();
        updatePaddlePosition();
      }
    }

    document.addEventListener('keydown', containerKeyDown);
    document.addEventListener('keyup', containerKeyUp);

    function reset() {
      ball.position.set(0, 0, 0);
      ball.$velocity = null;
      paddle1.position.set(0, 0, FIELD_LENGTH / 2);
      paddle2.position.set(0, 0, -FIELD_LENGTH / 2);
    }

    function addPaddle() {
      var paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, 10, 1, 1, 1),
        paddleMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }),
        paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
      scene.add(paddle);
      return paddle;
    }

    container = document.getElementById('app');

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, 1000, FIELD_LENGTH / 2 + 500);

    scene = new THREE.Scene();
    scene.add(camera);

    var fieldGeometry = new THREE.BoxGeometry(FIELD_WIDTH, 5, FIELD_LENGTH, 1, 1, 1),
      fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.position.set(0, -50, 0);

    scene.add(field);
    paddle1 = addPaddle();
    paddle1.position.z = FIELD_LENGTH / 2;
    paddle2 = addPaddle();
    paddle2.position.z = -FIELD_LENGTH / 2;

    let ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 16, 16),
      ballMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    let edgeGeometry = new THREE.EdgesGeometry(fieldGeometry);
    let edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    let edge = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    field.add(edge);

    camera.lookAt(ball.position);

    mainLight = new THREE.HemisphereLight(0xffffff, 0x003300);
    scene.add(mainLight);

    let dashMaterial = new THREE.LineDashedMaterial({
      color: 0xffffff,
      linewidth: 1,
      scale: 1,
      dashSize: 3,
      gapSize: 1,
    });

    let points = [];
    points.push(new THREE.Vector3(-FIELD_WIDTH / 2, 0, 0));
    points.push(new THREE.Vector3(FIELD_WIDTH / 2, 0, 0));
    let dashGeometry = new THREE.BufferGeometry().setFromPoints(points);

    let dashLine = new THREE.LineSegments(dashGeometry, dashMaterial);
    dashLine.computeLineDistances();
    dashLine.position.set(0, -45, 0);

    scene.add(dashLine);

    camera.lookAt(ball.position);
    updateScoreBoard();
    startRender();
    document.addEventListener('keydown', containerKeyDown);
    document.addEventListener('keyup', containerKeyUp);
    renderer.domElement.style.cursor = 'none';
  },
};
