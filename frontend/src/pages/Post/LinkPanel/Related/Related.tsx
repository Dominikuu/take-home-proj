import React, {useEffect, useState} from 'react';
import {set as setProp, cloneDeep} from 'lodash';
import {useParams} from 'react-router-dom';
import {MENU_CONFIG} from 'router/Router';
import {useNavigate} from 'react-router-dom';
import {listAllRelated} from 'api/post/related';
import {ListItemButton, Typography, ListItemText, ListSubheader, List, ListItem, Divider, IconButton , DeleteIcon} from 'lib/mui-shared'
import './Related.scss';

interface Post {
  post_id: string;
  title: string;
  author: string;
  content: string;
}
const TITLE = 'Related list'

const Related = (props) => {
  const {postId} = useParams<{postId: string}>() as {postId: string};
  const [posts, setPosts] = useState<Post[]>([]);
  const { classes } = props;
  const history = useNavigate();
  const directToPostList = (postId: string) => {
    const url = `/post/` +  postId ;
    history(url, { replace: true });
  };
  const getRelatedArticles = async () => {
    const {data: responseBody} = await listAllRelated({postId});
    if (!responseBody) {
      return;
    }
    const post_list: Post[] = responseBody.map((postItem)=>{
      return {
        post_id: postItem.post_id,
        title: postItem.title,
        author: postItem.author.username,
        content: postItem.content.replace(/<\/?[^>]+(>|$)/g, "")
      }
    })
    setPosts(post_list)
  };
  useEffect(() => {
    (async () => {
      await getRelatedArticles();
    })();
  }, []);
  return (
    <div className="Related">
      <List
        sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper', border: '1px solid #eee', borderRadius: '10px' }}
        subheader={
          <ListSubheader className="header">
            <div className="title">
            {TITLE}
            </div>
            { posts.length>0 &&
              <div className="clear">
                {/* <IconButton  className={classes.button} onClick={onClearClick}>
                  <DeleteIcon/>
                </IconButton> */}
              </div>
            }
          </ListSubheader>
        }
      >{ posts.length > 0? (posts.map((post, idx)=>(
        <React.Fragment key={'related_article'+ idx}>
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

export default Related;
