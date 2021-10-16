<template>
  <div class="card">
    <div class="bank-info">
      <div class="bank-name">
        {{ card.name }}
      </div>
      <div class="bank-balance">
        {{ card.currency }}
        {{ card.amount }}
      </div>
    </div>
    <div class="converted-amount">
      <div class="amount">
        {{ getCurrencySymbol }}
        {{ getConvertedAmount }}
      </div>
      <div class="conversion-rate">
        <text> 1 {{ card.currency }} = {{ this.rate }} {{ this.mainCurrency }} </text>
      </div>
    </div>
    <div class="update">
      <text> Update </text>
    </div>
    <div class="delete">
      <button
        @click="deleteBank(card.id)"
      >Delete</button>
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
    getConvertedAmount() {
      const convertedAmount = this.card.amount * this.rate;
      return (Math.round(convertedAmount * 100) / 100).toFixed(2);
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
