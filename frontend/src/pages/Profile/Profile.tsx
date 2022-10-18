import React, {useState} from 'react';
import {Container} from 'react-bootstrap';
import {Divider, List, ListItemButton, ListItemIcon, ListItemText, BookmarksIcon, Typography
  ,Box, AccountBoxIcon, FolderIcon, SettingsIcon} from 'lib/mui-shared';
import PublishedArticle from './PublishedArticle/PublishedArticle';
import MyAccount from './MyAccount/MyAccount';
import Bookmark from './Bookmark/Bookmark'
import './Profile.scss';
enum Tab {
  MyAccount = 'MYACOUNT',
  Settings = 'SETTINGS',
  Published = 'PUBLISHED',
  Bookmark = 'BOOKMARK'
}
interface TabItem {
  title: string;
  key: Tab;
  icon: any;
  panel: any;
}
const TAB_LIST: TabItem[] = [
  {
    title: 'My account',
    key: Tab.MyAccount,
    icon: <AccountBoxIcon/>,
    panel: <MyAccount/>
  },
  {
    title: 'Settings',
    key: Tab.Settings,
    icon: <SettingsIcon/>,
    panel: <MyAccount/>
  },
  {
    title: 'Published',
    key: Tab.Published,
    icon: <FolderIcon/>,
    panel: <PublishedArticle/>
  },
  {
    title: 'Bookmark',
    key: Tab.Bookmark,
    icon: <BookmarksIcon/>,
    panel: <Bookmark/>
  }
]

interface TabPanelProps {
  children?: React.ReactNode;
  value: Tab;
  label: Tab;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, label, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== label}
      id={`vertical-tabpanel-${label}`}
      aria-labelledby={`vertical-tab-${label}`}
      {...other}
    >
      {value === label && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile = () => {
  const [tabTitle, setTabtitle] = useState<string>('My account');
  const [selected, setSelected] = useState<TabItem>(TAB_LIST[0]);
  
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tab: TabItem,
  ) => {
    setSelected(tab);
    setTabtitle(tab.title)
  };

  return <section className="Profile">
    <Container>
      <h4 className="title">{tabTitle}</h4>
      <Divider light />
      <Container className='main'>
        <Container className='tab-title-list'>
          <List component="nav" aria-label="main mailbox folders">
          {TAB_LIST.map((tab, idx)=>(
             <ListItemButton
              key={idx}
              selected={selected.key === tab.key}
              onClick={(event) => handleListItemClick(event, tab)}
            >
              <ListItemIcon>
                {tab.icon}
              </ListItemIcon>
              <ListItemText primary={tab.title} />
            </ListItemButton>
        ))}
          </List>
        </Container>
        <Container>
          {TAB_LIST.map((tab, idx)=>(
            <TabPanel key={'panel_'+tab.key} value={selected.key} label={tab.key}>
                {tab.panel}
            </TabPanel>
          ))}
        </Container>
      </Container>
    </Container>
  </section>

};

export default Profile;
