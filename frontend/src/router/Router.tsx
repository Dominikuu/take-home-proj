import Home from 'pages/Home/Home';
import PostList from 'pages/Post-list/Post-list';
import CreatePost from 'pages/Create-post/Create-post';
import OfferList from 'pages/OfferList/OfferList'
// import {PointToPoint, Software} from 'pages';

// interface RouteWithSubRoutesPropsI {
//   route: RouteI;
// }

// export function RouteWithSubRoutes(props: RouteWithSubRoutesPropsI): JSX.Element {
//   const {route} = props;
//   console.log(props);

//   return route.isPrivate ? (
//     <PrivateRoute path="/privateHome" component={Home} isAuthenticated />
//   ) : (
//     <Route
//       path={route.path}
//       render={(renderProps): JSX.Element => {
//         return <route.Component routeComponentProps={renderProps} routes={route.routes} />;
//       }}
//     />
//   );
// }

// export interface RouteComponentPropsI {
//   routeComponentProps: RouteComponentProps;
//   routes?: RouteI[];
//   route: any;
// }

// export interface RouteI {
//   [x: string]: IntrinsicAttributes & RouteComponentPropsI;
//   route: IntrinsicAttributes & RouteComponentPropsI;
//   path: string;
//   Component: (props: RouteComponentPropsI) => JSX.Element;
//   breadcrumbName: string;
//   routes?: RouteI[];
//   isPrivate?: boolean;
// }

export const MENU_CONFIG: {[key: string]: any} = {
  // products: {
  //   path: '/products',
  //   Component: Home,
  //   breadcrumbName: 'Products',
  //   routes: [
  //     {
  //       path: '/products/point-to-point',
  //       Component: PointToPoint,
  //       breadcrumbName: 'Point to Point'
  //     },
  //     {
  //       path: '/products/point-to-multipoint',
  //       Component: Home,
  //       breadcrumbName: 'Point to MultiPoint'
  //     },
  //     {
  //       path: '/products/wifi',
  //       Component: Home,
  //       breadcrumbName: 'Wi-Fi'
  //     },
  //     {
  //       path: '/products/antenna',
  //       Component: Home,
  //       breadcrumbName: 'Antenna'
  //     },
  //     {
  //       path: '/products/accessories',
  //       Component: Home,
  //       breadcrumbName: 'Accessories'
  //     },
  //     {
  //       path: '/products/software',
  //       Component: Software,
  //       breadcrumbName: 'Software'
  //     }
  //   ]
  // },
  // supports: {
  //   path: '/supports',
  //   Component: Home,
  //   breadcrumbName: 'Supports',
  //   routes: [
  //     {
  //       path: '/supports/contact',
  //       Component: Home,
  //       breadcrumbName: 'Contact Us'
  //     },
  //     {
  //       path: '/supports/application-case',
  //       Component: Home,
  //       breadcrumbName: 'Application Cases'
  //     },
  //     {
  //       path: '/supports/training',
  //       Component: Home,
  //       breadcrumbName: 'Trainning'
  //     },
  //     {
  //       path: '/supports/rma',
  //       Component: Home,
  //       breadcrumbName: 'RMA'
  //     },
  //     {
  //       path: '/supports/download',
  //       Component: Home,
  //       breadcrumbName: 'Download'
  //     }
  //   ]
  // },
  offer: {
    path: '/',
    Component: OfferList,
    breadcrumbName: 'Community',
    routes: []
  },
  topics: {
    path: '/posts',
    Component: PostList,
    breadcrumbName: 'Topics',
    showOnlyFooter: true,
    routes: [
      {
        path: '/posts',
        Component: PostList,
        breadcrumbName: 'Topics'
      },
      {
        path: '/posts/create',
        Component: CreatePost,
        breadcrumbName: 'News'
      },
      {
        path: '/company/community',
        Component: Home,
        breadcrumbName: 'Community'
      },
      {
        path: '/company/career',
        Component: Home,
        breadcrumbName: 'Careers'
      }
    ]
  }
};

export const ROUTES: any[] = [
  ...Object.values(MENU_CONFIG)
];
