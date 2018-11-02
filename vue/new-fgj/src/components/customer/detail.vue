<template>
  <transition name="move">
    <div class="detail xb-detail" ref="detail">
      <div class="header-wrapper">
        <div class="header">
          <i @click="hide()" class="el-icon-arrow-left"></i>
          <span class="title">详情</span>
          <router-link :to="{name:'跟进',query:{id:InquiryID}}" class="add" tag="span">跟进</router-link>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="报备历史" name="first">
          <div class="f-content" v-loading="loading">
            <el-tree :data="historyData" :props="defaultProps" @node-click="handleNodeClick" :indent="7"
                     :render-content="renderContent"></el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="客户详情" name="second">
          <div class="f-content">
            <div class="pack_1">
              <p><span class="title">客户名称</span><span>{{customerData.CustName}}</span></p>
              <p><span class="title">昵称</span><span>{{customerData.NickName}}</span></p>
              <p style="line-height:36px">
                <span class="title">客户号码</span>
                <span v-show="!allphone">{{customerData.CustMobile}}</span>
                <span v-show="allphone">{{phoneData.CustMobile}}</span>
                
                <el-button v-show="customerData.haveall=== '1'" @click="getNumber()" class="allphone" type="primary">取电</el-button>

                <a class="el-button el-button--primary" v-show="isCanTel" :href="CustMobileTel">拨号</a>
              </p>
              <p><span class="title">客户分类</span><span>{{customerData.CustGrade}}</span></p>
              <p><span class="title">标签</span><span><el-tag v-for="item in tag" :key="item.id" style="margin:5px 5px 5px 0"
                                                            type="gray">{{item}}</el-tag></span></p>
            </div>

            <div class="pack_2">
              <p><span class="title">需求户型</span><span>{{customerData.CountF}}</span></p>
              <p><span class="title">需求类型</span><span>{{customerData.PropertyUsage}}</span></p>
              <p><span class="title">面积</span><span>{{customerData.SquareMin}}-{{customerData.SquareMax}}㎡</span></p>
              <p><span class="title">价格</span><span>{{parseInt(customerData.PriceMin)}}-{{parseInt(customerData.PriceMin)}}万</span></p>
              <p><span class="title">备注</span><span>{{customerData.Remark}}</span></p>
            </div>

            <div class="pack_1">
              <p><span class="title">职业</span><span>{{customerData.CustType}}</span></p>
              <p><span class="title">籍贯</span><span>{{customerData.Origin}}</span></p>
              <p><span class="title">年龄</span><span>{{customerData.Age}}</span></p>
              <p><span class="title">生日</span><span>{{customerData.Birthday}}</span></p>
              <p><span class="title">住址</span><span>{{customerData.CustAddress}}</span></p>
            </div>

            <div class="pack_2">
              <p><span class="title">婚姻</span><span>{{customerData.Marriage}}</span></p>
              <p><span class="title">子女</span><span>{{customerData.Children}}</span></p>
              <p><span class="title">父母</span><span>{{customerData.Parents}}</span></p>
              <p><span class="title">父亲工作</span><span>{{customerData.FatherWork}}</span></p>
              <p><span class="title">母亲工作</span><span>{{customerData.MotherWork}}</span></p>
            </div>

            <div class="pack_1">
              <p><span class="title">收入情况</span><span>{{customerData.Interest}}</span></p>
              <p><span class="title">消费</span><span>{{customerData.Ability}}</span></p>
              <p><span class="title">性格</span><span>{{customerData.Nature}}</span></p>
              <p><span class="title">收入</span><span>{{customerData.Income}}</span></p>
              <p><span class="title">作息</span><span>{{customerData.Rest}}</span></p>
              <p><span class="title">房产|车辆|存款</span><span>{{customerData.Assets}}</span></p>
              <!--<p><span class="title">房产</span><span v-text="customerData.Assets.spilt('|')[0]"></span></p>-->
              <!--<p><span class="title">车辆</span><span v-text="customerData.Assets.spilt('|')[1]"></span></p>-->
              <!--<p><span class="title">存款</span><span v-text="customerData.Assets.spilt('|')[2]"></span></p>-->
              <p><span class="title">投资</span><span>{{customerData.Experience}}</span></p>
              <p><span class="title">决策</span><span>{{customerData.Policymakers}}</span></p>
              <p><span class="title">看房</span><span>{{customerData.LookHouse}}</span></p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {
  GetMobile,
  GetInquiryById,
  GetInquiryOpHistory
} from "../../api/customer/detail";
import { verifyData } from '@/utils/index'

export default {
  data() {
    return {
      loading: true,
      item: {},
      InquiryID: 0,
      customerData: [], // 传递客户详情数据
      historyData: [], // 报备历史
      phoneData: "",
      allphone: false,
      tag: [], // 标签
      activeName: "first", // 默认展开标签页
      personData: [
        {
          label: "一级 1",
          dis: "xxxxxx",
          children: [
            {
              label: "二级 1-1",
              dis: "xxxxxx",
              children: [
                {
                  label: "三级 1-1-1",
                  dis: "xxxxxx",
                  children: [
                    {
                      label: "三级 222",
                      dis: "xxxxxx",
                      children: [
                        {
                          label: "一级 1",
                          dis: "xxxxxx"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      // 传递自定义字段
      defaultProps: {
        children: "children",
        label: "label"
      },
      isCanTel: '',    // 能否拨号
    };
  },
  mounted() {
    // this.item = this.$route.params.item
    this.InquiryID = this.$route.query.id
    console.log(this.item)
    // 客户详情
    GetInquiryById(this.InquiryID)
      .then(res => {
        // console.log(res);
        if (res.data.result === "权限不足") {
          this.$message.error('权限不足')
          setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          return;
        } else if (res.data.result === "success") {
          this.customerData = eval(res.data.tempTable[0]);

          let CustMobile = res.data.tempTable[0].CustMobile;
          if (verifyData(CustMobile, 'phone')) {
            this.isCanTel = CustMobile
          }
        } else if (res.data.result === "error") {
          console.log(res.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
    // 历史
    GetInquiryOpHistory(this.InquiryID)
      .then(res => {
        console.log(res);
        if (res.data.result === "权限不足") {
          this.$message.error('权限不足')
          setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          return;
        } else if (res.data.result === "success") {
          this.historyData = eval(res.data.data);
          this.loading = false
          console.log(this.historyData);
        } else if (res.data.result === "error") {
          console.log(res.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });

    if (this.customerData.Tag !== "" && this.customerData.Tag !== undefined) {
      console.log(this.customerData.Tag);
      this.tag = this.customerData.Tag.split("|");
      this.tag.shift();
    }
    // 全号
  },
  computed: {
    // 拨号电话
    CustMobileTel() {
      return 'tel:' + this.isCanTel
    }
  },
  methods: {
    getNumber() {
      this.allphone = true;
      GetMobile(this.customerData.InquiryID)
        .then(res => {
          if (res.data.result === "success") {
            this.phoneData = res.data;

            let CustMobile = res.data.CustMobile;
            if (verifyData(CustMobile, 'phone')) {
              this.isCanTel = CustMobile
            }

          } else if (res.data.result === "error") {
            this.$message.error(res.data.msg);
          } else {
            console.log("请求失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleNodeClick(data) {
      console.log(data);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    show() {},
    hide() {
      (this.allphone = false), window.history.go(-1);
    },
    // 自定义内容
    renderContent(h, { node, data, store }) {
      return (
        //          <span>
        //          <span>
        //          <p>{data.EstateName}</p>
        //          <p>{data.DeclareEmpName}</p>
        //        </span>
        //        </span>
        <span class="wrapper">
          <span class="wrapper-part">
            <span>
              <span class="name"> {data.EstateName}</span>
              <p class="time"> {data.DeclareDate}</p>
            </span>
            <span>
              <span class="name"> {data.VisitEmpName}</span>
              <p class="time"> {data.VisitDate}</p>
            </span>
            <span>
              <span class="name"> {data.ReceptionEmpName}</span>
              <p class="time"> {data.ReceptionDate}</p>
            </span>
          </span>

          <span class="wrapper-part" style="text-align:right">
            <span>
              <span class="name"> {data.DeclareEmpName}</span>
              <p class="time !== 0"> {data.ExpireDate}</p>
            </span>
            <span>
              <span class="name"> {data.VisitType}</span>
              <p class="time"> {data.VisitExpireDate}</p>
            </span>
            <span>
              <span class="name"> {data.ReceptionType}</span>
            </span>
          </span>
        </span>
      );
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

.xb-detail {
  margin: 0;
  background: #f8f8f8;
  height: 100%;
}

.el-icon-arrow-left {
  font-size: 20px;
}

.cell {
  text-align: center;
}

.el-dialog {
  z-index: 1;
}

.el-tree-node {
  position: relative;

  &::after {
    position: absolute;
    width: 100%;
    border-bottom: 1px solid #cccccc;
    content: '';
  }

  &:last-child::after {
    display: none;
  }
}

.el-tree-node__content {
  height: 44px;
  line-height: 44px;
  display: flex;
  justify-content: space-between;

  .el-tree-node__expand-icon {
    margin-top: 14px;
    flex: 0 0 12px;
  }

  .wrapper {
    padding-right: 10px;
    line-height: 21px;
    display: flex;
    flex: 1;
    justify-content: space-between;

    .wrapper-part {
      position: relative;

      .time {
        padding: 0;
        top: 15px;
        font-size: 11px;
        left: 0;
        color: #7e8c8d;
        border: none;
      }

      .name {
        font-size: 12px;
      }
    }
  }
}

.xb-detail {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  z-index: 40;
  width: 100%;
  top: 0;
  min-height: 100%;
  left: 0;
  line-height: 1.4;
  background: #fff;

  &.move-enter-active, &.move-leave-active {
    transition: all 0.2s linear;
  }

  &.move-enter, &.move-leave-active {
    transform: translate3d(100%, 0, 0);
  }

  .header-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;

    .header {
      display: flex;
      justify-content: space-between;
      height: 44px;
      background: #f9f9f9;
      line-height: 44px;
      font-size: 16px
      i {
        font-size 20px
      }
      i, .add {
        padding 0 10px
        line-height: 44px;
        color: #007aff;
      }
    }
  }

  .el-tabs__nav {
    width: 100%;
    text-align: center;

    .el-tabs__item {
      width: 50%;
    }
  }

  .el-tabs {
    position: relative;
    padding-top: 44px;

    .el-tabs__header {
      position: fixed;
      top: 44px;
      width: 100%;
      background-color: #ffffff;
      z-index: 1;
    }

    .el-tabs__content {
      padding-top: 42px;
    }

    .f-content {
      text-align: left;

      .pack_2 {
        background-color: #f9f9f9;
      }

      p {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #cccccc;
        padding: 10px 5px;

        .title {
          font-weight: bold;
          flex: 0 0 100px;
        }

        span {
          flex: 1;
          padding: 0 5px;
        }
      }
    }

    .el-dialog--small {
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
