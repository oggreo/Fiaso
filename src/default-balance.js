import { uuid } from './utils.js';

export default {
  name: 'fiaso',
  cards: [
    {
      name: 'My Bank',
      currency: 'USD',
      id: uuid(),
      history: [
        {
          dayMonthYear: [17, 8, 2021],
          hourMinSec: [20, 27, 17],
          timeStamp: 1634585455960,
          amount: 10,
        },
        {
          dayMonthYear: [17, 8, 2021],
          hourMinSec: [20, 27, 17],
          timeStamp: 1634585455989,
          amount: 1000,
        },
      ],
    },
    {
      name: 'My Wallet',
      currency: 'JPY',
      id: uuid(),
      history: [
        {
          dayMonthYear: [9, 7, 2021],
          hourMinSec: [20, 27, 17],
          amount: 1000,
          timeStamp: 1634585455989,
        },
      ],
    },
  ],
};
