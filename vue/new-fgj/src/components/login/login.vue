<template>
    <transition name="move">
        <div class="login xb-login">
          <div v-show="probation">
            <div class="login-header">
                <!-- <i @click="_back()" class="el-icon-arrow-left"></i> -->
                <span class="title">补全信息</span>
                <!-- <span style="width:14px"></span> -->
            </div>
            <div class="login-content">
                <el-steps align-center :active="active" finish-status="success" >
                    <el-step v-for="(item,index) in listWrapper" :key="index" :title="item.text" ></el-step>
                </el-steps>
            </div>

            <Form :model="formItem" :label-width="80" label-position="left">
                <FormItem v-show="active === 0" label="姓名">
                    <el-input v-model="formItem.EmpName" placeholder="输入您的名字"></el-input>
                </FormItem>
                <div id="cascaderbox" @click="closeCasader">
                  <FormItem v-show="active === 0" label="部门">
                    <el-cascader
                      ref="lcCascader"
                      placeholder="输入公司简称"
                      v-model="DeptID"
                      popper-class="login-cascader-menus"
                      clearable
                      @change="ss"
                      :options="departmant"
                      :before-filter="select"
                      :show-all-levels="false"
                      filterable
                      change-on-select
                      style="width:100%"
                    ></el-cascader>
                  </FormItem>
                  <p class="remark-dept">如果没有找到您的公司，您可以选择分销商，然后备注里填公司名</p>
                </div>
                <FormItem v-show="active === 0" label="备注" style="margin: 5px 0">
                  <Input v-model="formItem.Remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" />
                </FormItem>
                <p v-show="active === 0" style="font-size:10px;color:#878D99">*选填(填写备注信息)</p>
                <FormItem v-show="active === 1" label="密码">
                    <input type="password" v-model="formItem.Password" class="el-input__inner" placeholder="输入您的密码">
                </FormItem>
                <FormItem v-show="active === 1" label="确认密码">
                    <input type="password" v-model="makePassword" class="el-input__inner"  placeholder="输入在输入一次您的密码">
                </FormItem>

                <FormItem v-show="active === 2" label="手机">
                    <el-input v-model="formItem.Tel" placeholder="输入您的手机号码"></el-input>
                    <!-- <el-button type="danger" style="margin-left:5px" ref="btn">发送</el-button> -->
                    <input type="button"  @click="send()" style="margin-left:5px" ref="btn" class="el-button el-button--danger" :value="timer === 60?'发送':timer+'秒'" />
                </FormItem>
                <FormItem v-show="active === 2" label="验证码">
                    <el-input v-model="formItem.smsNumber" placeholder="输入您的验证码"></el-input>
                </FormItem>

            </Form>
            <el-button @click="nextStep()" class="nextStep" type="danger" v-text="active === 2?'提交':'下一步'"></el-button>
          </div>
          <loader-center ref="loaders"></loader-center>
        <!-- 确定 -->
        <el-dialog
            title="确定"
            :visible.sync="dialogVisible"
            width="80%">
            <span>确认提交？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handler()">确 定</el-button>
            </span>
        </el-dialog>
          <!-- 成功后的审核页面 -->
          <section class="success-wrap" v-show="IsSuccess">
            <success :id="successID"></success>
          </section>
        </div>
    </transition>
</template>
<script>
import {
  verifyLogin,
  GetDepartmentJson,
  CheckIsMyMobile,
  registered,
  ModifyAccount,
  upPurviewForEmpID
} from "@/api/login/login.js";
import Success from '@/components/login/loginSuccess'
import LoaderCenter from '@/base/LoaderCenter'

export default {
  data() {
    return {
      timeout: null,
      active: 0,
      oldData: "",
      listWrapper: [
        { value: 1, text: "填写个人信息" },
        { value: 2, text: "设置密码" },
        { value: 3, text: "验证手机号" }
      ],
      dialogVisible: false,
      DeptID: [],
      departmant: [],
      formItem: {
        todo: "Employee",
        type: "upEmployee",
        Status: "待审",
        Source: "公众号",
        Remark: "",
        PositionID: "5CAE22DDED0D440F9F3539FA9F22E889",
        needVali: "1",
        smsNumber: "", // 手机验证
        DeptID: "",
        DeptName: '',     // 部门名字
        isSendMsg: '1',
        EmpName: "",
        Tel: "",
        Password: "",
        needpurview: false,
        valiurl: document.URL
      },
      makePassword: "",
      timer: 60,
      probation: false,      // 试用
      IsSuccess: false,      // 注册成功后的审核页面
      successID: '0',          // 把选择到的部门id传过去
      isOneSubmit: true,    // 只允许提交一次
    };
  },
  created () {
    // 验证
    verifyLogin('login').then((res) => {
      // console.log(res)
      if (res.data.result === 'success') {
        if (res.data.Status === '试用') {
          this.probation = true
        } else if (res.data.Status === '待审') {
          this.IsSuccess = true
        }
      } else if (res.data.result === 'error') {
        window.location.href = res.data.URL    // 测试关闭
      }
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.loaders = this.$refs.loaders      // 提示元素全局保存
    })
    // 获取部门数据
    GetDepartmentJson()
      .then(res => {
        if (res.data !== "") {
          this.departmant = eval(res.data);
          this.departmant.forEach((value, index, array) => {
            value.disabled = true;
            if (value.children.length !== 0) {
              value.children.forEach((value, index, array) => {
                value.disabled = true;
              });
            }
          });
        }
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
  },
  methods: {
    // 筛选后
    // ss() {
    //   document.getElementsByClassName("el-cascader-menus")[0].style.opacity = 0;
    //   console.log('el-cascader-menus', document.getElementsByClassName("el-cascader-menus")[0]);
    // },
    // 筛选前钩子
    select(value) {
      this.DeptID = [];
      document.getElementsByClassName("el-cascader-menus")[0].style.display = 'block';
      if (!value) {
        document.getElementsByClassName("el-cascader-menus")[0].style.display = 'none';
      }
      // console.log('el-cascader-menus', document.getElementsByClassName("el-cascader-menus")[0]);
      // console.log(document.getElementsByClassName("el-input__inner")[0].value);
      if (this.oldData === "") {
        this.oldData = document.getElementsByClassName(
          "el-input__inner"
        )[0].value;
      }
      if (
        document.getElementsByClassName("el-input__inner")[0].value === "" &&
        this.oldData !== ""
      ) {
        console.log(8);
        setTimeout(() => {
          document.getElementsByClassName(
            "el-cascader-menus"
          )[0].style.opacity = 0;
        }, 10);
      }
      document.getElementsByClassName("el-cascader-menus")[0].style.opacity = 1;
    },
    // 正则手机判断
    isCheckMobile(text) {
      let reg = /^(13[0-9]|147|15[0-9]|18[0-9]|17[0-9]|19[0-9]|16[0-9])([0-9]{8})$/;
      let a = reg.test(text);
      let reg2 = /^([0-9]{4})$/;
      let b = reg2.test(text);
      if (a) {
        return a;
      } else if (b) {
        return b;
      } else {
        return false;
      }
    },
    // 发送验证码
    send() {
      if (
        this.formItem.Tel === "" ||
        this.isCheckMobile(this.formItem.Tel) === false
      ) {
        this.open("请输入正确的手机号码");
        return;
      }
      // 校验手机号
      CheckIsMyMobile(this.formItem.Tel)
        .then(res => {
          if (res.data.result === "success") {
            // 发送验证码
            ModifyAccount(this.formItem.Tel)
              .then(res => {
                if (res.data.result === "success") {
                  this.open("发送成功请接收");
                  let _this = this;
                  this.$refs.btn.disabled = true;
                  let ss = setInterval(() => {
                    _this.$refs.btn.disabled = true;
                    _this.timer -= 1;
                    console.log(_this.timer);
                    if (_this.timer === 0) {
                      console.log("stop");
                      clearInterval(ss);
                      _this.timer = 60;
                      _this.$refs.btn.disabled = false;
                    }
                  }, 1000);
                } else if (res.data.result === "error") {
                  this.open(res.data.msg);
                }
              })
              .catch();
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch();
    },
    Trim(str) { 
      return str.replace(/(^\s*)|(\s*$)/g, ""); 
    },
    nextStep() {
      if (this.active === 0) {
        if (this.DeptID.length !== 0 && this.formItem.EmpName !== "") {
          this.active += 1;
        } else {
          this.open("请检查是否填写完整");
        }
      } else if (this.active === 1) {
        if (
          this.formItem.Password &&
          this.formItem.Password === this.makePassword
        ) {
          this.active += 1;
        } else {
          this.open("2次密码输入不一致，请重新输入");
          this.formItem.Password = "";
          this.makePassword = "";
        }
      } else if (this.active === 2) {
        if (this.formItem.Tel !== "" && this.formItem.smsNumber !== "") {
          if (this.isCheckMobile(this.formItem.Tel)) {
            // this.dialogVisible = true;
            this.handler();
          } else {
            this.open("请填写正确的手机号码");
          }
        } else {
          this.open("手机号码和验证码不能为空");
        }
      }
    },
    // 注册
    handler() {
      this.formItem.DeptID = this.DeptID[this.DeptID.length - 1].split(",")[0];
      // 我也是没办法才这样拿部门名字的
      let box = document.getElementById('cascaderbox')
      let input = box.getElementsByClassName('el-cascader__label')[0]
      let str = this.Trim(input.innerHTML)
      this.formItem.DeptName = str

      this.loaders.show('正在提交')
      if (!this.isOneSubmit) {
        return
      }
      this.isOneSubmit = false
      registered(this.formItem)
        .then(res => {
          if (res.data.result === "success") {
            // 权限赋予
            upPurviewForEmpID(this.formItem.PositionID, res.data.EmpID)
              .then(res => {
                if (res.data.result === 'success') {
                  this.isOneSubmit = true
                  this.loaders.hide()
                  this.open("注册成功");
                  // setTimeout(() => {
                  //   this.$router.push({path:'/loginSuccess'})
                  // }, 200)
                  // 显示审核页面
                  this.successID = this.DeptID[this.DeptID.length - 1].split(',')[0]
                  this.IsSuccess = true
                } else {
                  this.open(res.data.msg);
                }
              })
              .catch(err => alert('异常', err));
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(err => alert('异常', err));
    },
    _back() {
      if (this.active === 0) {
        window.history.go(-1);
      } else {
        this.active -= 1;
      }
    },
    // 选择部门
    ss(value) {
      // console.log('value', value)
      if (!value.length) {
        return
      }
      const DeptType = value[value.length-1].split(",")[2];
      if (DeptType === "分销") {
        this.formItem.PositionID = "5CAE22DDED0D440F9F3539FA9F22E889";
      } else if (DeptType === "中介") {
        this.formItem.PositionID = "ZCAE22DDED0D440F9F3539FA9F22E889";
      } else if (DeptType === "客服") {
        this.formItem.PositionID = "89603686a75c42f39d6515540c6b15f3";
      }
      console.log(this.formItem.PositionID)
    },
    // 提示
    open(msg) {
      this.$message(msg);
    },
    closeCasader() {
      setTimeout(() => {
        document.getElementsByClassName("el-cascader-menus")[0].style.display = 'none';
      }, 20)
    }
  },
  components: {
    Success,
    LoaderCenter
  }
};
</script>
<style lang="stylus">

// div.el-cascader-menus {
//   opacity: 0;
// }

.ivu-cascader-transfer {
  white-space: normal;
}

.ivu-form-item-content {
  display: flex;
}

.ivu-cascader {
  width: 100%;
}

.xb-login {
  height: 100%;
  background: #fff;

  &.move-enter-active, &.move-leave-active {
    transition: all 0.2s linear;
  }

  &.move-enter, &.move-leave-active {
    transform: translate3d(100%, 0, 0);
  }

  .login-header {
    position: fixed;
    z-index: 2;
    width: 100%;
    display: flex;
    justify-content: center;
    height: 44px;
    background: #f9f9f9;
    line-height: 44px;
    padding: 0 10px;
    text-align: center;
  
    i, .add {
      line-height: 44px;
      color: #007aff;
    }
  }

  .login-content {
    padding-top: 54px;

    .el-step.is-horizontal:last-of-type {
      width: auto !important;
    }
    .remark-dept {
      margin-top: -12px;
      padding-bottom: 10px;
      padding-left: 78px;
      font-size: 12px;
      line-height: 1.2;
    }
  }

  .ivu-form {
    width: 80%;
    margin: 10px auto;
  }

  .nextStep {
    width: 80%;
  }
}
// 审核页面
.success-wrap 
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 99
  background: #fff

</style>
