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
        <h2>
            ${words[registry[1].lang].play}
        </h2>
        <div class="play_modal_img_container">
        </div>
        <div class="play_modal_text">
        <div class="play_move_left">
          ${words[registry[1].lang].moveleft}
        </div>
        <div class="play_move_right">
          ${words[registry[1].lang].moveright}
        </div>
        </div>
        </div>
			</section>
			`;
  }
  deleteModal() {
    const modal = document.querySelector(".play_modal");
    modal.style.display = "none";
  }
  initEvents() {
    const startButton = document.getElementById("start_button");
    startButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.deleteModal();
      }
    });
  }
}
