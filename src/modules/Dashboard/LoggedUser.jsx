import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { getContext } from '../../utils';
import './index.css'
export const LoggedUser = ({ logged ,setLogged}) => {
  const [desire, setDesire] = useState(logged.desire);
  const handleSendDesire = async () => {
   try {
     const res = await fetch(`${getContext()}/user/${logged.id}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...logged,
        desire
      }),
    })
    const user = await res.json();
    if(user) {
      setDesire(user.desire)
      setLogged(user)
    }
   } catch (error) {
     console.log(error)
   }
  };
  return (
    <div >
      <p>Zalogowany: {logged.username}</p>
      <div className="Logged__desire">
        Co byś chciał?
        <TextField
          label='prezent'
          required
          variant='outlined'
          value={desire}
          onChange={(e) => {
            setDesire(e.target.value);
          }}
          size="small"
          multiline
        />
        <Button color='primary' onClick={handleSendDesire} variant='outlined' size="small">
          Wyślij
        </Button>
      </div>
    </div>
  );
};
