import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    return `
			<nav>
			<a href="/" id="main_link" class="nav__link" data-link>Ping? Pong!</a>
			<a id="start_button" class="nav__link">Start</a>
			</nav>
			<div class="play_modal">
				Play Game
			</div>
			`;
  }
  deleteModal() {
    const modal = document.querySelector(".play_modal");
    modal.style.display = "none";
  }
  async getModal() {}
}
