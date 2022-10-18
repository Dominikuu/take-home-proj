import React, {useState, useEffect, MouseEvent} from 'react';
import EventBus from 'eventing-bus';
import {get} from 'lodash'
import {useLocation, useSearchParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Nav,Navbar, NavDropdown} from 'react-bootstrap';
import {BlockEventType} from 'common/shared.definition';
import { styled, alpha } from '@mui/material/styles';
import {Dispatch} from 'redux';
import {globalSearch} from 'api/global-search'
import {useInterval} from 'lib/hook/interval'
import {MENU_CONFIG} from 'router/Router';
import NotificationPanel from 'common/NotificationPanel/NotificationPanel'
import AuthModal from 'common/AuthModal/AuthModal';
import {logout, checkAuth} from 'lib/auth/auth.action';
import {LogLevel} from 'api/user/notifications'
import {getUserUnreadCount} from 'api/user/notifications/unread-count'
import {Avatar,  AccountCircleIcon, Tooltip, SearchIcon, CircularProgress, Box, Autocomplete} from 'lib/mui-shared';
import logo from 'assets/img/logo.png';
import './Navbar.scss';

const SEARCH_DAY_BEFORE = 60 * 60 * 24*24

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(Autocomplete)(({ theme }) => ({
  color: 'inherit',
  '& .MuiAutocomplete-input': {
    padding: theme.spacing(1, 1, 1, 0),
    border: 'none',
    outline: 'none',
    height: '1rem',
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '0ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
}));

const POLLING_INTERVAL = 10 * 1000

const NavBar = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState<boolean>(false);
  const [expand, updateExpanded] = useState<boolean>(false);
  const [navColour, updateNavbar] = useState<boolean>(false);
  const {isLoggedIn, user} = useSelector((state: {auth: any}) => {
    return state.auth;
  });
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [options, setOptions] = useState<readonly string[]>(['Option 1', 'Option 2']);
  const [searching, setSearching] = useState<boolean>(open && options.length === 0)
  const [status, setStatus] = useState(Object.keys(MENU_CONFIG).map((x) => false));
  const [modalType, setModalShow] = useState('');

  const [title, setTitle] = useState<string | null>();
  const history = useNavigate();
  const location = useLocation();
  const dispatch: Dispatch<any> = useDispatch();
  const updateStatus = (value: boolean, index: number) => {
    const clone = [...status].map((x) => false);
    clone[index] = value;
    setStatus(clone);
  };
  // Long polling to get latest unread count
  useInterval(() => {
    getUnreadCount().catch(console.error);;
  }, POLLING_INTERVAL, !isLoggedIn)

  useEffect(() => {
    const ssoToken = searchParams.get('ssoToken')
    if (!isLoggedIn) {
      dispatch(checkAuth(ssoToken));
    }
  }, [searchParams]);

  useEffect(() => {
    setTitle(null);
  }, [location]);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    EventBus.on(BlockEventType.ShowTitleOnNav, setTitle.bind(this));
    if (isLoggedIn) {
      getUnreadCount().catch(console.error);;
    }
  }, []);

  const getUnreadCount =async () => {
    const {data} = await getUserUnreadCount({
      start_time: Math.round(Date.now()/1000 - SEARCH_DAY_BEFORE),
      end_time: Math.round(Date.now()/1000),
      log_levels: [LogLevel.Info]
    })
    setUnreadCount(data)
  }

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  function scrollHandler() {
    updateNavbar(window.scrollY >= 20);
  }

  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  function onRedirectToOauth() {
    localStorage.removeItem('token');
  }

  function onLogout() {
    dispatch(logout());
  }

  function openSignupModal(event) {
    localStorage.removeItem('token');
    dispatch(logout());
  }

  const openLoginModal = (event) => {
    localStorage.removeItem('token');
  };

  const onSeachOptionClick = (postId: string) =>{
    if (!postId) {
      return
    }
    history('/post/' + postId)
    setOpen(false)
  }



  const onGlobalSearchInputChange = async (event, newInputValue) =>{
    setInputValue(newInputValue)
    if (!newInputValue) {
      setOpen(false);
      setOptions([])
      return
    }
    setOpen(true);
    setSearching(true)
    const resp = await globalSearch({filter: newInputValue});
    setOptions(resp.data);
    setSearching(false)

  }

  return (
    <>
      <Navbar expanded={expand} fixed="top" expand="md" className={(navColour ? 'sticky' : 'navbar') + ' Navbar'}>
        <Container>
          <Navbar.Brand href="/#">
            <img src={logo} className="logo" alt="brand" />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => {
              updateExpanded(expand ? false : true);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto" defaultActiveKey="#home">
              {Object.values(MENU_CONFIG).map((el: any, index) => {
                return !el.showOnlyFooter && el.routes && el.routes.length > 0?
                <Nav.Item key={'navbarScrollingDropdown' + index}>
                  <NavDropdown
                    title={el.breadcrumbName}
                    id={'navbarScrollingDropdown' + index}
                    onMouseEnter={(e: MouseEvent) => updateStatus(true, index)}
                    onMouseLeave={(e: MouseEvent) => updateStatus(false, index)}
                    show={status[index]}
                  >
                    {(el.routes).map(({breadcrumbName, path}) => (
                      <NavDropdown.Item key={breadcrumbName} href={'#' + path}>
                        {breadcrumbName}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                </Nav.Item>:
                <Nav.Item key={'navbarSingle'+ index}>
                  <Nav.Link href={'#' + el.path}>{el.breadcrumbName}</Nav.Link>
                </Nav.Item>
              })}
            </Nav>
            {navColour && title ? <Navbar.Brand href="/#">{title}</Navbar.Brand> : null}
            <Nav className="justify-content-end" style={{width: '100%'}}>
              <Nav.Item>
                <Nav.Link>
                  <Tooltip title="Search">
                    <Search>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        open={open}
                        forcePopupIcon={false}
                        loading={searching}
                        getOptionLabel={(option) => get(option, 'title') as string}
                        isOptionEqualToValue={(option, value) => get(option, 'post_id')  === get(value, 'post_id') }
                        onOpen={(event) => {
                          if (inputValue) {
                            setOpen(true);
                          }
                        }}
                        onClose={(event: object, reason: string) => {
                          if (reason === 'blur') {
                            setOpen(false)
                          }
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => onGlobalSearchInputChange(event, newInputValue)}
                        id="controllable-states-demo"
                        options={options}
                        sx={{
                          display: 'inline-block',
                          '& input': {
                            width: 200,
                            bgcolor: 'background.paper',
                            color: (theme) =>
                              theme.palette.getContrastText(theme.palette.background.paper),
                          },
                        }}
                        componentsProps={{
                          paper: {
                            sx: {
                              marginLeft: '2rem',
                              width: '20ch',
                            }
                          }
                        }}
                        renderOption={(props, option: any) =>
                            <Box
                              {...props}
                              component='li'
                              key={option['post_id']}
                              onClick={()=>onSeachOptionClick(option['post_id'])}
                            >
                              <div className="title">
                                <span>{option['title']}</span>
                              </div>
                              {/* <div className="sub-title">
                                <div className="category">
                                  <Chip size="small" label={capitalize(option.category)} color={CategroryColor[option.category]} variant="outlined" />
                                </div>
                                <Stack className="tags" direction="row" spacing={1}>
                                  {option['tags'].map((tag, idx) => (
                                    <Chip key={idx} label={capitalize(tag)} size="small"/>
                                  ))}
                                </Stack>
                              </div> */}
                            </Box>

                        }
                        renderInput={(params) => (
                          <div className="global-search-container" ref={params.InputProps.ref}>
                            <input placeholder="Search…" type="text" {...params.inputProps} />
                            <React.Fragment>
                            {searching? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                            </React.Fragment>
                          </div>
                        )}
                      />
                    </Search>
                  </Tooltip>
                </Nav.Link>
              </Nav.Item>
              {isLoggedIn &&
              <Nav.Item>
                <Nav.Link>
                  <Tooltip title="Notification">
                    <NotificationPanel unread={unreadCount} onRefresh={(refresh)=>getUnreadCount()}/>
                  </Tooltip>
                </Nav.Link>
              </Nav.Item>}
              <Nav.Item>
                <NavDropdown title={user?<Tooltip title={user.username}><Avatar sx={{ height: '32px', width: '32px' }} alt={user.username} src={user.avatar}/></Tooltip>:<AccountCircleIcon />} id="navbarScrollingDropdown">
                  {!isLoggedIn ? <NavDropdown.Item onClick={openLoginModal} href={process.env.REACT_APP_OAUTH_URL + '/login?serviceURL=' + process.env.REACT_APP_SERVICE_HOST}>Login</NavDropdown.Item> : null}
                  {!isLoggedIn ? <NavDropdown.Item onClick={openSignupModal}  href={process.env.REACT_APP_OAUTH_URL + '/register?serviceURL=' + process.env.REACT_APP_SERVICE_HOST}>Register</NavDropdown.Item> : null}
                  {!isLoggedIn && false ? (
                    <NavDropdown.Item
                      onClick={onRedirectToOauth}
                      href={process.env.REACT_APP_OAUTH_URL + '/login?serviceURL=' + process.env.REACT_APP_SERVICE_HOST}
                    >
                      Redirect to Oauth
                    </NavDropdown.Item>
                  ) : null}
                  {isLoggedIn ? <NavDropdown.Item href="#/profile">Profile</NavDropdown.Item> : null}
                  {isLoggedIn ? <NavDropdown.Item onClick={onLogout} href={process.env.REACT_APP_OAUTH_URL + '/logout?serviceURL=' + process.env.REACT_APP_SERVICE_HOST}>Logout</NavDropdown.Item> : null}
                </NavDropdown>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AuthModal modalType={modalType} />
    </>
  );
};

export default NavBar;
