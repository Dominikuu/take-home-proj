import {Row} from 'react-bootstrap';
import {Divider} from 'lib/mui-shared';
import FileUpload from './FileUpload/FileUpload';
import Visualization from './Visualization/Visualization';
import PostTable from './Feature-topics/Feature-topics';
import './Statistic.scss';

const Statistic = () => {
  return (
    <>
      <section style={{display: 'block'}}>
        <Row>
          <FileUpload />
        </Row>
        <Divider />
        <Row>
          <PostTable />
        </Row>
        <Row>
          <Visualization />
        </Row>
      </section>
    </>
  );
};

export default Statistic;
