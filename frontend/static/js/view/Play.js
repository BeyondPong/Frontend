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
        <a tabindex="0" id="start_button" class="nav__link">${
          words[registry[1].lang].start
        }</a>
			</nav>
			<section class="modal_container">
        <div class="modal_content play_modal">
            ${words[registry[1].lang].play}
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
