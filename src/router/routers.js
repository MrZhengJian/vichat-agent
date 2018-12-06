import Main from '@/view/main'
import parentView from '@/components/parent-view'
import i18n from '@/locale'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导z航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */
export default [
  
  {
    path: '/login',
    name: 'login',
    meta: {
      title: i18n.t('login'),
      hideInMenu: true,
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: false,
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: i18n.t('home'),
          notCache: true,
        },
        component: () => import('@/view/single-page/home/home.vue')
      },
      {
        path: '/Expiring',
        name: 'Expiring',
        meta: {
          hideInMenu: true,
          title: i18n.t('home'),
          notCache: true,
        },
        component: () => import('@/view/single-page/home/home_details.vue')
      }
    ]
  },
  {
    path: '/account_management',
    name: 'account_management',
    component: Main,
    meta: {
      icon: 'md-people',
      title: i18n.t('account_management'),
    },
    children: [ 
        {
            path: '/my_account', 
            name: 'my_account', 
            meta: {
              hideInMenu: false,
              icon: 'md-person',
              title: i18n.t('my_account'),
            },   
            component: () => import('@/view/myAccount-management/myAccount-management.vue')
        },
        {
            path: '/role', 
            name: 'role', 
            meta: {
              hideInMenu: false,
              icon: 'md-key',
              title: i18n.t('role'),
            },   
            component: () => import('@/view/role-management/role.vue')
        }
    ]
  },
  {
    path: '/management',
    name: 'management',
    component: Main,
    meta: {
      title: i18n.t('Enterprise_management'),
    },
    children: [ 
        {
            path: 'Enterprise_management', 
            name: 'Enterprise_management', 
            meta: {
              hideInMenu: false,
              icon: 'md-home',
              title: i18n.t('Enterprise_management'),
            },   
            component: () => import('@/view/Enterprise-management/Enterprise-management.vue')
        },
        {
          path: '/user',
          name: 'user',
          meta: {
            hideInMenu: true,
            icon: 'md-person',
            title: i18n.t('user'),
          },
          component: () => import('@/view/user-management/user-management.vue')
        },
        {
          path: '/org',
          name: 'org',
          meta: {
            hideInMenu: true,
            icon: 'md-person',
            title: i18n.t('org'),
          },
          component: () => import('@/view/org-management/org-management.vue')
        },
        {
          path: '/channel',
          name: 'channel',
          meta: {
            title: i18n.t('channel'),
            icon: 'md-flag',
            hideInMenu: true,
          },
          component: () => import('@/view/channel-management/channel-management.vue')
        },
        {
          path: '/channel_details',
          name: 'channel_details',
          meta: {
            title: i18n.t('channel_details'),
            icon: 'md-flag',
            hideInMenu: true,
          },
          component: () => import('@/view/channel-management/channel-details.vue')
        }
    ]
  },
  {
    path: '/Amanagement',
    name: 'Amanagement',
    component: Main,
    meta: {
      title: i18n.t('Amanagement'),
    },
    children: [ 
        {
            path: 'Agent_management', 
            name: 'Agent_management', 
            meta: {
              hideInMenu: false,
              icon: 'md-contacts',
              title: i18n.t('Amanagement'),
            },   
            component: () => import('@/view/Agent-management/Agent-management.vue')
        }
        // {
        //   path: '/a_user',
        //   name: 'a_user',
        //   meta: {
        //     hideInMenu: true,
        //     icon: 'md-person',
        //     title: i18n.t('a_user'),
        //   },
        //   component: () => import('@/view/Agent-management/agent-account/agent-account.vue')
        // },
    ]
  },
  {
    path: 'SN',
    name: 'SN',
    component: Main,
    meta: {
      title: i18n.t('SN_management'),
    },
    children: [
      {
        path: '/SN_management',
        name: 'SN_management',
        meta: {
          title: i18n.t('SN_management'),
          hideInMenu: false,
          icon: 'md-flag'
        },
        component: () => import('@/view/SN-management/SN-management.vue')
      }
    ]
  },
  {
    path: '_details_management',
    name: '_details_management',
    component: Main,
    meta: {
      icon: 'md-contacts',
      title: i18n.t('details_management'),
    },
    children: [
      {
        path: '/agent_charge',
        name: 'agent_charge',
        meta: {
          title: i18n.t('details_management'),
          hideInMenu: false,
          icon: 'md-list'
        },
        component: () => import('@/view/details-management/agent-charge/agent-charge.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
