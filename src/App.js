import { useState, useCallback } from 'react';
import './App.css';
import LoginPage from './modules/Login';
import DashboardPage from './modules/Dashboard';

export const pages = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
};

function App() {
  const [page, setPage] = useState(pages.LOGIN);
  const [logged, setLogged] = useState('');

  const switchPages = useCallback(() => {
    switch (page) {
      case pages.LOGIN: {
        return <LoginPage setLogged={setLogged} setPage={setPage} />;
      }
      case pages.DASHBOARD: {
        return (
          <DashboardPage
            setPage={setPage}
            setLogged={setLogged}
            logged={logged}
          />
        );
      }
      default:
        return null;
    }
  }, [page]);
  return <div className='Container'>{switchPages()}</div>;
}

export default App;
