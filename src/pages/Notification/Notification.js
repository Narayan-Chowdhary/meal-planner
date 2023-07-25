
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';


const Notification=(props)=>{
    const text=props.text;
    const status=props.status
    const isActive=props.isActive
    const setActive=props.setActive
    
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setActive(!isActive);
    };
  

    return(
        <>
        <Snackbar open={isActive} anchorOrigin={{vertical:'bottom' , horizontal:'center'}} autoHideDuration={2000} onClose={handleClose} sx={{width:'30%',height:'20%', justifyContent:'center',textTransform:'uppercase'}} >
        <Alert onClose={handleClose} severity={status} sx={{ width: '100%' ,}}>
        {text}
        </Alert>
      </Snackbar>
      </>
    )


}
export default Notification;