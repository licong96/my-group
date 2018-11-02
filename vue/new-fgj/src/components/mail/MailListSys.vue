<template lang="html">
  <!-- 系统消息 -->
  <section class="mail-list">
    <div class="main">
      <scroll ref="scrolls" :data="listData" :pullup="pullup" @scrollToEnd="scrollToEnd">
        <div>
          <sideslip
            ref="sideslips"
            v-for="(item, index) in listData" :key="index" :item="item" 
            :touchSides="touchSides"
            :paramRight="paramRight"
            :previousEl="previousEl"
            @onTouchSides="onTouchSides"
            @previous="previous"
            @onTouchStart="onTouchStart">
              <!-- 中间内容 -->
              <div class="center" :class="{'read': item.UnReadCount==='0'}" slot="center" @click="openDetail(item)"> 
                <i class="dot">{{item.UnReadCount}}</i>
                <p class="text ellipsis">{{item.MessageContent}}</p>
                <div class="right">
                  <p class="time">{{item.SendTime}}</p>
                  <p class="info"><i class="iconfont icon-tubiao15"></i>{{item.ReplyCount}}</p>
                </div>
              </div>
              <!-- 右侧按钮，用了滑动组件之后，点击事件的父容器就不需要 touchStart.stop -->
              <div class="side-right" slot="right" :style="paramRight.style">
                <span class="button yellow" :style="paramRight.btnStyle1" @click="onReply(item)">标记已读</span>
              </div>
          </sideslip>
          <loader v-show="hasMore"></loader>
          <empty v-show="!hasMore && !listData.length"></empty>
        </div>
      </scroll>
    </div>
    <transition name="transX">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { MessageSetReader } from "@/api/mail/mailList";
import { mailList } from '@/common/js/mixin'
import { mapGetters } from 'vuex'

export default {
  mixins: [mailList],
  data() {
    return {
      MessageType: '系统'
    }
  },
  computed: {
    ...mapGetters([
      'getMailLikestr'
    ])
  },
  methods: {
    openDetail(item) {
      // 打开详细页
      this.$router.push({
        path: "/mailList/sys/mailDetail",
        query: {
          id: item.MessageID
        }
      });
      MessageSetReader(item.MessageID) // 标记已读
      item.UnReadCount = '0' // 未读数设为0
    },
  },
  watch: {
    getMailLikestr(newVal) {
      if (this.MessageType === '系统') {
        console.log(newVal)
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../common/sass/variable";
@import "../../common/sass/mixin";

.mail-list {
  .main {
    overflow: hidden;
    position: absolute;
    top: 132px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    padding-bottom: 32px;
    text-align: left;
  }
  .center {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px 10px 24px;
    @include border-b-1px(0);
    &.read {
      .dot {
        display: none;
      }
      .text {
        color: #999;
      }
    }
    .dot {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 50%;
      left: 6px;
      margin-top: -7px;
      border-radius: 50%;
      padding: 0 2px;
      min-width: 14px;
      min-height: 14px;
      font-size: 12px;
      font-style: normal;
      color: #fff;
      background-color: $color-red;
    }
    .text {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
    .right {
      font-size: 12px;
      color: #999;
      .info {
        padding-top: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .iconfont {
        padding-right: 2px;
      }
    }
  }
}
</style>
