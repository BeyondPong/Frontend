import registry from "../State/Registry.js";
import Main from "../view/Main.js";
import Play from "../view/Play.js";

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

export const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    {
      path: "/",
      view: Main,
    },
    {
      path: "/login",
      view: () => {
        console.log(registry[0].islogin);
      },
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
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = {
      route: routes[5],
      result: [location.pathname],
    };
    navigateTo("/notfound");
  } else if (match.route.path === "/login") {
    if (registry[0].islogin) {
      match = {
        route: routes[0],
        result: ["/"],
      };
      navigateTo("/");
    } else {
      const view = new match.route.view(getParams(match));
      const selectApp = document.querySelector("#app");
      selectApp.innerHTML = await view.getHtml();
    }
  } else if (match.route.path === "/profile") {
    if (!registry[0].islogin) {
      match = {
        route: routes[4],
        result: ["/notlogin"],
      };
      navigateTo("/notlogin");
    } else {
      const view = new match.route.view(getParams(match));
      const selectApp = document.querySelector("#app");
      selectApp.innerHTML = await view.getHtml();
    }
  } else if (match.route.path == "/play") {
    const view = new match.route.view(getParams(match));
    const selectApp = document.querySelector("#app");
    selectApp.innerHTML = await view.getHtml();
    const start_button = document.querySelector("#start_button");
    start_button.addEventListener("click", view.deleteModal);
  } else {
    const view = new match.route.view(getParams(match));
    const selectApp = document.querySelector("#app");
    selectApp.innerHTML = await view.getHtml();
  }
};

export default router;
