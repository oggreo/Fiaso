<template>
  <div class="total-amount">
    <p> {{ getCurrencySymbol }} {{ getCurrentTotal }}</p>
    <p> Total balance </p>
  </div>

  <BaseSelect
    :options="this.options"
    v-model="this.mainCurrency"
    label="Select main currency"
    />
  <button id="show-modal" @click="showModal = true">+ Add new</button>
  <transition name="modal">
    <BaseForm v-if="showModal" @close="showModal=false">
      <template v-slot:header>
        <h3>Add new bank </h3>
      </template>
      <template v-slot:body>
        <form
          @submit.prevent
          @submit="createNewBank(newBank)"
        >
          <BaseInput
            label="Bank Name"
            type="text"
            v-model="newBank.name"
          />
          <BaseInput
            label="Amount"
            type="text"
            v-model="newBank.amount"
          />
          <BaseInput
            label="Currency"
            type="text"
            v-model="newBank.currency"
          />
          <button type="submit" @click="showModal=false">
            Submit
          </button>
          <button type="button" class="modal-default-button" @click="showModal=false">
            Cancel
          </button>
        </form>
      </template>
    </BaseForm>
  </transition>
  <div class="balance">
    <BankCard
      class="card"
      v-for="(card, $cardIndex) of balance.cards"
      :key="$cardIndex"
      :card="card"
      :mainCurrency="mainCurrency"
    >
    </BankCard>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BankCard from '../components/BankCard';
import BaseInput from '../components/BaseInput';
import BaseForm from '../components/BaseForm';
import BaseSelect from '../components/BaseSelect';

export default {
  name: 'MainBalance',
  inject: ['GStore'],
  data() {
    return {
      mainCurrency: 'GBP',
      newBank: {
        name: '',
        amount: '',
        currency: '',
      },
      options: [
        'USD',
        'GBP',
        'MXN',
        'JPY',
      ],
      showModal: false,
    };
  },
  components: {
    BaseInput,
    BankCard,
    BaseForm,
    BaseSelect,
  },
  computed: {
    ...mapState(['balance']),
    getCurrentTotal() {
      let total = 0;
      this.GStore.forEach(
        (card) => {
          total += parseFloat(card.convertedAmount);
        },
      );
      return total;
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
  methods: {
    createNewBank(newBank) {
      this.$store.commit('ADD_NEW_BANK', { newBank });
    },
  },
};
</script>

<style scoped>
.balance {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-around;
  align-items: flex-start;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

</style>
