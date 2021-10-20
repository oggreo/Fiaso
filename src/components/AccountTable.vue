<template>
  <table
    class="table-auto ml-50">
    <thead>
      <tr>
        <th>Name</th>
        <th>Date</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody
    >
      <tr v-for="(history, $historyIndex) of card.history"
          :key="$historyIndex"
          class=""
      >
        <td>{{ card.name }}</td>
        <td>{{ history.dayMonthYear.join('-') }}</td>
        <td>{{ history.amount }}</td>
        <td
          @click="showModal=true; selectedHistory=history"
        > ✏️ </td>
      </tr>
    </tbody>
  </table>
  <BaseForm v-if="showModal" @clase="showModal=false">
    <template v-slot:header>
      <h3 class="font-semibold"> Update balance </h3>
    </template>
    <template v-slot:body>
      <form
      >
        <div class="add-bank-form">
          <div class="flex flex-row justify-between">
            <BaseInput
              label="Date"
              type="date"
              v-model="newHistory.newTime"
            />
          </div>
          <div class="flex flex-row justify-between">
            <BaseInput
              label="Amount"
              type="text"
              v-model="newHistory.newAmount"
            />
          </div>
          <div class="flex flex-row mt-5 justify-around">
            <button type="button"
                    class="modal-default-button bg-transparent hover:bg-blue-500
                            text-blue-700 font-semibold hover:text-white py-1 px-2 border
                            border-blue-500 hover:border-transparent rounded"
                    @submit.prevent
                    @click="showModal=false;
                            updateHistory(targetCard, selectedHistory, newHistory)">
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
</template>

<script>
import BaseForm from './BaseForm';
import BaseInput from './BaseInput';

export default {
  name: 'AccountTable',
  components: {
    BaseInput,
    BaseForm,
  },
  data() {
    return {
      newHistory: {
        newTime: null,
        newAmount: null,
      },
      targetCard: this.card,
      showModal: false,
      selectedHistory: null,
    };
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  methods: {
    updateHistory(targetCard, oldHistory, newHistory) {
      // 2021-11-10
      const yearMonthDay = newHistory.newTime;
      const dayMonthYear = yearMonthDay.split('-').reverse();
      const updatedHistory = {
        dayMonthYear: Array.from(dayMonthYear, (x) => parseInt(x, 10)),
        hourMinSec: [0, 0, 0],
        timeStamp: Date.parse(yearMonthDay),
        amount: newHistory.newAmount,
      };
      this.$store.commit('UPDATE_HISTORY', {
        targetCard, oldHistory, updatedHistory,
      });
    },
  },
};
</script>

<style scoped>
.table-auto {
  margin-left: 50px;
}
</style>
