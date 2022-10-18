import React from 'react';
import {Col, Row} from 'react-bootstrap';
import {SiLinux, SiVisualstudiocode, SiPostman, SiHeroku, SiSwagger} from 'react-icons/si';
import ReactTooltip from 'react-tooltip';

function Toolstack() {
  return (
    <Row style={{justifyContent: 'center', paddingBottom: '50px'}}>
      <Col xs={4} md={2} className="tech-icons" data-tip="Linux">
        <SiLinux />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="VS code">
        <SiVisualstudiocode />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Postman">
        <SiPostman />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Heroku">
        <SiHeroku />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Swagger">
        <SiSwagger />
        {/* <ReactTooltip /> */}
      </Col>
    </Row>
  );
}

export default Toolstack;
