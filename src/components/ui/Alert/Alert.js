import  {React,useEffect,useState} from 'react';
import {
  base_url,
  cloudinaryUploadImage_url,
  getLayoutAPIEndpoint,
} from "../../../config";

import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import "./Alert.css"
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


function AlertComponent({
  text = "Are you sure",
  option1,
  option2 = "No",
  show,
  setShow,
  handeldelete,
  dataid,
  collectIdToDelete,
}) {
  const [pageStyles, setpageStyles] = useState(null);
  const fetchStyles = async () => {
    const response = await fetch(
      `${base_url}${getLayoutAPIEndpoint}?module=Alert`
    );
    let styles = await response.json();
    setpageStyles(styles[0]?.styles);
  };
  useEffect(() => {
    fetchStyles();
  }, []);

  const handleSubmit = () => {
     
{collectIdToDelete.length ? collectIdToDelete?.map((e)=>(
  handeldelete(e)
)) :
    handeldelete(dataid);
  }

    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
      <Dialog
        open={show}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            background: `${pageStyles?.bgColor} !important`,
          }}
        >
          <Typography
            sx={{
              color: `${pageStyles?.TextColor} !important`,
              fontSize: "20px",
            }}
          >
            {text}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            background: `${pageStyles?.bgColor} !important`,
          }}
        >
          {/* <DialogContentText id="alert-dialog-slide-description">
                    {text}
                  </DialogContentText> */}
        </DialogContent>
        <DialogActions
          sx={{
            background: `${pageStyles?.bgColor} !important`,
          }}
        >
          {option1 != undefined ? (
            <Button
              variant="contained"
              className="cardButton"
              onClick={() => handleSubmit()}
              sx={{
                backgroundColor: `${pageStyles?.ButtonColor} !important`,
                padding: "10px 20px",
              }}
            >
              {option1}
            </Button>
          ) : null}
          <Button
            variant="contained"
            className="cardButton"
            onClick={handleClose}
            sx={{
              backgroundColor: `${pageStyles?.ButtonColor} !important`,
              padding: "10px 20px",
            }}
          >
            {option2}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AlertComponent
