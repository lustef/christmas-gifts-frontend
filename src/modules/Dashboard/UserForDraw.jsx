import { Button, Input, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';

export const UserForDraw = ({
  user: { username, toExclude },
  setUsers,
  users,
}) => {
  const handleDeleteUser = () => {
    setUsers((prev) => prev.filter((pUser) => pUser.username !== username));
  };
  const [usersToExclude, setUsersToExclude] = useState(toExclude || []);

  const handleChange = async (event) => {
    setUsersToExclude(event.target.value);
    setUsers((prev) => {
      const current = prev.findIndex((u) => u.username === username);
      prev[current].toExclude = event.target.value;
      return prev;
    });
  };

  return (
    <div className='Admin__User'>
      <p>{username}</p>
      <div className='Admin__exclude'>
        <p>Wyklucz:</p>
        <div className='Admin__exclude__select'>
          <Select
            multiple
            value={usersToExclude}
            onChange={handleChange}
            variant='outlined'
            input={<Input />}
            fullWidth
          >
            {users
              .filter((u) => u.username !== username)
              .map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.username}
                </MenuItem>
              ))}
          </Select>
        </div>
      </div>
      <Button
        color='primary'
        onClick={handleDeleteUser}
        variant='outlined'
        size='small'
      >
        Usuń
      </Button>
    </div>
  );
};
