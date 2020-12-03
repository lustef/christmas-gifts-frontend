import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { getContext } from '../../utils';
import { UserForDraw } from './UserForDraw';

export const Admin = ({ logged, setLogged }) => {
  const [users, setUsers] = useState(logged.room.users);
  const [newUser, setNewUser] = useState('');

  const addUser = async () => {
    try {
      const res = await fetch(`${getContext()}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUser,
          role: 'NORMAL',
          roomId: logged.room.id,
        }),
      });
      const user = await res.json();
      if (user) {
        setUsers((prev) => [...prev, user]);
        setNewUser('');
      }
    } catch (error) {
      console.log('file: Admin.jsx -> line 24 -> addUser -> error', error);
    }
  };

  const handleDraw = async () => {
    let idsToSelect = users.map(({ id }) => id);
    const usersAfterDraw = [];
    for (let i = 0; i < users.length; i++) {
      const current = users[i];
      const idsToSelectForCurrent = idsToSelect.filter(
        (id) =>
          !(current.toExclude && current.toExclude.includes(id)) ||
          current.id === id
      );
      const randomIndex = Math.floor(
        Math.random() * idsToSelectForCurrent.length
      );
      const receiverId = idsToSelectForCurrent[randomIndex];
      idsToSelect = idsToSelect.filter((id) => receiverId !== id);
      current.giftReceiver = users.find(({ id }) => id === receiverId).id;
      delete current.toExclude
      usersAfterDraw.push(current);
    }
    setLogged({
      ...logged,
      giftReceiver: usersAfterDraw.find(({id})=> id==logged.id).giftReceiver
    })
    await Promise.all(
      usersAfterDraw.map((user) => {
        fetch(`${getContext()}/user/${user.id}/update`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...user,
            room: logged.room
          }),
        });
      })
    );
  };

  return (
    <div>
      <div>
        <p>
          <strong>Losowani:</strong>
        </p>
        <div className='Admin__add__user'>
          <TextField
            label='Imię'
            required
            variant='outlined'
            value={newUser}
            onChange={(e) => {
              setNewUser(e.target.value);
            }}
            size='small'
          />
          <Button
            color='primary'
            onClick={addUser}
            variant='outlined'
            size='small'
          >
            Dodaj
          </Button>
        </div>
        <div className='Admin__users'>
          {users.map((user) => (
            <UserForDraw
              user={user}
              setUsers={setUsers}
              users={users}
              key={user.username}
            />
          ))}
        </div>
      </div>
      <Button color='primary' onClick={handleDraw} variant='outlined'>
        Losuj
      </Button>
    </div>
  );
};
