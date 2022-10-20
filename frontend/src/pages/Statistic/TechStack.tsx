import React from 'react';
import {Col, Row} from 'react-bootstrap';
import {FaAngular, FaAws, FaDocker} from 'react-icons/fa';
import {
  DiJavascript1,
  DiReact,
  DiRedis,
  DiNodejs,
  DiHtml5,
  DiCss3,
  DiMongodb,
  DiPython,
  DiGit,
  DiPostgresql
} from 'react-icons/di';
import {SiRabbitmq, SiTypescript, SiFlask} from 'react-icons/si';
import ReactTooltip from 'react-tooltip';

function Techstack() {
  return (
    <Row style={{justifyContent: 'center', paddingBottom: '50px'}}>
      <Col xs={4} md={2} className="tech-icons" data-tip="Angular">
        <FaAngular />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Javascript">
        <DiJavascript1 />
        {/* <ReactTooltip /> */}
      </Col>

      <Col xs={4} md={2} className="tech-icons" data-tip="NodeJS">
        <DiNodejs />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Redis">
        <DiRedis />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="RabbitMQ">
        <SiRabbitmq />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="ReactJS">
        <DiReact />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="HTML5">
        <DiHtml5 />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="CSS3">
        <DiCss3 />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="PostgreSQL">
        <DiPostgresql />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="MongoDB">
        <DiMongodb />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Python">
        <DiPython />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Typescript">
        <SiTypescript />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Flask">
        <SiFlask />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Git">
        <DiGit />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="Docker">
        <FaDocker />
        {/* <ReactTooltip /> */}
      </Col>
      <Col xs={4} md={2} className="tech-icons" data-tip="AWS">
        <FaAws />
        {/* <ReactTooltip /> */}
      </Col>
    </Row>
  );
}

export default Techstack;
