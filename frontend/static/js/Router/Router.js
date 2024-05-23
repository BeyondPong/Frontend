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
import updateBackground from "../utility/updateBackground.js";

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
    updateBackground("error");
    return {
      route: this.routes.find((r) => r.path === "/notfound"),
      result: [location.pathname],
    };
  }

  handleNotLogin() {
    navigateTo("/notlogin");
    updateBackground("error");
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
        updateBackground("error");
        await this.render(match);
        break;
    }
  }

  async handleMainRoute(match) {
    const viewInstance = new match.route.view(getParams(match));
    await this.render(match);
    await viewInstance.onMounted();
    updateBackground("normal");
  }

  async handleLoginRoute(match) {
    if (registry[0].islogin) {
      navigateTo("/");
      updateBackground("normal");
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
      viewInstance.defaultTabs();
      navItems.forEach((item, index) => {
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
      updateBackground("normal");
    }
  }

  async handlePlayRoute(match) {
    await this.render(match);
    const viewInstance = new match.route.view(getParams(match));
    const localLink = document.getElementById("local_link");
    const remoteLink = document.getElementById("remote_link");
    const tournamentLink = document.getElementById("tournament_link");
    localLink.addEventListener("click", () => {
      viewInstance.localModal();
    });
    localLink.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        viewInstance.localModal();
      }
    });
    remoteLink.addEventListener("click", () => {
      viewInstance.remoteModal();
    });
    remoteLink.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        viewInstance.remoteModal();
      }
    });
    tournamentLink.addEventListener("click", () => {
      viewInstance.tournamentModal();
    });
    tournamentLink.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        viewInstance.tournamentModal();
      }
    });
    updateBackground("normal");
  }

  async render(match) {
    const viewInstance = new match.route.view(getParams(match));
    document.querySelector("#app").innerHTML = await viewInstance.getHtml();
  }
}
