import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
// import Particle from "../Particle";
// import Github from "./Github";
import Particle from '../../Particle';
import Techstack from '../TechStack';
// import Aboutcard from "./AboutCard";
// import laptopImg from "../../Assets/about.png";
import Toolstack from '../ToolStack';
import './About2.scss';

const About2 = () => (
  <Container fluid className="about2-section">
    <Particle />
    <h1 className="project-heading">
      Professional <strong className="purple">Skillset </strong>
    </h1>

    <Techstack />

    <h1 className="project-heading">
      <strong className="purple">Tools</strong> I use
    </h1>
    <Toolstack />

    {/* <Github /> */}
  </Container>
);

export default About2;
