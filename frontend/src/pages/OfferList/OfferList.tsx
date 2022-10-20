import {useEffect, useState} from 'react';
import {BlockEventType} from 'common/shared.definition';
import EventBus from 'eventing-bus';
import EditPost from './EditPost/EditPost';
import OfferTable from './Feature-topics/Feature-topics';
import './OfferList.scss';
import {SwipeableDrawer} from 'lib/mui-shared';

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
      setOpen(isOpen);
    });
  }, []);
  return (
    <>
      <section>
        <OfferTable onCreate={toggleDrawer} />
      </section>
      <SwipeableDrawer
        sx={{
          '& .MuiDrawer-paper': {
            justifyContent: 'center'
          }
        }}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <EditPost />
      </SwipeableDrawer>
    </>
  );
};

export default OfferList;
