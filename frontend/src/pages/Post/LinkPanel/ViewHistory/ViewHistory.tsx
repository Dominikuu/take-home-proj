import React, {useEffect, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {useDispatch} from 'react-redux';
import {Dispatch} from 'redux';
import {listManyPosts} from 'api/post'
import store from 'lib/store';
import {ListItemButton, Typography, ListItemText, ListSubheader, List, ListItem, Divider, IconButton , DeleteIcon} from 'lib/mui-shared'
import {set as setProp, cloneDeep} from 'lodash';
import {MENU_CONFIG} from 'router/Router';
import {useNavigate} from 'react-router-dom';
import {clearVeiwHistory} from 'lib/viewHistory/veiwHistory.action';
import './ViewHistory.scss';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

interface Post {
  post_id: string;
  title: string;
  author: string;
  content: string;
}

const ViewHistory = (props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { classes } = props;
  const dispatch: Dispatch<any> = useDispatch()
  
  const history = useNavigate();
  const {viewHistory} = store.getState();
  const directToPostList = (postId: string) => {
    const url = `/post/` +  postId ;
    history(url, { replace: true });
  };
  const getPosts = async () => {
    const postIds: string[] = Array.from(viewHistory.posts).reverse()
    const {data: responseBody} = await listManyPosts({post_ids: postIds});
    if (!responseBody) {
      return;
    }
    const post_list: Post[] = responseBody.data.map((postItem)=>{
      return {
        post_id: postItem.post_id,
        title: postItem.title,
        author: postItem.author.username,
        content: postItem.content.replace(/<\/?[^>]+(>|$)/g, "")
      }
    })
    setPosts(post_list)
  };
  const onClearClick = ()=>{
    setPosts([])
    dispatch(clearVeiwHistory())
  }
  useEffect(() => {
      getPosts();
  }, []);
  return (
    <div className="ViewHistory">
          <List
            sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper', border: '1px solid #eee', borderRadius: '10px' }}
            subheader={
              <ListSubheader className="header">
                <div className="title">
                  View History
                </div>
                { viewHistory.posts.size>0 &&
                  <div className="clear">
                    <IconButton  className={classes.button} onClick={onClearClick}>
                      <DeleteIcon/>
                    </IconButton>
                  </div>
                }
              </ListSubheader>
            }
          >{ viewHistory.posts.size > 0? (posts.map((post, idx)=>(
            <React.Fragment key={'view_history'+ idx}>
              <ListItemButton alignItems="flex-start" onClick={()=>directToPostList(post.post_id)}>
                <ListItemText
                  className="listItem"
                  primary={post.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {post.author}
                      </Typography>
                      {" — " + post.content}
                    </React.Fragment>
                  }
                />
              </ListItemButton>
              {idx < posts.length -1 && <Divider variant="middle" component="li" />}
            </React.Fragment>))): 
            <div className="no-post">There is no post</div>
          }
          </List>
    </div>
  );
};

export default withStyles(styles)(ViewHistory);
