<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
   
    <div class="login-con">
      
      <Card icon="log-in" :title="login_welcome_agent" :bordered="false">
        <div class="form-con">
          <login-form ref='login_form' @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
      <div class="lang">
        <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
      </div>
    </div>

  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapMutations,mapActions } from 'vuex'
import { loadSysStaticData } from '@/api/user-manage'
import { platForm } from '@/api/user'
import Language from '@/view/main/components/language'
export default {
  components: {
    LoginForm,
    Language
  },
  created () {
    platForm().then(res => {
      for(let key in res.data.data){
        localStorage.setItem(key,res.data.data[key])
      }
    })
    this.setLocal(this.$i18n.locale)
  },
  mounted(){
    this.$refs.login_form.refreshImg()
  },
  methods: {
    ...mapMutations([
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin',
      'getUserInfo',
      'saveUserObj',
      'loadSysStaticData'
    ]),
   
    handleSubmit ({ userName, password, code }) {
      this.handleLogin({ userName, password , code }).then(res => {
        if(res.code!=0){
          this.$refs.login_form.refreshImg()
          return
        }
        this.getUserInfo().then(res => {
          this.$router.push({
            name: 'home'
          })
        })
        this.$store.commit('clearTagNavList')
      })
    }
  },
  computed:{
    login_welcome: function () {
      return this.$t('login_welcome')
    },
    login_welcome_agent: function () {
      return this.$t('login_welcome_agent')
    },
    local () {
      return this.$store.state.app.local
    }
  }
}
</script>

<style>

</style>
