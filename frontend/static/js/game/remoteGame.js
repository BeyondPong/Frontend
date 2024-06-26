import { postGameResult } from '../api/postAPI.js';
import { addBlurBackground } from '../utility/blurBackGround.js';

export const remoteGame = {
  async init(socket, nickname, gameMode) {
    addBlurBackground();
    const root = document.getElementById('app');
    const $app = document.getElementById('app');
    const $canvas = document.createElement('canvas');
    const context = $canvas.getContext('2d');
    let running = false;
    let grid = 15;
    let role = false;
    let user = {
      player1: { name: 'player1', score: 0 },
      player2: { name: 'player2', score: 0 },
    };

    let topPaddle = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      name: '',
    };
    let bottomPaddle = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      name: '',
    };
    let ball = {
      x: 0,
      y: 0,
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
      role = false;
      removeKeyboardEvent();
      await postGameResult(gameMode, user);
      const $win = document.createElement('div');
      $win.classList.add('win');
      $win.innerHTML = `${data.winner} wins!!!`;

      const $score = document.createElement('div');
      $score.classList.add('win');
      if (data.winner === nickname) {
        $score.innerHTML = `${data.scores[nickname]} : ${data.scores[data.loser]}`;
      } else {
        $score.innerHTML = `${data.scores[data.loser]} : ${data.scores[data.winner]}`;
      }

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
        window.location.href = '/play';
      });
      againButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          window.location.href = '/play';
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

      context.fillStyle = 'rgba(211,211,211,0.5)';
      for (let i = grid; i < $canvas.width - grid; i += grid * 2) {
        context.fillRect(i, $canvas.height / 2 - grid / 2, grid, grid);
      }
    }

    function gameStart() {
      let responseMessage = {
        type: 'start_game',
      };
      socket.send(JSON.stringify(responseMessage));
    }

    async function settingGame(data) {
      if (running) {
        return;
      }
      while (root.childNodes.length > 0) {
        root.removeChild(root.firstChild);
      }
      $app.appendChild($canvas);
      data.players.forEach((player) => {
        if (player === nickname) {
          role = true;
        }
      });
      addKeyboardEvent();
      running = true;
      $canvas.width = data.game_width;
      $canvas.height = data.game_height;
      targetBall.x = data.ball_position.x;
      targetBall.y = data.ball_position.y;

      user.player1.name = data.players[0];
      bottomPaddle.name = data.players[0];
      user.player2.name = data.players[1];
      topPaddle.name = data.players[1];
      topPaddle.x = data.paddles[1].x;
      topPaddle.y = data.paddles[1].y;
      topPaddle.width = data.paddles[1].width;
      topPaddle.height = data.paddles[1].height;
      bottomPaddle.x = data.paddles[0].x;
      bottomPaddle.y = data.paddles[0].y;
      bottomPaddle.width = data.paddles[0].width;
      bottomPaddle.height = data.paddles[0].height;

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

      $div.appendChild(player2Container);
      $div.appendChild(player1Container);
      root.appendChild($div);
      document.getElementById('player1Score').innerText = user.player1.score;
      document.getElementById('player2Score').innerText = user.player2.score;
    }

    function waitNextGame() {
      running = false;
      const $wait = document.createElement('div');
      $wait.classList.add('loading_spinner');

      const spinner = document.createElement('div');
      spinner.classList.add('spinner');

      const waitText = document.createElement('p');
      waitText.innerText = 'Wait for next game...';

      $wait.appendChild(spinner);
      $wait.appendChild(waitText);
      root.appendChild($wait);
    }

    async function setSocket() {
      socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'game_start':
            handleGameStart(data.data);
            break;
          case 'update_score':
            handleUpdateScore(data.data);
            break;
          case 'ball_position':
            handleBallPosition(data.data);
            break;
          case 'next_round':
            handleNextRound(data.data);
            break;
          case 'game_restart':
            handleGameRestart(data.data);
            break;
          case 'end_game':
            handleEndGame(data.data);
            break;
          case 'paddle_position':
            handlePaddlePosition(data.data);
            break;
        }
      };
    }

    async function handleGameStart(data) {
      await settingGame(data);
      animate();
    }

    function handleUpdateScore(data) {
      gameStop();
      updateScore(data);
      running = true;
    }

    function handleBallPosition(data) {
      targetBall.x = data.x;
      targetBall.y = data.y;
    }

    async function handleNextRound(data) {
      waitNextGame();
      gameStart();
      animate();
    }

    function handleGameRestart(data) {
      targetBall.x = data.ball_position.x;
      targetBall.y = data.ball_position.y;
      topPaddle.x = data.paddles[1].x;
      topPaddle.y = data.paddles[1].y;
      bottomPaddle.x = data.paddles[0].x;
      bottomPaddle.y = data.paddles[0].y;
    }

    function handleEndGame(data) {
      updateScore(data);
      gameEnd(data);
      waitNextGame();
    }

    function handlePaddlePosition(data) {
      data.forEach((paddleData) => {
        if (paddleData.nickname === topPaddle.name) {
          topPaddle.x = paddleData.x;
          topPaddle.y = paddleData.y;
        } else if (paddleData.nickname === bottomPaddle.name) {
          bottomPaddle.x = paddleData.x;
          bottomPaddle.y = paddleData.y;
        }
      });
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
      if (role === true) {
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);
      }
    }

    function removeKeyboardEvent() {
      if (role === true) {
        document.removeEventListener('keydown', keydownHandler);
        document.removeEventListener('keyup', keyupHandler);
      }
    }

    function keydownHandler(e) {
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
    }

    function keyupHandler(e) {
      if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
        e.preventDefault();
      }
    }

    setSocket();
    gameStart();
  },
};
