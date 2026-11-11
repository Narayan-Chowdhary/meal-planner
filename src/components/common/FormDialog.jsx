import { Avatar, Box, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography, Zoom, useMediaQuery, useTheme } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

/**
 * Standard dialog for forms: icon + title + subtitle header, close button, scrollable
 * body and a sticky actions row. Goes full-screen on phones.
 *
 *   <FormDialog open onClose title="Add user" icon={<PersonAddIcon/>} actions={<Button/>}>…</FormDialog>
 *
 * Pass `component="form"` + `onSubmit` to make the whole dialog a <form>.
 */
export default function FormDialog({
  open, onClose, title, subtitle, icon, children, actions, maxWidth = "sm", component, onSubmit, ...rest
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={Boolean(open)}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      slots={{ transition: Zoom }}
      slotProps={{ paper: component ? { component, onSubmit, noValidate: true } : undefined }}
      aria-labelledby="form-dialog-title"
      {...rest}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", px: 3, pt: 3, pb: 1 }}>
        {icon && (
          <Avatar sx={{ bgcolor: "rgba(194,65,12,.1)", color: "primary.main", width: 44, height: 44 }}>{icon}</Avatar>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography id="form-dialog-title" variant="h5" component="h2">{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
        </Box>
        {onClose && (
          <IconButton onClick={onClose} aria-label="Close" sx={{ alignSelf: "flex-start", mt: -0.5, mr: -1 }}>
            <CloseRoundedIcon />
          </IconButton>
        )}
      </Stack>
      <DialogContent sx={{ pt: "16px !important" }}>{children}</DialogContent>
      {actions && (
        <DialogActions sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2, position: "sticky", bottom: 0, bgcolor: "background.paper" }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
