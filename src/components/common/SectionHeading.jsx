import { Box, Stack, Typography } from "@mui/material";
import { Reveal } from "./Motion";

/** Consistent section title: small overline, display heading, optional subtitle and actions. */
export default function SectionHeading({ overline, title, subtitle, actions, align = "left", sx }) {
  return (
    <Reveal>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: align === "center" ? "center" : "flex-start", sm: "flex-end" }, justifyContent: "space-between", mb: { xs: 3, md: 4 }, ...sx }}
      >
        <Box sx={{ textAlign: align, maxWidth: 680, mx: align === "center" ? "auto" : 0 }}>
          {overline && (
            <Typography variant="overline" color="primary" sx={{ display: "block", mb: 0.5 }}>
              {overline}
            </Typography>
          )}
          <Typography variant="h3" component="h2" sx={{ textTransform: "capitalize" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" sx={{ mt: 1, fontSize: { md: "1.05rem" } }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
      </Stack>
    </Reveal>
  );
}
