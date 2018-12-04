import { getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute, routeHasExist } from '@/libs/util'
import routers from '@/router/routers'
import { querySecPrivilege } from '@/api/user'
import $ from 'jquery'
import i18n from '@/locale'


const _routers = JSON.parse(JSON.stringify(routers))
const whitelist = ['login','register','_home','home',"error_401","error_500","error_404"]
let accessList = []
function creatAccessList(arr){

  for(let i=0;i<arr.length;i++){
    accessList.push(arr[i].name)
    if(arr[i].children&&arr[i].children.length>0){
      creatAccessList(arr[i].children)
    }
  }
}
function checkRoutes(arr){
  for(let i=0;i<arr.length;i++){
    if(whitelist.indexOf(arr[i].name)>-1||accessList.indexOf(arr[i].name)>-1){
      if(arr[i].name=='account_management'&&arr[i].children&&arr[i].children.length>0){
        checkRoutes(arr[i].children)
      }
    }else{
      arr.splice(i,1)
      i--
    }
  }
}
function aaa(state, getters, rootState){
  let routers = JSON.parse(JSON.stringify(_routers))
  // console.log(routers,_routers)
  let ts = new Date().getTime()
  let arr = []
  $.ajax({
    url:'/agent/api/querySecPrivilege?'+ts,
    async:false,
    type:'get',
    success:function(res){
      res = res.data.privilege
      accessList=[]
      creatAccessList(res)
      checkRoutes(routers)
      state.homeRoute=getHomeRoute(routers)
      // console.log(routers)
      arr = getMenuByRouter(routers,getters, rootState.user.access)
      // console.log(accessList)
      state.channel_role = accessList.indexOf('channel_management')<0?false:true
    }
  })
  return arr
}
export default {
  state: {
    breadCrumbList: [],
    tagNavList:[],
    homeRoute: getHomeRoute(routers),
    local: '',
    firstLogin:false,
    channel_role:false,
    companyName:''
  },
  getters: {
    menuList: (state, getters, rootState) => aaa(state, getters, rootState)
     // (routers, rootState.user.access) 
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute ,state.companyName)
    },
    setCompanyName (state, name) {
      state.companyName=name
    },
    setTagNavList (state, list) {
      let myList = []
      if (list) {
        myList = [...list]
        setTagNavListInLocalstorage([...list])
      } else {
        myList = getTagNavListFromLocalstorage()
      }
      for(let i=0;i<myList.length;i++){
        if(myList[i].name){
          myList[i].meta.title = i18n.t(myList[i].name)
        }
      }
      state.tagNavList = myList
      // console.log(this.state.app.firstLogin)
      if(this.state.app.firstLogin){
        state.tagNavList=[{
            meta: {
              hideInMenu: true,
              notCache: true,
              title: i18n.t('home')
            },
            name: "home",
            path: "/home",
            to: "/home"
          }]
        setTagNavListInLocalstorage([])  
        this.state.app.firstLogin=false
      }
    },
    clearTagNavList () {
      this.state.app.firstLogin=true
    },
    addTag (state, { route, type = 'unshift' }) {
      if (!routeHasExist(state.tagNavList, route)) {
        if (type === 'push') {
          state.tagNavList.push(route)
        }else {
          if (route.name === 'home') {
            state.tagNavList.unshift(route)
          }else if(route!='') {
            state.tagNavList.splice(1, 0, route)
          }
        }

        setTagNavListInLocalstorage([...state.tagNavList])

      }
    },
    setLocal (state, lang) {
      state.local = lang
      window.localStorage.setItem('lang',lang)
    }
  }
}
