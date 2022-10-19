import React, {Fragment, useMemo, useEffect, useState, useRef, CSSProperties, MouseEvent} from 'react';
import {Container, Row, Button} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {get as getProp, capitalize, cloneDeep} from 'lodash';

import MUIDataTable from 'mui-datatables';
import EventBus from 'eventing-bus';
import {get} from 'lodash';
import {createTheme, styled, ThemeProvider, Theme} from '@mui/material/styles';
import {useDispatch} from 'react-redux';
import {Dispatch} from 'redux';
import {BlockEventType, CategroryColor} from 'common/shared.definition';
import {listAllPosts, deleteManyPosts} from 'api/post';
import {useNavigate, useLocation} from 'react-router-dom';
import {Chip, Stack, Avatar, LoadingButton,Tooltip,IconButton, PushPinIcon, Fab, KeyboardArrowUpIcon, BookmarksIcon, AddIcon} from 'lib/mui-shared';
import {TimeFormatter} from 'lib/formatter/time';
import {CountFormatter} from 'lib/formatter/count';
import {withStyles, CircularProgress} from '@material-ui/core';
import WithDialog from 'common/Dialog/WithDialog';

import './Feature-topics.scss';

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
  bookmark: boolean;
  hidden: boolean;
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
      flexGrow: 1,

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
  border: "1px solid #ff0000",
  borderRadius: '2rem',
  color: '#ff0000',
  padding: '0.25rem 0.5rem',
  "&:hover":{
    backgroundColor: "#ff0000",
    borderColor: "#ff0000",
    color: '#fff',
  },

});

const convertToTable = (responseBody): Post[] => {
  const bookmarks = []
  return responseBody.map(({post_id, likes, hidden, title, category, tags, is_pinned, author, create_time, replies, views}) => {
    return {
      id: post_id,
      title: {title, status: 'new', category, is_pinned, tags},
      author,
      views: CountFormatter.countAbbr(views),
      create_time: TimeFormatter.timeSince(new Date(create_time)),
      replies,
      bookmark: bookmarks && bookmarks.some((_post)=>_post === post_id),
      hidden
    };
  });
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
  const {classes} = prop;
  const {search} = useLocation();
  const urlSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const [page, setPage] = useState<number>(0)
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [selectIds, setSelectIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const offerState = useSelector((state: {offer: []}) => state.offer);
  const queryParams = useRef({skip: 0, limit: 10, ...getQueryFromUrl(urlSearchParams)});
  const dispatch: Dispatch<any> = useDispatch();
  const getPosts = async () => {
    // setIsLoading(true)
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

  const onChipClicked = (event, query:string, value:string)=>{
    if (event) {
      event.stopPropagation();
    }
    history(`/posts?${query}=${value.toLowerCase()}`)
  }

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
                {/* <Waypoint
                  onEnter={buildTestData.bind(this)}
                  onLeave={()=>{console.log('onLeave')}}
                /> */}
                
                {value}*{rowIndex}
              </Fragment>
            );
          } else {
            return <Fragment></Fragment>;
          }
        }
      }
    },
    {
      label: 'Featured Topics',
      name: 'title',
      selector: 'title',
      options: {
        setCellProps: () => ({ style: { minWidth: "40rem"} }),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="title-container">
              <div className="title">
                {value.is_pinned ? <PushPinIcon /> : null}
                <span className="status"></span>
                <span>{value.title}</span>
              </div>
              <div className="sub-title">
                <div className="category">
                  <Chip size="small" label={capitalize(value.category)} color={CategroryColor[value.category]} variant="outlined" onClick={(evt)=>{onChipClicked(evt, 'category', value.category)}}/>
                </div>
                <Stack className="tags" direction="row" spacing={1}>
                  {value.tags.map((tag, idx) => (
                    <Chip key={idx} label={capitalize(tag)} size="small" onClick={(evt)=>{onChipClicked(evt, 'tags', tag)}}/>
                  ))}
                </Stack>
              </div>
            </div>
          );
        }
      }
    },
    {
      label: 'Author',
      name: 'author',
      options: {
        customBodyRender: ({username, avatar}, tableMeta, updateValue) => {
          return (
            <Tooltip title={username}>
              <Avatar alt={username} src={avatar} />
            </Tooltip>
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
    setRowProps: (row, dataIndex, rowIndex) => ({
        style: {
          backgroundColor: posts[rowIndex].hidden? '#efefef': 'inherit'
        }
      }
    ),
    // customToolbar: ()=>{
    //   if (!authState.user) {
    //     return
    //   }
    //   return (authState.user.role === Role.Member || authState.user.role === Role.Admin) &&  (
    //     <div className="btn-container">
    //       <Button className="btn btn-primary" onClick={directToCreatePost}>
    //         Create New Topic
    //       </Button>
    //     </div>
    //   )
    // },
    // customToolbarSelect: ()=>{
    //   if (!authState.user) {
    //     return
    //   }
    //   return (authState.user.role === Role.Member || authState.user.role === Role.Admin) &&  (
    //     <div className="btn-container">
    //       <Button className="btn btn-primary" onClick={directToCreatePost}>
    //         Create New Topic
    //       </Button>
    //       {authState.user.role === Role.Admin && selectIds.length >0 && <Button className="btn btn-primary" onClick={openRemoveConfirmDialog}>
    //         Remove
    //       </Button>}
    //     </div>
    //   )
    // },
    viewColumns: false,
    onTableChange: onTableTakeAction.bind(this),
    onRowSelectionChange: onSelectRows.bind(this)
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
            },

          }
        }
      }
    });
  useEffect(()=>{
    console.log(offerState)
  },[offerState])
  useEffect(() => {

    (async () => {
      // await getPosts();
      EventBus.on(BlockEventType.ChangeFilter,(selection: {[group: string]: Set<string>})=>{
        const array_query = {}
        for (const group of Object.keys(selection)){
          array_query[group] = Array.from(selection[group])
        }
        queryParams.current = {skip: 0, limit: 10, ...array_query}
        // getPosts();
      })
    })();
  }, []);

  return (
    <Container className="FeatureTopics block">
      <ThemeProvider theme={getMuiTheme()}>
        {isLoading && <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} />}
        <MUIDataTable data={posts} columns={columns} options={options} />
      </ThemeProvider>
      <Row className="btn-container">
        {posts.length < total?
          <div className="read-more"><ReadmoreButton loading={isLoading} onClick={onClickReadMore}>
          Read more
          </ReadmoreButton>
          </div>: null}
      </Row>
      <Container className="fixed-btn">
        
        <Fab size="small" color="error" aria-label="add" onClick={directToCreatePost}>
          <AddIcon />
        </Fab>
        
        <Fab size="small" color="error" aria-label="top" onClick={scrollToTop}>
          <KeyboardArrowUpIcon />
        </Fab>
      </Container>
    </Container>
  );
};
export default withStyles(styles as {})(WithDialog(FeatureTopics));
