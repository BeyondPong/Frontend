import AbstractView from './AbstractView.js';
import registry from '../state/Registry.js';
import { words } from '../state/Registry.js';
import { localGame } from '../game/localGame.js';
import { remoteGame } from '../game/remoteGame.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    return `
      <header class="main_header">
        <a href="/" id="main_link" class="nav__link" data-link>Ping? Pong!</a>
      </header>
			<nav class="play_nav">
        <a tabindex="0" class="nav__link" id="local_link">${words[registry.lang].local}</a>
         <a tabindex="0" class="nav__link" id="remote_link">${words[registry.lang].remote}</a>
         <a tabindex="0" class="nav__link" id="tournament_link">${words[registry.lang].tournament}</a>
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
      remoteGame.init();
    });
    startButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.target.style.display = 'none';
        this.deleteModal();
        remoteGame.init();
      }
    });
  }
  async tournamentModal() {
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
      <div class="modal_content tournament_container hidden">
        <div class="tournament_container_flex">
          <div>
            <input type="text" class="input_box" placeholder="${words[registry.lang].tournament_nickname_placeholder}" maxlength="10"/>
          </div>
          <div><button class="close_button check_button">CHECK</button></div>
        </div>
      </div>
  `;
    this.showModal(modalHtml);
    const startButton = document.querySelector('#start_button');

    startButton.addEventListener('click', async (e) => {
      e.target.style.display = 'none';
      this.deleteModal();

      const container = document.querySelector('.tournament_container');
      const checkButton = document.querySelector('.check_button');
      const inputBox = document.querySelector('.input_box');

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
      })
      checkButton.addEventListener('click', () => {
        // API, 소켓 연결 예정. 닉네임 중복검사 필요.
        const nickName = inputBox.value;
        // container.classList.add('hidden');
        const container = document.querySelector('.tournament_container_flex');
        while (container.childNodes.length > 0) {
          container.removeChild(container.firstChild);
        }
        const newDiv = document.createElement('div');
        newDiv.classList.add('history_container');
        const tableHTML = `
        <div class="table_box">
          <table class="table_container">
            <thead>
              <tr>
                <th>No.</th>
                <th>${words[registry.lang].tournament_table_nickname}</th>
                <th>${words[registry.lang].tournament_table_score}</th>
              </tr>
            </thead>
            <tbody class="table_tbody">
              <tr>
                <td class="table_number">1</td>
                <td class="table_nickname">아보카도</td>
                <td class="table_score">11 Win 2 Lose</td>
              </tr>
              <tr>
                <td class="table_number">2</td>
                <td class="table_nickname">바나나</td>
                <td class="table_score">1 Win 2 Lose</td>
              </tr>
              <tr>
                <td class="table_number">3</td>
                <td class="table_nickname">끄투마스터고승준</td>
                <td class="table_score">0 Win 3 Lose</td>
              </tr>
              <tr>
                <td class="table_number">4</td>
                <td class="table_nickname">할라피뇨</td>
                <td class="table_score">4 Win 0 Lose</td>
              </tr>
            </tbody>
          </table>
          </div>
        `;
        newDiv.innerHTML = tableHTML;
        container.replaceChildren(newDiv);

      })
    });


    startButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.target.style.display = 'none';
        this.deleteModal();
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
