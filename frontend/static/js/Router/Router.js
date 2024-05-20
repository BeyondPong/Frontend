import Main from "../view/Main.js";
import Play from "../view/Play.js";
import Login from "../view/Login.js";
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
        view: () => {
          console.log("Profile!!");
        },
      },
      {
        path: "/notlogin",
        view: () => {
          console.log("Not Login!!");
        },
      },
      {
        path: "/notfound",
        view: () => {
          console.log("Not found!!");
        },
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

    const viewInstance = new match.route.view(getParams(match));
    if (!match) {
      match = {
        route: this.routes[5],
        result: [location.pathname],
      };
      this.navigateTo("/notfound");
    } else if (match.route.path === "/login") {
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
      }
    } else if (match.route.path === "/play") {
      await this.render(match);
      const startButton = document.querySelector("#start_button");
      startButton.addEventListener("click", viewInstance.deleteModal);
      return;
    }
    this.render(match);
  }

  async render(match) {
    const viewInstance = new match.route.view(getParams(match));
    const selectApp = document.querySelector("#app");
    selectApp.innerHTML = await viewInstance.getHtml();
  }
}
