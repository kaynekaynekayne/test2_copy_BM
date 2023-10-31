<template>
  <b-container id="orderEntry" class="text-center colorWhite pt-2" fluid>
    <b-row>
      <b-col cols="3" class="pr-1">
        <order-input></order-input>
      </b-col>
      <b-col class="pl-1">
        <order-options></order-options>
      </b-col>
    </b-row>
    <b-row>
      <order-list-tab></order-list-tab>
    </b-row>
  </b-container>
</template>

<script>
  import OrderInput from './OrderComponents/OrderInput'
  import OrderOptions from './OrderComponents/OrderOptions'
  import OrderListTab from './OrderComponents/OrderListTab'

  export default {
    name: 'order-entry',
    components: { OrderInput, OrderOptions, OrderListTab }
  }
</script>

<style>
</style>
