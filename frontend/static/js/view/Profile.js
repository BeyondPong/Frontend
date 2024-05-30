import AbstractView from './AbstractView.js';
import registry from '../state/Registry.js';
import { words } from '../state/Registry.js';
import { getProfileData, getHistoryData } from '../api/api.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    return `
              <header class="main_header">
                <a href="/" id="main_link" class="nav__link" data-link>Ping? Pong!</a>
              </header>
              <nav>
              <a href="/login" id="login_link" class="nav__link" data-link>${words[registry[1].lang].login}</a>
              <a href="/play" id="play_link" class="nav__link" data-link>${words[registry[1].lang].play}</a>
              <a href="/profile" id="profile_link" class="nav__link" data-link style="pointer-events: none; color: grey; text-decoration: none;">${
                words[registry[1].lang].profile
              }</a>
              </nav>
              <section class="modal_container">
                <div class="modal_content profile_modal">
                  <ul class="profile_nav">
                    <li class="profile_nav_item"><a href="#" class="information">${
                      words[registry[1].lang].information
                    }</a></li>
                    <li class="profile_nav_item"><a href="#" class="history">${words[registry[1].lang].history}</a></li>
                    <li class="profile_nav_item"><a href="#" class="friends">${words[registry[1].lang].friends}</a></li>
                    <li class="profile_nav_item"><a href="#" class="search">${words[registry[1].lang].search}</a></li>
                  </ul>
                  <div class="profile_content">
                  </div>
                </div>
              </section>
              `;
  }

  async moveTabs(tabText) {
    const profileContent = document.querySelector('.profile_content');
    profileContent.innerHTML = '';
    if (tabText === words[registry[1].lang].information) {
      const data = await getProfileData();
      if (data) {
        const container = document.createElement('div');
        container.classList.add('profile_container');
        const profileHTML = `
        <div class="profile_content_elements">
            <div class="profile_img_container">
              <div class="profile_img" style="background-image: url(${data.profile_img});">
                <button class="profile_img_edit pencil-profile" id="profile_img_edit"><i class="fa-solid fa-pencil"></i></button>
              </div>
            </div>
            <div class="profile_name_container">
              <span class="profile_name">${data.nickname}</span>
              <div class="profile_lang_container"><span class="profile_lang">${data.language}</span></div>
            </div>
            <div class="profile_status_container">
              <div class="profile_status">
                <span>${data.status_msg}</span>
              </div>
              <button class="profile_img_edit" id="status_edit"><i class="fa-solid fa-pencil"></i></button>
            </div>
            <span class="profile_count">${data.win_cnt}${words[registry[1].lang].win} ${data.lose_cnt}${
          words[registry[1].lang].lose
        } </span>
        </div>
    `;
        container.innerHTML = profileHTML;
        profileContent.replaceChildren(container);
        document.getElementById('profile_img_edit').addEventListener('click', () => {
          
        });
      }
    } else if (tabText === words[registry[1].lang].history) {
      const container = document.createElement('div');
      container.classList.add('history_container');
      const historyHTML = `
        <div class="table_box">
          <table class="table_container">
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Match Score</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table_content">
                <td class="table_date">2024-02-11</td>
                <td class="table_opponent">seoson</td>
                <td class="table_match_score">11:1</td>
                <td class="table_result">Win</td>
              </tr>
              <tr class="table_content">
                <td class="table_date"></td>
                <td class="table_opponent"></td>
                <td class="table_match_score"></td>
                <td class="table_result"></td>
              </tr>
              <tr class="table_content">
                <td class="table_date"></td>
                <td class="table_opponent"></td>
                <td class="table_match_score"></td>
                <td class="table_result"></td>
              </tr>
              <tr class="table_content">
                <td class="table_date"></td>
                <td class="table_opponent"></td>
                <td class="table_match_score"></td>
                <td class="table_result"></td>
              </tr>
              <tr class="table_content">
                <td class="table_date"></td>
                <td class="table_opponent"></td>
                <td class="table_match_score"></td>
                <td class="table_result"></td>
              </tr>
              <tr class="table_content">
                <td class="table_date"></td>
                <td class="table_opponent"></td>
                <td class="table_match_score"></td>
                <td class="table_result"></td>
              </tr>
              <tr class="table_content">
                <td class="table_date"></td>
                <td class="table_opponent"></td>
                <td class="table_match_score"></td>
                <td class="table_result"></td>
              </tr>
              <tr class="table_content">
                <td class="table_date"></td>
                <td class="table_opponent"></td>
                <td class="table_match_score"></td>
                <td class="table_result"></td>
              </tr>
              <tr class="table_content">
                <td class="table_date"></td>
                <td class="table_opponent"></td>
                <td class="table_match_score"></td>
                <td class="table_result"></td>
              </tr>
              <tr class="table_content">
                <td class="table_date"></td>
                <td class="table_opponent"></td>
                <td class="table_match_score"></td>
                <td class="table_result"></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
      container.innerHTML = historyHTML;
      profileContent.replaceChildren(container);

      const tableList = document.getElementsByClassName('table_content');

      const data = await getHistoryData();
      if (data) {
        data.histories.forEach((item, index) => {
          tableList[index].querySelector('.table_date').textContent = item.date;
          tableList[index].querySelector('.table_opponent').textContent = item.opponent;
          tableList[index].querySelector('.table_match_score').textContent = item.match_score;
          tableList[index].querySelector('.table_result').textContent = item.result;
        });
      }
    } else if (tabText === words[registry[1].lang].friends) {
      document.querySelector('.profile_content').textContent = 'friends';
    } else {
      document.querySelector('.profile_content').textContent = 'search';
    }
  }

  defaultTabs() {
    this.moveTabs(words[registry[1].lang].information);
    document.querySelector('.information').classList.add('active_tab');
  }
}
