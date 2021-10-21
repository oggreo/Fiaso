<template>
  <div class="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
    <div class="flex justify-center md:justify-end -mt-16">
      <img class="w-20 h-20 object-cover rounded-full border-2 border-white-500"
           src="../assets/pound.svg">
    </div>
    <div class="bank-info">
      <div class="bank-name text-gray-800 text-xl font-semibold">
        {{ card.name }}
      </div>
      <div class="bank-balance text-gray-800 text-base">
        {{ card.currency }}
        {{ getBankBalance }}
      </div>
    </div>
    <div class="converted-amount">
      <div class="amount text-gray-800 text-2xl font-semibold">
        {{ getCurrencySymbol }}
        {{ getConvertedAmount }}
      </div>
      <div v-if="card.currency !== this.mainCurrency" class="conversion-rate text-gray-800 text-xs">
        <text> 1 {{ card.currency }} = {{ this.rate }} {{ this.mainCurrency }} </text>
      </div>
    </div>
    <div>
      <button
        class="update text-indigo-800 font-medium font-semibold"
        @click="showModal=true"
      >
        Update
      </button>
      <transition name="modal">
        <BaseForm v-if="showModal" @clase="showModal=false">
          <template v-slot:header>
            <h3 class="font-semibold"> Update balance </h3>
          </template>
          <template v-slot:body>
            <AccountTable
              :history="card.history"
              :name="card.name"
              :card="card"
            />
            <button type="submit"
                    class="modal-default-button mt-4 bg-transparent hover:bg-blue-500
                      text-blue-700 font-semibold hover:text-white py-1 px-3 border
                      border-blue-500 hover:border-transparent rounded"
                    @click="showAddBalance=true">
              +
            </button>
            <div class="flex flex-row mt-5 justify-around">
              <button type="button"
                      class="modal-default-button bg-transparent hover:bg-blue-500
                             text-blue-700 font-semibold hover:text-white py-1 px-2 border
                             border-blue-500 hover:border-transparent rounded"
                      @click="showModal=false">
                Cancel
              </button>
            </div>
          </template>
        </BaseForm>
      </transition>
    </div>
    <transition name="modal">
      <BaseForm v-if="showAddBalance" @clase="showAddBalance=false">
        <template v-slot:header>
          <h3 class="font-semibold"> Add new balance </h3>
        </template>
        <template v-slot:body>
          <form>
            <div class="add-balance-form">
              <div class="flex flex-row justify-between">
                <BaseInput
                  label="Amount"
                  type="text"
                  v-model="newHistory.amount"
                />
              </div>
              <div class="flex flex-row mt-5 justify-around">
                <button type="button"
                        class="modal-default-button bg-transparent hover:bg-blue-500
                                  text-blue-700 font-semibold hover:text-white py-1 px-2 border
                                  border-blue-500 hover:border-transparent rounded"
                        @submit.prevent
                        @click="showAddBalance=false;
                                addHistory(targetCard, newHistory)">
                  Submit
                </button>
                <button type="button"
                        class="modal-default-button bg-transparent hover:bg-blue-500
                                         text-blue-700 font-semibold hover:text-white py-1 px-2
                                         border border-blue-500 hover:border-transparent rounded"
                        @click="showAddBalance=false">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </template>
      </BaseForm>
    </transition>
    <div class="delete text-indigo-800">
      <button
        @click="deleteBank(card.id)"
      >🗑️</button>
    </div>
  </div>
</template>

<script>
import CurrencyExchangeServices from '../services/CurrencyExchangeServices';
import AccountTable from './AccountTable';
import BaseForm from './BaseForm';
import BaseInput from './BaseInput';

export default {
  name: 'BankCard',
  inject: ['GStore'],
  components: {
    AccountTable,
    BaseForm,
    BaseInput,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
    mainCurrency: {
      type: String,
      required: true,
    },
  },
  watch: {
    card() {
      let latest = this.card.history[0];
      for (let i = 1; i < this.card.history.length; i += 1) {
        if (latest.timeStamp < this.card.history[i].timeStamp) {
          latest = this.card.history[i];
        }
      }
      this.latest = latest;
      const fromCurrency = this.card.currency;
      const toCurrency = this.mainCurrency;
      CurrencyExchangeServices.getRate(fromCurrency, toCurrency)
        .then((response) => {
          this.rate = response.data.result;
          const convertedAmount = this.latest.amount * this.rate;
          this.convertedAmount = (Math.round(convertedAmount * 100) / 100).toFixed(2);
          for (let i = 0; i < this.GStore.length; i += 1) {
            const card = this.GStore[i];
            if (card.id === this.card.id) {
              this.GStore.splice(i, 1);
              break;
            }
          }
          this.GStore.push({
            id: this.card.id,
            convertedAmount: this.convertedAmount,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    mainCurrency() {
      // get the latest record from cards history
      let latest = this.card.history[0];
      for (let i = 1; i < this.card.history.length; i += 1) {
        if (latest.timeStamp < this.card.history[i].timeStamp) {
          latest = this.card.history[i];
        }
      }
      this.latest = latest;
      const fromCurrency = this.card.currency;
      const toCurrency = this.mainCurrency;
      CurrencyExchangeServices.getRate(fromCurrency, toCurrency)
        .then((response) => {
          this.rate = response.data.result;
          const convertedAmount = this.latest.amount * this.rate;
          this.convertedAmount = (Math.round(convertedAmount * 100) / 100).toFixed(2);
          for (let i = 0; i < this.GStore.length; i += 1) {
            const card = this.GStore[i];
            if (card.id === this.card.id) {
              this.GStore.splice(i, 1);
              break;
            }
          }
          this.GStore.push({
            id: this.card.id,
            convertedAmount: this.convertedAmount,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  methods: {
    addHistory(targetCard, newHistory) {
      const date = new Date();
      const updatedHistory = newHistory;
      updatedHistory.dayMonthYear = [date.getDate(), date.getMonth(), date.getFullYear()];
      updatedHistory.hourMinSec = [date.getHours(), date.getMinutes(), date.getSeconds()];
      updatedHistory.timeStamp = Date.now();
      this.$store.commit('ADD_HISTORY', { targetCard, newHistory: updatedHistory });
    },
    deleteBank(id) {
      for (let i = 0; i < this.GStore.length; i += 1) {
        const card = this.GStore[i];
        if (card.id === this.card.id) {
          this.GStore.splice(i, 1);
        }
      }
      this.$store.commit('DELETE_BANK', { id });
    },
  },
  data() {
    return {
      newHistory: {
        dayMonthYear: null,
        hourMinSec: null,
        timeStamp: null,
        amount: null,
      },
      targetCard: this.card,
      showAddBalance: false,
      showModal: false,
      rate: 1,
      convertedAmount: null,
      latest: null,
    };
  },
  created() {
    // get the latest record from cards history
    let latest = this.card.history[0];
    for (let i = 1; i < this.card.history.length; i += 1) {
      if (latest.timeStamp < this.card.history[i].timeStamp) {
        latest = this.card.history[i];
      }
    }
    this.latest = latest;
    // compute conversion
    const fromCurrency = this.card.currency;
    const toCurrency = this.mainCurrency;
    CurrencyExchangeServices.getRate(fromCurrency, toCurrency)
      .then((response) => {
        this.rate = response.data.result;
        const convertedAmount = this.latest.amount * this.rate;
        this.convertedAmount = (Math.round(convertedAmount * 100) / 100).toFixed(2);
        for (let i = 0; i < this.GStore.length; i += 1) {
          const card = this.GStore[i];
          if (card.id === this.card.id) {
            this.GStore.splice(i, 1);
            break;
          }
        }
        this.GStore.push({
          id: this.card.id,
          convertedAmount: this.convertedAmount,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    getBankBalance() {
      // get the latest record from cards history
      let latest = this.card.history[0];
      for (let i = 1; i < this.card.history.length; i += 1) {
        if (latest.timeStamp < this.card.history[i].timeStamp) {
          latest = this.card.history[i];
        }
      }
      return latest.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    getConvertedAmount() {
      let convertedAmount = this.latest.amount * this.rate;
      convertedAmount = (Math.round(convertedAmount * 100) / 100).toFixed(2);
      return convertedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    getCurrencySymbol() {
      let symbol = '';
      switch (this.mainCurrency) {
        case 'GBP':
          symbol = '£';
          break;
        case 'JPY':
          symbol = '¥';
          break;
        case 'USD':
          symbol = '$';
          break;
        case 'MXN':
          symbol = '$';
          break;
        default:
          symbol = '';
      }
      return symbol;
    },
  },
};

</script>

<style scoped>
.card {
  border-color: gainsboro;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-around;
  align-items: center;
  width: 250px;
  height: 350px;
  border-radius: 5%;
  border: 1px solid gainsboro;
}

</style>
