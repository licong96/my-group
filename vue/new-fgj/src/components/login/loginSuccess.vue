<template>
<transition name="move">
  <div class="loginSuccess">
    <div class="loginSuccess-header">
      <i @click="hide()" class="el-icon-arrow-left"></i>
      <span class="title">信息补全成功</span>
      <span class="add">&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </div>
    <div class="loginContent">
      <div class="textBox el-card">
        <i class="el-icon-success"></i>
        <p>您的信息正在审核中，<br>您可以通过联系以下人员快速通过审核</p>
        <el-button type="danger" @click="toLogin()" style="margin-top:20px">重新登录</el-button>
      </div>
      <el-card v-for="(item,index) in admins" :key="index" class="box-card">
        <img :src="!item.picSrc?'static/img/default_header.png':item.picSrc" alt="" width="50" height="50">
        <div class="text item">{{item.EmpName}}</div>
        <a :href="'tel:'+item.Tel" class="text item tel">{{item.Tel}}</a>
      </el-card>
    </div>
  </div>
</transition>
</template>
<script>
import { verifyLogin } from '@/api/login/login';
import { GetManagerEmloyee } from "@/api/login/loginSuccess";

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      admins: []
    };
  },
  created () {
    console.log('部门ID', this.id)
  },
  mounted() {
    // const DeptId = this.$route.query.DeptId ? this.$route.query.DeptId : "";
    // const EmpId = this.$route.query.EmpId ? this.$route.query.EmpId : "";
    // console.log(DeptId)
    // console.log(EmpId)
    // if (DeptId == "" && EmpId == "") {
    //   window.location.href = "/Login.html";
    // }
    GetManagerEmloyee(this.id)
      .then(res => {
        if (res.data.tempTable) {
          this.admins.push(res.data.tempTable[0]);
          this.admins.push(res.data.tempTable[1]);
        }
      })
      .catch();
  },
  methods: {
    hide() {
      window.history.go(-1);
    },
    toLogin() {
      window.location.href = "/Login.html";
    }
  }
};
</script>
<style lang="stylus">
.loginSuccess {
  position: absolute;
  top: 0;
  left: 0px;
  width: 100%;
  z-index: 40;
  background: #f9f9f9;

  &.move-enter-active, &.move-leave-active {
    transition: all 0.2s linear;
  }

  &.move-enter, &.move-leave-active {
    transform: translate3d(100%, 0, 0);
  }

  .loginSuccess-header {
    display: flex;
    justify-content: space-between;
    height: 44px;
    background: #f9f9f9;
    line-height: 44px;
    padding: 0 10px;

    i, .add {
      line-height: 44px;
      color: #007aff;
    }
  }

  .textBox {
    text-align: center;
    padding: 30% 40px;

    .el-icon-success {
      font-size: 50px;
      padding: 10px;
      color: #67C23A;
    }

    p {
      line-height: 20px;
    }
  }

  .loginContent {
    text-align: left;

    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .clearfix:before, .clearfix:after {
      display: table;
      content: '';
    }

    .clearfix:after {
      clear: both;
    }

    .box-card {
      width: 100%;

      .el-card__body {
        display: flex;
        padding: 10px 20px;

        img {
          border-radius: 45px;
          background: url('default_header.png') no-repeat;
          background-size: 100%;
        }

        .item {
          margin: 0 20px;
          line-height: 50px;
        }

        .tel {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
</style>
