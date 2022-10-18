import React, {useState, useEffect, useRef, useCallback} from 'react';
import {get, set, cloneDeep} from 'lodash'
import {Row} from 'react-bootstrap';
import {useParams, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {styled} from '@mui/material/styles';
import Moment from 'react-moment';
import EventBus from 'eventing-bus';
import {useDispatch} from 'react-redux';
import {Dispatch} from 'redux';
import PopperMenu, {Option as PopperMenuOption} from 'common/PopperMenu/PopperMenu';
import {listAllCommentReplies, deleteOneComment, getOneComment} from 'api/comment';
import {updateOneCommentHide} from 'api/post/comment/hide';
import {updateOnePostHide} from 'api/post/hide';
import {updateOnePostClose} from 'api/post/close';
import {updateOneLike, updateOneUnlike} from 'api/post/like';
import {updateOneBookmarks, RequestBody as UpdateBookmarkRequestBody, Action as BookmarkAction} from 'api/user/bookmark';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import renderHTML from 'react-render-html';
import {Link, Chip, Paper, Stack, Avatar,
  IconButton,
  EditIcon,
  Tooltip,
  Backdrop,
  CircularProgress,
  DeleteForeverIcon,
  BookmarksIcon,
  VisibilityIcon,
  FavoriteIcon,
  FavoriteBorderIcon,
  ModeCommentIcon,
  LockIcon,
  DoNotDisturbOnIcon,
  ShareIcon, VisibilityOffIcon
} from 'lib/mui-shared';
import {saveViewHistory} from 'lib/viewHistory/veiwHistory.action';
import {BlockEventType} from 'common/shared.definition';
import './Topic.scss';
import Comment from '../Comment/Comment';
import CommentEditor from '../CommentEditor/CommentEditor';

enum CommentAccess {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

interface Comment {
  [key: string]: string;
}

interface Like {
  isLiked: boolean;
  total: number;
}

interface TopicProp{
  info: any,
  order: number,
  ancestor: any,
  onDeleteReply: any
}
enum MenuKey{
 Hide= 'HIDE',
 Close= 'CLOSE',
 Edit= 'EDIT',
 Delete= 'DELETE',
}
const POPPERMENUOPTION: PopperMenuOption[] = [
  {
    icon: <VisibilityOffIcon/>,
    label: 'Hide',
    key: MenuKey.Hide,
    onClick: ()=>{},
    disabled: false,
    hidden: false
  },
  {
    icon: <DoNotDisturbOnIcon/>,
    label: 'Close',
    key: MenuKey.Close,
    onClick: ()=>{},
    disabled: false,
    hidden: false
  },
  {
    icon: <EditIcon/>,
    label: 'Edit',
    key: MenuKey.Edit,
    onClick: ()=>{},
    disabled: false,
    hidden: false
  },
  {
    icon: <DeleteForeverIcon/>,
    label: 'Delete',
    key: MenuKey.Delete,
    onClick: ()=>{},
    disabled: false,
    hidden: false
  }
]

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0
}));

const Topic = ({info, order, ancestor, onDeleteReply}: TopicProp) => {
  const [topic, setTopic] = useState(cloneDeep(info))
  const [isLoading, setIsLoading] = useState(false);
  const {postId} = useParams<{postId: string}>() as {postId: string};
  const [like, setLike] = useState<Like>({isLiked: false, total: 0});
  const [popperMenuOptions, setPopperMenuOptions] = useState<PopperMenuOption[]>(POPPERMENUOPTION)
  const [bookmark, setBookmark] = useState<boolean>(false)
  const [replyCount, setReplyCount] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [open, setOpen] = useState(false);
  const [openCreator, setCreatorOpen] = useState(false);
  const [openEditor, setEditorOpen] = useState(false);
  const {user} = useSelector((state: {auth: any}) => state.auth);
  const history = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();
  const topicElement = useRef<null | HTMLDivElement>(null);;

  const handleViewComment = async ()=>{
    const {data} = await getOneComment({postId, commentId: topic.comment_id});
    setTopic({...topic, content: data.content})
  }

  const handleViewReplies = async () => {
    const {data} = await listAllCommentReplies({postId, commentId: topic.comment_id});
    setComments(data);
    setReplyCount(data.length);
  };

  const handleCreatorToggle = (isExpaned: boolean) => {
    setCreatorOpen(isExpaned);
  };

  const handleEditorToggle = (isExpaned: boolean) => {
    if (!order) {
      // Navigate to Edit page
      history(`/post/${postId}/edit`);
    } else {
      setEditorOpen(isExpaned);
    }
  };

  const handleEditorReload = async(isLoading: boolean) => {
    if (!isLoading) {
      await handleViewComment();
    }
    setIsLoading(isLoading);
  }

  const handleCreateReload = async (isLoading: boolean) => {
    if (!isLoading) {
      if (!order) {
        EventBus.publish(BlockEventType.CreateNewComment);
      } else {
        await handleViewReplies();
      }
    }
    setOpen(true);
    setIsLoading(isLoading);
  };

  const handleDeleteReload = async (isLoading: boolean) => {
    if (!isLoading) {
      await handleViewReplies();
    }
    setOpen(true);
    setIsLoading(isLoading);
  };

  const openDeleteConfirmModal = async () => {
    setIsLoading(true);
    await deleteOneComment({postId: topic.post_id, commentId: topic.comment_id});
    // Refresh
    if (!ancestor.length) {
      EventBus.publish(BlockEventType.DeleteComment);
    } else {
      await handleViewReplies();
      onDeleteReply();
    }
    setIsLoading(false);
  };

  const openHideConfirmModal = async () => {
    setIsLoading(true);
    const isHidden = !topic.hidden
    console.log(isHidden)
    const reqBody = {hidden: isHidden}
    try {
      if (topic.comment_id) {
        await updateOneCommentHide(postId, topic.comment_id, reqBody)
      } else {
        await updateOnePostHide(postId, reqBody)
      }
      // Refresh
      set(topic, 'hidden', isHidden)
      setTopic(topic)
      configActionOptions({hidden: isHidden, closed: topic.closed})

    } catch(e) {
      console.error(e)
    } finally {
      setIsLoading(false);
    }
  };

  const openCloseConfirmModal = async () => {
    setIsLoading(true);
    const isClosed = !topic.closed
    const reqBody = {closed: isClosed}
    await updateOnePostClose(postId, reqBody);
    // Refresh
    set(topic, 'closed', isClosed)
    setTopic(topic)
    configActionOptions({hidden: topic.hidden, closed: isClosed})

    setIsLoading(false);
  };

  const onViewReplyClick = () => {
    if (!open) {
      handleViewReplies();
    }
    setOpen(!open);
  };

  const onLikeClick = async () => {
    if(!user) {
      return
    }
    const reqBody = {post_id: postId, user_id: user._id, comment_id: topic.comment_id};
    const {data} = await updateOneLike(reqBody);
    setLike({isLiked: true, total: data});
  };

  const onUnlikeClick = async () => {
    if(!user) {
      return
    }
    const reqBody = {post_id: postId, user_id: user._id, comment_id: topic.comment_id};
    const {data} = await updateOneUnlike(reqBody);
    setLike({isLiked: false, total: data});
  };

  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value=text;
    document.body.appendChild(textArea);
    textArea.focus();textArea.select();
    try{
      document.execCommand('copy')
    }catch(err){
      console.error('Unable to copy to clipboard',err)
    }
    document.body.removeChild(textArea)
  };

  const copyToClipboard = (level: string) => {
    const targetAchorUrl = `${window.location.origin}/#/post/${postId}#${level}`
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(targetAchorUrl);
    } else {
      unsecuredCopyToClipboard(targetAchorUrl);
    }
    EventBus.publish(BlockEventType.ShowSnackbarMessage, {message: 'Copied to clipboard!', type: null});
  };

  const onBookmarkClicked =  async ()=>{
    const isAddedToBookMark = bookmark
    const reqBody: UpdateBookmarkRequestBody = {
      action: isAddedToBookMark ? BookmarkAction.Remove: BookmarkAction.Add,
      post: postId
    }
    try {
      const resp = await updateOneBookmarks(reqBody)
      setBookmark(!bookmark)
      EventBus.publish(BlockEventType.ShowSnackbarMessage, {message: 'Bookmark is '+ (isAddedToBookMark ? BookmarkAction.Remove: BookmarkAction.Add), type: null});

    } catch(e) {
      EventBus.publish(BlockEventType.ShowSnackbarMessage, {message: e, type: 'error'});
    }
  }

  const configActionOptions = ({hidden, closed})=>{
    const newPopperMenuOptions = cloneDeep(POPPERMENUOPTION)
    const isAuthor = topic.author.author_id === (user && user._id)
    const isPost = !order? true: false
    for (const option of newPopperMenuOptions) {
      switch (option.key) {
        case MenuKey.Hide:
          option.hidden = false
          option.label = hidden? 'Show': 'Hide'
          option.onClick = openHideConfirmModal.bind(this)
          break;
        case MenuKey.Close:
          option.hidden = order? true: false
          option.label = closed? 'Open to Reply': 'Close'
          option.onClick = openCloseConfirmModal.bind(this)
          break;
        case MenuKey.Edit:
          option.hidden = !isAuthor
          option.onClick = handleEditorToggle.bind(this)
          break;
        case MenuKey.Delete:
          option.hidden = !(isAuthor && !isPost)
          option.onClick = openDeleteConfirmModal.bind(this)
          break;
        default:
          break;
      }
    }
    setPopperMenuOptions(newPopperMenuOptions)
  }

  useEffect(() => {
    if (!topicElement.current || !document) {
      return;
    }

    const url = window.location.href
    const anchorId = url.substring(url.lastIndexOf("#") + 1, url.length);

    if(anchorId === [...ancestor, order].join('-')){
      setTimeout(()=>{
        topicElement.current?.scrollIntoView({ behavior: "smooth" });
      }, 1000)
    }


  }, [])

  useEffect(() => {
    dispatch(saveViewHistory(postId))
    if (topic.likes) {
      setLike({isLiked: topic.likes.some(({user_id}) => user_id === (user && user._id)), total: topic.likes.length});
    }
    setReplyCount(topic.reply_count);
    configActionOptions({hidden: topic.hidden, closed: topic.closed})
  }, [info]);

  return (
    <Row className="Topic" id={[...ancestor, order].join('-')} ref={topicElement}>
      <Backdrop
        className="backdrop"
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={isLoading}
        // onClick={handleClose}
      >
      <CircularProgress color="inherit" />
      </Backdrop>
      <div className="body">
        <div className="heading">
          <div className="meta">
            <div className="avator">
              <Avatar  sx={{ height: '48px', width: '48px' }} alt={topic.author.username} src={topic.author.avatar} />
            </div>

            <div className="auth">
              <div className="name">
                <span className="role">
                  <span>{topic.author ? (topic.author.username  || 'Anonymous') : ''}</span>
                </span>
                <span className='private-icon'>
                  {(topic.access === CommentAccess.Private && get(topic, 'author.username')?
                    <Tooltip title={CommentAccess.Private}>
                      <LockIcon/>
                    </Tooltip>
                    : '')}
                </span>
                <span className="hidden">
                  {topic.hidden &&
                    (<Tooltip title='Hidden'>
                      <VisibilityOffIcon/>
                    </Tooltip>)
                  }
                </span>
              </div>
              <div className="datetime">
                <Moment format="YYYY/MM/DD">{topic.create_time}</Moment>
                {topic.create_time !== topic.edit_time ? (
                  <span>
                    {'  ('}
                    <Moment format="YYYY/MM/DD">{topic.edit_time}</Moment>
                    {' edited)'}
                  </span>
                ) : null}
              </div>
            </div>
            {topic.access === CommentAccess.Private && !topic.author? `(${CommentAccess.Private})`: null}
          </div>
          <div className="corner">
            {order ? <div className="order">#{[...ancestor, order].join('-')}</div> : null}
            {user && !popperMenuOptions.every(({hidden})=>hidden)? <PopperMenu options={popperMenuOptions}></PopperMenu> : null}
          </div>
        </div>
        {
          !order || topic.access === CommentAccess.Public || (topic.access === CommentAccess.Private && get(topic, 'author.username'))? (
          <div className='content'>
            <div className="cooked">
              {openEditor ? (
                <CommentEditor
                  isPatch={true}
                  info={topic}
                  onToggle={handleEditorToggle}
                  onReload={handleEditorReload}
                ></CommentEditor>
              ) : (

                // renderHTML(topic.content)
                <div dangerouslySetInnerHTML={{ __html: topic.content }}></div>
              )}
            </div>
            <div className="cover">
              <img src={topic.cover}/>
            </div>
            <section className="menu-area">
              <nav className="controls">
                <div className="statistic">
                  <Stack direction="row" spacing={2}>
                    <Item elevation={0}>
                      <Tooltip title="Total reply">
                        <IconButton component="span" size="small">
                          <ModeCommentIcon />
                          <span className="count">{replyCount}</span>
                        </IconButton>
                      </Tooltip>
                    </Item>
                    {!order ? (
                      <Item elevation={0}>
                        <Tooltip title="Views">
                          <IconButton component="span" size="small">
                            <VisibilityIcon />
                            <span className="count">{topic.views}</span>
                            </IconButton>
                      </Tooltip>
                      </Item>
                    ) : null}
                    <Item elevation={0}>
                      {like.isLiked ? (
                        <Tooltip title="Unlike">
                          <IconButton component="span" size="small" disableRipple={!user} onClick={onUnlikeClick}>
                            <FavoriteIcon />
                            <span className="count">{like.total}</span>
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Give like">
                          <IconButton component="span" size="small" disableRipple={!user} onClick={onLikeClick}>
                            <FavoriteBorderIcon />
                            <span className="count">{like.total}</span>
                          </IconButton>
                        </Tooltip>
                      )}
                    </Item>
                    {order && replyCount ? (
                      <Button variant="link" onClick={onViewReplyClick} aria-expanded={open} aria-controls="collapseID">
                        view {replyCount} replies
                      </Button>
                    ) : null}
                  </Stack>
                </div>
                <div className="actions">
                  <Stack direction="row" spacing={2}>
                    <Item elevation={0}>
                      <Tooltip title="Share link">
                        <IconButton component="span" size="small" onClick={()=>copyToClipboard([...ancestor, order].join('-'))}>
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                    </Item>
                    { user && (
                      <>
                        {!order && (<Item elevation={0}>
                          <Tooltip title={bookmark? "Remove bookmark": "Add to bookmark"}>
                            <IconButton component="span" size="small" onClick={onBookmarkClicked}>
                              <BookmarksIcon color={bookmark? 'error': undefined} />
                            </IconButton>
                          </Tooltip>
                        </Item>)}
                        {!topic.closed &&
                          (<Item elevation={0}>
                            <Button
                              variant="primary"
                              onClick={() => setCreatorOpen(!openCreator)}
                              aria-expanded={open}
                              aria-controls="editorID"
                            >
                              Reply
                            </Button>
                          </Item>)}
                      </>)
                    }
                  </Stack>
                </div>
              </nav>
            </section>
            {topic.closed && <section className="topicClosed">
              This topic is CLOSED
            </section>}
          </div>
          ): (
            <div className='content private'>
              {CommentAccess.Private}
            </div>
          )
        }
      </div>
      <Collapse in={openCreator}>
        <div
          id="editorID"
          style={{
            textAlign: 'justify'
          }}
        >
          <CommentEditor
            isPatch={false}
            info={topic}
            onToggle={handleCreatorToggle}
            onReload={handleCreateReload}
          ></CommentEditor>
        </div>
      </Collapse>
      <Collapse in={open}>
        <div
          id="collapseID"
          style={{
            textAlign: 'justify'
          }}
        >
          <div className="comment-stream">
            {comments.map((item, i) => {
              return (
                <Topic
                  key={i}
                  info={item}
                  ancestor={[...ancestor, order]}
                  order={comments.length - i}
                  onDeleteReply={handleDeleteReload}
                ></Topic>
              );
            })}
          </div>
        </div>
      </Collapse>
    </Row>
  );
};

export default Topic;
