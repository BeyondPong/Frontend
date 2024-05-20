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
			<a id="start_button" class="nav__link">Start</a>
			</nav>
			<section class="modal_container">
        <div class="modal_content play_modal">
          Play Game
        </div>
			</section>
			`;
  }
  deleteModal() {
    const modal = document.querySelector(".play_modal");
    modal.style.display = "none";
  }
  async getModal() {}
}
