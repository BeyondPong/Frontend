import Main from "../view/Main.js";
import Play from "../view/Play.js";
import Login from "../view/Login.js";
import Profile from "../view/Profile.js";
import NotFound from "../view/NotFound.js";
import NotLogin from "../view/NotLogin.js";
import registry from "../state/Registry.js";
import pathToRegex from "../utility/pathToRegex.js";
import getParams from "../utility/getParams.js";

export class Router {
  constructor() {
    this.routes = [
      {
        path: "/",
        view: Main,
      },
      {
        path: "/login",
        view: Login,
      },
      {
        path: "/play",
        view: Play,
      },
      {
        path: "/profile",
        view: Profile,
      },
      {
        path: "/notlogin",
        view: NotLogin,
      },
      {
        path: "/notfound",
        view: NotFound,
      },
    ];
  }

  navigateTo(url) {
    history.pushState(null, null, url);
  }

  async route() {
    const potentialMatches = this.routes.map((route) => {
      return {
        route: route,
        result: location.pathname.match(pathToRegex(route.path)),
      };
    });

    let match = potentialMatches.find(
      (potentialMatch) => potentialMatch.result !== null
    );
    if (!match || location.pathname === "/notfound") {
      match = {
        route: this.routes[5],
        result: [location.pathname],
      };
      this.navigateTo("/notfound");
      document.documentElement.style.backgroundImage =
        "url('/static/assets/errorbackgroundImg.png')";
    }
    const viewInstance = new match.route.view(getParams(match));
    if (match.route.path === "/login") {
      if (registry[0].islogin) {
        match = {
          route: this.routes[0],
          result: ["/"],
        };
        this.navigateTo("/");
      }
    } else if (match.route.path === "/profile") {
      if (!registry[0].islogin) {
        match = {
          route: this.routes[4],
          result: ["/notlogin"],
        };
        this.navigateTo("/notlogin");
        document.body.style.backgroundImage =
          "url('/static/assets/errorbackgroundImg.png')";
      }
    } else if (match.route.path === "/play") {
      await this.render(match);
      const startButton = document.querySelector("#start_button");
      startButton.addEventListener("click", viewInstance.deleteModal);
      return;
    } else if (match.route.path == "/") {
      document.body.style.backgroundImage =
        "url('/static/assets/backgroundImg.png')";
    }
    this.render(match);
  }

  async render(match) {
    const viewInstance = new match.route.view(getParams(match));
    const selectApp = document.querySelector("#app");
    selectApp.innerHTML = await viewInstance.getHtml();
  }
}
