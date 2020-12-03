import { Button } from '@material-ui/core';
import React from 'react';
import { pages } from '../../App';
import { Admin } from './Admin';
import { GiftedReceiver } from './GiftedReceiver';
import { LoggedUser } from './LoggedUser';
import './index.css';
const DashboardPage = ({ logged, setLogged, setPage }) => {
  const handleLogout = () => {
    setLogged(null);
    setPage(pages.LOGIN);
  };

  return (
    <div className='Logged__container'>
       <div>
        <Button color='primary' onClick={handleLogout} variant='outlined'>
          Wyloguj
        </Button>
      </div>
      <LoggedUser logged={logged} setLogged={setLogged}/>
      {logged.role === 'ADMIN' && <Admin logged={logged}/>}
      <GiftedReceiver logged={logged}/>
     
    </div>
  );
};
export default DashboardPage;
