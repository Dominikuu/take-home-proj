import React, {useEffect, useState} from 'react';
import {set as setProp, cloneDeep} from 'lodash';
import {MENU_CONFIG} from 'router/Router';
import {useNavigate} from 'react-router-dom';
import {statisticPosts} from 'api/post';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import './LinkPanel.scss';
import ViewHistory from './ViewHistory/ViewHistory'
import Related from './Related/Related'

const LinkPanel = () => {
  return (
    <div className="LinkPanel">
      <div className="sticky-container">
        <ViewHistory/>
        <Related/>
      </div>
    </div>
  );
};

export default LinkPanel;
