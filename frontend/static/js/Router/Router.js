import Main from "../view/Main.js";
import Play from "../view/Play.js";
import Login from "../view/Login.js";
import Profile from "../view/Profile.js";
import NotFound from "../view/NotFound.js";
import NotLogin from "../view/NotLogin.js";
import registry from "../state/Registry.js";
import pathToRegex from "../utility/pathToRegex.js";
import getParams from "../utility/getParams.js";
import navigateTo from "../utility/navigateTo.js";

export class Router {
  constructor() {
    this.routes = [
      { path: "/", view: Main },
      { path: "/login", view: Login },
      { path: "/play", view: Play },
      { path: "/profile", view: Profile },
      { path: "/notlogin", view: NotLogin },
      { path: "/notfound", view: NotFound },
    ];
  }

  async route() {
    let match = this.findMatch();
    if (!match || location.pathname === "/notfound") {
      match = this.handleNotFound();
    }
    await this.handleRouteChange(match);
  }

  findMatch() {
    return this.routes
      .map((route) => ({
        route,
        result: location.pathname.match(pathToRegex(route.path)),
      }))
      .find((potentialMatch) => potentialMatch.result !== null);
  }

  handleNotFound() {
    navigateTo("/notfound");
    this.updateBackground("error");
    return {
      route: this.routes.find((r) => r.path === "/notfound"),
      result: [location.pathname],
    };
  }

  handleNotLogin() {
    navigateTo("/notlogin");
    this.updateBackground("error");
    return {
      route: this.routes.find((r) => r.path === "/notlogin"),
      result: [location.pathname],
    };
  }

  async handleRouteChange(match) {
    switch (match.route.path) {
      case "/login":
        await this.handleLoginRoute(match);
        break;
      case "/profile":
        await this.handleProfileRoute(match);
        break;
      case "/play":
        await this.handlePlayRoute(match);
        break;
      case "/":
        await this.handleMainRoute(match);
        break;
      default:
        this.updateBackground("error");
        await this.render(match);
        break;
    }
  }

  async handleMainRoute(match) {
    await this.render(match);
    this.updateBackground("normal");
  }

  async handleLoginRoute(match) {
    if (registry[0].islogin) {
      navigateTo("/");
      this.updateBackground("normal");
      console.log("hihi");
    } else await this.render(match);
  }

  async handleProfileRoute(match) {
    if (!registry[0].islogin) {
      match = this.handleNotLogin();
      await this.render(match);
    } else {
      await this.render(match);
      const viewInstance = new match.route.view(getParams(match));
      const navItems = Array.from(
        document.getElementsByClassName("profile_nav_item")
      );
      navItems.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          navItems.forEach((nav) =>
            nav.querySelector("a").classList.remove("active_tab")
          );
          e.target.closest("a").classList.add("active_tab");
          const tabText = e.target.closest("a").textContent.trim();
          viewInstance.moveTabs(tabText);
        });
      });
      this.updateBackground("normal");
    }
  }

  async handlePlayRoute(match) {
    await this.render(match);
    const viewInstance = new match.route.view(getParams(match));
    document
      .querySelector("#start_button")
      .addEventListener("click", viewInstance.deleteModal);
    viewInstance.initEvents();
    this.updateBackground("normal");
  }

  async render(match) {
    const viewInstance = new match.route.view(getParams(match));
    document.querySelector("#app").innerHTML = await viewInstance.getHtml();
  }

  updateBackground(type) {
    const hasNormal = document.body.classList.contains("normal-background");
    const hasError = document.body.classList.contains("error-background");

    if (type === "normal" && hasError) {
      document.body.classList.replace("error-background", "normal-background");
    } else if (type === "error" && hasNormal) {
      document.body.classList.replace("normal-background", "error-background");
    } else if (!hasNormal && !hasError) {
      document.body.classList.add(`${type}-background`);
    }
  }
}
