import AbstractView from "./AbstractView.js";

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
              <a href="/login" id="login_link" class="nav__link" data-link>Login</a>
              <a href="/play" id="play_link" class="nav__link" data-link>Play</a>
              <a href="/profile" id="profile_link" class="nav__link" data-link style="pointer-events: none; color: grey; text-decoration: none;">Profile</a>
              </nav>
              <section class="modal_container">
                <div class="modal_content profile_modal">
                  <ul class="profile_nav">
                    <li class="profile_nav_item"><a href="#" class="information">Information</a></li>
                    <li class="profile_nav_item"><a href="#" class="history">History</a></li>
                    <li class="profile_nav_item"><a href="#" class="friends">Friends</a></li>
                    <li class="profile_nav_item"><a href="#" class="search">Search</a></li>
                  </ul>
                  <div class="profile_content">
                  </div>
                </div>
              </section>
              `;
  }

  moveTabs(tabText) {
    // 여기서 뷰에 맞게 뿌려줄 예정
    if (tabText === 'Information') {
      document.querySelector('.profile_content').textContent = "information";
    }
    else if (tabText === 'History') {
      document.querySelector('.profile_content').textContent = "history";
    }
    else if (tabText=== 'Friends') {
      document.querySelector('.profile_content').textContent = "friends";
    }
    else {
      document.querySelector('.profile_content').textContent = "search";
    }
  }

  async getModal() {}

}
