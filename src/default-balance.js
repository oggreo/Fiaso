import { uuid } from './utils.js';

export default {
  name: 'fiaso',
  userId: null,
  cards: [
    {
      name: 'My Bank',
      currency: 'GBP',
      id: uuid(),
      history: [
        {
          dayMonthYear: [17, 8, 2021],
          hourMinSec: [20, 27, 17],
          timeStamp: 1634585455960,
          amount: 234,
        },
        {
          dayMonthYear: [17, 8, 2021],
          hourMinSec: [20, 27, 17],
          timeStamp: 1634585455989,
          amount: 123,
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
          amount: 1,
          timeStamp: 1634585455989,
        },
      ],
    },
  ],
};
