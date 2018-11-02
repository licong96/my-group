<template lang="html">
  <!-- 选择部门 -->
  <div class="dept-name">
    <el-cascader
      :placeholder="placeholder"
      :options="SDeptData"
      v-model="SDeptVal"
      popper-class="dept-name-cascader"
      :filterable="filterable"
      :clearable="clearable"
      :show-all-levels="false"
      :change-on-select="true"
      @change="changeDepar"
      @blur="blur($event)">
    </el-cascader>
  </div>
</template>

<script>
  import { GetDepartmentJson } from '@/api/public'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '选择部门'
      },
      isOneDeptName: {    // 是否直接去获取部门数据
        type: Boolean,
        default: false
      },
      filterable: {     // 是否可以搜索
        type: Boolean,
        default: false
      },
      clearable: {      // 是否支持清空
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        SDeptData: [],
        SDeptVal: [],
      }
    },
    created() {
      // 如果是真，直接获取数据，但是部门数据并不急，可以先加到队列里等着，不要影响主线程
      if (this.isOneDeptName) {
        setTimeout(() => {
          this._GetDepartmentJson()
        }, 0)
      }
    },
    methods: {
      clearSDeptVal() {
        this.SDeptVal = []
      },
      _GetDepartmentJson() {
        GetDepartmentJson(0).then(res => {
          this.SDeptData = res.data

          if (!!this.elCascader) {
            // 获取数据成功后去掉加载中
            let load = this.elCascader.querySelector('.lc-loader')
            load.style.display = 'none'
          }
        })
      },
      changeDepar(newVal) {
        this.$emit('onDeptName', newVal)
      },
      blur(e) {      // 收起键盘
        e.currentTarget.blur()
      }
    },
    watch: {
      isOneDeptName(newVal) {   // 触发后再获取数据
        if (newVal) {
          setTimeout(() => {
            this._GetDepartmentJson()   // 获取数据

            // 添加加载中
            this.elCascader = document.querySelector('.el-cascader-menu')
            let html = `<section class="lc-loader flex justify-center align-center" style="margin-top: 40%;">
                          <i class="el-icon-loading"></i>
                          <p class="desc" style="font-size: 12px">加载中</p>
                        </section>`
            this.elCascader.innerHTML = html
          }, 30)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
