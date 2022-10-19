import {useParams} from 'react-router-dom';
import PostContent from './PostContent/PostContent';
import LinkPanel from './LinkPanel/LinkPanel'
import './Offer.scss';

const Offer = () => {
  const {offerId} = useParams<{offerId: string}>() as {offerId: string};
  return (
    <section>
      <PostContent key={'post_content' + offerId}></PostContent>
      {/* <LinkPanel key={ 'link_panel'+ offerId}></LinkPanel> */}
    </section>
  );
};

export default Offer;
