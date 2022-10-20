import Statistic from 'pages/Statistic/Statistic';
import OfferList from 'pages/OfferList/OfferList';

export const MENU_CONFIG: {[key: string]: any} = {
  offer: {
    path: '/',
    Component: OfferList,
    breadcrumbName: 'Offer',
    routes: []
  },
  statistic: {
    path: '/statistic',
    Component: Statistic,
    breadcrumbName: 'Statistic',
    routes: []
  }
};

export const ROUTES: any[] = [...Object.values(MENU_CONFIG)];
