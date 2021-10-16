import { uuid } from './utils.js';

export default {
  name: 'fiaso',
  cards: [
    {
      name: 'My Bank',
      currency: 'USD',
      id: uuid(),
      amount: 1000,
    },
    {
      name: 'My Wallet',
      currency: 'JPY',
      id: uuid(),
      amount: 20000,
    },
  ],
};
