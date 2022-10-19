import Sidebar from 'common/Sidebar/Sidebar';
import FileUpload from './FileUpload/FileUpload'
import PostTable from './Feature-topics/Feature-topics';
import './Statistic.scss';

const Statistic = () => {
  return (
    <section>
      <FileUpload/>
      <Sidebar />
      <PostTable />
    </section>
  );
};

export default Statistic;
