<template>
  <div class="account-main flex flex-col space-between ml-10 mr-10">
    <div class="greeting flex flex-row justify-between">
      <h1 v-if="user.data"
          class="mb-5 pb-2 text-2xl font-black leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Hi! {{ displayName }}👋
      </h1>
      <h1 v-else
          class="mb-5 pb-2 text-2xl font-black leading-7 text-gray-900 sm:text-3xl sm:truncate">
        Demo👋
      </h1>
      <div class="select-main-currency">
        <BaseSelect
          :options="this.options"
          v-model="this.mainCurrency"
          label="Select main currency"
        />
      </div>
    </div>
    <div class="account-info flex flex-row justify-between jus">
      <div class="total-amount">
        <p class="text-5xl font-black"
        > {{ getCurrencySymbol }} {{ getCurrentTotal }}</p>
        <p class="text-sm text-gray-500"
        > Total balance {{ getCurrentDateTime }}</p>
      </div>
      <div class="edit-account-info">
        <div class="add-new-bank">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            id="show-modal" @click="showModal = true">
            + Add new
          </button>
          <transition name="modal">
            <BaseForm v-if="showModal" @close="showModal=false">
              <template v-slot:header>
                <h3 class="font-semibold">Add new bank </h3>
              </template>
              <template v-slot:body>
                <form
                  @submit.prevent
                  @submit="createNewBank(newBank)"
                >
                  <div class="add-bank-form">
                    <div class="flex flex-row justify-between">
                      <BaseInput
                        label="Bank Name"
                        type="text"
                        v-model="newBank.name"
                      />
                    </div>
                    <div class="flex flex-row justify-between">
                      <BaseInput
                        label="Amount"
                        type="text"
                        v-model="newBank.amount"
                      />
                    </div>
                    <div class="flex flex-row justify-start">
                      <BaseSelect
                        :options="this.options"
                        v-model="newBank.currency"
                        label="Select main currency"
                      />
                    </div>
                    <div class="flex flex-row mt-5 justify-around">
                      <button type="submit"
                              class="modal-default-button bg-transparent hover:bg-blue-500
                              text-blue-700 font-semibold hover:text-white py-1 px-2 border
                              border-blue-500 hover:border-transparent rounded"
                              @click="showModal=false">
                        Submit
                      </button>
                      <button type="button"
                              class="modal-default-button bg-transparent hover:bg-blue-500
                                     text-blue-700 font-semibold hover:text-white py-1 px-2 border
                                     border-blue-500 hover:border-transparent rounded"
                              @click="showModal=false">
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </template>
            </BaseForm>
          </transition>
        </div>
      </div>
    </div>
  </div>

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
import { mapState, mapGetters } from 'vuex';
import { getAuth } from 'firebase/auth';
import { gsap } from 'gsap';
import BankCard from '../components/BankCard';
import BaseInput from '../components/BaseInput';
import BaseForm from '../components/BaseForm';
import BaseSelect from '../components/BaseSelect';

export default {
  name: 'MainBalance',
  inject: ['GStore'],
  data() {
    return {
      tweenedTotal: 0,
      displayName: null,
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
  updated() {
    // Code that will run only after the
    // entire view has been re-rendered
    this.$nextTick(function () {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user !== null) {
        this.displayName = user.displayName;
      }
    });
  },
  components: {
    BaseInput,
    BankCard,
    BaseForm,
    BaseSelect,
  },
  // watch: {
  //   mainCurrency() {
  //     let total = 0;
  //     this.GStore.forEach(
  //       (card) => {
  //         total += parseFloat(card.convertedAmount);
  //       },
  //     );
  //     total = (Math.round(total * 100) / 100).toFixed(2);
  //     total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //     gsap.to(this.$data, {
  //       duration: 0.3,
  //       ease: 'circ.out',
  //       tweenedTotal: total,
  //     });
  //   },
  // },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
    ...mapState(['balance']),
    getCurrentDateTime() {
      return new Date().toLocaleDateString();
    },
    getCurrentTotal() {
      let total = 0;
      this.GStore.forEach(
        (card) => {
          total += parseFloat(card.convertedAmount);
          console.log('card.convertedAmount', card.convertedAmount);
        },
      );
      total = total.toFixed(2);
      gsap.to(this.$data, {
        duration: 0.3,
        ease: 'circ.out',
        tweenedTotal: total,
      });

      total = (Math.round(this.tweenedTotal * 100) / 100).toFixed(2);
      total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
      const date = new Date();
      this.$store.commit('ADD_NEW_BANK', { newBank, date });
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
</style>
