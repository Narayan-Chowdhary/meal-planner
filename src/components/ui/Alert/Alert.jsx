import { Avatar, Button, Dialog, DialogActions, DialogContent, Typography, Zoom } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

/**
 * Confirmation dialog. API kept compatible with existing callers:
 * `option1` = confirm label (omit for an info-only dialog), `option2` = cancel label.
 * On confirm it calls `handeldelete` for every id in `collectIdToDelete`, or for `dataid`.
 */
function AlertComponent({ text = "Are you sure?", option1, option2 = "No", show, setShow, handeldelete, dataid, collectIdToDelete = [] }) {
  const handleClose = () => setShow(false);
  const isConfirm = option1 !== undefined; // otherwise it is an info/success message

  const handleSubmit = () => {
    if (collectIdToDelete?.length) collectIdToDelete.forEach((id) => handeldelete?.(id));
    else handeldelete?.(dataid);
    setShow(false);
  };

  return (
    <Dialog open={Boolean(show)} onClose={handleClose} slots={{ transition: Zoom }} maxWidth="xs" fullWidth aria-labelledby="confirm-dialog-title">
      <DialogContent sx={{ textAlign: "center", pt: 4 }}>
        <Avatar
          sx={{
            mx: "auto", mb: 2, width: 56, height: 56,
            bgcolor: isConfirm ? "rgba(197,48,48,.1)" : "rgba(47,133,90,.12)",
            color: isConfirm ? "error.main" : "success.main",
          }}
        >
          {isConfirm ? <WarningAmberRoundedIcon /> : <CheckCircleRoundedIcon />}
        </Avatar>
        <Typography id="confirm-dialog-title" variant="h5" component="h2">
          {text}
        </Typography>
        {isConfirm && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            This action can't be undone.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1, "& > *": { flex: 1 } }}>
        <Button variant={isConfirm ? "outlined" : "contained"} color={isConfirm ? "inherit" : "primary"} onClick={handleClose} sx={isConfirm ? { borderColor: "divider" } : undefined}>
          {option2}
        </Button>
        {isConfirm && (
          <Button variant="contained" color="error" onClick={handleSubmit}>
            {option1}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AlertComponent;
