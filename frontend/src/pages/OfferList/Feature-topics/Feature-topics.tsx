import React, {Fragment, useMemo, useEffect, useState, useRef, CSSProperties, MouseEvent} from 'react';
import {Container, Row, Button} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {get as getProp, cloneDeep} from 'lodash';
import withSnackbar, {SnackbarMessage} from 'common/Snackbar/Snackbar';
import MUIDataTable from 'mui-datatables';
import EventBus from 'eventing-bus';
import {get} from 'lodash';
import {createTheme, styled, ThemeProvider, Theme} from '@mui/material/styles';

import {BlockEventType} from 'common/shared.definition';

import {useNavigate, useLocation} from 'react-router-dom';
import {LoadingButton, Tooltip, IconButton, Fab, KeyboardArrowUpIcon, ShareIcon, AddIcon} from 'lib/mui-shared';
import {TimeFormatter} from 'lib/formatter/time';
import {CountFormatter} from 'lib/formatter/count';
import {withStyles} from '@material-ui/core';
import {Role} from 'App';
import WithDialog from 'common/Dialog/WithDialog';
import './Feature-topics.scss';

declare module '@mui/material/styles' {
  interface Components {
    [key: string]: any;
  }
}
export const ALLOWED_FILTER_FIELD = ['category', 'tag'];
export interface Offer {
  id: string;
  jobTitle: string;
  salary: number;
  bonus: number;
  culture: string;
  learning: string;
  description: string;
}
export enum TableAction {
  filter = 'filterChange',
  sort = 'sort',
  search = 'search',
  limit = 'changeRowsPerPage',
  page = 'changePage'
}
export const paramDict = {
  [TableAction.filter]: {
    fitlerList: ''
  },
  [TableAction.sort]: {
    'sortOrder.name': 'sort',
    'sortOrder.direction': 'sort_type'
  },
  [TableAction.search]: {
    searchText: 'search'
  },
  [TableAction.page]: {
    page: 'skip',
    rowsPerPage: 'limit'
  },
  [TableAction.limit]: {
    page: 'skip',
    rowsPerPage: 'limit'
  }
};
const styles = (theme: Theme) =>
  ({
    root: {
      width: '100%',
      overflowX: 'auto',
      height: 300,
      flexGrow: 1
    },
    head: {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      position: 'sticky',
      fontSize: '.6rem',
      top: 0,
      fontFamily: 'Poppins'
    },
    table: {
      minWidth: 700,
      height: 200,
      fontFamily: 'Poppins'
    },
    tableCell: {
      fontSize: '.6rem',
      fontFamily: 'Poppins'
    }
  } as CSSProperties);

const ReadmoreButton = styled(LoadingButton)({
  background: '#fff',
  border: '1px solid #ff0000',
  borderRadius: '2rem',
  color: '#ff0000',
  padding: '0.25rem 0.5rem',
  '&:hover': {
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
    color: '#fff'
  }
});

const convertToTable = (responseBody): Offer[] => {
  return responseBody.map(
    ({post_id, likes, hidden, title, category, tags, is_pinned, author, create_time, replies, views}) => {
      return {
        id: post_id,
        title: {title, status: 'new', category, is_pinned, tags},
        author,
        views: CountFormatter.countAbbr(views),
        create_time: TimeFormatter.timeSince(new Date(create_time)),
        replies,
        hidden
      };
    }
  );
};
const getQueryFromUrl = (queryParams) => {
  const result = {};
  for (const [key, value] of queryParams.entries()) {
    if (!ALLOWED_FILTER_FIELD.includes(key)) {
      continue;
    }
    result[key] = value.split(',');
  }

  return result;
};

const FeatureTopics = (prop) => {
  const {search} = useLocation();
  const urlSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const [page, setPage] = useState<number>(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [selectIds, setSelectIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authState = useSelector((state: {auth: any}) => state.auth);
  const offerState = useSelector((state: {offer: any}) => state.offer);
  const queryParams = useRef({skip: 0, limit: 10, ...getQueryFromUrl(urlSearchParams)});

  const getPosts = async () => {
    setPosts([...convertToTable({})]);
    setTotal(300);
    setIsLoading(false);
  };

  const getPartialPosts = async () => {
    const resp = {data: {data: {}}};
    setPosts([...posts, ...convertToTable(resp.data.data)]);
  };

  const history = useNavigate();
  const onAddClicked = () => {
    console.log('CLICKE ADD');
    EventBus.publish(BlockEventType.ToggleDrawer, {isOpen: true});
  };
  const deletePosts = async () => {
    prop.closeDialog();
    await getPosts();
  };
  const onSelectRows = (currentRowsSelected, allRowsSelected, rowsSelected: number[]) => {
    const postIds = rowsSelected.map((index: number) => posts[index].id);
    setSelectIds(postIds);
  };

  const columns = [
    {
      name: 'id',
      label: 'Id',
      options: {
        filter: false,
        display: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowIndex = tableMeta.rowIndex;
          if (rowIndex === posts.length - 5) {
            return (
              <Fragment>
                {value}*{rowIndex}
              </Fragment>
            );
          } else {
            return <Fragment></Fragment>;
          }
        }
      }
    },
    {label: 'Job title', name: 'jobTitle'},
    {label: 'Salary', name: 'salary'},
    {label: 'Bonus', name: 'bonus'},
    {label: 'Culture', name: 'culture'},
    {label: 'Learning opportunity', name: 'learning'},
    {label: 'Latest Post', name: 'create_time'},
    {
      label: 'Share link',
      name: 'share',
      options: {
        customBodyRender: (isAdded, tableMeta, updateValue) => {
          const offerId = posts[tableMeta.rowIndex].id;
          return (
            <Tooltip title="Share link">
              <IconButton component="span" size="small" onClick={(e) => copyToClipboard(e, offerId)}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          );
        }
      }
    }
  ];

  const onShowSnackbarMessage = ({message, type}: SnackbarMessage) => {
    prop.snackbarShowMessage(message, type || 'success');
  };

  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  };

  const copyToClipboard = (event, offerId: string) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const targetAchorUrl = `${window.location.origin}/#/offer/${offerId}`;
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(targetAchorUrl);
    } else {
      unsecuredCopyToClipboard(targetAchorUrl);
    }
    onShowSnackbarMessage({message: 'Copied to clipboard!', type: 'success'});
  };

  const onTableTakeAction = (action: TableAction, tableState) => {
    const tableKeyDict = paramDict[action];
    if (!tableKeyDict) {
      return;
    }
    for (const [prop, queryParam] of Object.entries(tableKeyDict)) {
      const val = getProp(tableState, prop);
      queryParams.current[queryParam] = val;
    }
    getPosts();
  };

  const options = {
    selectableRowsHeader: get(authState, 'user.role') === 'ADMIN',
    selectableRowsHideCheckboxes: get(authState, 'user.role') !== 'ADMIN',
    print: false,
    download: false,
    onRowClick: (rowData, {rowIndex}, e) => {
      history(`/offer/${posts[rowIndex].id}`);
    },
    filter: true,
    serverSide: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 30, 100],
    count: total,
    search: true,
    setRowProps: (row, dataIndex, rowIndex) => ({
      style: {
        backgroundColor: posts[rowIndex].hidden ? '#efefef' : 'inherit'
      }
    }),
    customToolbar: () => {
      if (!authState.user) {
        return;
      }
      return (
        (authState.user.role === Role.Member || authState.user.role === Role.Admin) && (
          <div className="btn-container">
            <Button className="btn btn-primary" onClick={onAddClicked}>
              Create New Topic
            </Button>
          </div>
        )
      );
    },
    customToolbarSelect: () => {
      if (!authState.user) {
        return;
      }
      return (
        (authState.user.role === Role.Member || authState.user.role === Role.Admin) && (
          <div className="btn-container">
            <Button className="btn btn-primary" onClick={onAddClicked}>
              Create New Topic
            </Button>
            {authState.user.role === Role.Admin && selectIds.length > 0 && (
              <Button className="btn btn-primary" onClick={openRemoveConfirmDialog}>
                Remove
              </Button>
            )}
          </div>
        )
      );
    },
    viewColumns: false,
    onTableChange: onTableTakeAction.bind(this),
    onRowSelectionChange: onSelectRows.bind(this)
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleDialogCancellClick = () => {
    prop.closeDialog();
  };

  const onClickReadMore = async () => {
    const newPage = page + 1;
    queryParams.current['skip'] = newPage;
    setPage(newPage);
    getPartialPosts();
  };

  const openRemoveConfirmDialog = () => {
    const component = 'Are you sure to delete these articles?';
    prop.openDialog({
      component,
      title: 'Confirm',
      okCallback: deletePosts,
      cancelCallback: handleDialogCancellClick,
      width: 'md',
      okText: 'OK',
      cancelText: 'Cancel'
    });
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: 'none'
            }
          }
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              borderBottom: ['1px', 'solid', '#000']
            }
          }
        },
        MuiTableHeadCell: {
          styleOverrides: {
            root: {
              padding: '12px',
              fontFamily: 'Poppins'
            }
          }
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            data: {
              fontFamily: 'Poppins'
            }
          }
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: '12px',
              fontFamily: 'Poppins'
            }
          }
        }
      }
    });

  useEffect(() => {
    const postList = cloneDeep(offerState.offer).map((el) => {
      el.create_time = TimeFormatter.timeSince(new Date(el.create_time));
      return el;
    });
    setPosts(postList);
  }, [offerState]);

  return (
    <Container className="FeatureTopics block">
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable data={posts} columns={columns} options={options} />
      </ThemeProvider>
      <Row className="btn-container">
        {posts.length < total ? (
          <div className="read-more">
            <ReadmoreButton loading={isLoading} onClick={onClickReadMore}>
              Read more
            </ReadmoreButton>
          </div>
        ) : null}
      </Row>
      <Container className="fixed-btn">
        <Fab size="small" color="error" aria-label="add" onClick={onAddClicked}>
          <Tooltip title="Create new offer">
            <AddIcon />
          </Tooltip>
        </Fab>
        <Fab size="small" color="error" aria-label="top" onClick={scrollToTop}>
          <Tooltip title="To top">
            <KeyboardArrowUpIcon />
          </Tooltip>
        </Fab>
      </Container>
    </Container>
  );
};
export default withStyles(styles as {})(withSnackbar(WithDialog(FeatureTopics)));
