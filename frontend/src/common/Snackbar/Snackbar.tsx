import React, {useState} from 'react';
import {AlertColor} from '@mui/material';
import {Alert, Snackbar} from 'lib/mui-shared';
import { VerticalAlignBottom } from '@material-ui/icons';
export interface WithSnackProps {
  loading?: boolean;
  snackbarShowMessage?: any;
}

export interface SnackbarMessage { 
  message: string;
  type: AlertColor
}

export enum Vertical {
  Top= 'top',
  Bottom= 'bottom'
}

export enum Horizontal {
  Left= 'left',
  Right= 'right'
}
function withSnackbar<P extends WithSnackProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P & WithSnackProps> {
  const ConmponentWithSnack = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("I'm a custom snackbar");
    const [duration, setDuration] = useState<number>(2000);
    const [severity, setSeverity] = useState<AlertColor>('success'); /** error | warning | info */
    const [position, setPosition] = useState<{vertical: Vertical, horizontal: Horizontal}>({vertical: Vertical.Top, horizontal: Horizontal.Right})
    const showMessage = async (message: string, severity: AlertColor = 'success', duration: number = 3000, vertical:Vertical=Vertical.Top, horizontal: Horizontal=Horizontal.Right) => {
      setMessage(message);
      setSeverity(severity);
      setDuration(duration);
      setPosition({vertical, horizontal})
      setOpen(true);
      return new Promise((resolve)=>{
        setTimeout(resolve.bind(null, true), duration)
      })
    };

    const handleClose = (event) => {
      setOpen(false);
    };
    return (
      <>
        <WrappedComponent {...props} snackbarShowMessage={showMessage} />
        <Snackbar
          anchorOrigin={position}
          autoHideDuration={duration}
          open={open}
          onClose={handleClose}
          key={'bottom' + 'center'}
          // TransitionComponent={transition as React.ComponentType}
        >
          <Alert variant="filled" onClose={handleClose} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </>
    );
  };
  return ConmponentWithSnack;
}
export default withSnackbar;
