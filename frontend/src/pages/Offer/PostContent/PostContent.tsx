import {useState, useEffect, useRef} from 'react';
import {capitalize} from 'lodash';
import {Row, Container} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import withSnackbar, {WithSnackProps, SnackbarMessage} from 'common/Snackbar/Snackbar';
import {useNavigate, useParams} from 'react-router-dom';
import {styled} from '@mui/material/styles';
import {Link, Chip, PushPinIcon, Paper} from 'lib/mui-shared';
import {getOnePost} from 'api/post';
import EventBus from 'eventing-bus';
import {BlockEventType, CategroryColor} from 'common/shared.definition';
import {useDispatch} from 'react-redux';
import {Dispatch} from 'redux';
import {getOffer} from 'lib/offer/offer.action'
import './PostContent.scss';

import Topic from '../Topic/Topic';
import { off } from 'process';

const ListItem = styled('li')(({theme}) => ({
  margin: theme.spacing(0.5)
}));

interface PostContentProp extends WithSnackProps{
  key: string
}

const PostContent = ({snackbarShowMessage}: PostContentProp) => {
  const {offerId} = useParams<{offerId: string}>() as {offerId: string};
  const offerState = useSelector((state: {offer: any}) => state.offer);
  const dispatch: Dispatch<any> = useDispatch();
  const [offer, setOffer] = useState<{
    title: string;
    category: string;
    posts: any[];
    likes: any[];
    tags: string[];
    is_pinned: boolean;
    closed: boolean;
    hidden: boolean;
  }>({title: '', category: '', posts: [], tags: [], is_pinned: false, likes: [], closed: false, hidden: false});
  const postsEndRef = useRef<null | HTMLDivElement>(null);
  const history = useNavigate();
  const getPost =  (data) => {
    const posts = [
      {
        content: data.content,
        likes: data.likes,
        reply_count: data.comments.length,
        author: data.author,
        create_time: data.create_time,
        edit_time: data.edit_time,
        is_pinned: data.is_pinned,
        views: data.views,
        cover: data.cover,
        closed: data.closed,
        hidden: data.hidden
      },
      ...data.comments
    ];
    const {title, category, tags, is_pinned, likes, closed, hidden} = data;
    const newPost = {posts, title, category, tags, is_pinned, likes, closed, hidden};
    setOffer(offer)
    EventBus.publish(BlockEventType.ShowTitleOnNav, newPost.title);
  };

  const scrollToBottom = () => {
    postsEndRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  const onChipClicked = (event, query: string, value: string)=>{
    if (event) {
      event.stopPropagation();
    }
    history(`/posts?${query}=${value.toLowerCase()}`)
  }

  const onShowSnackbarMessage = ({message, type}: SnackbarMessage) => {
    snackbarShowMessage(message, type || 'success')
  }

  useEffect(() => {
    EventBus.on(BlockEventType.ShowSnackbarMessage, (payload: SnackbarMessage) => onShowSnackbarMessage(payload))
  }, []);

  useEffect(() => {
    const offer = offerState.offer.find(({id})=> offerId === id)
    if (!offer) {
      return
    } 
    getPost(offer)
    
  }, [offerState])
  

  return (
    <Container className="PostContent">
      <Row>
        <Link className="link" href="#" underline="none">
          {"<< Back"}
        </Link>
      </Row>
      <Row>
        <div className="TopicTitle">
          <h1>
            {offer && offer.is_pinned ? <PushPinIcon /> : null}
            <span>{offer.title}</span>
          </h1>
        </div>
      </Row>
      <Container>
        <Row>
          <section className="TopicArea">
            <div className="TopicTitle">
              <div className="PostStream">
                {(offer.posts || []).map(function (item, i) {
                  return <Topic onDeleteReply={null} ancestor={[]} order={i} key={i} info={item}></Topic>;
                })}
              </div>
              <div ref={postsEndRef} />
            </div>
          </section>
        </Row>
      </Container>
    </Container>
  );
};

export default withSnackbar(PostContent);
