import React, {useState, useRef, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import { makeStyles } from '@mui/styles';
import {Box, Grid, Paper, Card,  CardActionArea,  CardMedia,  CardContent,  Typography} from 'lib/mui-shared'
import { experimentalStyled as styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {TimeFormatter} from 'lib/formatter/time';
import {listAllPosts} from 'api/post';
import './Announcements.scss';

export interface Post {
  title: {title: string; status: string; category: string};
  author: string;
  create_time: number;
  id: string;
  cover?: string;
  content: string
}
const useStyles = makeStyles({
  description: {
    color: 'blue',
    overflow: "hidden",
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical'
  },
});

const Item = styled(CardContent)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: 0,
  color: theme.palette.text.secondary,
}));

const Announcements = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryParams = useRef({skip: 0, limit: 4, category: 'announcement'});

  const getPosts = async () => {
    const resp = await listAllPosts(queryParams.current);
    setPosts([...convertToTable(resp.data.data)]);
    setIsLoading(false);
  };

  const convertToTable = (responseBody): Post[] => {
    return responseBody.map(({post_id, title, category, tags, cover, is_pinned, author, create_time, content}) => {
      return {
        id: post_id,
        title: {title, status: 'new', category, is_pinned, tags},
        author,
        cover,
        create_time: TimeFormatter.timeSince(new Date(create_time)),
        content: content? content.replace(/<\/?[^>]+(>|$)/g, "") : null
      };
    });
  };

  useEffect(() => {
    (async () => {
      await getPosts();
    })();
  }, []);

  return <Container className="Announcements block">
    <h4>Announcements</h4>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {!isLoading? posts.map((_, index) => (
          <Grid item xs={2} sm={4} md={3} key={index}>
            <Card sx={{ maxWidth: 300 }}>
              <CardActionArea href={'#/post/'+_.id}>
                <CardMedia
                  component="img"
                  height="180"
                  sx={{ width: 'inherit' }}
                  image={_.cover}
                  alt={_.title.title}
                />
                <CardContent>
                  <Item>
                    <Typography gutterBottom variant="h5" component="div">
                      {_.title.title}
                    </Typography>
                    {/* <Typography className={classes.description} variant="body2" color="text.secondary">{_.content}</Typography> */}
                  </Item>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )): Array.from(new Array(4)).map((_, index) => (
          <Grid item xs={2} sm={4} md={3} key={index}>
            <Card sx={{ maxWidth: 300 }}>
              <CardActionArea >
                <Skeleton variant="rectangular"  height={180} />
                <CardContent sx={{paddingBottom: '16px'}}>
                  <Item>
                    <Typography gutterBottom variant="h5" component="div">
                      <Skeleton />
                      <Skeleton width="60%"/>
                    </Typography>
                    {/* <Typography className={classes.description} variant="body2" color="text.secondary">{_.content}</Typography> */}
                  </Item>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>))}
      </Grid>
    </Box>

  </Container>
};

export default Announcements;
