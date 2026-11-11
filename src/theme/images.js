// Food imagery helpers.
//
// Photos are served from Unsplash's CDN (images.unsplash.com), which supports on-the-fly
// resizing/format conversion. The legacy random endpoint (source.unsplash.com) has been
// shut down, so we keep a curated pool of verified food photo IDs and pick from it —
// randomly per session, or deterministically per recipe so a card keeps the same image.
// https://unsplash.com/license — free to use, hotlinking is the recommended usage.

export const UNSPLASH = {
  heroSpread: "1543353071-873f17a7a088", // colourful plates on blue table
  heroBowls: "1504674900247-0877df9cc836", // bowls with herbs, top-down
  cookingTogether: "1556910103-1c02745aae4d", // friends cooking in a kitchen
  groceryAisle: "1542838132-92c53300491e", // fresh produce aisle
  market: "1488459716781-31db52582fe9", // vegetable market
  rainbowPantry: "1606787366850-de6330128bfc", // colour-sorted ingredients
  curry: "1585937421612-70a008356fbe", // indian curry bowls
  biryani: "1563379091339-03b21ab4a4f8",
  fineDining: "1414235077428-338989a2e8c0",
  healthyBowl: "1490645935967-10de6ba17061",
  vegetables: "1498837167922-ddd27525d352",
};

// General pool for "random" food imagery (all verified to resolve).
export const FOOD_POOL = [
  "1504674900247-0877df9cc836", "1546069901-ba9599a7e63c", "1512621776951-a57141f2eefd",
  "1540189549336-e6e99c3679fe", "1565299624946-b28f40a0ae38", "1567620905732-2d1ec7ab7445",
  "1565958011703-44f9829ba187", "1482049016688-2d3e1b311543", "1484723091739-30a097e8f929",
  "1473093295043-cdd812d0e601", "1490645935967-10de6ba17061", "1476224203421-9ac39bcb3327",
  "1585937421612-70a008356fbe", "1563379091339-03b21ab4a4f8", "1606491956689-2ea866880c84",
  "1543353071-873f17a7a088", "1490818387583-1baba5e638af", "1547592180-85f173990554",
  "1555939594-58d7cb561ad1", "1568901346375-23c9450c58cd", "1600891964092-4316c288032e",
  "1512058564366-18510be2db19", "1601050690597-df0568f70950", "1574071318508-1cdbab80d002",
  "1578985545062-69928b1d9587", "1525351484163-7529414344d8", "1573080496219-bb080dd4f877",
  "1455619452474-d2be8b1e70cd", "1588166524941-3bf61a9c41db", "1504754524776-8f4f37790ca0",
];

/** Build an optimised Unsplash CDN URL. */
export function unsplash(id, { w = 800, h, q = 75, fit = "crop" } = {}) {
  const params = new URLSearchParams({ auto: "format", fit, w: String(w), q: String(q) });
  if (h) params.set("h", String(h));
  return `https://images.unsplash.com/photo-${id}?${params}`;
}

/** srcSet for responsive <img>. */
export function unsplashSrcSet(id, widths = [480, 800, 1200, 1800], opts = {}) {
  return widths.map((w) => `${unsplash(id, { ...opts, w, h: opts.h ? Math.round((opts.h / (opts.w ?? 800)) * w) : undefined })} ${w}w`).join(", ");
}

function hash(str) {
  let h = 0;
  for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/** Stable "random" food photo for a given seed (e.g. recipe id/title). */
export function foodImageFor(seed, opts) {
  return unsplash(FOOD_POOL[hash(seed) % FOOD_POOL.length], opts);
}

/** Truly random food photo (changes on every call). */
export function randomFoodImage(opts) {
  return unsplash(FOOD_POOL[Math.floor(Math.random() * FOOD_POOL.length)], opts);
}

/**
 * Optimise user-uploaded Cloudinary images: force https and ask Cloudinary for a
 * resized, auto-format, auto-quality version. Other URLs are returned untouched.
 */
export function optimizeImage(url, width = 800) {
  if (!url || typeof url !== "string") return url;
  const secure = url.replace(/^http:\/\//, "https://");
  if (!secure.includes("res.cloudinary.com") || !secure.includes("/upload/")) return secure;
  if (/\/upload\/[^/]*(w_|f_auto|q_auto)/.test(secure)) return secure;
  return secure.replace("/upload/", `/upload/c_fill,w_${width},f_auto,q_auto/`);
}
