import React, { useEffect, useState } from 'react';
import { getContext } from '../../utils';

export const GiftedReceiver = ({ logged: { giftReceiver } }) => {
  const [receiver, setReceiver] = useState(null);

  const getDesire = async (giftReceiverName) => {
    try {
      const res = await fetch(`${getContext()}/user/${giftReceiverName}`);
      const giftReceiver = await res.json();
      setReceiver(giftReceiver);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (giftReceiver) {
      getDesire(giftReceiver);
    }
  }, [giftReceiver]);

  return (
    receiver && (
      <div className='Logged__gift__receiver'>
        <div>
          <strong>Wylosowano:</strong> {receiver.username}
        </div>
        <div>
          <strong>Czego pragnie:</strong> {receiver.desire}
        </div>
      </div>
    )
  );
};
