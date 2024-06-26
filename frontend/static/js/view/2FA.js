import AbstractView from './AbstractView.js';
import { postLogin2FA, postLoginCode2FA } from '../api/postAPI.js';
import { getRegistration } from '../api/getAPI.js';
import { addBlurBackground } from '../utility/blurBackGround.js';
import { words, changeLanguage } from '../state/Registry.js';
import registry from '../state/Registry.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }
  async getHtml() {
    const currentLang = registry.lang;
    const modalHtml = `
    <div class="dropdown" id="dropdown_2fa">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" aria-expanded="false" data-bs-toggle="dropdown" aria-haspopup="true">
      <i class="fa-solid fa-globe"></i>
        Language
      </button>
      <ul id="d_menu" class="dropdown-menu drmenu" aria-labelledby="dropdownMenuButton">
        <li><a id="item1" class="dropdown-item drmenu ${
          currentLang === 'ko' ? 'disabled' : ''
        }" href="/" data-lang="ko">ko</a></li>
        <li><a id="item2" class="dropdown-item drmenu ${
          currentLang === 'en' ? 'disabled' : ''
        }" href="/" data-lang="en">en</a></li>
        <li><a id="item3" class="dropdown-item drmenu ${
          currentLang === 'jp' ? 'disabled' : ''
        }" href="/" data-lang="jp">jp</a></li>
      </ul>
    </div>
    <div class="fa_modal">
      <div id="gdpr" style="display: none">
        <h2 id="gdpr_underline">${words[currentLang].title}</h2>
        <p>${words[currentLang].content}</p>
        <ul>
          <li><strong>${words[currentLang].items[0]}</strong></li>
          <li><strong>${words[currentLang].items[1]}</strong></li>
          <li><strong>${words[currentLang].items[2]}</strong></li>
          <li><strong>${words[currentLang].items[3]}</strong></li>
          <li><strong>${words[currentLang].items[4]}</strong></li>
          <li><strong>${words[currentLang].items[5]}</strong></li>
          <li><strong>${words[currentLang].items[6]}</strong></li>
        </ul>
        <p id="gdpr_underline">${words[currentLang].agreement}</p>
        <button id="agreeBtn">${words[currentLang].button}</button>
      </div>
      <div class="modal_header">
        <i id="lock_image" class="fa-solid fa-lock"></i>
        <h2>Two-Factor Authentication</h2>
        <h4>Receive a temporary 6-digit login code via email</h4>
        <p id="user_email"></p>
        <button id="sendBtn">SEND</button>
        </div>
      <div id="fa_code_container" class="fa_code_container">
        <input type="text" id="fa_code_1" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_2" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_3" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_4" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_5" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_6" maxlength="1" class="fa_code_input" required>
      </div>
      <button id="checkBtn">VERIFY</button>
    </div>
    `;
    return modalHtml;
  }

  async updateGdprContent() {
    const gdpr = document.getElementById('gdpr');
    const title = gdpr.querySelector('h2');
    const content = gdpr.querySelector('p');
    const ul = gdpr.querySelector('ul');
    const agreement = gdpr.querySelectorAll('p')[1];
    const button = gdpr.querySelector('button');

    let currentLang = registry.lang;

    title.textContent = words[currentLang].title;
    content.textContent = words[currentLang].content;
    ul.innerHTML = words[currentLang].items
      .map((item) => `<li><strong>${item.split(':')[0]}:</strong> ${item.split(':')[1]}</li>`)
      .join('');
    agreement.textContent = words[currentLang].agreement;
    button.textContent = words[currentLang].button;
  }

  async onMounted() {
    const sendBtn = document.getElementById('sendBtn');
    const dropdownToggle = document.getElementById('dropdownMenuButton');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    sendBtn.addEventListener('click', async (e) => {
      if (sendBtn.innerText === 'SEND') {
        sendBtn.innerText = 'RESEND';
      }
      const response = await postLogin2FA();
    });

    sendBtn.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });

    dropdownToggle.addEventListener('click', () => {
      dropdownMenu.classList.toggle('show');
    });
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach((item) => {
      item.addEventListener('click', async (event) => {
        event.preventDefault();
        const selectedLang = item.getAttribute('data-lang');
        registry.lang = selectedLang;
        dropdownMenu.classList.remove('show');
        window.dispatchEvent(new Event('popstate'));
        const newLang = event.target.dataset.lang;
        changeLanguage(newLang);
        await this.updateGdprContent();
      });
    });
  }

  async checkCode() {
    let tryCount = 0;
    checkBtn.addEventListener('click', async (e) => {
      const faCodeInputs = document.querySelectorAll('.fa_code_input');
      const faCode = Array.from(faCodeInputs)
        .map((input) => input.value)
        .join('');
      const response = await postLoginCode2FA(faCode);
      if (response) {
        window.localStorage.setItem('2FA', response.token);
        window.location.href = '/';
      } else {
        tryCount += 1;
        if (tryCount === 3) {
          alert('Rewrite your email to get 2FA code');
          window.location.href = '/';
        }
      }
    });
  }

  async addEvent() {
    addBlurBackground();
    this.onMounted();
    const gdpr = document.getElementById('gdpr');
    const check = document.getElementById('checkBtn');
    const faCodeInputs = document.querySelectorAll('.fa_code_input');
    const user_email_p = document.getElementById('user_email');

    const registration = await getRegistration();
    let user_email = registration.email;
    if (user_email === null) {
      localStorage.clear();
      alert('You have to register email on Intranet');
      window.location.href = '/';
    }
    user_email_p.textContent = `Email: ${user_email}`;
    if (registration.status === 'new_user') {
      gdpr.style.display = 'grid';
    }
    const agreeBtn = document.getElementById('agreeBtn');
    agreeBtn.addEventListener('click', (e) => {
      gdpr.style.display = 'none';
    });
    agreeBtn.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        agreeBtn.click();
      }
    });

    faCodeInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (input.value.length >= 1 && index < faCodeInputs.length - 1) {
          faCodeInputs[index + 1].focus();
        }
      });
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        faCodeInputs.forEach((input, idx) => {
          input.value = pasteData[idx] || '';
        });
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          check.click();
        }
        if (e.key === 'Backspace' && input.value.length === 1) {
          input.value = '';
        } else if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
          faCodeInputs[index - 1].focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          faCodeInputs[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < faCodeInputs.length - 1) {
          faCodeInputs[index + 1].focus();
        }
      });
    });
    this.checkCode();
  }
}
