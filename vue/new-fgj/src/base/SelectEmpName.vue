<template lang="html">
  <!-- 选择人员-->
  <div class="emp-name">
    <el-select
      v-model="EmpName"
      clearable
      :disabled="disabled"
      :placeholder="placeholder"
      popper-class="select-emp-name"
      @visible-change="visibleChange"
      @blur="blur($event)">
      <el-option
        v-for="(item, index) in EmpData"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import { GetEmployeeJson } from '@/api/public'

  export default {
    props: {
      DeptID: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '选择人员'
      },
      disabled: {
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
        EmpData: [],
        EmpName: '',     // 选中的人员
      }
    },
    created() {
    },
    methods: {
      clearEmpName() {
        // 清空也需要发送事件
        if (this.EmpName) {
          this.EmpName = ''
        } 
        else {
          this.$emit('onEmpName')
        }

        this.EmpData = []
      },
      _GetEmployeeJson() {    // 根据部门id获取人员
        GetEmployeeJson(this.DeptID).then((res) => {
          this.EmpData = eval(res.data)
        })
      },
      visibleChange(bool) {   // 下拉框出现/隐藏时触发
        this.$emit('empVisibleChange', bool)
      },
      blur(e) {      // 收起键盘
        e.currentTarget.blur()
      }
    },
    watch: {
      DeptID() {      // 每次改变部门，都再次获取人员
        this._GetEmployeeJson()
      },
      EmpName(newVal) {
        this.$emit('onEmpName', newVal)
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
