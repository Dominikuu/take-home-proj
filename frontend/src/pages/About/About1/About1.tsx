import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
// import Particle from "../Particle";
// import Github from "./Github";
// import Aboutcard from "./AboutCard";
// import laptopImg from "../../Assets/about.png";
import GreetingLottie from '../../DisaplayLottie';
import './About1.scss';
import Card from 'react-bootstrap/Card';
import code from '../../../assets/lottie/developer-about.json';
import {ImPointRight} from 'react-icons/im';

const About1 = () => (
  <Container fluid className="about1-section">
    {/* <Particle /> */}
    <Container>
      <Row style={{justifyContent: 'center', padding: '10px'}}>
        <Col className="about-card" md={7}>
          <h1 style={{fontSize: '2.1em', paddingBottom: '20px'}}>
            Know Who <strong className="purple">I'M</strong>
          </h1>
          <Card className="quote-card-view">
            <Card.Body>
              <blockquote className="blockquote mb-0">
                <p style={{textAlign: 'justify'}}>
                  Hi Everyone, I am <span className="purple">Dominique Chen </span>
                  from <span className="purple"> Taipei, Taiwan.</span>
                  <br />I am a web developer who is inclined to front-end.
                  <br />
                  <br />
                  Apart from coding, some other activities that I love to do!
                </p>
                <ul>
                  <li className="about-activity">
                    <ImPointRight /> Playing Badminton
                  </li>
                  <li className="about-activity">
                    <ImPointRight /> Writting Tech Blogs
                  </li>
                  <li className="about-activity">
                    <ImPointRight /> Travelling
                  </li>
                </ul>

                <p style={{marginBlockEnd: 0, color: 'rgb(155 126 172)'}}>
                  "Strive to build things that make a difference!"{' '}
                </p>
              </blockquote>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5} className="about-img">
          <GreetingLottie animationData={code} />
        </Col>
      </Row>
    </Container>
  </Container>
);
export default About1;
