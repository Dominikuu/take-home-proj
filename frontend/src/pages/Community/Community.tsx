import './Community.scss';
import Announcements from './Announcements/Announcements';
import Categories from './Categories/Categories';
import FeatureTopics from './Feature-topics/Feature-topics';

const Community = () => (
    <section className='Community'>
      <Announcements></Announcements>
      <Categories></Categories>
      <FeatureTopics></FeatureTopics>
    </section>
);

export default Community;
