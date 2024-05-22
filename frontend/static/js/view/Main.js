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
			<a href="/login" id="login_link" class="nav__link" data-link> ${
        words[registry[1].lang].login
      }</a>
			<a href="/play" id="play_link" class="nav__link" data-link>${
        words[registry[1].lang].play
      }</a>
			<a href="/profile" id="profile_link" class="nav__link" data-link>${
        words[registry[1].lang].profile
      }</a>
			</nav>
			`;
  }
}
