import React from 'react';
import {Backdrop,
  CircularProgress} from 'lib/mui-shared';
import './LoadingMask.scss';

const LoadingMask = ({loading}: {loading: boolean}) => {
  return (
    <Backdrop
      sx={{ position: "absolute", color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
    <CircularProgress color="inherit" />
  </Backdrop>
  );
};

export default LoadingMask;
