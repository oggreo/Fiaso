<template>
  <label
    class="mr-4 font-medium"
    v-if="label">{{ label }}</label>
  <select
    :value="modelValue"
    class="field mr-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white
           border border-blue-500 hover:border-transparent rounded"
    v-bind="{
      ...$attrs,
      // Making v-model capable
      onChange: ($event) => { $emit('update:modelValue', $event.target.value) }
    }"
  >
    <option
      v-for="option in options"
      :value="option"
      :key="option"
      :selected="option === modelValue"
    >{{ option }}</option>
  </select>
</template>

<script>
export default {
  name: 'BaseSelect',
  props: {
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
};
</script>

<style scoped>

</style>
