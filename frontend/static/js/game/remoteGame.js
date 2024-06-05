import { addBlurBackground } from '../utility/blurBackGround.js';

export const remoteGame = {
  async init() {
    addBlurBackground();
    const $app = document.getElementById('app');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = $app.offsetWidth / 2;
    canvas.height = $app.offsetHeight / 1.2;
    while ($app.firstChild) {
      $app.removeChild($app.firstChild);
    }
    $app.appendChild(canvas);
    const grid = 15;
    const paddleWidth = grid * 5; // 80
    const maxPaddleX = canvas.width - grid - paddleWidth;

    let paddleSpeed = 6;
    let ballSpeed = 2.5;

    const topPaddle = {
      x: canvas.width / 2 - paddleWidth / 2,
      y: grid * 2,
      width: paddleWidth,
      height: grid,
      dx: 0,
    };
    const bottomPaddle = {
      x: canvas.width / 2 - paddleWidth / 2,
      y: canvas.height - grid * 3,
      width: paddleWidth,
      height: grid,
      dx: 0,
    };
    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: grid,
      height: grid,
      resetting: false,
      dx: ballSpeed,
      dy: -ballSpeed,
    };

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
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = 'blue';
      context.fillRect(0, 0, canvas.width, canvas.height);
      topPaddle.x += topPaddle.dx;
      bottomPaddle.x += bottomPaddle.dx;

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

    document.addEventListener('keydown', function (e) {
      if (e.which === 37) {
        bottomPaddle.dx = -paddleSpeed;
      } else if (e.which === 39) {
        bottomPaddle.dx = paddleSpeed;
      }
      if (e.which === 65) {
        topPaddle.dx = -paddleSpeed;
      } else if (e.which === 68) {
        topPaddle.dx = paddleSpeed;
      }
    });

    document.addEventListener('keyup', function (e) {
      if (e.which === 37 || e.which === 39) {
        bottomPaddle.dx = 0;
      }
      if (e.which === 65 || e.which === 68) {
        topPaddle.dx = 0;
      }
    });

    requestAnimationFrame(loop);
  },
};
