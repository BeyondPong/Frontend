const registry = [{ islogin: false }];

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

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    {
      path: "/",
      view: () => {
        console.log("MAIN!!");
      },
    },
    {
      path: "/login",
      view: () => {
        console.log(registry[0].islogin);
      },
    },
    {
      path: "/play",
      view: () => {
        console.log("Play!!");
      },
    },
    {
      path: "/profile",
      view: () => {
        console.log("Profle!!");
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
  } else if (match.route.path === "/login" && registry[0].islogin) {
    match = {
      route: routes[0],
      result: ["/"],
    };
    navigateTo("/");
  }

  match.route.view();

  //   const view = new match.route.view(getParams(match));

  //   document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});
