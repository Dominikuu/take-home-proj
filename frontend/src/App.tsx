import {useState, useEffect} from 'react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Navbar from 'common/Navigation/Navbar';
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
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500
  }
});

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
              <Route path="/offer/:offerId" element={<Page.Offer />} />
              <Route path="/statistic" element={<Page.Statistic />} />
              <Route path="*" element={<Page.NotFound />} />
            </Routes>
          </DialogProvider>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
