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
      <div class="conversion-rate text-gray-800 text-xs">
        <text> 1 {{ card.currency }} = {{ this.rate }} {{ this.mainCurrency }} </text>
      </div>
    </div>
    <div class="update text-indigo-800 font-medium font-semibold">
      <text> Update </text>
    </div>
    <div class="delete text-indigo-800">
      <button
        @click="deleteBank(card.id)"
      >🗑️</button>
    </div>
  </div>

</template>

<script>
import CurrencyExchangeServices from '../services/CurrencyExchangeServices';

export default {
  name: 'BankCard',
  inject: ['GStore'],
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
    mainCurrency() {
      const fromCurrency = this.card.currency;
      const toCurrency = this.mainCurrency;
      CurrencyExchangeServices.getRate(fromCurrency, toCurrency)
        .then((response) => {
          this.rate = response.data.result;
          const convertedAmount = this.card.amount * this.rate;
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
      rate: 1,
      convertedAmount: null,
    };
  },
  created() {
    const fromCurrency = this.card.currency;
    const toCurrency = this.mainCurrency;
    CurrencyExchangeServices.getRate(fromCurrency, toCurrency)
      .then((response) => {
        this.rate = response.data.result;
        const convertedAmount = this.card.amount * this.rate;
        this.convertedAmount = (Math.round(convertedAmount * 100) / 100).toFixed(2);
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
      return this.card.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    getConvertedAmount() {
      let convertedAmount = this.card.amount * this.rate;
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
  width: 200px;
  height: 300px;
  border-radius: 5%;
  border: 1px solid gainsboro;
}

</style>
