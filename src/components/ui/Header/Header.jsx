import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  AppBar, Avatar, Badge, Box, Button, Container, Divider, Drawer, IconButton, List,
  ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Popover, Stack, Toolbar,
  Tooltip, Typography, useScrollTrigger,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";

import PopoverNotification from "../../../pages/Popover/Popover.jsx";
import { database, getNotificationData } from "../../../Services/firebase";
import { getCurrentUser, logout } from "../../../Services/session";
import Hero from "../Hero/Hero";

const NAV_ITEMS = {
  admin: [
    { name: "users", path: "/users" },
    { name: "products", path: "/products" },
    { name: "layout", path: "/adminLayout" },
  ],
  user: [
    { name: "home", path: "/home" },
    { name: "all_recipe", path: "/recipeSuggestionPage" },
    { name: "meal_planner", path: "/mealplanner" },
    { name: "groceries", path: "/groceries" },
  ],
  guest: [{ name: "all_recipe", path: "/recipeSuggestionPage" }],
};

export function Logo({ onClick, light = false }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      onClick={onClick}
      sx={{ alignItems: "center", cursor: "pointer", userSelect: "none", "&:hover .logo-mark": { transform: "rotate(-12deg) scale(1.05)" } }}
    >
      <Box
        className="logo-mark"
        sx={{
          width: 38, height: 38, borderRadius: "12px", display: "grid", placeItems: "center", color: "#fff",
          background: "linear-gradient(135deg, var(--mp-primary-light), var(--mp-primary) 60%, var(--mp-primary-dark))",
          boxShadow: "0 6px 16px rgba(194,65,12,.35)",
          transition: "transform .4s var(--mp-ease)",
        }}
      >
        <RestaurantMenuRoundedIcon fontSize="small" />
      </Box>
      <Typography sx={{ fontFamily: "var(--mp-font-display)", fontWeight: 750, fontSize: { xs: 22, md: 24 }, letterSpacing: "-0.02em", color: light ? "#fff" : "text.primary" }}>
        My<Box component="span" sx={{ color: light ? "#FED7AA" : "primary.main" }}>Recipe</Box>
      </Typography>
    </Stack>
  );
}

export default function Header({ longHeader = false }) {
  const { t, i18n } = useTranslation();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const user = getCurrentUser();
  const items = NAV_ITEMS[user.role] ?? NAV_ITEMS.guest;
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountEl, setAccountEl] = useState(null);
  const [notifyEl, setNotifyEl] = useState(null);
  const [notifications, setNotifications] = useState();
  const [hasNotifications, setHasNotifications] = useState(false);
  const [unread, setUnread] = useState(0);

  const applyNotifications = (data) => {
    if (!data) return;
    const entries = Object.entries(data);
    setHasNotifications(entries.length > 0);
    setUnread(entries.filter(([, n]) => n?.is_read === false).length);
    setNotifications(entries);
  };
  const fetchNotifications = () =>
    getNotificationData()
      .then(applyNotifications)
      .catch((error) => console.warn("Could not load notifications", error));

  useEffect(() => {
    if (user.role !== "admin") return;
    getNotificationData()
      .then(applyNotifications)
      .catch((error) => console.warn("Could not load notifications", error));
  }, [user.role]);

  const go = (path) => {
    setDrawerOpen(false);
    setAccountEl(null);
    nav(path);
  };

  const toggleLanguage = () => i18n.changeLanguage(i18n.resolvedLanguage === "hi" ? "en" : "hi");
  const isActive = (path) => pathname.toLowerCase() === path.toLowerCase();

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        sx={{
          top: 0,
          bgcolor: scrolled ? "rgba(255,248,242,0.82)" : "rgba(255,248,242,0.6)",
          backdropFilter: "saturate(180%) blur(14px)",
          borderBottom: "1px solid",
          borderColor: scrolled ? "divider" : "transparent",
          boxShadow: scrolled ? "0 6px 24px rgba(31,23,18,.06)" : "none",
          transition: "all .3s var(--mp-ease)",
        }}
      >
        <Container>
          <Toolbar disableGutters sx={{ minHeight: "var(--mp-header-h) !important", gap: 2 }}>
            <Logo onClick={() => go(user.role === "guest" ? "/recipeSuggestionPage" : "/home")} />

            {/* Desktop navigation */}
            <Stack direction="row" spacing={0.5} component="nav" sx={{ ml: 4, display: { xs: "none", md: "flex" } }}>
              {items.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => go(item.path)}
                  color="inherit"
                  sx={{
                    position: "relative",
                    fontWeight: 600,
                    color: isActive(item.path) ? "primary.main" : "text.primary",
                    "&::after": {
                      content: '""', position: "absolute", left: 20, right: 20, bottom: 6, height: 2, borderRadius: 2,
                      bgcolor: "primary.main", transform: isActive(item.path) ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left", transition: "transform .35s var(--mp-ease)",
                    },
                    "&:hover::after": { transform: "scaleX(1)" },
                    "&:hover": { bgcolor: "transparent" },
                  }}
                >
                  {t(item.name)}
                </Button>
              ))}
            </Stack>

            <Box sx={{ flex: 1 }} />

            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <Tooltip title={t("change_language")}>
                <Button
                  size="small"
                  color="inherit"
                  onClick={toggleLanguage}
                  startIcon={<TranslateRoundedIcon fontSize="small" />}
                  sx={{ minWidth: 0, px: 1.5, fontWeight: 700, display: { xs: "none", sm: "inline-flex" } }}
                >
                  {i18n.resolvedLanguage === "hi" ? "हिं" : "EN"}
                </Button>
              </Tooltip>

              {user.role === "admin" && (
                <Tooltip title="Notifications">
                  <IconButton onClick={(e) => setNotifyEl(e.currentTarget)} aria-label="Notifications">
                    <Badge badgeContent={unread} color="primary" max={99}>
                      <NotificationsNoneRoundedIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {user.role === "guest" ? (
                <Button variant="contained" onClick={() => go("/")} startIcon={<LoginRoundedIcon />} sx={{ display: { xs: "none", sm: "inline-flex" } }}>
                  Sign in
                </Button>
              ) : (
                <IconButton onClick={(e) => setAccountEl(e.currentTarget)} aria-label="Account menu" sx={{ p: 0.5 }}>
                  <Avatar
                    src={user.ProfileImage}
                    alt={user.name}
                    sx={{ width: 38, height: 38, border: "2px solid #fff", boxShadow: "0 0 0 2px var(--mp-primary)" }}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
              )}

              <IconButton onClick={() => setDrawerOpen(true)} sx={{ display: { md: "none" } }} aria-label="Open menu">
                <MenuRoundedIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {longHeader && <Hero user={user} />}

      {/* Account menu */}
      <Menu
        anchorEl={accountEl}
        open={Boolean(accountEl)}
        onClose={() => setAccountEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
            {user.role}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => go("/settings")}>
          <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
          {t("settings")}
        </MenuItem>
        <MenuItem onClick={() => { logout(); go("/"); }}>
          <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} slotProps={{ paper: { sx: { width: "min(320px, 86vw)", bgcolor: "background.default" } } }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", p: 2 }}>
          <Logo onClick={() => go("/home")} />
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close menu"><CloseRoundedIcon /></IconButton>
        </Stack>
        <Divider />
        <List sx={{ p: 1.5 }}>
          {items.map((item) => (
            <ListItemButton
              key={item.path}
              selected={isActive(item.path)}
              onClick={() => go(item.path)}
              sx={{ borderRadius: 3, mb: 0.5, "&.Mui-selected": { bgcolor: "rgba(194,65,12,.1)", color: "primary.main" } }}
            >
              <ListItemText primary={t(item.name)} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ mt: "auto", p: 2 }}>
          <Button fullWidth variant="outlined" onClick={toggleLanguage} startIcon={<TranslateRoundedIcon />} sx={{ mb: 1 }}>
            {i18n.resolvedLanguage === "hi" ? "English" : "हिंदी"}
          </Button>
          {user.role === "guest" && (
            <Button fullWidth variant="contained" onClick={() => go("/")}>Sign in</Button>
          )}
        </Box>
      </Drawer>

      {/* Admin notifications */}
      <Popover
        open={Boolean(notifyEl)}
        anchorEl={notifyEl}
        onClose={() => setNotifyEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <PopoverNotification
          DataFromFireBase={notifications}
          database={database}
          notification={hasNotifications}
          setAnchorEl={setNotifyEl}
          fetchNotifications={fetchNotifications}
        />
      </Popover>
    </>
  );
}
