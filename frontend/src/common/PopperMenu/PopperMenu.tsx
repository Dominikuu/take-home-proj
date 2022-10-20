import React from 'react';
import {IconButton, Menu, MenuItem, MoreVertIcon, ListItemIcon, ListItemText} from 'lib/mui-shared'
import "./PopperMenu.scss"

export interface Option {
    disabled: boolean;
    key: string;
    label: string;
    onClick: ()=> void;
    hidden: boolean;
    icon: any;
}

interface PopperMenuProp {
    options: Option[];
    disabled?: boolean;
}

const ITEM_HEIGHT = 48;

const PopperMenu = ({options}: PopperMenuProp) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
        >
          {options.map(({icon, label, key, hidden, onClick}) => (
            !hidden && <MenuItem key={key} selected={key === 'Pyxis'} onClick={()=>{handleClose();onClick()}}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText>{label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </div>);
}

export default PopperMenu;
