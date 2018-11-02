<template lang="html">
  <!-- 什么都没有搜到 -->
  <div>
    <vue-core-image-upload
      :class="className"
      :maxWidth="maxWidth"
      :compress="compress"
      :crop-ratio="cropRation"
      :crop="crop"
      :cropBtn="{'ok': '确定', 'cancel': '取消'}"
      @imagechanged="imagechanged"
      @errorhandle="errorhandle"
      inputAccept="image/jpg,image/jpeg,image/png"
      :max-file-size="10485760"
      :isXhr="isXhr"
      text="">
    </vue-core-image-upload>
  </div>
</template>

<script>
  import VueCoreImageUpload from 'vue-core-image-upload'

  export default {
    props: {
      className: {
        type: String,
        default: ''
      },
      maxWidth: {
        type: Number,
        default: 750
      },
      compress:{
        type: Number,
        default: 20
      },
      cropRation: {
        type: String,
        default: '1.5:1'
      },
      crop: {
        type: String,
        default: 'local'
      },
      maxFileSize: {
        type: Number,
        default: 10485760
      },
      isXhr: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    methods: {
      imagechanged(res) {    // 户型图片上传
        this.$emit('coreImage', res)
      },
      errorhandle(res) {     // 错误提示
        this.$message.error(res)
      },
    },
    components: {
      VueCoreImageUpload
    }
  }
</script>

<style scoped lang="scss">
  .g-core-image-upload-btn {
    width: 100%;
    height: 100%;
  }
</style>
