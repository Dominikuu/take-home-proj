import OfferTable from './Feature-topics/Feature-topics';
import Sidebar from 'common/Sidebar/Sidebar';
import './OfferList.scss';

const OfferList = () => {
  return (
    <section>
      <Sidebar />
      <OfferTable />
    </section>
  );
};

export default OfferList;
