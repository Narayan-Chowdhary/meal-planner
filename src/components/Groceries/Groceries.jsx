import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Alert, Badge, Box, Button, Card, Chip, Container, Fab, Grid, Skeleton, Snackbar, Stack, Typography, Zoom,
} from "@mui/material";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import ShoppingCartCheckoutRoundedIcon from "@mui/icons-material/ShoppingCartCheckoutRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { base_url } from "../../config";
import { getCurrentUser } from "../../Services/session";
import FoodImage from "../common/FoodImage";
import { Reveal, Stagger, StaggerItem } from "../common/Motion";
import { UNSPLASH, unsplash } from "../../theme/images";

const formatPrice = (amount, currency = "INR") => {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
};

const json = { "Content-Type": "application/json; charset=utf-8" };

function Groceries() {
  const user = getCurrentUser();
  const nav = useNavigate();
  const { t } = useTranslation();

  const [products, setProducts] = useState(null);
  const [cart, setCart] = useState({ userId: user.id ?? "", items: [] });
  const [toast, setToast] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const loadProducts = () =>
    fetch(`${base_url}Products`)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);
  const fetchData = () => loadProducts().then(setProducts);

  useEffect(() => {
    loadProducts().then(setProducts);
  }, []);

  const addToCart = async (product) => {
    // Reserve one unit of stock
    await fetch(`${base_url}Products/${product.id}`, {
      method: "PATCH",
      headers: json,
      body: JSON.stringify({ total_quantity: product.total_quantity - 1 }),
    });

    setCart((prev) => {
      const existing = prev.items.find((i) => i.id === product.id);
      const items = existing
        ? prev.items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [
            ...prev.items,
            {
              id: product.id,
              dateof_purchase: Date.now(),
              price: product.price,
              currency: product.currency,
              title: product.title,
              quantity: 1,
              image: product.image,
            },
          ];
      return { userId: user.id, items };
    });
    setToast(`${product.title} added to cart`);
    fetchData();
  };

  const checkout = async () => {
    setCheckingOut(true);
    try {
      const existingRes = await fetch(`${base_url}cart?userId=${user.id}`);
      const [existing] = await existingRes.json();

      // merge with what is already saved for this user
      const merged = [...(existing?.items ?? [])];
      for (const item of cart.items) {
        const found = merged.find((m) => m.id === item.id);
        if (found) found.quantity += item.quantity;
        else merged.push(item);
      }
      const body = JSON.stringify({ userId: user.id, items: merged });

      const response = existing
        ? await fetch(`${base_url}cart/${existing.id}`, { method: "PATCH", headers: json, body })
        : await fetch(`${base_url}cart`, { method: "POST", headers: json, body });
      const saved = await response.json();
      const qttotal = (saved.items ?? []).reduce((sum, i) => sum + i.price * i.quantity, 0);
      nav("/cart", { state: { qttotal } });
    } finally {
      setCheckingOut(false);
    }
  };

  const cartCount = cart.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <Box>
      {/* Banner */}
      <Container>
        <Reveal>
          <Box
            sx={{
              position: "relative", overflow: "hidden", borderRadius: "28px", color: "#fff", p: { xs: 3, md: 6 }, mb: { xs: 4, md: 6 },
              minHeight: { xs: 200, md: 260 }, display: "flex", flexDirection: "column", justifyContent: "flex-end",
              backgroundImage: `linear-gradient(90deg, rgba(31,23,18,.85) 0%, rgba(31,23,18,.35) 70%), url(${unsplash(UNSPLASH.groceryAisle, { w: 1600, q: 70 })})`,
              backgroundSize: "cover", backgroundPosition: "center",
            }}
          >
            <Typography variant="overline" sx={{ color: "#FED7AA" }}>Fresh & local</Typography>
            <Typography variant="h2" component="h1">{t("groceries", "Groceries")}</Typography>
            <Typography sx={{ mt: 1, maxWidth: 480, opacity: 0.9 }}>
              Stock your kitchen with everything you need for this week's plan.
            </Typography>
          </Box>
        </Reveal>

        {products === null ? (
          <Grid container spacing={3}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Skeleton variant="rounded" sx={{ aspectRatio: "3 / 4", height: "auto", borderRadius: "20px" }} />
              </Grid>
            ))}
          </Grid>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Inventory2OutlinedIcon sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h5" sx={{ mt: 1 }}>No products available right now</Typography>
          </Box>
        ) : (
          <Stagger>
            <Grid container spacing={3}>
              {products.map((p) => {
                const outOfStock = p.total_quantity < 1;
                const lowStock = !outOfStock && p.total_quantity <= 10;
                return (
                  <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <StaggerItem>
                      <Card
                        sx={{
                          height: "100%", display: "flex", flexDirection: "column",
                          transition: "transform .45s var(--mp-ease), box-shadow .45s",
                          "&:hover": { transform: "translateY(-6px)", boxShadow: "var(--mp-shadow-lg)" },
                          "&:hover img": { transform: "scale(1.06)" },
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <FoodImage src={p.image} seed={p.title} alt={p.title} width={600} ratio="1 / 1" sx={{ filter: outOfStock ? "grayscale(.8)" : "none" }} />
                          <Chip
                            size="small"
                            label={outOfStock ? t("currently_not_avialable", "Out of stock") : lowStock ? `Only ${p.total_quantity} left` : `${p.total_quantity} in stock`}
                            color={outOfStock ? "default" : lowStock ? "warning" : "success"}
                            sx={{ position: "absolute", top: 12, left: 12, fontWeight: 700 }}
                          />
                        </Box>
                        <Stack spacing={1} sx={{ p: 2.5, flex: 1 }}>
                          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline", gap: 1 }}>
                            <Typography variant="h5" component="h3" sx={{ textTransform: "capitalize" }}>{p.title}</Typography>
                            <Typography sx={{ fontWeight: 800, color: "primary.main", whiteSpace: "nowrap" }}>{formatPrice(p.price, p.currency)}</Typography>
                          </Stack>
                          {p.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {p.description}
                            </Typography>
                          )}
                          <Box sx={{ flex: 1 }} />
                          <Button
                            variant="contained"
                            fullWidth
                            disabled={outOfStock}
                            startIcon={<AddShoppingCartRoundedIcon />}
                            onClick={() => addToCart(p)}
                          >
                            Add to cart
                          </Button>
                        </Stack>
                      </Card>
                    </StaggerItem>
                  </Grid>
                );
              })}
            </Grid>
          </Stagger>
        )}
      </Container>

      {/* Floating checkout button */}
      <Box sx={{ position: "fixed", bottom: { xs: 88, md: 28 }, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 1250, pointerEvents: "none" }}>
      <Zoom in={cartCount > 0}>
        <Fab
          variant="extended"
          color="primary"
          onClick={checkout}
          disabled={checkingOut}
          sx={{ px: 3, boxShadow: "var(--mp-shadow-lg)", pointerEvents: "auto" }}
        >
          <Badge badgeContent={cartCount} color="secondary" sx={{ mr: 1.5 }}>
            <ShoppingCartCheckoutRoundedIcon />
          </Badge>
          Go to cart
        </Fab>
      </Zoom>
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={2200} onClose={() => setToast(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" variant="filled" onClose={() => setToast(null)} sx={{ textTransform: "capitalize" }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Groceries;
