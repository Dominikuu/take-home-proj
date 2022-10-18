
import {useState, useEffect} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from 'common/Navigation/Navbar';
import Footer from 'common/Footer/Footer';
import Preloader from 'common/Preloader/preloader';
import DialogProvider from 'common/Dialog/DialogProvider';
import {PrivatedRoutes} from 'router/PrivateRoute';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'App.scss';
import 'style.css';
import * as Page from 'pages';

export enum Role {
  Admin = 'ADMIN',
  Guest = 'GUEST',
  Member = 'MEMBER'
}

const THEME = createTheme({
  typography: {
   fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
   "fontSize": 14,
   "fontWeightLight": 300,
   "fontWeightRegular": 400,
   "fontWeightMedium": 500
  },
});

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  // const isLocalhost = Boolean(
  //   window.location.hostname === 'localhost' ||
  //     // [::1] is the IPv6 localhost address.
  //     window.location.hostname === '[::1]' ||
  //     // 127.0.0.1/8 is considered localhost for IPv4.
  //     window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  // );
  return (
    <ThemeProvider theme={THEME}>
      <Router>
        <div className="App" id={load ? 'no-scroll' : 'scroll'}>
        <Preloader load={load} />
          <Navbar />
          <DialogProvider>
            <Routes>
              <Route path="/" element={<Page.OfferList />} />
              <Route path="/offers" element={<Page.OfferList />} />
              <Route path="/offer/:offerId" element={<Page.Post />} />
              <Route path="/offer/:offerId" element={<Page.Post />} />
              <Route path="*" element={<Page.NotFound />} />
            </Routes>
          </DialogProvider>
          <Footer />
        </div>
      </Router>

    </ThemeProvider>
  );
}

export default App;
