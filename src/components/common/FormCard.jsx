import { Box, Card, Container, Stack, Typography } from "@mui/material";
import { Reveal } from "./Motion";
import { unsplash } from "../../theme/images";

/**
 * Full-page form layout: slim photo banner with title, then a centered card.
 *
 *   <FormCard image={UNSPLASH.market} overline="Recipes" title="Add your recipe" subtitle="…" actions={…}>
 *     …fields…
 *   </FormCard>
 */
export default function FormCard({ image, overline, title, subtitle, headerAction, children, actions, maxWidth = "md", component, onSubmit }) {
  return (
    <Container maxWidth={maxWidth} sx={{ pb: 4 }}>
      <Reveal>
        <Box
          sx={{
            position: "relative", borderRadius: "28px 28px 0 0", overflow: "hidden", color: "#fff",
            px: { xs: 3, md: 5 }, pt: { xs: 5, md: 7 }, pb: { xs: 7, md: 9 },
            backgroundColor: "var(--mp-ink)",
            backgroundImage: image ? `linear-gradient(100deg, rgba(31,23,18,.88) 10%, rgba(31,23,18,.45) 100%), url(${unsplash(image, { w: 1400, q: 65 })})` : undefined,
            backgroundSize: "cover", backgroundPosition: "center",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "flex-end" } }}>
            <Box>
              {overline && <Typography variant="overline" sx={{ color: "#FED7AA" }}>{overline}</Typography>}
              <Typography variant="h3" component="h1">{title}</Typography>
              {subtitle && <Typography sx={{ mt: 1, opacity: 0.88, maxWidth: 520 }}>{subtitle}</Typography>}
            </Box>
            {headerAction}
          </Stack>
        </Box>
        <Card
          component={component}
          onSubmit={onSubmit}
          noValidate={component === "form" ? true : undefined}
          sx={{ mt: -4, mx: { xs: 1, md: 3 }, position: "relative", p: { xs: 2.5, md: 4 }, borderRadius: "24px" }}
        >
          {children}
          {actions && (
            <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end", mt: 4, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
              {actions}
            </Stack>
          )}
        </Card>
      </Reveal>
    </Container>
  );
}

/** Titled group of fields inside a FormCard. */
export function FormSection({ title, description, children, sx }) {
  return (
    <Box sx={{ "& + &": { mt: 4, pt: 4, borderTop: "1px solid", borderColor: "divider" }, ...sx }}>
      {title && <Typography variant="h6" component="h2">{title}</Typography>}
      {description && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>}
      <Box sx={{ mt: title && !description ? 2 : 0 }}>{children}</Box>
    </Box>
  );
}
