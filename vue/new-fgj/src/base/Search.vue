<template lang="html">
  <!-- 搜索 -->
  <section class="max-auto search-wrap" @touchmove.prevent>
    <div class="search">
      <i class="el-icon-search"></i>
      <input class="search-input" v-model="query" type="text" :placeholder="placeholder">
      <i class="el-icon-circle-close" v-show="query" @click="clear"></i>
    </div>
  </section>
</template>

<script>
  import { timeBounce } from '@/utils/index'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索关键字，如姓名，电话，标签...'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    created() {
      this.$watch('query', timeBounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 300))
    },
    methods: {
      clear() {
        this.query = ''
      },
      setQuery(query) {
        this.query = query
      },
      blur() {
        this.$refs.query.blur()
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-wrap {
    position: relative;
    z-index: 5;
    padding: 10px;
    background-color: #f5f5f5;
  }
  .search {
    display: flex;
    align-items: center;
    border-radius: 4px;
    height: 30px;
    text-align: left;
    background-color: #DFE4ED;
    .el-icon-search {
      padding: 0 6px;
      font-size: 16px;
      color: #5A5E66;
    }
    .search-input {
      flex: 1;
      font-size: 14px;
      color: #5A5E66;
      background-color: transparent;
      &:focus {
        outline: none;
      }
    }
    .el-icon-circle-close {
      padding: 5px;
      font-size: 20px;
      color: #878D99;
    }
  }
</style>
