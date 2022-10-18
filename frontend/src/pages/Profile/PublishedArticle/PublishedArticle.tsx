import { useEffect, useState, useRef, CSSProperties} from 'react';
import {Container, Row, Button} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {get as getProp} from 'lodash';
import MUIDataTable from 'mui-datatables';
import {get} from 'lodash';
import {createTheme, ThemeProvider, Theme} from '@mui/material/styles';
import {listAllPosts, deleteManyPosts} from 'api/post';
import {useNavigate} from 'react-router-dom';
import './PublishedArticle.scss';

import {Chip, Stack, PushPinIcon} from 'lib/mui-shared';
import {TimeFormatter} from 'lib/formatter/time';
import {CountFormatter} from 'lib/formatter/count';
import {withStyles, CircularProgress} from '@material-ui/core';
import {Role} from 'App';
import WithDialog from 'common/Dialog/WithDialog';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
declare module '@mui/material/styles' {
  interface Components {
    [key: string]: any;
  }
}
export const ALLOWED_FILTER_FIELD = ['category', 'tag'];
export interface Post {
  title: {title: string; status: string; category: string};
  author: string;
  replies: number;
  views: number;
  create_time: number;
  id: string;
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
      top: 0
    },
    table: {
      minWidth: 700,
      height: 200
    },
    tableCell: {
      fontSize: '.6rem'
    }
  } as CSSProperties);

const convertToTable = (responseBody): Post[] => {
  return responseBody.map(({post_id, title, category, tags, is_pinned, author, create_time, replies, views}) => {
    return {
      id: post_id,
      title: {title, status: 'new', category, is_pinned, tags},
      author,
      views: CountFormatter.countAbbr(views),
      create_time: TimeFormatter.timeSince(new Date(create_time)),
      replies
    };
  });
};
// const getQueryFromUrl = (queryParams) => {
//   const result = {};
//   for (const [key, value] of queryParams.entries()) {
//     if (!ALLOWED_FILTER_FIELD.includes(key)) {
//       continue;
//     }

//     result[key] = value.split(',');
//   }

//   return result;
// };

const PublishedArticle = (prop) => {
  const [page, setPage] = useState<number>(0)
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [selectIds, setSelectIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authState = useSelector((state: {auth: any}) => state.auth);
  const queryParams = useRef({skip: 0, limit: 10, author: authState.user._id});
  const getPosts = async () => {
    const resp = await listAllPosts(queryParams.current);
    setPosts([...convertToTable(resp.data.data)]);
    setTotal(resp.data.total);
    setIsLoading(false);
  };

  const getPartialPosts = async ()=>{
    const resp = await listAllPosts(queryParams.current);
    setPosts([...posts, ...convertToTable(resp.data.data)]);
  }

  const history = useNavigate();
  const directToCreatePost = () => history(`/post/create`);
  const deletePosts = async () => {
    prop.closeDialog()
    await deleteManyPosts(selectIds);
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
      }
    },
    {
      label: 'Featured Topics',
      name: 'title',
      selector: 'title',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="title-container">
              <div className="title">
                {value.is_pinned ? <PushPinIcon /> : null}
                <span className="status"></span>
                <span>{value.title}</span>
              </div>
              <div className="sub-title">
                <div className="category">{value.category}</div>
                <Stack className="tags" direction="row" spacing={1}>
                  {value.tags.map((tag, idx) => (
                    <Chip key={idx} label={tag} size="small" />
                  ))}
                </Stack>
              </div>
            </div>
          );
        }
      }
    },
    {label: 'Replies', name: 'replies'},
    {label: 'Views', name: 'views'},
    {label: 'Latest Post', name: 'create_time'},
  ];
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
    pagination: false,
    download: false,
    onRowClick: (rowData, {rowIndex}, e) => {
      history(`/post/${posts[rowIndex].id}`);
    },
    filter: false,
    serverSide: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 30, 100],
    count: total,
    search: false,
    viewColumns: false,
    onTableChange: onTableTakeAction.bind(this),
    onRowSelectionChange: onSelectRows.bind(this),
    setTableProps: () => {
      return {
        // material ui v4 only
        size: 'small',
      };
    },
  };

  const scrollToTop = ()=>{
    window.scrollTo(0, 0)
  }

  const handleDialogCancellClick = () => {
    prop.closeDialog();
  };

  const onClickReadMore = async () => {
    const newPage = page + 1
    queryParams.current['skip'] = newPage;
    setPage(newPage)
    getPartialPosts()
  }


  const openRemoveConfirmDialog = ()=>{
    const component = "Are you sure to delete these articles?";
    prop.openDialog({
      component,
      title: 'Confirm',
      okCallback: deletePosts,
      cancelCallback: handleDialogCancellClick,
      width: 'md',
      okText: 'OK',
      cancelText: 'Cancel'
    });
  }

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: 'none',
              // height: '100vh'
            },

          }
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              borderBottom: ['1px', 'solid', '#000']
            }
          }
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: '12px'
            }
          }
        }
      }
    });

  useEffect(() => {
    (async () => {
      await getPosts();
    })();
  }, []);

  return (
    <Container className="PublishedArticle block">
      <div className="btn-container">
        <Button className="btn btn-primary" onClick={openRemoveConfirmDialog}>
          Remove
        </Button>
      </div>

      <ThemeProvider theme={getMuiTheme()}>
        {isLoading ? (
          <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} />
        ) : (
          <MUIDataTable data={posts} columns={columns} options={options} />
        )}
      </ThemeProvider>
      <Row className="btn-container">
        {posts.length < total? <div className="read-more"><Button className="btn btn-primary centerButton" onClick={onClickReadMore}>
          Read more
        </Button></div>: null}
      </Row>
      <Container className="fixed-btn">
        {authState.user && (authState.user.role === Role.Admin || authState.user.role === Role.Member) ?
          <Fab size="small" color="secondary" aria-label="add" onClick={directToCreatePost}>
            <AddIcon />
          </Fab>: null
        }
        <Fab size="small" color="error" aria-label="top" onClick={scrollToTop}>
          <KeyboardArrowUpIcon />
        </Fab>
      </Container>
    </Container>
  );
};
export default withStyles(styles as {})(WithDialog(PublishedArticle));
