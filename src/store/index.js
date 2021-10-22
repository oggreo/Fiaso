import { createStore } from 'vuex';
import {
  getDatabase, ref, set, onValue,
} from 'firebase/database';
import { uuid } from '../utils';
import defaultBalance from '../default-balance';

const balance = JSON.parse(localStorage.getItem('balance')) || defaultBalance;

export default createStore({
  state: {
    convertedAmounts: [],
    balance,
    user: {
      loggedIn: false,
      data: null,
      uid: null,
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    userId(state) {
      return state.user.uid;
    },
  },
  mutations: {
    DELETE_CONVERTED_AMOUNTS(state, { targetId }) {
      console.log('targetId', targetId);
      for (let i = 0; i < state.convertedAmounts.length; i += 1) {
        const card = state.convertedAmounts[i];
        if (card.id === targetId) {
          console.log('targetId 2', targetId);
          state.convertedAmounts.splice(i, 1);
        }
      }
    },
    UPDATE_CONVERTED_AMOUNTS(state, { targetId, newAmount }) {
      for (let i = 0; i < state.convertedAmounts.length; i += 1) {
        const card = state.convertedAmounts[i];
        if (card.id === targetId) {
          state.convertedAmounts.splice(i, 1);
          break;
        }
      }
      state.convertedAmounts.push({
        id: targetId,
        convertedAmount: newAmount,
      });
    },
    INIT_CONVERTED_AMOUNTS(state) {
      // console.log('initting convertedAmounts');
      state.convertedAmounts = [];
    },
    SET_LOGGED_IN(state, isLoggedIn) {
      state.user.loggedIn = isLoggedIn;
    },
    SET_USER(state, userData) {
      state.user.data = userData;
      if (userData) {
        state.user.uid = userData.uid;
      }
    },
    SET_DEFAULT_DATA(state) {
      state.balance = defaultBalance;
    },
    SET_USER_STORED_DATA(state, { uid }) {
      const db = getDatabase();
      const userData = ref(db, `userData/${uid}`);
      if (userData) {
        onValue(userData, (snapshot) => {
          const storedBalance = snapshot.val();
          if (storedBalance) {
            state.balance = storedBalance;
          } else {
            // write to fireBase
            set(ref(db, `userData/${uid}`), {
              cards: state.balance.cards,
            });
          }
        });
      }
    },
    ADD_HISTORY(state, { targetCard, newHistory }) {
      const targetIndex = state.balance.cards.findIndex((card) => card.id === targetCard.id);
      state.balance.cards[targetIndex].history.push(newHistory);
      // write to fireBase
      const db = getDatabase();
      const uid = state.user.uid.toString();
      set(ref(db, `userData/${uid}`), {
        cards: state.balance.cards,
      });
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
      // write to fireBase
      const db = getDatabase();
      const uid = state.user.uid.toString();
      set(ref(db, `userData/${uid}`), {
        cards: state.balance.cards,
      });
    },
    ADD_NEW_BANK(state, { newBank, date }) {
      const formattedNewBank = {
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
      };
      state.balance.cards.push(formattedNewBank);
      // write to fireBase
      const db = getDatabase();
      const uid = state.user.uid.toString();
      set(ref(db, `userData/${uid}`), {
        cards: state.balance.cards,
      });
    },
    DELETE_BANK(state, { id }) {
      const targetIndex = state.balance.cards.findIndex((card) => card.id === id);
      state.balance.cards.splice(targetIndex, 1);
      // write to fireBase
      const db = getDatabase();
      const uid = state.user.uid.toString();
      set(ref(db, `userData/${uid}`), {
        cards: state.balance.cards,
      });
    },
  },
  actions: {
    getUser({ commit }, user) {
      commit('SET_LOGGED_IN', user !== null);
      if (user) {
        commit('SET_USER', {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
        });
      } else {
        commit('SET_USER', null);
      }
    },
  },
  modules: {
  },
});
