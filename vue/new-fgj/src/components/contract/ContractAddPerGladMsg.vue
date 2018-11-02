<template lang="html">
  <!-- 发送喜报 -->
  <section class="lc-cont-glad-msg">
    <el-dialog
      title="选择人员"
      center
      :visible.sync="dialogVisible"
      modal
      :modal-append-to-body="false"
      append-to-body
      custom-class="lc-dialog-glad-msg"
      width="80%">
      <div class="con">
        <div class="item" v-for="(item, index) in sendData" :key="index">
          <h3 class="title">{{item.DeptName}}</h3>
          <el-radio-group v-model="item.select">
            <el-radio v-for="(list, index) in item.list" :label="list" :key="index">{{list.EmpName}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSend">确 定</el-button>
      </span>
    </el-dialog>
    <loader-center ref="loaderCenters"></loader-center>
  </section>
</template>

<script>
  import LoaderCenter from '@/base/LoaderCenter'
  import { SelectByID } from '@/api/contract/contractAdd'
  import { GetEmployeeForDeptList, SendContractMsg } from '@/api/contract/contractAddPer'

  export default {
    props: {
      ContractCommData: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        ContractID: '',
        dialogVisible: false,
        arrrLength: 0,    // 记录一共有多少公司
        sendData: [],   // 需要发送的数据
        contractData: {},   // 合同数据
      }
    },
    activated () {
    },
    mounted () {
      this.$nextTick(() => {
        this.loaderCenter = this.$refs.loaderCenters     // 提示元素全局保存
      })
    },
    computed: {
    },
    methods: {
      _parcet() {   // 父级触发发送喜报按钮
        this._getSelectByID(this.$route.query.id)   // 获取合同数据
      },
      confirmSend() {   // 确定发送
        let data = this.sendData

        // 要判断每个都选中
        for (let i = 0, length = data.length; i < length; i++) {
          if (!data[i].select) {
            this.$message.error('还有没选中的人员')
            return
          }
        }

        this.loaderCenter.show('正在发送')
        data.forEach(item => {
          if (item.select) {
            this.selectLi(item.select)
          }
        })
      },
      selectLi(list) {    // 发送喜报
        let data = this.contractData
        if (!data) {
          return
        }

        let params = Object.assign({}, {
          ContractID: data.ContractID,
          CustName: data.CustName,
          CustMobile: data.CustMobile,
          EstateName: data.EstateName,
          Usage: data.Usage,
          PicSrc: data.PicSrc,
        }, list)

        SendContractMsg(params)  
        .then(res => {
          if (res.data.result === 'success') {
            this.$message.success('发送成功')
            this.dialogVisible = false
            this.loaderCenter.hide()
          }
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
          else {
            this.$message.error('发送失败')
          }
        })
        .catch(err => alert('网络异常：' + err))
      },
      GetEmployeeForDeptList() {    // 获取公司
        this.sendData = []    // 先清空
        let data = this.ContractCommData    // 所有数据
        let startArr = []   // 启用的数据 
        let obj = {}    // 存储公司id
        let arr = []    // 存储一共有多少个公司
        let DeptID = ''
        let currentIndex = 0

        for (let i = 0, length = data.length; i < length; i++) {
          DeptID = data[i].DeptID
          if (data[i].FlagDeleted !== 'True') {
            startArr.push(data[i])
            if (!obj[DeptID]) {
              obj[DeptID] = true
              arr.push(DeptID)
            }
          }
        }
        
        this.arrrLength = arr.length
        
        this.loaderCenter.show('获取公司')
        arr.forEach((DeptID) => {
          GetEmployeeForDeptList(DeptID).then(res => {
            currentIndex++
            if (res.data.result === 'success') {
              this.sendData.push({
                DeptID: DeptID,
                DeptName: res.data.tempTable[0].DeptName,
                list: res.data.tempTable
              })
              // 到最后一个请求的时候再显示弹窗
              if (currentIndex >= arr.length) {
                this.dialogVisible = true
                this.loaderCenter.hide()
              }
            }
            else if (res.data.result === '权限不足') {
              this.$message.error('权限不足')
              setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
            }
            else {
              this.$message.error('请求失败')
            }
          })
          .catch(err => alert('网络异常：' + err))
        })
      },
      // 获取合同数据
      _getSelectByID(ContractID) {
        SelectByID(ContractID)
        .then(res => {
          this.contractData = res.data.tempTable[0]
          // 判断是否已发送喜报
          if (this.contractData.IsSendMsg === '0') {
            this.GetEmployeeForDeptList()   // 获取公司
          } else {
            this.$confirm('已发送过喜报，是否再次发送?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.GetEmployeeForDeptList()
            })
            .catch(() => {})
          }
        })
        .catch(err => alert('网络异常：' + err))
      }
    },
    watch: {},
    components: {
      LoaderCenter
    }
  }
</script>

<style lang="scss">
  // 注意这里的样式是全局的，主要是修改弹窗
  @import '../../common/sass/mixin';

  .lc-dialog-glad-msg {
    .con {
      text-align: center;
      .title {
        @include border-b-1px(100%);
        font-size: 16px;
        color: #333;
        line-height: 44px;
      }
      .el-radio {
        @include border-b-1px(0);
        margin: 0;
        display: block;
        height: 44px;
        font-size: 16px;
        line-height: 44px;
      } 
    }
  }
  .v-modal {
    z-index: 2000 !important;
  }
</style>
