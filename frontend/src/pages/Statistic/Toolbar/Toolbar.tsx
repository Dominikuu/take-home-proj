import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import Button from '@material-ui/core/Button';
// import { useHistory  } from 'react-router-dom'
import './Toolbar.scss';

const Toolbar = (props) => {
  // const history = useHistory();
  const directToCreatePost = () => {
    // history.push(`/products/point-to-point`);
    console.log('test');
    // history.push(`/posts/create`);
    // /products/point-to-point
  };
  return (
    <Container fluid className="toolbar-section">
      <Button variant="outlined" color="secondary" onClick={directToCreatePost}>
        Create New Topic
      </Button>
      {/* <Particle />
    <h1 className="project-heading">
      Professional <strong className="purple">Skillset </strong>
    </h1>

    <Techstack />

    <h1 className="project-heading">
      <strong className="purple">Tools</strong> I use
    </h1>
    <Toolstack /> */}

      {/* <Github /> */}
    </Container>
  );
};

export default Toolbar;
