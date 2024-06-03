import AbstractView from './AbstractView.js';
import registry from '../state/Registry.js';
import { words } from '../state/Registry.js';
import { getProfileData, getHistoryData, getSearchResultData, postAddFriend } from '../api/api.js';

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
              <a href="/profile" id="profile_link" class="nav__link" data-link style="pointer-events: none; color: grey; text-decoration: none;">${words[registry[1].lang].profile
      }</a>
              </nav>
              <section class="modal_container">
                <div class="modal_content profile_modal">
                  <ul class="profile_nav">
                    <li class="profile_nav_item"><a href="#" class="information">${words[registry[1].lang].information
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

  async loadSearchResultData(name) {
    try {
      // const response = await fetch('.../name');
      const response = await fetch('static/data/search.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Failed to load search result data: ", error);
    }
  }

  async showHistoryResult() {
    const tableBody = document.querySelector('.table_tbody');
    tableBody.innerHTML = '';

    const data = await getHistoryData();
    if (data) {
      data.histories.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('table_content');
        const historyHTML = `
          <td class="table_date">${item.date}</td>
          <td class="table_opponent">${item.opponent}</td>
          <td class="table_match_score">${item.match_score}</td>
          <td class="table_result">${item.result}</td>
        `;
        tr.innerHTML = historyHTML;
        tableBody.appendChild(tr);
      })
    }
  }
  async showSearchResult() {
    const searchAndDisplayResults = async () => {
      const query = document.getElementById('search_input').value;
      if (query === '') {
        alert('Please enter a friend name.');
        return;
      }
      const matchFriends = await getSearchResultData(query);
      if (!matchFriends || matchFriends.users.length === 0) {
        alert('No match friends');
        return;
      }
      const searchResultBox = document.querySelector('.search_result_box');
      searchResultBox.innerHTML = '';

      matchFriends.users.forEach((user) => {
        const friendElement = document.createElement('div');
        friendElement.classList.add('friend');
        let resultHTML = `
          <div class="friend_image" style="background-image: url(${user.profile_img});"></div>
          <div class="friend_name">${user.nickname}</div>
          <div class="friend_message">${user.status_msg}</div>
        `;
        if (user.is_friend) {
          resultHTML += `<div class="disabled_friend_button"><button class="add_button disabled_button" disabled data-user-id="${user.id}">ADD</button></div>`;
        } else {
          resultHTML += `<div class="friend_button"><button class="add_button" data-user-id="${user.id}">ADD</button></div>`;
        }
        friendElement.innerHTML = resultHTML;
        searchResultBox.appendChild(friendElement);
      });
    };

    document.querySelector('.search_button_container').addEventListener('click', async (e) => {
      await searchAndDisplayResults();
    });
    document.getElementById('search_input').addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        await searchAndDisplayResults();
      }
    });

    const buttons = Array.from(document.getElementsByClassName('add_button'));
    buttons.forEach((button) => {
      button.addEventListener('click', async (e) => {
        const userId = e.target.getAttribute('data-user-id');
        const user = matchFriends.users.find((u) => u.id === parseInt(userId));
        if (user.is_friend === false) {
          await postAddFriend(userId);
          alert('New friend added successfully!');
          e.target.style.cursor = 'not-allowed';
          e.target.style.backgroundColor = 'grey';
          e.target.disabled = true;
          e.target.parentNode.classList.add('disabled_friend_button');
        }
      });
    });
  }

  async moveTabs(tabText) {
    const profileContent = document.querySelector('.profile_content');
    profileContent.innerHTML = '';
    if (tabText === words[registry[1].lang].information) {
      const data = await getProfileData();
      if (data.status_msg === null) data.status_msg = `안녕하세요 ${data.nickname}입니다.`;
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
            <span class="profile_count">${data.win_cnt}${words[registry[1].lang].win} ${data.lose_cnt}${words[registry[1].lang].lose
          } </span>
        </div>
    `;
        container.innerHTML = profileHTML;
        profileContent.replaceChildren(container);
        document.getElementById('profile_img_edit').addEventListener('click', () => { });
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
            <tbody class="table_tbody">
\            </tbody>
          </table>
        </div>
      `;
      container.innerHTML = historyHTML;
      profileContent.replaceChildren(container);
      this.showHistoryResult();

    } else if (tabText === words[registry[1].lang].friends) {
      const container = document.createElement('div');
      container.classList.add('friends_container');
      const friendsHTML = `
        <div class="friends_result_container">
          <div class="friends_result_box">
            <div class="friend">
              <div class="friend_state friend_online"></div>
              <div class="friend_image" style="background-image: url(https://cdn.intra.42.fr/users/22a150a2b718bb79bbe204dc8e4a4ae7/misukim.jpg);"></div>
              <div class="friend_name">sgo</div>
              <div class="friend_message">안녕하세요 저는 상태메세지입니다. 방가</div>
              <div class="friend_button"><button class="add_button" data-user-id="#">DELETE</button></div>
            </div>
            <div class="friend">
              <div class="friend_state friend_online"></div>
              <div class="friend_image" style="background-image: url(https://cdn.intra.42.fr/users/22a150a2b718bb79bbe204dc8e4a4ae7/misukim.jpg);"></div>
              <div class="friend_name">seoson</div>
              <div class="friend_message">안녕하세요 방가</div>
              <div class="friend_button"><button class="add_button" data-user-id="#">DELETE</button></div>
            </div>
              <div class="friend">
                <div class="friend_state"></div>
                <div class="friend_image" style="background-image: url(https://cdn.intra.42.fr/users/22a150a2b718bb79bbe204dc8e4a4ae7/misukim.jpg);"></div>
                <div class="friend_name">jonim</div>
                <div class="friend_message">안녕하세요 저는 상태메세지입니다. 방가</div>
                <div class="friend_button"><button class="add_button" data-user-id="#">DELETE</button></div>
              </div>
              <div class="friend">
                <div class="friend_state"></div>
                <div class="friend_image" style="background-image: url(https://cdn.intra.42.fr/users/22a150a2b718bb79bbe204dc8e4a4ae7/misukim.jpg);"></div>
                <div class="friend_name">jusohn</div>
                <div class="friend_message">hi</div>
                <div class="friend_button"><button class="add_button" data-user-id="#">DELETE</button></div>
              </div>
          </div>
        </div>
      `;
      container.innerHTML = friendsHTML;
      profileContent.replaceChildren(container);

    } else {
      const container = document.createElement('div');
      container.classList.add('search_container');
      const searchHTML = `
        <div class="form_container">
          <form action="#" class="form_box">
            <div class="input_container">
              <input type="search" id="search_input" placeholder="Search for a friend..." required>
            </div>
            <div class="search_button_container"><button type="button" class="search_button"><i class="fa-solid fa-magnifying-glass"></i></button></div>
          </form>
        </div>
        <div class="search_result_container">
          <div class="search_result_box"></div>
        </div>
      `;
      container.innerHTML = searchHTML;
      profileContent.replaceChildren(container);
      this.showSearchResult();
    }
  }

  defaultTabs() {
    this.moveTabs(words[registry[1].lang].information);
    document.querySelector('.information').classList.add('active_tab');
  }
}
