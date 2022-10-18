import React, {useState, useEffect} from 'react';
import {Col, Row, Container} from 'react-bootstrap';
import {renderRoutes, matchRoutes} from 'react-router-config';
import {useParams} from 'react-router-dom';
import Sidebar from 'common/Sidebar/Sidebar';
import {updateOneLike, updateOneUnlike, UpdateOneLike} from 'api/post/like';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import './Comment.scss';

interface Like {
  isLiked: boolean;
  total: number;
}

const Comment = ({info}) => {
  const [like, setLike] = useState<Like>({isLiked: false, total: 0});
  const {postId} = useParams<{postId: string}>();
  const onLikeClick = async () => {
    const reqBody: UpdateOneLike.RequestBody = {post_id: postId as string, user_id: '', comment_id: info.comment_id};
    const {data} = await updateOneLike(reqBody);
    setLike({isLiked: true, total: data});
  };
  const onUnlikeClick = async () => {
    const reqBody: UpdateOneLike.RequestBody = {post_id: postId as string, user_id: '', comment_id: info.comment_id};
    const {data} = await updateOneUnlike(reqBody);
    setLike({isLiked: false, total: data});
  };
  useEffect(() => {
    if (info.likes) {
      setLike({isLiked: info.likes.some(({user_id}) => user_id), total: info.likes.total});
    }
  }, [info]);
  return (
    <Row className="Comment">
      <div className="avator"></div>
      <div className="body">
        <div className="content">
          <div className="cooked">{info.content}</div>
          <section className="menu-area">
            <nav className="controls">
              <div className="actions">
                <button>{info.likes}</button>
                <button>Share link</button>
                <button>Bookmark</button>
              </div>
            </nav>
          </section>
        </div>
      </div>
    </Row>
  );
};

export default Comment;
