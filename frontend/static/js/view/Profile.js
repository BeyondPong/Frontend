import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    return `
              <header>
                <h1>Ping? Pong!</h1>
              </header>
              <nav>
              <a href="/" id="main_link" class="nav__link" data-link>Ping? Pong!</a>
              <a href="/login" id="login_link" class="nav__link" data-link>Login</a>
              <a href="/play" id="play_link" class="nav__link" data-link>Play</a>
              <a href="/profile" id="profile_link" class="nav__link" data-link style="pointer-events: none; color: grey; text-decoration: none;">Profile</a>
              </nav>
              <section class="profile_modal">
              Profile Modal
              </section>
              `;
  }
  async getModal() {}
}
