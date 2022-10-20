import {Col, Row} from 'react-bootstrap';
import Product1 from 'assets/img/TopPage_1_Product.svg';
import Product2 from 'assets/img/TopPage_2_Product.png';
import Product3 from 'assets/img/TopPage_3_Product.svg';
import Product41 from 'assets/img/TopPage_4_Product-01.svg';
import Product42 from 'assets/img/TopPage_4_Product-02.svg';
import Product5 from 'assets/img/TopPage_5_Product.svg';
import './Home.scss';

const Home = () => (
  <div className="page uop-home">
    <section className="section1">
      <Row>
        <Col xs={12} md={6} className="photo-panel">
          <img src={Product1} alt="product1"/>
        </Col>
        <Col xs={12} md={6}>
          <h1 className="title">High-Performance</h1>
          <h1 className="title">Simple Installation</h1>
          <h1 className="title">Stable Connection</h1>
          <h1 className="title">Enterprise Wireless Equipment</h1>
        </Col>
      </Row>
    </section>
    <section className="full-window">
      <Row>
        <Col xs={12} md={12} className="photo-panel">
          <h1 className="title">High-Performance</h1>
          <p className="ft-16 grey">A true multi-application network operating system</p>
        </Col>
        <Col xs={12} md={12} className="photo-panel">
          <img alt="product5" src={Product2} />
        </Col>
        <Col xs={12} md={12}>
          <p className="ft-16 grey">
            Powerful management on business networking online on each device status, traffic, activities, signal,
            connection all in one utilities tool.
          </p>
          <div style={{textAlign: 'right'}}>
            <a href="#/products/wifi" className="learn-more">
              {'Learn more >>'}
            </a>
          </div>
        </Col>
      </Row>
    </section>
    <section className="section3">
      <Row>
        <Col xs={12} md={6}>
          <h1 className="title">PTP Backhaul Solutions</h1>
          <p className="ft-16 grey">60GHz Outdoor Wireless Point-to-Point Bridge</p>
          <div style={{textAlign: 'right'}}>
            <a href="#/products/point-to-point" className="learn-more">
              {'Learn more >>'}
            </a>
          </div>
        </Col>
        <Col xs={12} md={6} className="photo-panel">
          <img alt="product5" src={Product3} />
        </Col>
      </Row>
    </section>
    <section className="section4 fold">
      <Row>
        <Col xs={12} md={6} className="left-panel">
          <Row>
            <Col xs={12} md={6} className="photo-panel">
              <img alt="product5" src={Product41} />
            </Col>
            <Col xs={12} md={6} className="photo-panel">
              <h1 className="title">ISP and WISP Solutions</h1>
              <div style={{textAlign: 'right'}}>
                <a href="#/products/antenna" className="learn-more">
                  {'Learn more >>'}
                </a>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6} className="right-panel">
          <Row>
            <Col xs={12} md={6} className="photo-panel">
              <img alt="product5" src={Product42} />
            </Col>
            <Col xs={12} md={6} className="photo-panel">
              <h1 className="title">Point-to-Multipoint Access Solutions</h1>
              <div style={{textAlign: 'right'}}>
                <a href="#/products/point-to-multipoint" className="learn-more">
                  {'Learn more >>'}
                </a>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
    <section className="section5">
      <Row>
        <Col xs={12} md={6} className="photo-panel">
          <img alt="product5" src={Product5} />
        </Col>
        <Col xs={12} md={6}>
          <h1 className="title">Business Solutions</h1>
          <p className="ft-16 grey">Increase productivity with products built for your business or home office</p>
          <div style={{textAlign: 'right'}}>
            <a href="/" className="learn-more">
              {'Learn more >>'}
            </a>
          </div>
        </Col>
      </Row>
    </section>
  </div>
);

export default Home;
