import { alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";

// Design tokens — mirrored as CSS variables in index.css so plain CSS can use them too.
export const tokens = {
  primary: "#C2410C", // burnt orange / paprika
  primaryLight: "#F97316",
  primaryDark: "#9A3412",
  secondary: "#2F6B4F", // herb green
  secondaryLight: "#4E9A74",
  cream: "#FFF8F2",
  ink: "#1F1712",
  muted: "#6B5E55",
  fontDisplay: '"Fraunces", Georgia, "Times New Roman", serif',
  fontBody: '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  shadowSm: "0 1px 2px rgba(31,23,18,.05), 0 2px 8px rgba(31,23,18,.05)",
  shadowMd: "0 2px 4px rgba(31,23,18,.04), 0 12px 32px rgba(31,23,18,.08)",
  shadowLg: "0 4px 8px rgba(31,23,18,.05), 0 24px 48px rgba(31,23,18,.14)",
};

const headings = Object.fromEntries(
  ["h1", "h2", "h3", "h4"].map((h) => [
    h,
    { fontFamily: tokens.fontDisplay, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 },
  ])
);

let theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: tokens.primary, light: tokens.primaryLight, dark: tokens.primaryDark, contrastText: "#fff" },
    secondary: { main: tokens.secondary, light: tokens.secondaryLight, contrastText: "#fff" },
    background: { default: tokens.cream, paper: "#FFFFFF" },
    text: { primary: tokens.ink, secondary: tokens.muted },
    divider: "rgba(31,23,18,0.08)",
    success: { main: "#2F855A" },
    error: { main: "#C53030" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: tokens.fontBody,
    ...headings,
    h5: { fontFamily: tokens.fontDisplay, fontWeight: 650, letterSpacing: "-0.01em" },
    h6: { fontWeight: 700, letterSpacing: "-0.01em" },
    subtitle1: { fontWeight: 600 },
    overline: { fontWeight: 700, letterSpacing: "0.14em" },
    button: { fontWeight: 700, textTransform: "none", letterSpacing: 0 },
  },
  transitions: {
    easing: { easeOut: "cubic-bezier(0.22, 1, 0.36, 1)" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: tokens.cream } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          minHeight: 42,
          transition: "transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s, background-color .2s",
          "&:hover": { transform: "translateY(-1px)" },
          "&:active": { transform: "translateY(0) scale(.98)" },
        },
        containedPrimary: {
          backgroundImage: `linear-gradient(135deg, ${tokens.primaryLight} 0%, ${tokens.primary} 55%, ${tokens.primaryDark} 100%)`,
          "&:hover": { boxShadow: `0 8px 20px ${alpha(tokens.primary, 0.35)}` },
        },
        sizeLarge: { minHeight: 50, paddingInline: 28, fontSize: "1rem" },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { transition: "transform .2s, background-color .2s", "&:hover": { transform: "scale(1.06)" } } },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        rounded: { borderRadius: 20 },
        elevation0: { boxShadow: tokens.shadowSm },
        elevation1: { boxShadow: tokens.shadowMd },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 20, boxShadow: tokens.shadowSm, border: "1px solid rgba(31,23,18,0.06)" } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#fff",
          transition: "box-shadow .2s",
          "&.Mui-focused": { boxShadow: `0 0 0 4px ${alpha(tokens.primary, 0.12)}` },
        },
      },
    },
    MuiTextField: { defaultProps: { fullWidth: true } },
    MuiInputLabel: {
      styleOverrides: { root: { fontWeight: 500, "&.Mui-focused": { fontWeight: 600 } } },
    },
    MuiFormLabel: {
      styleOverrides: { root: { fontWeight: 700, fontSize: 14, color: tokens.ink, marginBottom: 6, "&.Mui-focused": { color: tokens.ink } } },
    },
    MuiFormHelperText: { styleOverrides: { root: { marginLeft: 4 } } },
    // Select "bars": same height/radius as text fields, chevron icon, roomy menu
    MuiSelect: {
      defaultProps: {
        MenuProps: {
          slotProps: { paper: { sx: { mt: 1, borderRadius: "14px", boxShadow: tokens.shadowLg, maxHeight: 360 } } },
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
        },
      },
      styleOverrides: {
        select: { display: "flex", alignItems: "center", gap: 8, minHeight: "1.4375em" },
        icon: { color: tokens.muted, right: 10, transition: "transform .25s" },
        iconOpen: { transform: "rotate(180deg)" },
      },
    },
    MuiNativeSelect: {
      styleOverrides: { select: { borderRadius: 12 }, icon: { color: tokens.muted, right: 10 } },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: "2px 6px",
          minHeight: 40,
          gap: 10,
          "&.Mui-selected": { backgroundColor: alpha(tokens.primary, 0.1), color: tokens.primaryDark, fontWeight: 700 },
          "&.Mui-selected:hover": { backgroundColor: alpha(tokens.primary, 0.16) },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: { borderRadius: 14, boxShadow: tokens.shadowLg, marginTop: 8 },
        option: { borderRadius: 10, margin: "2px 6px" },
        tag: { borderRadius: 999 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontFamily: tokens.fontDisplay, fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.01em", padding: "24px 24px 8px" } },
    },
    MuiDialogContent: { styleOverrides: { root: { padding: "8px 24px 16px" } } },
    MuiDialogActions: { styleOverrides: { root: { padding: "8px 24px 24px", gap: 8 } } },
    MuiBackdrop: {
      styleOverrides: { root: { "&:not(.MuiBackdrop-invisible)": { backgroundColor: "rgba(31,23,18,.45)", backdropFilter: "blur(4px)" } } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, color: tokens.muted, backgroundColor: "#FBF4EC", borderBottom: "1px solid rgba(31,23,18,0.08)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" },
        body: { borderBottom: "1px solid rgba(31,23,18,0.06)" },
      },
    },
    MuiTableRow: { styleOverrides: { root: { "&.MuiTableRow-hover:hover": { backgroundColor: alpha(tokens.primary, 0.04) } } } },
    MuiTableContainer: { styleOverrides: { root: { borderRadius: 20 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 999 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 24 } } },
    MuiPopover: { styleOverrides: { paper: { borderRadius: 16, boxShadow: tokens.shadowLg } } },
    MuiMenu: { styleOverrides: { paper: { borderRadius: 16, boxShadow: tokens.shadowLg, minWidth: 200 } } },
    MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 8, fontWeight: 600, backgroundColor: tokens.ink } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: "none" } } },
    MuiContainer: { defaultProps: { maxWidth: "xl" } },
    MuiLink: { defaultProps: { underline: "hover" }, styleOverrides: { root: { fontWeight: 600 } } },
  },
});

theme = responsiveFontSizes(theme, { factor: 2.4 });

export default theme;
