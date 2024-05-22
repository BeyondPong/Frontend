import AbstractView from "./AbstractView.js";
import registry from "../state/Registry.js";
import { words } from "../state/Registry.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    return `
              <header>
                <a href="/" id="main_link" class="nav__link" data-link>Ping? Pong!</a>
              </header>
              <nav>
              <a href="/login" id="login_link" class="nav__link" data-link>${
                words[registry[1].lang].login
              }</a>
              <a href="/play" id="play_link" class="nav__link" data-link>${
                words[registry[1].lang].play
              }</a>
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
                    <li class="profile_nav_item"><a href="#" class="history">${
                      words[registry[1].lang].history
                    }</a></li>
                    <li class="profile_nav_item"><a href="#" class="friends">${
                      words[registry[1].lang].friends
                    }</a></li>
                    <li class="profile_nav_item"><a href="#" class="search">${
                      words[registry[1].lang].search
                    }</a></li>
                  </ul>
                  <div class="profile_content">
                  </div>
                </div>
              </section>
              `;
  }
  
  async loadProfileData() {
    try {
      const response = await fetch('static/data/information.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Failed to load profile data: ", error);
    }
  }

  async moveTabs(tabText) {
    const profileContent = document.querySelector('.profile_content');
    profileContent.innerHTML = '';
    if (tabText === words[registry[1].lang].information) {
      const data = await this.loadProfileData();
      if (data) {
        const container = document.createElement('div');
        container.classList.add('profile_container');
        const profileHTML = `
        <div class="profile_content_elements">
            <div class="profile_img_container">
              <div class="profile_img" style="background-image: url(${data.profile_img});">
                <button class="profile_img_edit pencil-profile"><i class="fa-solid fa-pencil"></i></button>
              </div>
            </div>
            <span class="profile_name">${data.nickname}</span>
            <span class="profile_status">
            ${data.status_msg}
            <button class="profile_img_edit pencil-status"><i class="fa-solid fa-pencil"></i></button>
            </span>
            <span class="profile_count">${data.win_count} Win ${data.lose_count} Lose</span>
        </div>
    `;
        container.innerHTML = profileHTML;
        profileContent.replaceChildren(container);
      }

    } else if (tabText === words[registry[1].lang].history) {
      document.querySelector(".profile_content").textContent = "history";
    } else if (tabText === words[registry[1].lang].friends) {
      document.querySelector(".profile_content").textContent = "friends";
    } else {
      document.querySelector(".profile_content").textContent = "search";
    }
  }

  defaultTabs() {
    this.moveTabs(words[registry[1].lang].information);
    document.querySelector(".information").classList.add("active_tab");
  }

  async getModal() {}
}
