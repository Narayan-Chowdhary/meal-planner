# Meal Planner

A React app for planning meals, managing recipes and groceries, with role-based access (admin / user / guest), English & Hindi translations, a meal calendar and a chatbot.

## Tech stack

| Area      | Tools |
|-----------|-------|
| Build     | [Vite](https://vite.dev) |
| UI        | React 19, MUI 9 (`@mui/material`, `@mui/x-data-grid`) with a custom theme |
| Motion    | [Motion](https://motion.dev) (`motion/react`), respects "reduce motion" |
| Routing   | React Router (`react-router`) with lazy-loaded routes |
| State     | Redux Toolkit |
| Forms     | Formik + Yup |
| i18n      | i18next (`public/assets/locales/{en,hi}`) |
| Mock API  | [json-server](https://github.com/typicode/json-server) serving `db.json` |
| Testing   | Vitest + Testing Library |
| Linting   | ESLint (flat config) |

## Getting started

Requires **Node.js 20.19+**.

```bash
npm install
cp .env.example .env     # then fill in the values
npm run dev              # starts the app (http://localhost:3000) and the API (http://localhost:8000)
```

## Run with Docker

Requires Docker with Compose v2.

```bash
cp .env.example .env          # VITE_* values are baked into the bundle at build time
docker compose up --build     # app: http://localhost:8080 · API: http://localhost:8000
```

There are two services:
- **web:** an unprivileged nginx serving the built bundle. It adds SPA routing, gzip, long-term caching for build assets and security headers, and proxies `/api/` to the API.
- **api:** json-server serving `db.json`. Changes persist in the `api-data` volume.

Useful commands:

```bash
docker compose down              # stop
docker compose down -v           # stop and reset the API data to db.json
WEB_PORT=9000 docker compose up  # use another port
docker build -t meal-planner-web .   # build just the web image
```

The app talks to the API on the same origin (`/api/`), so there's no CORS to configure. The relevant files are `Dockerfile`, `docker-compose.yml` and `docker/nginx.conf`.

## Scripts

| Command            | Description |
|--------------------|-------------|
| `npm run dev`      | Run web app and mock API together |
| `npm start`        | Web app only (Vite dev server) |
| `npm run server`   | Mock API only (json-server on port 8000) |
| `npm run build`    | Production build into `build/` |
| `npm run preview`  | Serve the production build locally |
| `npm run lint`     | Lint the project |
| `npm test`         | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI) |

## Configuration

All environment-specific values live in `.env` (see `.env.example`); `src/config.js` is the single place the app reads them from. Only `VITE_`-prefixed variables reach the browser, so never put server-side secrets there.

> **Note:** `db.json` is demo data for json-server and contains plain-text demo passwords. Do not reuse real credentials in it. json-server v1 stores all record ids as strings.

## Design system

- **Theme:** `src/theme/theme.js` sets the MUI palette (burnt orange and herb green on cream), Fraunces for headings, Plus Jakarta Sans for body text, and component styles. The same values are mirrored as CSS variables (`--mp-*`) in `src/index.css`, so plain CSS can use them too.
- **Images:** `src/theme/images.js` holds a curated pool of verified Unsplash food photos, with helpers for responsive URLs (`unsplash()`, `unsplashSrcSet()`). It picks a stable "random" photo per recipe (`foodImageFor()`) and resizes uploaded Cloudinary images (`optimizeImage()`).
- **Shared components** in `src/components/common/`:
  - `FoodImage`: lazy loading, shimmer placeholder, fade-in and an Unsplash fallback.
  - `Motion`: `Reveal`, `Stagger`, `StaggerItem` and `PageTransition`.
  - `SectionHeading`, `AuthLayout` and `RequireAuth`.
- **Recipe card:** `RecipeCard` in `src/components/ui/Card/` has grid and list layouts.

## Features

- **Recipes:** browse, search/filter, add, edit and delete recipes, including bulk import from CSV.
- **Auth:** login and signup with Formik validation, plus Google sign-in.
- **Roles:** admin, user and guest. Admins manage users, products and orders.
- **Translation:** switch between English and Hindi.
- **Meal planner:** plan meals on a calendar (react-big-calendar).
- **Shopping:** groceries, cart and Razorpay test checkout.
- **Extras:** fitness report charts and the "Mealot" chatbot.

## Known limitations

- The recipe video tutorial page uses restcountries.com for country flags. That service retired its keyless endpoints, so flags are skipped until an API key and the v5 API are wired in.
- `npm run lint` reports warnings for legacy patterns, such as state mutation and `setState` inside effects. They are tracked as warnings in `eslint.config.js` and should be fixed one component at a time.
