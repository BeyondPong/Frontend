import router from "./Router/Router.js";
import { navigateTo } from "./Router/Router.js";

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  router();
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
});
