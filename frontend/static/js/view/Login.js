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
		<a href="/profile" id="profile_link" class="nav__link" data-link>Profile</a>
		</nav>
		`;
  }
  async getModal() {}
}
