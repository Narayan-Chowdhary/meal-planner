import { useId } from "react";
import { Avatar, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { optimizeImage } from "../../theme/images";

/**
 * Image picker with live preview.
 *  - variant="avatar": round preview (profile pictures)
 *  - variant="cover":  4:3 rounded preview (recipes, products)
 * `onFileSelect(file, event)` receives the chosen File; the parent handles uploading
 * and passes the resulting URL (or an object URL) back in `value`.
 */
export default function ImageUploadField({
  value, onFileSelect, uploading = false, variant = "cover", label = "Image", helperText, accept = "image/*", name,
}) {
  const id = useId();
  const preview = value ? optimizeImage(value, 600) : null;
  const isAvatar = variant === "avatar";

  const picker = (
    <input
      id={id}
      name={name}
      type="file"
      accept={accept}
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect?.(file, e);
        e.target.value = ""; // allow picking the same file again
      }}
    />
  );

  if (isAvatar) {
    return (
      <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
        <Box sx={{ position: "relative" }}>
          <Avatar src={preview ?? undefined} sx={{ width: 88, height: 88, bgcolor: "rgba(194,65,12,.08)", color: "primary.main", boxShadow: "0 0 0 4px #fff, 0 0 0 6px rgba(194,65,12,.25)" }}>
            <PersonRoundedIcon sx={{ fontSize: 44 }} />
          </Avatar>
          {uploading && <CircularProgress size={96} thickness={2} sx={{ position: "absolute", top: -4, left: -4 }} />}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>{label}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{helperText ?? "PNG or JPG, square works best."}</Typography>
          <Button component="label" htmlFor={id} size="small" variant="outlined" startIcon={<PhotoCameraRoundedIcon />} disabled={uploading}>
            {preview ? "Change photo" : "Upload photo"}
            {picker}
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <Box>
      <Typography component="span" sx={{ display: "block", fontWeight: 700, fontSize: 14, mb: 0.75 }}>{label}</Typography>
      <Box
        component="label"
        htmlFor={id}
        sx={{
          position: "relative", display: "grid", placeItems: "center", aspectRatio: "16 / 9", borderRadius: "16px", overflow: "hidden",
          cursor: uploading ? "progress" : "pointer", border: "2px dashed", borderColor: preview ? "transparent" : "rgba(194,65,12,.35)",
          bgcolor: "rgba(194,65,12,.04)", transition: "border-color .2s, background-color .2s",
          "&:hover": { borderColor: "primary.main", bgcolor: "rgba(194,65,12,.07)" },
          "&:hover .upload-overlay": { opacity: 1 },
        }}
      >
        {preview ? (
          <>
            <Box component="img" src={preview} alt="" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <Stack
              className="upload-overlay"
              sx={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", bgcolor: "rgba(31,23,18,.45)", color: "#fff", opacity: 0, transition: "opacity .2s" }}
            >
              <PhotoCameraRoundedIcon />
              <Typography sx={{ fontWeight: 700, mt: 0.5 }}>Change image</Typography>
            </Stack>
          </>
        ) : (
          <Stack sx={{ alignItems: "center", color: "primary.main", p: 2, textAlign: "center" }}>
            <AddPhotoAlternateRoundedIcon sx={{ fontSize: 40 }} />
            <Typography sx={{ fontWeight: 700 }}>Click to upload</Typography>
            <Typography variant="body2" color="text.secondary">{helperText ?? "PNG or JPG, landscape works best"}</Typography>
          </Stack>
        )}
        {uploading && (
          <Stack sx={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,.7)" }}>
            <CircularProgress />
          </Stack>
        )}
        {picker}
      </Box>
    </Box>
  );
}
