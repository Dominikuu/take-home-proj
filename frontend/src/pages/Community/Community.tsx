import React from 'react';
import {Col, Row, Button} from 'react-bootstrap';
import {renderRoutes, matchRoutes} from 'react-router-config';
import Product1 from 'assets/img/TopPage_1_Product.svg';
import Product2 from 'assets/img/TopPage_2_Product.png';
import Product3 from 'assets/img/TopPage_3_Product.svg';
import Product41 from 'assets/img/TopPage_4_Product-01.svg';
import Product42 from 'assets/img/TopPage_4_Product-02.svg';
import Product5 from 'assets/img/TopPage_5_Product.svg';
import './Community.scss';
import Announcements from './Announcements/Announcements';
import Categories from './Categories/Categories';
import FeatureTopics from './Feature-topics/Feature-topics';

const Community = () => (
    <section className='Community'>
      <Announcements></Announcements>
      <Categories></Categories>
      <FeatureTopics></FeatureTopics>
    </section>
);

export default Community;
