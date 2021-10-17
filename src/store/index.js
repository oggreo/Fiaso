import { createStore } from 'vuex';
import defaultBalance from '../default-balance';
import { uuid, saveStatePlugin } from '../utils';

const balance = JSON.parse(localStorage.getItem('balance')) || defaultBalance;

export default createStore({
  plugins: [saveStatePlugin],
  state: {
    balance,
  },
  mutations: {
    ADD_NEW_BANK(state, { newBank }) {
      state.balance.cards.push({
        name: newBank.name,
        currency: newBank.currency,
        amount: newBank.amount,
        id: uuid(),
      });
    },
    DELETE_BANK(state, { id }) {
      const targetIndex = state.balance.cards.findIndex((card) => card.id === id);
      state.balance.cards.splice(targetIndex, 1);
    },
  },
  actions: {
  },
  modules: {
  },
});
