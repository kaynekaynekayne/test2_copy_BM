<template>
  <b-modal id="centeredModal" centered hide-footer hide-header>
    <div class="pl-2 pr-2 pt-3 pb-3" id="modalTitle">
      <slot name="header"></slot>
    </div>
    <div class="pl-2 pr-2 pb-3" id="modalContent">
      <slot name="content"></slot>
    </div>
    <div class="pl-2 pr-2 pt-5 pb-4 text-center" id="modalFooter">
      <slot name="footer"></slot>
    </div>
  </b-modal>
</template>

<script>
  export default {
    name: 'centered-modal'
  }
</script>

<style>
  #modalTitle {
    font-size: 20px;
  }
</style>
