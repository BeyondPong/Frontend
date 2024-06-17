import AbstractView from './AbstractView.js';
import { postLogin2FA, postLoginCode2FA } from '../api/api.js';
import { addBlurBackground } from '../utility/blurBackGround.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }
  async getHtml() {
    const modalHtml = `
    <div class="fa_modal">
      <div class="modal_header">
      <i id="lock_image" class="fa-solid fa-lock"></i>
      <h2>2FA</h2>
      </div>
      <input class="email_input" type="email"
            id="email"
            placeholder="ex@gmail.com or ex@naver.com"
            required>
      <div id="fa_code_container" class="fa_code_container" style="display:none;">
        <input type="text" id="fa_code_1" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_2" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_3" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_4" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_5" maxlength="1" class="fa_code_input" required>
        <input type="text" id="fa_code_6" maxlength="1" class="fa_code_input" required>
      </div>
      <button id="checkBtn">CHECK</button>
    </div>
    `;
    return modalHtml;
  }

  async checkCode() {
    const emailInput = document.getElementById('email');
    const faCodeContainer = document.getElementById('fa_code_container');

    emailInput.style.display = 'none';

    faCodeContainer.style.display = 'flex';

    const checkBtn = document.getElementById('checkBtn');
    checkBtn.textContent = 'VERIFY';
    let tryCount = 0;
    checkBtn.addEventListener('click', async (e) => {
      const faCodeInputs = document.querySelectorAll('.fa_code_input');
      const faCode = Array.from(faCodeInputs)
        .map((input) => input.value)
        .join('');
      const response = await postLoginCode2FA(faCode);
      if (response) {
        window.location.href = '/';
        window.localStorage.setItem('2FA', response.token);
      } else {
        tryCount += 1;
        if (tryCount === 3) {
          alert('Rewrite your email to get 2FA code');
          window.location.href = '/';
        }
      }
    });
  }

  async checkEmail(email) {
    const emailPattern = /.+@(gmail\.com|naver\.com)$/;
    if (emailPattern.test(email)) {
      console.log('Valid email:', email);
      await postLogin2FA(email);
      await this.checkCode();
    } else {
      alert('Invalid email address use gmail.com or naver.com only');
      console.error('Invalid email:', email);
    }
  }

  async addEvent() {
    addBlurBackground();
    const email = document.getElementById('email');
    const check = document.getElementById('checkBtn');
    const faCodeInputs = document.querySelectorAll('.fa_code_input');

    email.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        check.click();
      }
    });

    check.addEventListener('click', (e) => {
      if (email.style.display !== 'none') {
        this.checkEmail(email.value);
      } else {
        const faCode = Array.from(faCodeInputs)
          .map((input) => input.value)
          .join('');
        console.log('2FA code:', faCode);
      }
    });

    faCodeInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (input.value.length >= 1 && index < faCodeInputs.length - 1) {
          faCodeInputs[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
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
  }
}
