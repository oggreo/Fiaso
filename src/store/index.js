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
    ADD_HISTORY(state, { targetCard, newHistory }) {
      console.log('targetCard', targetCard);
      console.log('state.balance.cards', state.balance.cards);
      const targetIndex = state.balance.cards.findIndex((card) => card.id === targetCard.id);
      console.log('targetIndex', targetIndex);
      state.balance.cards[targetIndex].history.push(newHistory);
    },
    UPDATE_HISTORY(state, { targetCard, oldHistory, updatedHistory }) {
      // update history
      let targetIndex = targetCard.history.findIndex((record) => record === oldHistory);
      const newCard = JSON.parse(JSON.stringify(targetCard));
      newCard.history.splice(targetIndex, 1);
      newCard.history.push(updatedHistory);

      targetIndex = state.balance.cards.findIndex((card) => card.id === targetCard.id);
      // it needs to replace the original position here
      state.balance.cards.splice(targetIndex, 1, newCard);
    },
    ADD_NEW_BANK(state, { newBank, date }) {
      state.balance.cards.push({
        name: newBank.name,
        currency: newBank.currency,
        id: uuid(),
        history: [
          {
            dayMonthYear: [date.getMonth(), date.getDate(), date.getFullYear()],
            hourMinSec: [date.getHours(), date.getMinutes(), date.getSeconds()],
            timeStamp: Date.now(),
            amount: newBank.amount,
          }],
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
