import {useParams} from 'react-router-dom';
import PostContent from './PostContent/PostContent';
import './Offer.scss';

const Offer = () => {
  const {offerId} = useParams<{offerId: string}>() as {offerId: string};
  return (
    <section>
      <PostContent key={'post_content' + offerId}></PostContent>
    </section>
  );
};

export default Offer;
