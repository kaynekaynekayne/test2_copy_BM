<template>
  <div class="container p-0">
    <div class="modalContent mt-3 pb-3 pl-3 pr-3 text-center" @wheel="zoom">
      <img :src="item" style="width: 160px" />
    </div>
  </div>
</template>
<script>
  import Constant from '../../../Constant'

  export default {
    name: 'modal-viewer',
    props: [
      'item'
    ],
    methods: {
      onClose (evt) {
        this.$emit('close')
      },
      zoom (evt) {
        var targetElement = null
        var imageDefaultWidth = this.imgDefaultWidth

        if (evt.target.querySelectorAll('img').length <= 0) {
          targetElement = evt.target.parentElement
        } else {
          targetElement = evt.target
        }

        if (evt.deltaY < 0) {
          var images = targetElement.querySelectorAll('img')
          var width = (images[0].offsetWidth + 1) + 'px'

          if ((images[0].offsetWidth + 4) <= 200) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        } else {
          var images = targetElement.querySelectorAll('img')
          var width = (images[0].offsetWidth - 1) + 'px'

          if ((images[0].offsetWidth - 4) >= 60) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        }
      }
    }
  }
</script>

<style>
</style>
