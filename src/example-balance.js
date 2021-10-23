import { uuid } from './utils.js';

export default {
  cards: [
    {
      name: 'Example Bank',
      currency: 'GBP',
      id: uuid(),
      history: [
        {
          dayMonthYear: [17, 8, 2021],
          hourMinSec: [20, 27, 17],
          timeStamp: 1634585455960,
          amount: 100,
        },
      ],
    },
  ],
};
