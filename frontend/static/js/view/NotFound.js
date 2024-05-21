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
		<h2 class="errorPage_h2">404</h2>
		<h2 class="errorPage_h2">Page Not Found</h2>
		<a href="/" id="main_link" class="nav__link errorPage_a" data-link>Go To Main</a>
	</nav>
		`;
  }
}
