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
    const isLogin = localStorage.getItem('token') !== null;

    return `
      <header class="main_header">
        <a href="/" id="main_link" class="nav__link" data-link>Ping? Pong!</a>
      </header>
      <nav class="play_nav">
        <a tabindex="0" class="nav__link" id="local_link">${words[registry.lang].local}</a>
        <a tabindex="0" class="nav__link" id="remote_link" style="${
          isLogin ? '' : 'pointer-events: none; color: grey; text-decoration: none;'
        }">${words[registry.lang].remote}</a>
        <a tabindex="0" class="nav__link" id="tournament_link" style="${
          isLogin ? '' : 'pointer-events: none; color: grey; text-decoration: none;'
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
  `;
    this.showModal(modalHtml);
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
