import { login, logout, getSession,platForm } from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import { loadSysStaticData } from '@/api/user-manage'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    userObj:{},
    funcObj:{},
    sysStaticData:{},
    record:null
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setUserObj(state,obj){
      state.userObj = obj
    },
    setFuncObj(state,arr){
      let obj={}
      for(let i=0;i<arr.length;i++){
        obj[arr[i]] = true
      }
      state.funcObj = obj
    },
    setCompanyObj(state,obj){
      state.CompanyObj = obj
    },
    setRecord(state,obj){
      state.record = obj
    },
    setSysStaticData(state,obj){
      state.sysStaticData = obj
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {userName, password ,code}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password,
          code
        }).then(res => {
          if(res){
            const data = res.data
            if(data.code==0){
              commit('setToken', data.data.agent_token)
            }
            resolve(data)
          }
          
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getSession(state.token).then(res => {
          const data = res.data
          localStorage.setItem('account_uname',data.data.user.userName)
          localStorage.setItem('account_uid',data.data.user.agentUid)
          commit('setUserObj', data.data.user)
          commit('setCompanyObj', data.data.company)

          commit('setFuncObj', data.data.functions)

          // commit('setRecord', data.obj.record)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
        platForm().then(res=>{
          for(let key in res.data.data){
            localStorage.setItem(key,res.data.data[key])
          }
        })
      })
    },
  }
}
