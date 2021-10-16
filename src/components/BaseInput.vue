<template>
  <label>{{ label }}</label>
  <input
    v-bind="$attrs"
    :placeholder="label"
    class="field"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
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

<!-- app -->
<div id="app">
<button id="show-modal" @click="showModal = true">Show Modal</button>
<!-- use the modal component, pass in the prop -->
<transition name="modal">
  <modal v-if="showModal" @close="showModal = false">
    <!--
      you can use custom content here to overwrite
      default content
    -->
    <template v-slot:header>
      <h3>custom header</h3>
    </template>
  </modal>
</transition>
</div>
