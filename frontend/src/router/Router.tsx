import React, {useState} from 'react';
import {HashRouter, Route, Link} from 'react-router-dom';
import {PrivatedRoutes} from './PrivateRoute';
import Home from 'pages/Home/Home';
import PostList from 'pages/Post-list/Post-list';
import CreatePost from 'pages/Create-post/Create-post';
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
  community: {
    path: '/',
    Component: PostList,
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
  // order: {
  //   path: '/order',
  //   Component: Home,
  //   breadcrumbName: 'Order now',
  //   routes: [
  //     {
  //       path: '/order/online-store',
  //       Component: Home,
  //       breadcrumbName: 'Online Store'
  //     },
  //     {
  //       path: '/order/find-distributor',
  //       Component: Home,
  //       breadcrumbName: 'Find a Distributor'
  //     },
  //     {
  //       path: 'become-distributor',
  //       Component: Home,
  //       breadcrumbName: 'Become a Distributor'
  //     }
  //   ]
  // }
};

export const ROUTES: any[] = [
  // {
  //   path: '/',
  //   Component: Home,
  //   breadcrumbName: 'home',
  //   exact: true
  // },
  ...Object.values(MENU_CONFIG)
];

// TODO:

// export default function Router(): JSX.Element {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//     <HashRouter>
//       <div>
//         <button type="button" onClick={(): void => setIsAuthenticated(!isAuthenticated)}>
//           {isAuthenticated ? '登出' : '登入'}
//         </button>

//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/about">About</Link>
//           </li>
//           <li>
//             <Link to="/blog">Blog</Link>
//           </li>
//           <li>
//             <Link to="/privateHome">PrivateHome</Link>
//           </li>
//         </ul>

//         <hr />

//         {ROUTES.map(
//           (route): JSX.Element => (

//             <React.Fragment key={route.path}>
//               <RouteWithSubRoutes route={route} />
//             </React.Fragment>
//           )
//         )}

//         <PrivateRoute path="/privateHome" component={Home} isAuthenticated={isAuthenticated} />
//       </div>
//     </HashRouter>
//   );
// }
