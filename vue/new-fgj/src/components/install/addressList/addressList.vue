<template>
  <transition name="move">
    <div class="building" ref="building">
      <div class="header-wrapper">
        <header class="lc header">
          <i class="el-icon-arrow-left icon" @click="hide"></i>
          <h3 class="title">通讯录</h3>
        </header>
        <el-input
          placeholder="搜索"
          suffix-icon="el-icon-search"
          icon="el-icon-search"
          @blur="handleIconClick"
          v-model="input2">
        </el-input>
      </div>
      <div class="buildingContent">
        <!-- 联系人列表 -->
        <div class="listWrapper page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
          <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :auto-fill="false"
              :bottom-all-loaded="allLoaded" ref="loadmore" v-loading.body="loading">
          <ul>
            <li class="listItem" v-for="item in contactList" :key="item.P">
              <div class="itemTitle">{{item.P}}</div>
              <ul class="itemContent">
                <li class="item" v-for="(dItem,index) in item.children" :key="index" >
                  <img class="author" :src="dItem.picSrc" alt="" width="50" height="50">
                  <div class="itemContent">
                    <p class="title">{{dItem.DeptName}}-{{dItem.EmpName}}</p>
                    <p>
                      <a class="tel" :href="'tel:'+dItem.Tel">{{dItem.Tel}}</a>
                      <span>{{dItem.Status}}</span>
                      <span>{{dItem.PositionName}}</span>
                    </p>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
              <mt-spinner type="snake" color="#26a2ff"></mt-spinner>
            </span>
          </div>
          </mt-loadmore>
        </div>
        <!-- 菜单列表 -->
        <div class="meunWrapper" ref="menuWrapper">
          <ul>
            <li @click="toPoint(index)" class="menuItem" v-for="(item,index) in contactList" :key="item.P">{{item.P}}</li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { contactList } from "@/api/install/addressList/addressList.js";

export default {
  data() {
    return {
      input2: "",
      loading: true,
      bottomStatus: "",
      allLoaded: false,
      wrapperHeight: 0,
      oldData:[], //原始数据
      contactList: {}, //所有通讯录列表
      scrollIndex: 0,
      currentList: [] // 当前显示的列表
    };
  },
  mounted() {
    // 加载通讯录列表
    contactList().then(res => {
      if (res.data.tempTable) {
        this.loading = false
        this.contactList = res.data.tempTable;
        this.oldData = res.data.tempTable
        this.contactList = this.reSet(this.contactList);
        // this.currentList.push(dest[0]);
        // console.log(this.currentList);
      }
      if (res.data.result === '权限不足') {
        this.$message.error('权限不足')
        setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
      }
    });
  },
  methods: {
    // 数组重构
    reSet(array){
        var map = {},
          dest = [];
        for (var i = 0; i < array.length; i++) {
          var ai = array[i];
          if (!map[ai.P]) {
            dest.push({
              P: ai.P,
              children: [ai]
            });
            map[ai.P] = ai;
          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.P == ai.P) {
                dj.children.push(ai);
                break;
              }
            }
          }
        }
        return dest
    },
    // 右侧菜单点击
    toPoint(index){
      // console.log(index)
      const tkd = document.getElementsByClassName('listItem')
      let content = 0
      for(let i=1;i<=index;i++){
        content = content + tkd[i-1].clientHeight
      }
      console.log(content)
      window.scrollTo(0,content)
    },
    // 底部加载
    handleBottomChange (status) {
      console.log(status)
      this.bottomStatus = status
    },
    loadBottom(){
      console.log(document.body.scrollHeight)
      this.scrollIndex += 1
      this.currentList.push(this.contactList[this.scrollIndex])
    },
    handleIconClick(ev) {
      this.loading = true
      console.log(ev);
      let thisArray = []
      this.oldData.forEach((value,index,array)=>{
        if(value.Tel.indexOf(this.input2)>-1 || value.EmpName.indexOf(this.input2)>-1|| value.DeptName.indexOf(this.input2)>-1){
        thisArray.push(value)
        }
      })

        console.log(thisArray)
       this.contactList = this.reSet(thisArray)

      this.loading = false
    },
    hide() {
      window.history.go(-1);
    }
  }
};
</script>


<style lang="stylus" rel="stylesheet/stylus">
.building {
  position: relative;
  margin: 0;
  background: #f8f8f8;
}

.header-wrapper {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1;
}
.mint-spinner-snake
  margin 0 auto
.mint-loadmore-bottom
  text-align center
.mint-loadmore
  background #ffffff
.buildingContent {
  width: 100%;
  display: flex;
  position relative
  top 88px
  background: #fff;

  .listWrapper {
    flex: 1;

    .listItem {
      padding-bottom: 10px;

      .itemTitle {
        background: #EDF2FC;
        color: #878D99;
        font-weight: bold;
        padding: 5px 0;
      }

      ul.itemContent {
        margin-bottom: 5px;

        .item {
          display: flex;
          margin: 0 10px;
          padding: 3px 0;
          position: relative;

          &::after {
            position: absolute;
            bottom: 0;
            left: 0;
            content: '';
            border-bottom: 1px solid #EDF2FC;
            width: 100%;
          }

          img.author {
            border-radius: 45px;
            margin: 0 5px;
          }

          .itemContent {
            padding: 6px 5px;
            text-align: left;

            p {
              padding-bottom: 10px;
              font-size: 12px;
              color: #878D99;

              .tel {
                color: #409EFF;
              }

              span {
                padding: 0 5px;
              }
            }

            .title {
              font-weight: bold;
              font-size: 14px;
              color: #5A5E66;
            }
          }
        }
      }
    }
  }

  .meunWrapper {
    flex: 0 0 20px;
    position: fixed;
    top: 120px;
    right: 0;

    .menuItem {
      padding: 0 7px;
      display: table;
    }
  }
}

.building {
  position: absolute;
  z-index: 40;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  background: #fff;

  &.move-enter-active, &.move-leave-active {
    transition: all 0.2s linear;
  }

  &.move-enter, &.move-leave-active {
    transform: translate3d(100%, 0, 0);
  }

  .header {
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
}
</style>
