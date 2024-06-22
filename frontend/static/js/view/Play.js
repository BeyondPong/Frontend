import AbstractView from './AbstractView.js';
import registry from '../state/Registry.js';
import { words } from '../state/Registry.js';
import { localGame } from '../game/localGame.js';
import { remoteGame } from '../game/remoteGame.js';
import { getRoomName, getProfileData, postTournamentNickName } from '../api/api.js';
import { addBlurBackground, removeBlurBackground } from '../utility/blurBackGround.js';
import WebSocketManager from '../state/WebSocketManager.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const isLogin = localStorage.getItem('token') !== null;

    return `
      <header class="main_header">
        <a href="/" id="main_link" class="nav__link" data-link>Ping? Pong!</a>
      </header>
      <div id = "countdown_container" style="display:none">
      </div>
      <div id="loading_spinner" class="loading_spinner" style="display: none;">
        <div class="spinner"></div>
        <p>Matching...</p>
      </div>
      <nav class="play_nav">
        <a tabindex="0" class="nav__link" id="local_link">${words[registry.lang].local}</a>
        <a tabindex="0" class="nav__link" id="remote_link" style="${isLogin ? '' : 'pointer-events: none; color: grey; text-decoration: none;'
      }">${words[registry.lang].remote}</a>
        <a tabindex="0" class="nav__link" id="tournament_link" style="${isLogin ? '' : 'pointer-events: none; color: grey; text-decoration: none;'
      }">${words[registry.lang].tournament}</a>
      </nav>
    `;
  }

  async localModal() {
    const modalHtml = `
      <div class="modal_content play_modal">
        <div class="local_modal_heading">
          <h2 class="local_modal_heading2">
              ${words[registry.lang].play}
          </h2>
          <div class="local_modal_heading3_container">
          <h3 class="local_modal_heading3">
            Player1
          </h3>
          <h3 class="local_modal_heading3">
            Player2
          </h3>
          </div>
        </div>
        <div class="local_play_modal_img_container">
        </div>
        <div class="play_modal_text">
          <div class="play_move_left">
            ${words[registry.lang].moveleft}
          </div>
          <div class="play_move_right">
            ${words[registry.lang].moveright}
          </div>
          <div class="play_move_left">
            ${words[registry.lang].moveleft}
          </div>
          <div class="play_move_right">
            ${words[registry.lang].moveright}
          </div>
        </div>
      </div>
    `;
    await this.showModal(modalHtml);
    const startButton = document.querySelector('#start_button');
    startButton.addEventListener('click', async (e) => {
      this.deleteModal();
      e.target.style.display = 'none';
      localGame.init();
    });
    startButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.target.style.display = 'none';
        this.deleteModal();
        localGame.init();
      }
    });
  }

  async remoteModal() {
    const modalHtml = `
      <div class="modal_content play_modal">
        <h2>
            ${words[registry.lang].play}
        </h2>
        <div class="remote_play_modal_img_container">
        </div>
        <div class="play_modal_text">
          <div class="play_move_left">
            ${words[registry.lang].moveleft}
          </div>
          <div class="play_move_right">
            ${words[registry.lang].moveright}
          </div>
        </div>
      </div>`;
    await this.showModal(modalHtml);
    const startButton = document.querySelector('#start_button');
    startButton.addEventListener('click', async (e) => {
      this.deleteModal();
      e.target.style.display = 'none';
      this.play('REMOTE');
    });
    startButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.target.style.display = 'none';
        this.deleteModal();
        this.play('REMOTE');
      }
    });
  }

  async play(mode) {
    const getRoomNames = async (mode) => {
      const response = await getRoomName(mode);
      return response.room_name;
    };

    const setupWebSocket = async (roomName, mode) => {
      const data = await getProfileData();
      const nickname = data.nickname;
      const token = localStorage.getItem('token');
      WebSocketManager.connectGameSocket(`ws://localhost:8000/ws/play/${mode}/${roomName}/${nickname}/?token=${token}`);
      let socket = WebSocketManager.returnGameSocket();

      const loadingSpinner = document.getElementById('loading_spinner');

      window.addEventListener('online', () => {
        console.log('ONLINE');
        removeBlurBackground();
        loadingSpinner.style.display = 'none';
        this.remoteGame.init(socket);
      });

      window.addEventListener('offline', () => {
        console.log('OFFLINE');
        addBlurBackground();
        loadingSpinner.innerText = 'No Internet Connection';
        loadingSpinner.style.display = 'flex';
      });

      socket.onopen = (event) => {
        console.log('Game socket connected');
        if (mode === 'TOURNAMENT') {
          this.tournamentNickNameModal(nickname, roomName);
          loadingSpinner.style.display = 'none';
        } else {
          loadingSpinner.style.display = 'flex';
        }
      };
      socket.onclose = (event) => {
        console.log('Game socket closed');
      };

      socket.onerror = (event) => {
        console.error('Game socket error:', event);
        if (!WebSocketManager.isGameSocketConnecting) {
          WebSocketManager.connectGameSocket(`ws://localhost:8000/ws/play/${mode}/${roomName}/${nickname}/?token=${token}`);
          socket = WebSocketManager.returnGameSocket();
        }
      };

      socket.onmessage = (event) => {
        console.log('Message from server: ', event.data);
        const data = JSON.parse(event.data);
        loadingSpinner.style.display = 'none';
        if (data.type === 'start_game') {
          const countdownContainer = document.querySelector('#countdown_container');
          countdownContainer.style.display = 'flex';

          let countdown = 3;
          countdownContainer.innerText = countdown;
          const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
              countdownContainer.innerText = countdown;
            } else {
              clearInterval(countdownInterval);
              countdownContainer.innerText = 'Go!';
              setTimeout(() => {
                countdownContainer.style.display = 'none';
                remoteGame.init(socket, nickname);
              }, 1000);
            }
          }, 1000);
        }
      };
    };

    const roomName = await getRoomNames(mode);
    await setupWebSocket(roomName, mode);
  }

  async tournamentNickNameModal(realName, roomName) {
    const modalHtml = `
      <div class="tournament_container_flex">
        <div>
          <input type="text" class="input_box" placeholder="${words[registry.lang].tournament_nickname_placeholder
      }" maxlength="10"/>
        </div>
        <div><button class="close_button check_button">CHECK</button></div>
      </div>
      <div class="tournament_modal hidden">
        <div class="tournament_modal_flex">
          <div>${words[registry.lang].tournament_nickname_error}</div>
          <div class="close_button tournament_button">
            <button>OK</button>
          </div>
        </div>
      </div>
    `;
    const modalCotainer = document.querySelector('.modal_container');
    const newContainer = document.createElement('div');
    newContainer.classList.add('modal_content');
    newContainer.classList.add('tournament_container');
    newContainer.innerHTML = modalHtml;
    modalCotainer.appendChild(newContainer);

    const container = document.querySelector('.tournament_container');
    const checkButton = document.querySelector('.check_button');
    const inputBox = document.querySelector('.input_box');
    const tournamentModal = document.querySelector('.tournament_modal');
    const closeButton = document.querySelector('.tournament_button');

    container.classList.remove('hidden');
    checkButton.disabled = true;
    checkButton.classList.add('disabled_button');
    inputBox.addEventListener('input', () => {
      if (inputBox.value.length < 2 || inputBox.value.length > 10) {
        checkButton.disabled = true;
        checkButton.classList.add('disabled_button');
      } else {
        checkButton.disabled = false;
        checkButton.classList.remove('disabled_button');
      }
    });

    checkButton.addEventListener('click', async () => {
      const nickName = inputBox.value;
      const checkNickName = await postTournamentNickName(nickName, realName, roomName);
      console.log(checkNickName);
      if (checkNickName.valid === false) {
        tournamentModal.classList.remove('hidden');
        closeButton.addEventListener('click', () => {
          console.log('close button');
          tournamentModal.classList.add('hidden');
        });
        return;
      }

      const container = document.querySelector('.tournament_container_flex');
      while (container.childNodes.length > 0) {
        container.removeChild(container.firstChild);
      }
      const newDiv = document.createElement('div');
      newDiv.classList.add('tournament_list');
      const tableHTML = `
        <div class="tournament_left">
          <div class="tournament_left_parent tournament_final">
            <div class="tournament_player_box">
              <div class="tournament_player">
                final1
              </div>
            <div class="tournament_player_name">avocado</div>
           </div>
          </div>
          <div class="tournament_left_childrens">
            <div class="tournament_left_child">
              <div class="tournament_left">
                <div class="tournament_left_parent remove-after">
                  <div class="tournament_player_box tournament_semi">
                    <div class="tournament_player">
                      semi1
                    </div>
                    <div class="tournament_player_name">${checkNickName.nicknames[0].nickname}</div>
                  </div>
                </div> 
              </div>
            </div>
            <div class="tournament_left_child left_last_child">
              <div class="tournament_left">
                <div class="tournament_left_parent remove-after">
                  <div class="tournament_player_box tournament_semi">
                    <div class="tournament_player">
                      semi2
                    </div>
                    <div class="tournament_player_name">${checkNickName.nicknames[2] ? checkNickName.nicknames[2].nickname : ' '}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tournament_right">
          <div class="tournament_right_parent remove-after">
            <div class="tournament_player_box">
              <div class="tournament_player remove-after">
                final2
              </div>
              <div class="tournament_player_name">misukim</div>
            </div>
          </div>
          <div class="tournament_right_childrens">
            <div class="tournament_right_child">
              <div class="tournament_right">
                <div class="tournament_right_parent remove-before">
                  <div class="tournament_player_box tournament_semi">
                    <div class="tournament_player">
                      semi1
                    </div>
                    <div class="tournament_player_name">${checkNickName.nicknames[1] ? checkNickName.nicknames[1].nickname : ' '}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tournament_right_child right_last_child">
              <div class="tournament_right">
                <div class="tournament_right_parent remove-before">
                  <div class="tournament_player_box tournament_semi">
                    <div class="tournament_player">
                      semi2
                    </div>
                    <div class="tournament_player_name">${checkNickName.nicknames[3] ? checkNickName.nicknames[3].nickname : ' '}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      newDiv.innerHTML = tableHTML;
      container.replaceChildren(newDiv);
    });

  }

  tournamentModal() {
    const modalHtml = `
      <div class="modal_content play_modal">
        <h2>
            ${words[registry.lang].play}
        </h2>
        <div class="remote_play_modal_img_container">
        </div>
        <div class="play_modal_text">
          <div class="play_move_left">
            ${words[registry.lang].moveleft}
          </div>
          <div class="play_move_right">
            ${words[registry.lang].moveright}
          </div>
        </div>
      </div>
  `;
    this.showModal(modalHtml);
    const startButton = document.querySelector('#start_button');

    startButton.addEventListener('click', (e) => {
      e.target.style.display = 'none';
      this.deleteModal();
      this.play('TOURNAMENT');
    });

    startButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.target.style.display = 'none';
        this.deleteModal();
        this.play('TOURNAMENT');
      }
    });
  }

  async showStartButton() {
    const startButton = document.createElement('a');
    startButton.id = 'start_button';
    startButton.classList.add('nav__link');
    startButton.classList.add('play_nav');
    startButton.tabIndex = 0;
    startButton.innerHTML = words[registry.lang].start;
    const playNav = document.querySelector('.play_nav');
    playNav.innerHTML = '';
    playNav.appendChild(startButton);
    const mainLink = document.querySelector('#main_link');
    mainLink.addEventListener('click', () => {
      WebSocketManager.closeGameSocket();
    });
    mainLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        WebSocketManager.closeGameSocket();
      }
    });
  }

  async showModal(modalHtml) {
    const modalContainer = document.createElement('section');
    modalContainer.classList.add('modal_container');
    modalContainer.innerHTML = modalHtml;
    const mainHeader = document.querySelector('.main_header');
    mainHeader.insertAdjacentElement('afterend', modalContainer);
    await this.showStartButton();
  }

  deleteModal() {
    const modal = document.querySelector('.play_modal');
    modal.style.display = 'none';
  }
}
