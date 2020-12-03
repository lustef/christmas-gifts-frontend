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
      console.log(error);
    }
  };

  const handleDraw = async () => {
    let allIds = users.map(({ id }) => id);
    const usersAfterDraw = users.map((user) => {
      delete user.giftReceiver;
      return user;
    });
    users.forEach((user) => {
      const whoCanGetUser = usersAfterDraw.filter((userToCheck) => {
        const IdsToExclude = userToCheck.toExclude
          ? [...userToCheck.toExclude, userToCheck.id]
          : [userToCheck.id];
        const withoutExcluded = allIds.filter(
          (inAllId) => !IdsToExclude.includes(inAllId)
        );
        return withoutExcluded.includes(user.id);
      });
      const reversed = Math.random() > 0.5;
      let canGiveUser = reversed
        ? whoCanGetUser.reverse().find((can) => can.giftReceiver === undefined)
        : whoCanGetUser.find((can) => can.giftReceiver === undefined);
      if (!canGiveUser) {
        const userToExclude = user.toExclude
          ? [...user.toExclude, user.id]
          : [user.id];

        const userWithoutExcluded = allIds.filter(
          (inAllId) => !userToExclude.includes(inAllId)
        );
        const finallySearch = whoCanGetUser.find((z) =>
          userWithoutExcluded.includes(z.giftReceiver)
        );
        user.giftReceiver = finallySearch.giftReceiver;
        canGiveUser = finallySearch;
      }
      canGiveUser.giftReceiver = user.id;
    });
    const updateAdmin = {
      ...logged,
      giftReceiver: usersAfterDraw.find((toFind) => toFind.id === logged.id)
        .giftReceiver,
    };
    setLogged(updateAdmin);
    await Promise.all(
      usersAfterDraw.map((user) => {
        fetch(`${getContext()}/user/${user.id}/update`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...user,
            room: logged.room,
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
