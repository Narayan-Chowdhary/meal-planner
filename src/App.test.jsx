import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import db from "../db.json";
import Store from "./Store/Slices/Store";
import App from "./App";

// Chart.js needs real canvas layout, which jsdom does not provide.
vi.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

// Serve db.json through fetch so pages render with realistic data.
function mockFetch(input, init = {}) {
  const url = new URL(typeof input === "string" ? input : input.url, "http://localhost:8000");
  const method = (init.method ?? "GET").toUpperCase();
  const json = (body) =>
    Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } }));

  if (url.pathname.startsWith("/assets/locales/")) return json({});
  if (method !== "GET") return json(init.body ? JSON.parse(init.body) : {});

  const [collection, id] = url.pathname.split("/").filter(Boolean);
  const key = Object.keys(db).find((k) => k.toLowerCase() === collection?.replace(/\.json$/, "").toLowerCase());
  let data = key ? db[key] : null;
  if (Array.isArray(data)) {
    if (id) return json(data.find((item) => String(item.id) === id) ?? {});
    for (const [field, value] of url.searchParams) {
      data = data.filter((item) => String(item[field]) === value);
    }
  }
  return json(data ?? {});
}

const routes = [
  "/", "/signup", "/home", "/recipeSuggestionPage", "/recipevt",
  "/mealplanner", "/mealdes", "/about", "/menu", "/profile", "/wishlist",
  "/dishPage", "/settings", "/fitenssreport", "/addrecipe", "/allmeals",
  "/groceries", "/cart", "/ordertable", "/adminLayout", "/users", "/products",
  "/add-recipe-csv", "/buildComp", "/activity", "/does-not-exist",
];

const ROLE_USERS = {
  admin: db.users.find((u) => u.role === "admin"),
  user: db.users.find((u) => u.role === "user"),
  guest: null,
};
const ROLE_ROUTES = ["/", "/signup", "/home", "/recipeSuggestionPage", "/allmeals", "/groceries", "/settings"];

describe.each(Object.keys(ROLE_USERS))("as %s", (role) => {
  const routesForRole = role === "admin" ? routes : ROLE_ROUTES;
  let errors;

  beforeAll(() => {
    // jsdom lacks these browser APIs used by MUI / chart.js
    window.matchMedia ??= () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
    window.scrollTo = () => {};
    globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
    globalThis.IntersectionObserver ??= class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ isIntersecting: true, target: el, intersectionRatio: 1 }], this); }
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
    };
  });

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(mockFetch));
    if (ROLE_USERS[role]) localStorage.setItem("items", JSON.stringify(ROLE_USERS[role]));
    errors = [];
    window.addEventListener("error", (e) => errors.push(e.error ?? e.message));
    vi.spyOn(console, "error").mockImplementation((...args) => errors.push(args.map(String).join(" ")));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it.each(routesForRole)("%s", async (path) => {
    window.history.pushState({}, "", path);
    render(
      <GoogleOAuthProvider clientId="test">
        <Provider store={Store}>
          <App />
        </Provider>
      </GoogleOAuthProvider>
    );

    expect(screen.getByText("Mealot")).toBeInTheDocument();
    // Wait for the lazy route to finish loading
    await waitFor(() => expect(screen.queryByTestId("page-loader")).toBeNull(), { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 50));

    const crashes = errors.filter((e) =>
      /(TypeError|ReferenceError|is not a function|is not defined|Cannot read|An error occurred in the|Element type is invalid)/.test(String(e))
    );
    expect(crashes, crashes.join("\n\n")).toEqual([]);
  }, 20000);
});

describe("recipe detail page", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(mockFetch));
    localStorage.setItem("items", JSON.stringify(db.users.find((u) => u.role === "user")));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("renders a recipe passed via router state", async () => {
    const recipe = db.Food.find((f) => f.Steps?.length && f.Ingredient?.length);
    // BrowserRouter reads navigation state from history.state.usr
    window.history.pushState({ usr: { element: recipe }, key: "test", idx: 0 }, "", "/dishPage");
    render(
      <GoogleOAuthProvider clientId="test">
        <Provider store={Store}>
          <App />
        </Provider>
      </GoogleOAuthProvider>
    );
    expect(await screen.findByRole("heading", { name: recipe.title }, { timeout: 10000 })).toBeInTheDocument();
    expect(screen.getByText("Ingredients", { selector: "h2" })).toBeInTheDocument();
    expect(screen.getByText(recipe.Steps[0].step)).toBeInTheDocument();
  }, 20000);
});
