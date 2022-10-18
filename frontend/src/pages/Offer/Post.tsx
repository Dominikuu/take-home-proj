import {useParams} from 'react-router-dom';
import PostContent from './PostContent/PostContent';
import LinkPanel from './LinkPanel/LinkPanel'
import './Post.scss';

const Post = () => {
  const {postId} = useParams<{postId: string}>() as {postId: string};
  return (
    <section>
      <PostContent key={'post_content' + postId}></PostContent>
      <LinkPanel key={ 'link_panel'+ postId}></LinkPanel>
    </section>
  );
};

export default Post;
