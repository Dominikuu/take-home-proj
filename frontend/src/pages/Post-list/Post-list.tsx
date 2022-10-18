import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import PostTable from '../Community/Feature-topics/Feature-topics';
import Sidebar from 'common/Sidebar/Sidebar';
import './Post-list.scss';

const PostList = () => {
  return (
    <section>
      <Sidebar />
      <PostTable />
    </section>
  );
};

export default PostList;
