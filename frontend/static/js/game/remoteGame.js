import { addBlurBackground } from '../utility/blurBackGround.js';

export const remoteGame = {
  async init() {
    addBlurBackground();
    const $app = document.getElementById('app');
    const $div = document.createElement('div');
    const player1Score = document.createElement('div');
    const player2Score = document.createElement('div');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let grid = 15;
    let paddleWidth = grid * 5;
    let maxPaddleX = canvas.width - grid - paddleWidth;
    const paddleSpeed = 6;
    const ballSpeed = 4;

    function resize() {
      canvas.width = $app.offsetWidth / 2;
      canvas.height = $app.offsetHeight / 1.2;
      paddleWidth = canvas.width / 8;
      maxPaddleX = canvas.width - grid - paddleWidth;
    }

    resize();
    window.addEventListener('resize', resize);

    let topPaddle = {
      x: canvas.width / 2 - paddleWidth / 2,
      y: grid * 2,
      width: paddleWidth,
      height: grid,
      paddleLeftPressed: false,
      paddleRightPressed: false,
    };
    let bottomPaddle = {
      x: canvas.width / 2 - paddleWidth / 2,
      y: canvas.height - grid * 3,
      width: paddleWidth,
      height: grid,
      paddleLeftPressed: false,
      paddleRightPressed: false,
    };
    let ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: grid,
      height: grid,
      resetting: false,
      dx: ballSpeed,
      dy: -ballSpeed,
    };
    while ($app.firstChild) {
      $app.removeChild($app.firstChild);
    }
    $div.id = 'scoreBoard';
    player1Score.id = 'player1Score';
    player2Score.id = 'player2Score';
    $div.appendChild(player1Score);
    $div.appendChild(player2Score);
    $app.appendChild(canvas);
    $app.appendChild($div);

    function collides(obj1, obj2) {
      return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
      );
    }

    function loop() {
      requestAnimationFrame(loop);
      topPaddle.width = paddleWidth;
      bottomPaddle.width = paddleWidth;
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = 'blue';
      context.fillRect(0, 0, canvas.width, canvas.height);
      if (topPaddle.paddleLeftPressed) {
        topPaddle.x -= paddleSpeed;
      }
      if (topPaddle.paddleRightPressed) {
        topPaddle.x += paddleSpeed;
      }
      if (bottomPaddle.paddleLeftPressed) {
        bottomPaddle.x -= paddleSpeed;
      }
      if (bottomPaddle.paddleRightPressed) {
        bottomPaddle.x += paddleSpeed;
      }

      if (topPaddle.x < grid) {
        topPaddle.x = grid;
      } else if (topPaddle.x > maxPaddleX) {
        topPaddle.x = maxPaddleX;
      }

      if (bottomPaddle.x < grid) {
        bottomPaddle.x = grid;
      } else if (bottomPaddle.x > maxPaddleX) {
        bottomPaddle.x = maxPaddleX;
      }

      context.fillStyle = 'white';
      context.fillRect(topPaddle.x, topPaddle.y, topPaddle.width, topPaddle.height);
      context.fillRect(bottomPaddle.x, bottomPaddle.y, bottomPaddle.width, bottomPaddle.height);

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x < grid) {
        ball.x = grid;
        ball.dx *= -1;
      } else if (ball.x + grid > canvas.width - grid) {
        ball.x = canvas.width - grid * 2;
        ball.dx *= -1;
      }

      if ((ball.y < 0 || ball.y > canvas.height) && !ball.resetting) {
        ball.resetting = true;

        setTimeout(() => {
          ball.resetting = false;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 2;
        }, 400);
      }

      if (collides(ball, topPaddle)) {
        ball.dy *= -1;
        ball.y = topPaddle.y + topPaddle.height;
      } else if (collides(ball, bottomPaddle)) {
        ball.dy *= -1;
        ball.y = bottomPaddle.y - ball.height;
      }

      context.fillStyle = 'lightgrey';
      context.fillRect(0, 0, grid, canvas.height);
      context.fillRect(canvas.width - grid, 0, grid, canvas.height);

      context.fillRect(ball.x, ball.y, ball.width, ball.height);
      context.fillStyle = 'lightgrey';
      context.fillRect(0, 0, canvas.width, grid);
      context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

      for (let i = grid; i < canvas.width - grid; i += grid * 2) {
        context.fillRect(i, canvas.height / 2 - grid / 2, grid, grid);
      }
    }

    function addKeyboardEvent() {
      document.addEventListener('keydown', function (e) {
        if (e.code === 'ArrowLeft') {
          e.preventDefault();
          bottomPaddle.paddleLeftPressed = true;
        } else if (e.code === 'ArrowRight') {
          e.preventDefault();
          bottomPaddle.paddleRightPressed = true;
        } else if (e.code === 'KeyA') {
          e.preventDefault();
          topPaddle.paddleLeftPressed = true;
        } else if (e.code === 'KeyD') {
          e.preventDefault();
          topPaddle.paddleRightPressed = true;
        }
      });
      document.addEventListener('keyup', function (e) {
        if (e.code === 'ArrowLeft') {
          e.preventDefault();
          bottomPaddle.paddleLeftPressed = false;
        } else if (e.code === 'ArrowRight') {
          e.preventDefault();
          bottomPaddle.paddleRightPressed = false;
        } else if (e.code === 'KeyA') {
          e.preventDefault();
          topPaddle.paddleLeftPressed = false;
        } else if (e.code === 'KeyD') {
          e.preventDefault();
          topPaddle.paddleRightPressed = false;
        }
        if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
          e.preventDefault();
        }
      });
    }

    requestAnimationFrame(loop);
    addKeyboardEvent();
  },
};
