import {useParams} from 'react-router-dom';
import PostContent from './PostContent/PostContent';
import './Post.scss';

const Post = () => {
  const {postId} = useParams<{postId: string}>() as {postId: string};
  return (
    <section>
      <PostContent key={'post_content' + postId}></PostContent>
    </section>
  );
};

export default Post;
