import './LinkPanel.scss';
import ViewHistory from './ViewHistory/ViewHistory'
import Related from './Related/Related'

const LinkPanel = () => {
  return (
    <div className="LinkPanel">
      <div className="sticky-container">
        <ViewHistory/>
        <Related/>
      </div>
    </div>
  );
};

export default LinkPanel;
