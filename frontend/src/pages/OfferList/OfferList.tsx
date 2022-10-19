import {useEffect, useState} from 'react';
import {BlockEventType} from 'common/shared.definition';
import EventBus from 'eventing-bus';
import Sidebar from 'common/Sidebar/Sidebar';
import EditPost from './EditPost/EditPost';
import OfferTable from './Feature-topics/Feature-topics';
import './OfferList.scss';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

const styles = {
  BackdropProps: {
    background: 'transparent'
  }
};

const OfferList = () => {
  

  const [open, setOpen] = useState<boolean>(false);
  const toggleDrawer = (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(isOpen);
  };
  useEffect(() => {
    EventBus.on(BlockEventType.ToggleDrawer, ({isOpen}) => {
      console.log(isOpen);
      setOpen(isOpen);
      // toggleDrawer(isOpen);
    });
  }, []);
  return (
    <>
      <section>
        <Sidebar />
        <OfferTable onCreate={toggleDrawer} />
      </section>
      <SwipeableDrawer  
        sx={{
          drawer: {
            background: 'red'
          }}
        } 
        anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
        <EditPost />
      </SwipeableDrawer>
    </>
  );
};

export default OfferList;
