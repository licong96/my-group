<template>
  <transition name="move">
    <div class="visit xb-visit" v-loading.body="loading">
      <div class="head-fixed">
        <header class="lc header">
          <i class="el-icon-arrow-left icon" @click="_back"></i>
          <h3 class="title">辩客</h3>
          <span class="right-span" @click="openReception"><el-button type="primary" size="small">接待</el-button></span>
        </header>
        <div class="visit-content">
          <div class="visit-building">
            <!-- <Cascader :data="buildingData" v-model="value1" size="large"></Cascader> -->
            <el-select v-model="value1" placeholder="请选择楼盘">
              <el-option
                v-for="(item, index) in buildingData"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="tel">
            <input type="tel" id="tel" v-model="input" placeholder="请输入手机号码全号或前三后四位或后四位">
            <el-button @click="searchData()" type="primary">查询</el-button>
          </div>
        </div>
      </div>

      <!--查询结果-->
      <div class="result">
        <ul class="list-wrapper active" :class="{'active':buttonShow}">
          <li v-for="cData in customers" :key="cData.id" class="item">
            <!-- 角标 -->
            <el-checkbox-group v-model="cData.checkedCustomer">
              <el-checkbox v-for="item in cData.report" :key="item.DeclareID" :label="item.DeclareID" @change="_check(cData)">
                <div class="flex-wrap">
                <div class="mark" v-show="item.VisitApplyIsValid == '1'">已申请</div>
                  <div class="text">
                    <div class="customer">
                      <span class="name">{{item.CustName}} - </span>
                      <span class="tel">{{cData.CustMobile}}</span>
                    </div>
                    <div class="report">
                      <p>报备：{{item.DeptName}} - {{item.DeclareEmpName}} {{item.DeclareDate}}</p>
                      <p v-show="item.VisitOpDeptName">到访({{item.VisitCount}})：{{item.VisitOpDeptName}} - {{item.VisitOpEmpName}} {{item.VisitDate}}</p>
                      <p v-show="item.ReceptionOpDeptName">接待({{item.ReceptionCount}})：{{item.ReceptionOpDeptName}} - {{item.ReceptionOpEmpName}} {{item.ReceptionDate}}</p>
                    </div>
                  </div>
                  <div class="img-wrap" v-show="item.PhotoPath" @click.stop="openFullImage(item.PhotoPath)">
                    <img class="img" :src="picPath(item.PhotoPath)" alt="">
                    <!-- <img class="img" src="http://img2.imgtn.bdimg.com/it/u=623402190,3738882342&fm=11&gp=0.jpg" alt=""> -->
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </li>
        </ul>
      </div>
      <!-- 没有 -->
      <empty v-show="!customers.length"></empty>

      <!-- 图片全屏预览 -->
      <el-dialog
        :visible.sync="dialogImageFull"
        width="94%">
        <img style="max-width: 100%;" :src="picPath(dialogImagePic)" alt="">
      </el-dialog>

      <!--底部按钮-->
      <div :class="{'active':buttonShow}" class="button-list">
        <el-button @click="makeSure('疑似')" v-show="!swiper || Iswiper" type="danger">疑似到访</el-button>
        <!-- <el-button @click="makeSure('到访')" :disabled="!swiper" type="success">到访</el-button> -->
        <el-button @click="makeSure('约访')" :disabled="!swiper" type="warning">约访</el-button>
        <el-button @click="makeSure('带访')" :disabled="!swiper" type="primary">带访</el-button>
      </div>

      <!--确认弹框-->
      <el-dialog
        title="确认"
        size="tiny"
        @close="dialogVisible1=false;nowCustomers=[];companyValue=[]"
        :visible.sync="dialogVisible1">
        <div class="block" style="display: block">
          <p>请再次确定你所操作的公司是<span v-for="item in nowCustomers" :key="item" style="color: #FA5555">{{item}}</span></p>
          <el-checkbox-group v-model="companyValue" style="margin-top: 10px">
            <el-checkbox v-for="item in companyOption" :key="item" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="success" @click="_reception()">确定</el-button>
        </span>
      </el-dialog>
      <!--补全号码-->
      <el-dialog
        title="补全号码"
        size="tiny"
        @close="dialogVisible2=false"
        :visible.sync="dialogVisible2">
        <div class="block" style="display: block">
          <input type="tel" id="tel" v-model="input2" placeholder="请补全号码">
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="_reception('Gstring')">无全号</el-button>
          <el-button type="success" @click="completeNumber()">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
/*
  VisitApplyIsValid : 0 没有角标，是 1 表示有角标
  PhotoPath： 图片
*/

import Empty from '@/base/Empty'
import {
  estate,
  SelectFilingByTel,
  autofiling,
  up_Visit
} from "../../api/visit/visit";
import { isCheckMobile, parseTime, removeTrim } from "@/utils/index.js"; // 正则手机判断
import { vipfgj } from '@/common/js/config'

// import VConsole from 'vconsole'
// var vConsole = new VConsole()

const loaderFooter = document.getElementById('loaderFooter')
loaderFooter.style.display = 'block'
loaderFooter.innerHTML = '辩客正在加载中'

export default {
  data() {
    return {
      companyOption: [],
      cData: [],
      loading: false,
      companyValue: [],
      dialogVisible1: false, // 确认
      dialogVisible2: false, // 补全号码窗口
      makeSureType: "", // 当前状态
      nowCustomers: [], // 当前选中客户
      input: "",
      oldInput: "", // 历史查询号码
      input2: "", // 补全号码
      radioKey: true,
      buttonShow: false, // 底部按钮显示隐藏key
      swiper: true, // 疑似到访key
      Iswiper: true, // 疑似到访key
      value1: '', // 选择的楼盘ID
      buildingData: [], // 楼盘数据
      customers: [],
      oldCustomers: [],
      checkedCities: [], // 选中的报备记录
      EstateID: '',   // 楼盘ID
      dialogImageFull: false,      // 图片全屏显示弹窗
      dialogImagePic: ''          // 图片全屏显示地址
    };
  },
  beforeCreate() {
    loaderFooter.innerHTML = 'beforeCreate'
  },
  created() {
    loaderFooter.innerHTML = 'created'
  },
  beforeMount() {
    loaderFooter.innerHTML = 'beforeMount'
  },
  mounted() {
    loaderFooter.innerHTML = 'mounted'
    loaderFooter.style.display = 'none'
    // 楼盘数据
    estate()
      .then(res => {
        if (res.data.result === "权限不足") {
          this.$message.error('权限不足')
          setTimeout(() => {
            window.location.href = "/Login.html";
          }, 1000)
          return;
        } else if (res.data.result === "success") {
          // console.log(res.data)
          eval(res.data.tempTable).forEach((value, index) => {
            const ss = {
              value: "",
              label: ""
            };
            ss.value = value.EstateID;
            ss.label = value.EstateName;
            this.buildingData.push(ss);
          });
          // console.log(this.buildingData);
        } else if (res.data.result === "error") {
          console.log(res.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    openFullImage(pic) {     // 全屏预览图片
      this.dialogImagePic = pic
      this.dialogImageFull = true
    },
    picPath(pic) {     // 添加测试i地址
      return `${vipfgj}${pic}`
    },
    // 返回
    _back() {
      window.history.go(-1);
    },
    // 初始化
    zero() {
      this.swiper = true;
      this.nowCustomers = [];
      this.buttonShow = false;
      this.checkedCities = [];
      this.cData.checkedCustomer;
      this.companyValue = [];
      this.input = this.oldInput;
      this.input2 = "";
    },
    // 勾选框点击互斥事件
    _check(cData) {
      this.cData = cData;
      console.log('cData', cData);
      
      this.buttonShow = true;
      if (cData.report.length > 1) {
        this.Iswiper = true;
      }
      if (cData.report.length > 1 && cData.checkedCustomer.length > 1) {
        this.swiper = false;
      } else {
        this.swiper = true;
      }
      this.customers.forEach((value, index, arry) => {
        if (cData.checkedCustomer.length === 0) {
          this.buttonShow = false;
          return;
        }
        if (value === cData) {
          return;
        }
        value.checkedCustomer = [];
      });
    },
    isFirstThree(tel) {   // 验证前三后四
      let reg = /^(13[0-9]|147|15[0-9]|18[0-9]|17[0-9]|19[0-9]|16[0-9])([0-9]{4})$/;
      return reg.test(tel)
    },
    // 辩客查询数据
    searchData() {
      this.buttonShow = false;
      this.loading = true;
      this.customers = [];
      if (this.input === "" || !this.value1) {
        this.open("请检查电话号码是否为空，或者楼盘是否选取");
        this.loading = false;
        return;
      } else if (!isCheckMobile(this.input) && !this.isFirstThree(this.input)) {
        this.open("请检查电话号码格式是否正确");
        this.loading = false;
        return;
      }
      SelectFilingByTel(this.value1, this.input)
        .then(res => {
          if (res.data.result === "权限不足") {
            window.location.href = "/Login.html";
            return;
          } else if (res.data.result === "success") {
            this.loading = false;
            this.oldInput = this.input;
            this.oldCustomers = eval(res.data.tempTable);
            // 自来客到访
            let _thisEstateName = "";
            this.buildingData.forEach(value => {
              if (this.value1 === value.EstateID) {
                _thisEstateName = value.EstateName;
              }
            });
            if (
              res.data.tempTable.length === 0 &&
              isCheckMobile(this.input) &&
              this.input.length >= 11
            ) {
              const CustMobile = isCheckMobile(this.input) ? this.input : "";
              const EstateID = this.value1;
              autofiling(CustMobile, _thisEstateName, EstateID)
                .then(res => {
                  if (res.data.result === "success") {
                    this.open("自来客到访成功");
                    // this.$router.push({ path: "/reception", params: {} });
                  } else if (res.data.result === "error") {
                    this.open(res.data.msg);
                  }
                })
                .catch();
            }
            let wrapperArry = eval(res.data.tempTable);
            wrapperArry.forEach((value, index, array) => {
              if (this.companyOption.includes(value.DeptName)) {
                return;
              }
              this.companyOption.push(value.DeptName);
            });
            console.log(wrapperArry);
            // 数组重构
            var map = {},
              dest = [];
            for (var i = 0; i < wrapperArry.length; i++) {
              var ai = wrapperArry[i];
              if (!map[ai.CustMobile]) {
                dest.push({
                  CustMobile: ai.CustMobile,
                  checkedCustomer: [],
                  report: [ai]
                });
                map[ai.CustMobile] = ai;
              } else {
                for (var j = 0; j < dest.length; j++) {
                  var dj = dest[j];
                  if (dj.CustMobile == ai.CustMobile) {
                    dj.report.push(ai);
                    break;
                  }
                }
              }
            }

            this.customers = dest;
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 确认窗口
    makeSure(type) {
      this.checkedCities = this.cData.checkedCustomer;
      console.log('checkedCities', this.checkedCities)
      //        this.companyValue = []
      this.nowCustomers = [];
      this.makeSureType = type;
      this.dialogVisible1 = true;

      this.customers.forEach((value, index, array) => {
        value.report.forEach(value => {
          let _value = value;
          this.checkedCities.forEach((value, index, array) => {
            if (_value.DeclareID === value) {
              this.EstateID = _value.EstateID
              this.nowCustomers.push(_value.DeptName);
              // let one = this.companyOption[0]
              // this.companyOption.shift()
              // this.companyOption.splice(1, 0, one)
              // console.log(this.companyOption)
              this.shuffle(this.companyOption);
              if (this.nowCustomers.includes(_value.DeptName)) {
                return;
              }
            }
          });
        });
      });
      this.unique(this.companyOption);
      this.unique(this.nowCustomers);
    },
    unique(arr) {
      var result = [],
        hash = {};
      for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
          result.push(elem);
          hash[elem] = true;
        }
      }
      return result;
    },
    shuffle(arr) {
      let i = arr.length;
      while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
        return j;
      }
    },
    // 补全号码
    completeNumber() {
      console.log(this.cData.CustMobile.substring(0, 3)+','+this.input2.substring(0, 3))
      console.log(this.cData.CustMobile.substring(7, 11)+','+this.input2.substring(7, 11))
      if (
        isCheckMobile(this.input2) &&
        this.input2.length >= 11 &&
        this.input2.substring(0, 3) == this.cData.CustMobile.substring(0, 3) &&
        this.input2.substring(7, 11) == this.cData.CustMobile.substring(7, 11)
      ) {
        this.open("号码补全成功");
        this.input = this.input2;
        this._reception();
        this.dialogVisible2 = false;
      } else {
        this.open("请输入正确的手机号");
      }
    },
    // 到访
    _reception(Gstring) {
      console.log(Gstring);
      this.dialogVisible2 = false;
      this.nowCustomers = this.unique(this.nowCustomers);
      if (
        this.companyValue.sort().toString() ==
        this.nowCustomers.sort().toString()
      ) {
        this.dialogVisible1 = false;
        let type = this.makeSureType;
        let DeclareArray = "";
        this.checkedCities.forEach((value, index) => {
          if (index === 0) {
            DeclareArray = value;
            return;
          }
          DeclareArray = DeclareArray + "," + value;
        });
        if (
          isCheckMobile(this.input) &&
          this.input.length < 11 &&
          type === "疑似" &&
          !Gstring
        ) {
          this.dialogVisible2 = true;
          return;
        }
        this.loading = true;
        // 添加 VisitNo: 当前时间拼接成一个字符串，一个看不懂的字符串
        let date = removeTrim(parseTime(new Date()))
        let first = ''
        let VisitNo = ''
        console.log(this.EstateArr)

        date.split('-').forEach(item => {
          first += item
        })
        first.split(':').forEach(item => {
          if (item) {
            VisitNo += item
          }
        })
        up_Visit(this.input, DeclareArray, type, VisitNo, this.EstateID)
          .then(res => {
            if (res.data.result === "success" && type !== "疑似") {
              this.loading = false;
              this.$message.success('操作成功')
              // this.$router.push({ path: "/reception", params: {} });
              this.companyValue = [];
            } else if (res.data.result === "error") {
              this.open(res.data.msg);
              this.companyValue = [];
              this.loading = false
            } else if (res.data.result === "success" && type === "疑似") {
              this.$message.success('操作成功')
              // this.$router.push({ path: "/reception", params: {} });
              this.companyValue = [];
              this.loading = false;
              console.log(this.checkedCities);
              this.checkedCities.forEach((value, index, array) => {
                let now = value;
                this.customers.forEach((value, index, array) => {
                  value.checkedCustomer = [];
                  value.report.forEach((value, index, array) => {
                    if (now === value.DeclareID) {
                      console.log(value);
                      array.splice(index, 1);
                    }
                  });
                });
              });
              this.zero(); // 初始化
              this.open("疑似到访成功");
            }
            // 成功后清除数据
            this.customers = [];
            this.buttonShow = false
          })
          .catch(error => {
            this.companyValue = [];
            console.log(error);
            this.$message.error('错误信息是：', error)
          });
      } else {
        this.companyValue = [];
        this.open("检查是否选择错误");
        this.loading = false;
      }
    },
    openReception() {
      this.$router.push({
        path: '/reception'
      })
    },
    // 提示
    open(msg) {
      this.$message(msg);
    }
  },
  components: {
    Empty
  }
};
</script>


<style lang="stylus" rel="stylesheet/stylus">
.xb-visit {
  margin: 0;
  background: #f8f8f8;
  height: 100%;
}

.el-dialog--tiny, .el-dialog {
  width: 80%;
}

#tel {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: 0;
  padding: 3px 10px;
  transition: border-color 0.2s;
  width: 100%;

  &::placeholder {
    color: #dddee1;
  }
}

.list-wrapper.active {
  padding-bottom: 30px;
  height: 70%;
  overflow: scroll;
  position: fixed;
  width: 100%;
  overflow-x: hidden;
}

.xb-visit {
  height: 100%;
  background: #fff;

  &.move-enter-active, &.move-leave-active {
    transition: all 0.2s linear;
  }

  &.move-enter, &.move-leave-active {
    transform: translate3d(100%, 0, 0);
  }
  .head-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  }
  .el-select {
    width: 100%;
  }

  .visit-header {
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

  .visit-content {
    width: 100%;
    background: #fff;
    padding: 15px;

    .tel {
      display: flex;
      justify-content: space-between;

      .el-button.el-button--primary {
        margin-left: 10px;
      }
    }

    .visit-building {
      margin-bottom: 10px;

      .el-icon-arrow-right {
        line-height: 36px;
      }
    }

    .ivu-cascader {
      width: 100%;
    }
  }

  .list-wrapper {
    .item {
      overflow: hidden;
      position: relative;
    }
    .mark {
      position: absolute;
      top: 3px;
      left: -16px;
      width: 56px;
      height: 20px;
      line-height: 20px;
      background-color: #409EFF;
      color: #fff;
      font-size: 10px;
      text-align: center;
      transform: rotate(-45deg);
    }
    .flex-wrap {
      text-align: left;
      display: flex;
      .text {
        flex: 1;
        white-space: normal;
      }
    }
    .img-wrap {
      width: 60px;
      height: 60px;
      .img {
        width: 100%;
      }
    }
  }

  .result {
    padding-top: 164px;
    background: #fff;

    .item {
      border-bottom: 1px solid #bfcbd9;

      .el-checkbox-group {
        width: 100%;

        .el-checkbox {
          display: flex;
          justify-content: space-between;
          padding: 10px;

          .el-checkbox__input {
            flex: 0 0 20px;
            line-height: 50px;
          }

          .el-checkbox__label {
            flex: 1;
            text-align: left;
            line-height: 20px;

            .report {
              font-size: 12px;
              color: #7e8c8d;
            }
          }
        }

        .el-checkbox + .el-checkbox {
          margin: 0;
        }
      }
    }
  }

  .button-list {
    display: flex;
    position: fixed;
    z-index: 2;
    transition: all 0.2s linear;
    width: 100%;
    bottom: -144px;
    left: 0;

    &.active {
      bottom: 10px;
    }

    button {
      width: 100%;
      margin: 0 5px;
    }
  }
}
</style>
