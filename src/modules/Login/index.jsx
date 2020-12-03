import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';
import { pages } from '../../App';
import { getContext } from '../../utils';
import './index.css';
const LoginPage = ({ setLogged, setPage }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (name && password) {
      try {
        const res = await fetch(`${getContext()}/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: name,
            password,
          }),
        });
        const user = await res.json();
        console.log('file: index.jsx -> line 24 -> login -> user', user);
        if (user) {
          setLogged(user);
          setPage(pages.DASHBOARD);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form className='Form'>
      <div className='Form__inputs'>
        <TextField
          label='imię'
          required
          placeholder='imię'
          variant='outlined'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          label='hasło'
          required
          placeholder='hasło'
          variant='outlined'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div>
        <Button color='primary' onClick={login} variant='outlined'>
          Zaloguj
        </Button>
      </div>
    </form>
  );
};

export default LoginPage;
