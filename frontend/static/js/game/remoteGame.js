import { postGameResult } from '../api/api.js';
import { addBlurBackground } from '../utility/blurBackGround.js';

export const remoteGame = {
  async init(socket, nickname, gameMode) {
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
    $app.appendChild($canvas);
    let running = true;
    let grid = 15;
    let paddleWidth = grid * 6;
    let user = {
      player1: { name: 'player1', score: 0 },
      player2: { name: 'player2', score: 0 },
    };

    let topPaddle = {
      x: $canvas.width / 2 - paddleWidth / 2,
      y: grid * 2,
      width: paddleWidth,
      height: grid,
    };
    let bottomPaddle = {
      x: $canvas.width / 2 - paddleWidth / 2,
      y: $canvas.height - grid * 3,
      width: paddleWidth,
      height: grid,
    };
    let ball = {
      x: $canvas.width / 2,
      y: $canvas.height / 2,
      width: grid,
      height: grid,
    };

    let targetBall = { x: ball.x, y: ball.y };

    function updateScore(data) {
      user.player1.score = data.scores[user.player1.name] ?? user.player1.score;
      user.player2.score = data.scores[user.player2.name] ?? user.player2.score;
      document.getElementById('player1Score').innerText = user.player1.score;
      document.getElementById('player2Score').innerText = user.player2.score;
    }

    function gameStop() {
      running = false;
    }

    async function gameEnd(data) {
      const $win = document.createElement('div');
      $win.classList.add('win');
      $win.innerHTML = `${data.winner} wins!!!`;

      const $score = document.createElement('div');
      $score.classList.add('win');
      $score.innerHTML = `${user.player1.score} : ${user.player2.score}`;

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
        remoteGame.init(socket, nickname, gameMode);
      });
      againButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          remoteGame.init(socket, nickname, gameMode);
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
      await postGameResult(gameMode, user);
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
      targetBall.x = data.ball_position.x;
      targetBall.y = data.ball_position.y;

      if (data.paddles[0].nickname === nickname) {
        user.player1.name = data.paddles[0].nickname;
        user.player2.name = data.paddles[1].nickname;
        topPaddle.x = data.paddles[0].x;
        topPaddle.y = data.paddles[0].y;
        topPaddle.width = data.paddles[0].width;
        topPaddle.height = data.paddles[0].height;
        bottomPaddle.x = data.paddles[1].x;
        bottomPaddle.y = data.paddles[1].y;
        bottomPaddle.width = data.paddles[1].width;
        bottomPaddle.height = data.paddles[1].height;
      } else {
        user.player1.name = data.paddles[1].nickname;
        user.player2.name = data.paddles[0].nickname;
        topPaddle.x = data.paddles[1].x;
        topPaddle.y = data.paddles[1].y;
        topPaddle.width = data.paddles[1].width;
        topPaddle.height = data.paddles[1].height;
        bottomPaddle.x = data.paddles[0].x;
        bottomPaddle.y = data.paddles[0].y;
        bottomPaddle.width = data.paddles[0].width;
        bottomPaddle.height = data.paddles[0].height;
      }

      user.player1.score = data.scores[user.player1.name];
      user.player2.score = data.scores[user.player2.name];

      const $div = document.createElement('div');
      $div.id = 'scoreBoard';
      $div.style.display = 'flex';
      $div.style.flexDirection = 'column';

      const player1Container = document.createElement('div');
      const player1Label = document.createElement('div');
      player1Label.innerText = user.player1.name;
      player1Label.style.whiteSpace = 'nowrap';
      const player1Score = document.createElement('div');
      player1Score.id = 'player1Score';
      player1Score.style.display = 'inline';
      player1Container.appendChild(player1Label);
      player1Container.appendChild(player1Score);

      const player2Container = document.createElement('div');
      const player2Label = document.createElement('div');
      player2Label.innerText = user.player2.name;
      player2Label.style.whiteSpace = 'nowrap';
      const player2Score = document.createElement('div');
      player2Score.id = 'player2Score';
      player2Score.style.display = 'inline';
      player2Container.appendChild(player2Label);
      player2Container.appendChild(player2Score);

      $div.appendChild(player1Container);
      $div.appendChild(player2Container);
      root.appendChild($div);
      document.getElementById('player1Score').innerText = user.player1.score;
      document.getElementById('player2Score').innerText = user.player2.score;
    }

    function setSocket() {
      socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.type === 'game_start') {
          settingGame(data.data);
        } else if (data.type == 'update_score') {
          gameStop();
          updateScore(data.data);
          running = true;
        } else if (data.type == 'ball_position') {
          targetBall.x = data.data.x;
          targetBall.y = data.data.y;
        } else if (data.type == 'end_game') {
          updateScore(data.data);
          gameEnd(data.data);
        }
      };
    }

    function animate() {
      if (running) {
        ball.x = targetBall.x;
        ball.y = targetBall.y;
        render();
        requestAnimationFrame(animate);
      }
    }

    function addKeyboardEvent() {
      document.addEventListener('keydown', function (e) {
        let responseMessage = {};
        if (e.code === 'ArrowLeft') {
          e.preventDefault();
          responseMessage = {
            type: 'move_paddle',
            paddle: nickname,
            direction: 'left',
          };
          socket.send(JSON.stringify(responseMessage));
        } else if (e.code === 'ArrowRight') {
          e.preventDefault();
          responseMessage = {
            type: 'move_paddle',
            paddle: nickname,
            direction: 'right',
          };
          socket.send(JSON.stringify(responseMessage));
        }
      });
      document.addEventListener('keyup', function (e) {
        if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
          e.preventDefault();
        }
      });
    }

    addKeyboardEvent();
    setSocket();
    gameStart();
    animate();
  },
};
