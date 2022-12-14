import React from 'react';
import fb from 'assets/img/fb_icon.svg';
import ig from 'assets/img/IG_icon.svg';
import twitter from 'assets/img/Twitter_icon.svg';
import linkedin from 'assets/img/in_icon.svg';
import {MENU_CONFIG} from 'router/Router';
import './Footer.scss';

const Footer = () => {
  return (
    <div className="footer-container footer">
      <div className="row">
        <div className="col-md-7 footer-menu">
          <div className="row">
            {Object.values(MENU_CONFIG || {}).map(({path, routes, breadcrumbName}, idx) => (
              <div className="col-md-3" key={idx}>
                <h4 className="widget-title">{breadcrumbName}</h4>
                <ul>
                  {routes?.map(({breadcrumbName: subBreadcrumbName, path: subpath}, subIdx) => (
                    <li key={subIdx}>
                      <a href={path + subpath}>{subBreadcrumbName}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-5 col-md-12 footer-contact">
          <div className="contact">
            <h4 className="widget-title">Follow us</h4>
          </div>
          <p className="social-icons">
            <a href="/" target="_blank" rel="noreferrer">
              <img src={fb} alt="fb" />
            </a>
            <a href="/" target="_blank" rel="noreferrer">
              <img src={ig} alt="ig" />
            </a>
            <a href="/" target="_blank" rel="noreferrer">
              <img src={twitter} alt="twitter" />
            </a>
            <a href="/" target="_blank" rel="noreferrer">
              <img src={linkedin} alt="linkedin" />
            </a>
          </p>
        </div>
      </div>
      <div className="copy-right">
        <p className="text-center">Copyright © 2021 Unitik Technology Co., LTD. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
