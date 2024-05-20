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
			<a id="start_button" class="nav__link">Start</a>
			</nav>
			<section class="play_modal">
				Play Game
			</section>
			`;
  }
  deleteModal() {
    const modal = document.querySelector(".play_modal");
    modal.style.display = "none";
  }
  async getModal() {}
}
