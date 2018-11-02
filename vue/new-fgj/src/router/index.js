import Vue from 'vue'
import Router from 'vue-router'
import Continue from '@/components/inquiry/Continue'      // 为了兼容vivo9手机，不使用懒加载

Vue.use(Router)

document.getElementById('loaderFooter').innerHTML = 'router开始执行'

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/inquiry'
    },
    {
      path: '/home',
      name: '首页',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/home.vue'], resolve)
      }
    },
    {
      path: '/visit',
      name: '辨客',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/visit/visit.vue'], resolve)
      }
    },
    {
      path: '/organization',
      name: '组织架构',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/organization/organization.vue'], resolve)
      }
    },
    {
      path: '/login',
      name: '注册',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/login/login.vue'], resolve)
      }
    },
    {
      path: '/loginSuccess',
      name: '等待审核',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/login/loginSuccess.vue'], resolve)
      }
    },
    {
      path: '/install',
      name: '设置',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/install/install.vue'], resolve)
      },
      children: [
        {
          path: 'addressList',
          name: '通讯录',
          meta: {
            keepAlive: false
          },
          component: (resolve) => {
            require(['../components/install/addressList/addressList.vue'], resolve)
          }
        }
      ]
    },
    // 工具模块
    {
      path: '/tools',
      name: '工具',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/tools/tools.vue'], resolve)
      },
      children: [
        {
          path: 'judgment',
          name: '判单工具',
          meta: {
            keepAlive: false
          },
          component: (resolve) => {
            require(['../components/tools/judgment/judgment.vue'], resolve)
          }
        }
      ]
    },

    // 下面是黎聪配置的路由
    {
      path: '/estate',
      name: '楼盘列表',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/estate/Estate'], resolve)
      },
      children: [
        {
          path: ':id',
          name: '楼盘详情',
          meta: {
            keepAlive: true
          },
          component: (resolve) => {
            require(['../components/estate/EstateDetail'], resolve)
          },
          children: [
            {
              path: 'bmap',
              name: '楼盘地图',
              meta: {
                keepAlive: true
              },
              component: (resolve) => {
                require(['../components/estate/BMap'], resolve)
              }
            }
          ]
        }
      ]
    },
    {
      path: '/addition',
      name: '楼盘添加',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/estate/EstateAdd'], resolve)
      }
    },
    {
      path: '/reported',
      name: '报备大厅',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/reported/Reported'], resolve)
      },
      children: [
        {
          path: 'screen',
          name: '报备大厅筛选',
          meta: {
            keepAlive: true
          },
          component: (resolve) => {
            require(['../components/reported/ReportedScreen'], resolve)
          }
        }
      ]
    },
    {
      path: '/inquiry',
      name: '客户列表',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/inquiry/Inquiry'], resolve)
      },
      children: [
        {
          path: 'detail',
          name: '客户详情',
          meta: {
            keepAlive: true
          },
          component: (resolve) => {
            require(['../components/customer/detail.vue'], resolve)
          }
        },
        {
          path: 'follow',
          name: '跟进',
          meta: {
            keepAlive: true
          },
          component: (resolve) => {
            require(['../components/customer/follow.vue'], resolve)
          }
        }
      ]
    },
    {
      path: '/myReport',
      name: '我的报备',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/inquiry/MyReport'], resolve)
      }
    },
    {
      path: '/transfer',
      name: '公客池',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/inquiry/InquiryTransfer'], resolve)
      }
    },
    {
      path: '/transferClip',
      name: '抢客',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/inquiry/InquiryTransferClip'], resolve)
      }
    },
    {
      path: '/continue',
      name: '客户续报',
      meta: {
        keepAlive: true
      },
      component: Continue
    },
    {
      path: '/reception',
      name: '接待列表',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/reception/Reception'], resolve)
      }
    },
    {
      path: '/linkman',
      name: '联系人',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/reception/Linkman'], resolve)
      }
    },
    {
      path: '/propertyAdd',
      name: '房源新增',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/property/PropertyAdd'], resolve)
      }
    },
    {
      path: '/propertyList',
      name: '房源列表',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/property/propertyList'], resolve)
      },
      children: [
        {
          path: ':id',
          name: '房源详情',
          meta: {
            keepAlive: true
          },
          component: (resolve) => {
            require(['../components/property/propertyDetails'], resolve)
          }
        }
      ]
    },
    {
      path: '/control',
      name: '销控管理',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/control/Control'], resolve)
      }
    },
    // {
    //   path: '/contractAdd',
    //   name: '合同录入',
    //   meta: {
    //     keepAlive: false
    //   },
    //   component: (resolve) => {
    //     require(['../components/contract/contractAdd'], resolve)
    //   },
    //   children: [
    //     {
    //       path: 'per',
    //       name: '录入合同业绩',
    //       meta: {
    //         keepAlive: false
    //       },
    //       component: (resolve) => {
    //         require(['../components/contract/ContractAddPer'], resolve)
    //       }
    //     },
    //     {
    //       path: 'fin',
    //       name: '财务收付',
    //       meta: {
    //         keepAlive: false
    //       },
    //       component: (resolve) => {
    //         require(['../components/contract/ContractAddFin'], resolve)
    //       }
    //     }
    //   ]
    // },
    {
      path: '/contractList',
      name: '合同列表',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/contract/ContractList'], resolve)
      },
      children: [
        {
          path: 'contractAdd',
          name: '合同录入',
          meta: {
            keepAlive: true
          },
          component: (resolve) => {
            require(['../components/contract/contractAdd'], resolve)
          },
          children: [
            {
              path: 'per',
              name: '录入合同业绩',
              meta: {
                keepAlive: true
              },
              component: (resolve) => {
                require(['../components/contract/ContractAddPer'], resolve)
              }
            },
            {
              path: 'fin',
              name: '财务收付',
              meta: {
                keepAlive: true
              },
              component: (resolve) => {
                require(['../components/contract/ContractAddFin'], resolve)
              }
            }
          ]
        },
        {
          path: 'processDetail',
          name: '详细流程',
          meta: {
            keepAlive: true
          },
          component: (resolve) => {
            require(['../components/process/ProcessDetail'], resolve)
          }
        },
      ]
    },
    {
      path: '/account',
      name: '对账单',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/contract/Account'], resolve)
      }
    },
    {
      path: '/accountList',
      name: '对账单列表',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/contract/AccountList'], resolve)
      }
    },
    {
      path: '/process',
      name: '管理流程',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/process/Process'], resolve)
      }
    },
    // {
    //   path: '/processDetail',
    //   name: '详细流程',
    //   meta: {
    //     keepAlive: false
    //   },
    //   component: (resolve) => {
    //     require(['../components/process/ProcessDetail'], resolve)
    //   }
    // },
    {
      path: '/mailAdd',
      name: '输入邮件内容',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/mail/MailAdd'], resolve)
      }
    },
    {
      path: '/mailList',
      name: '邮件列表',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/mail/MailList'], resolve)
      },
      children: mailChild()
    },
    {
      path: '/checkEmp',
      name: '人员审核',
      meta: {
        keepAlive: false
      },
      component: (resolve) => {
        require(['../components/employee/CheckEmp'], resolve)
      }
    },
    {
      path: '/echarts',
      name: '图表',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/echarts/Echarts'], resolve)
      },
      children: [
        echartsCommon('1', '用户注册'),
        echartsCommon('2', '用户登陆时段'),
        echartsCommon('3', '客户录入'),
        echartsCommon('4', '抢客图表'),
        echartsCommon('5', '客户跟进'),
        echartsCommon('6', '客户报备'),
        echartsCommon('7', '客户到访'),
        echartsCommon('8', '客户成交'),
        echartsCommon('9', '到访转化率'),
        echartsCommon('10', '成交转化率')
      ]
    }
  ],
  linkActiveClass: 'active'
})

/**
 * 图表复用函数
 * @param {String} path   序列号 
 * @param {String} name   图表名称
 * @returns 
 */
function echartsCommon (path, name) {
  return {
    path: path,
    name: name,
    meta: {
      keepAlive: true
    },
    component: (resolve) => {
      require(['../components/echarts/Echarts-' + path], resolve)
    }
  }
}

// 邮件详细页
function mailChild() {
  return [
    {
      path: 'mailDetail',
      meta: {
        keepAlive: true
      },
      component: (resolve) => {
        require(['../components/mail/mailDetail'], resolve)
      },
      children: [
        {
          path: 'reply',
          meta: {
            keepAlive: true
          },
          component: (resolve) => {
            require(['../components/mail/MailAdd'], resolve)
          }
        }
      ]
    }
  ]
}

// 防止地址错误
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    from.name ? next({ name: from.name }) : next('/')
  } else {
    next()
  }
})

export default router
