import { addBlurBackground } from '../utility/blurBackGround.js';

export const remoteGame = {
  async init(socket, nickname) {
    addBlurBackground();
    const root = document.getElementById('app');
    while (root.childNodes.length > 0) {
      root.removeChild(root.firstChild);
    }
    const $app = document.getElementById('app');
    const $canvas = document.createElement('canvas');
    const context = $canvas.getContext('2d');
    $canvas.width = $app.offsetWidth / 2;
    $canvas.height = $app.offsetHeight / 1.2;
    let grid = 15;
    let paddleWidth = grid * 6;
    let user = {
      player1: { name: 'player1', score: 0 },
      player2: { name: 'player2', score: 0 },
    };
    let running = true;
    let gameEnded = false;

    function updateScore(data) {
      console.log(data);
      document.getElementById('player1Score').innerText = user.player1.score;
      document.getElementById('player2Score').innerText = user.player2.score;
    }

    let topPaddle = {
      x: $canvas.width / 2 - paddleWidth / 2,
      y: grid * 2,
      width: paddleWidth,
      height: grid,
      paddleLeftPressed: false,
      paddleRightPressed: false,
    };
    let bottomPaddle = {
      x: $canvas.width / 2 - paddleWidth / 2,
      y: $canvas.height - grid * 3,
      width: paddleWidth,
      height: grid,
      paddleLeftPressed: false,
      paddleRightPressed: false,
    };
    let ball = {
      x: $canvas.width / 2,
      y: $canvas.height / 2,
      width: grid,
      height: grid,
      dx: 0,
      dy: 0,
    };

    function addPoint(player) {
      score[player]++;
    }

    function reset(player) {
      if (gameEnded === true) return;
      running = true;
      paddleSpeed = 6;
      ballSpeed = 6;
      resetBall(player);
      resetPaddle();
      loop();
    }

    function resetBall(player) {
      ball.x = $canvas.width / 2;
      ball.y = $canvas.height / 2;
      ball.dx = 0;
      if (player === 'player1') {
        ball.dy = ballSpeed * -1;
      } else {
        ball.dy = ballSpeed;
      }
    }

    function resetPaddle() {
      topPaddle.x = $canvas.width / 2 - paddleWidth / 2;
      bottomPaddle.x = $canvas.width / 2 - paddleWidth / 2;
    }

    function gameStop() {
      running = false;
      paddleSpeed = 0;
      ballSpeed = 0;
    }

    function gameEnd(player) {
      if (gameEnded === true) return;
      gameEnded = true;
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
      buttonContainer.classList.add('remote_buttonContainer');
      buttonContainer.appendChild($score);
      buttonContainer.appendChild($win);
      buttonContainer.appendChild(againButton);
      buttonContainer.appendChild(mainButton);
      document.getElementById('app').appendChild(buttonContainer);
      againButton.addEventListener('click', () => {
        remoteGame.init();
      });
      againButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          remoteGame.init();
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
      $canvas.style.cursor = 'auto';
    }

    function render() {
      context.clearRect(0, 0, $canvas.width, $canvas.height);

      context.fillStyle = 'blue';
      context.fillRect(0, 0, $canvas.width, $canvas.height);

      context.fillStyle = 'white';
      context.fillRect(topPaddle.x, topPaddle.y, topPaddle.width, topPaddle.height);
      context.fillRect(bottomPaddle.x, bottomPaddle.y, bottomPaddle.width, bottomPaddle.height);

      context.fillStyle = 'lightgrey';
      context.fillRect(0, 0, grid, $canvas.height);
      context.fillRect($canvas.width - grid, 0, grid, $canvas.height);

      context.fillRect(ball.x, ball.y, ball.width, ball.height);
      context.fillStyle = 'lightgrey';
      context.fillRect(0, 0, $canvas.width, grid);
      context.fillRect(0, $canvas.height - grid, $canvas.width, $canvas.height);

      for (let i = grid; i < $canvas.width - grid; i += grid * 2) {
        context.fillRect(i, $canvas.height / 2 - grid / 2, grid, grid);
      }
      $canvas.style.cursor = 'none';
    }

    function gameStart() {
      const responseMessage = {
        type: 'start_game',
        message: 'i want to play game',
        width: $canvas.width,
        height: $canvas.height,
      };
      socket.send(JSON.stringify(responseMessage));
    }

    function settingGame(data) {
      ball.x = data.data.ball_position.x;
      ball.y = data.data.ball_position.y;
      ball.dx = data.data.ball_velocity.x;
      ball.dy = data.data.ball_velocity.y;
      user.player1.name = data.data.paddles[0].nickname;
      user.player2.name = data.data.paddles[1].nickname;
      topPaddle.x = data.data.paddles[0].x;
      topPaddle.y = data.data.paddles[0].y;
      topPaddle.width = data.data.paddles[0].width;
      topPaddle.height = data.data.paddles[0].height;
      bottomPaddle.x = data.data.paddles[1].x;
      bottomPaddle.y = data.data.paddles[1].y;
      bottomPaddle.width = data.data.paddles[1].width;
      bottomPaddle.height = data.data.paddles[1].height;
      user.player1.score = data.data.scores[data.data.paddles[0].nickname];
      user.player2.score = data.data.scores[data.data.paddles[1].nickname];
      $app.appendChild($canvas);
      const $div = document.createElement('div');
      $div.id = 'scoreBoard';
      $div.style.display = 'flex';
      $div.style.flexDirection = 'column';
      const player1Container = document.createElement('div');
      const player1Label = document.createElement('div');
      player1Label.innerText = `data.data.paddles`;
      player1Label.style.whiteSpace = 'nowrap';
      const player1Score = document.createElement('div');
      player1Score.id = 'player1Score';
      player1Score.style.display = 'inline';
      player1Score.innerHTML = '0';
      player1Container.appendChild(player1Label);
      player1Container.appendChild(player1Score);

      const player2Container = document.createElement('div');
      const player2Label = document.createElement('div');
      player2Label.innerText = 'Player 2';
      player2Label.style.whiteSpace = 'nowrap';
      const player2Score = document.createElement('div');
      player2Score.id = 'player2Score';
      player2Score.style.display = 'inline';
      player2Score.innerHTML = '0';
      player2Container.appendChild(player2Label);
      player2Container.appendChild(player2Score);

      $div.appendChild(player1Container);
      $div.appendChild(player2Container);
      root.appendChild($div);
      document.getElementById('player1Score').innerText = user.player1.score;
      document.getElementById('player2Score').innerText = user.player2.score;
    }

    function loop() {
      socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type === 'start_game') {
          settingGame(data);
        } else if (data.type == 'update_score') {
          updateScore(data);
        } else if (data.type == 'move_ball') {
          console.log(data);
          render();
        }
      };
      if (running) {
        requestAnimationFrame(loop);
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

    addKeyboardEvent();
    gameStart();
    requestAnimationFrame(loop);
  },
};
