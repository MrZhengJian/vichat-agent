<template>
    <div class="my_account">
        <div class="main">
            <div class="btns">
                <Input search enter-button @on-keyup="searchBox(1)" @on-search="searchBox" :placeholder="searchByNameOrAccount" v-model="searchTxt"  style="width: 250px;float:left"></Input>
                <!-- <Button type="primary" v-if="accessList.account_import" @click="batchImportModal">{{$t('user_table_btn_batchImport')}}</Button> -->
                <Button type="primary" v-if="accessList.account_add" @click="openAddUser">{{$t('user_table_btn_add')}}</Button>
            </div>
            <div class="table">
                <Table ref="table" stripe :columns="columns" :data="tableData"></Table>
            </div>
            <div class="page">
                <div style="float: right;">
                    <Page
                      ref="pages"
                      @on-change="changePage"
                      @on-page-size-change="changePageSize"
                      :total='pages.total'
                      show-total
                      :page-size-opts = "[10,20,50]"
                      show-elevator
                      show-sizer
                      placement="top"
                  ></Page>
                </div>
            </div>
        </div>
         <!-- 修改密码 -->
        <Modal :title="modal6_title" v-model="modal6">
            <Form ref='changePassword' :model="changePassword" :label-width="120" :rules="ruleCustom">
                <FormItem :label="user_table_modal6_newPwd_label" prop="password">
                    <Input type="password" v-model="changePassword.password" :placeholder="user_table_modal6_newPwd_placeholder" :minlength="6" :maxlength='16' style="width: 300px" ></Input>
                </FormItem>
                <FormItem :label="repeat" prop="repassword">
                    <Input type="password" v-model="changePassword.repassword" :placeholder="register_repeat_pwd_placeholder" :minlength="6" :maxlength='16' style="width: 300px" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal6=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="sendNewpwd">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
        <!-- 添加账户 -->
        <Modal
            :title="add_account"
            v-model="modal1"
            class='adduser'
            >
            <Form ref="userAdd" :model="empMes" :rules="ruleCustom" :label-width="120">
                <FormItem :label="user_table_modal1_account_label" prop="account">
                    <Input type="text" v-model="empMes.account" :maxlength='20' :placeholder="user_table_modal1_account_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_userName_label" prop="userName">
                    <Input type="text" v-model="empMes.userName" :maxlength='20' :placeholder="user_table_modal1_userName_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_tel_label">
                    <Input type="text" v-model="empMes.tel" :maxlength='20' :placeholder="user_table_modal1_userName_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_email_label">
                    <Input type="text" v-model="empMes.email" :maxlength='20' :placeholder="user_table_modal1_email_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_gender_label" >
                    <RadioGroup v-model="empMes.sex">
                        <Radio :label="1">{{$t('user_table_modal1_gender_man')}}</Radio>
                        <Radio :label="2">{{$t('user_table_modal1_gender_woman')}}</Radio>
                        <Radio :label="3">{{$t('user_table_modal1_gender_secrecy')}}</Radio>
                    </RadioGroup>
                </FormItem>
                
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal1=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="addMes(1)">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 修改信息 -->
        <Modal
            :title="modal2_title"
            v-model="modal2"
            class='adduser'
            >
            <Form ref="userModify" :model="empMes" :rules="ruleCustom" :label-width="120">
                <FormItem :label="user_table_modal1_account_label" prop="account">
                    <Input disabled type="text" v-model="empMes.account" :maxlength='20' :placeholder="user_table_modal1_account_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_userName_label" prop="userName">
                    <Input type="text" v-model="empMes.userName" :maxlength='20' :placeholder="user_table_modal1_userName_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_tel_label">
                    <Input type="text" v-model="empMes.tel" :maxlength='20' :placeholder="user_table_modal1_userName_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_email_label">
                    <Input type="text" v-model="empMes.email" :maxlength='20' :placeholder="user_table_modal1_email_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_gender_label" >
                    <RadioGroup v-model="empMes.sex">
                        <Radio :label="1">{{$t('user_table_modal1_gender_man')}}</Radio>
                        <Radio :label="2">{{$t('user_table_modal1_gender_woman')}}</Radio>
                        <Radio :label="3">{{$t('user_table_modal1_gender_secrecy')}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal2=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="addMes(2)">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 角色分配 -->
        <Modal :title="role_assign_modal_title" v-model="modal8" >
            <Form :model="role_assign" :label-width="100">
                <FormItem :label="user_table_col_role1"  style="margin:12px;">
                    <Select v-model="role_assign.roid" style="width:300px">
                        <Option v-for="item in role_assign_List" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal8=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendRoleAssign">{{$t('ok')}}</Button>
            </div>
        </Modal>
    </div>
    
</template>

<script type="ecmascript-6">
import { queryAgentUser,batchSaveAgentUsers,batchCheckAgentUsers,chgAgentPassword,saveAgentUser} from '@/api/agent'
import { getSession } from '@/api/user'
import { dateFormat } from '@/libs/tools'
import { getSecRoleByUid,batchUpdateUserRole } from '@/api/user-manage'
import {queryPrisonSecRole} from '@/api/role'
import uploadExcel from '@/view/excel/upload-excel'
export default {
    components: {
        uploadExcel
    },
    data () {
        const validateAccount = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('user_table_account_rules')));
            } else if (value.length>20) {
                callback(new Error(this.$t('max_len_rules')));
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                callback(new Error(this.$t('account_reg_error')));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('login_pwd_rules')));
            } else if (value.length>18 || value.length<6) {
                callback(new Error(this.$t('pwd_len_rules')));
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                callback(new Error(this.$t('account_reg_error')));
            } else {
                callback();
            }
        };
        const validateRepassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('login_pwd_rules')));
            } else if (value.length>18 || value.length<6) {
                callback(new Error(this.$t('pwd_len_rules')));
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                callback(new Error(this.$t('account_reg_error')));
            } else if (value!==this.changePassword.password) {
                callback(new Error(this.$t('register_password_repeat')));
            } else {
                callback();
            }
        };
        const validateUserName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('user_table_userName_rules')));
            } else if (value.length>20) {
                callback(new Error(this.$t('max_len_rules')));
            } else {
                callback();
            }
        };
        return {
          accessList:{
            "account_role":this.$store.state.user.funcObj.account_role||false,
            "account_pwd":this.$store.state.user.funcObj.account_pwd||false,
            "account_edit":this.$store.state.user.funcObj.account_edit||false,
            "account_import":this.$store.state.user.funcObj.account_import||false,
            "account_add":this.$store.state.user.funcObj.account_add||false
          },
            agentId:this.$store.state.user.userObj.agentId,
            searchTxt:'',
            total:0,
            newQuery:false,
            companyName:localStorage.getItem('companyName'),
            tableData:[],
            columns: [
               
                {
                  title: this.$t('user_table_col_account'),
                  key: 'account',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.account,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.account)
                    ])
                  }
                },
                {
                  title: this.$t('user_table_col_userName'),
                  key: 'userName',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.userName,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.userName)
                    ])
                  }
                },
                {
                  title: this.$t('account_type'),
                  key: 'userType',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.userType,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.userType)
                    ])
                  }
                },
                {
                  title: this.$t('user_table_modal1_tel_label'),
                  key: 'tel',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.tel,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.tel)
                    ])
                  }
                },
                {
                  title: this.$t('user_table_modal1_email_label'),
                  key: 'email',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.email,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.email)
                    ])
                  }
                },
                {
                  title: this.$t('user_table_modal1_gender_label'),
                  key: 'sex',
                  width:60,
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.sex,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.sex)
                    ])
                  }
                },
                {
                  title: this.$t('user_table_col_action'),
                  key: 'action',
                  align: 'center',
                  width: 250,
                  fixed: 'right',
                  render: (h, params) => {
                    return h('div', [
                      h('Button',
                        {
                          on: {
                            click: () => {
                              this.modify(params)
                            }
                          },
                          style: {
                            display:this.accessList.account_edit?'inline-block':'none',
                            color: '#2DB7F5',
                            cursor: 'pointer'
                          },
                          props: {
                            type: 'text',
                            size: 'small'
                          }
                        }, this.$t('user_table_col_edit')),
                      h('Button',
                        {
                          on: {
                            click: () => {
                              this.changePwd(params)
                            }
                          },
                          style: {
                            display:this.accessList.account_pwd?'inline-block':'none',
                            cursor: 'pointer',
                            color: '#2DB7F5'
                          },
                          props: {
                            type: 'text',
                            size: 'small'
                          }
                        }, this.$t('user_table_col_pwd')),
                      h('Button',
                        {
                          on: {
                            click: () => {
                              this.roleAssign(params)
                            }
                          },
                          style: {
                            display: this.accessList.account_role?'inline-block':'none',
                            cursor: 'pointer',
                            marginRight: '5px',
                            color: (params.row.userType==this.$t('employee_type_List2')?'#ccc':'#2DB7F5')
                          },
                          props: {
                            type: 'text',
                            size: 'small',
                            disabled:(params.row.userType==this.$t('employee_type_List2')?true:false)
                          }
                        }, this.$t('user_table_col_role_assign'))
                    ])
                  }
                }
            ],
            modal1:false,
            modal2:false,
            modal6:false,
            modal8:false,
            modal11:false,
            modal12:false,
            empMes:{
                agentId:this.$route.params.agentId || localStorage.getItem('agentId'),
                account:'',
                userName:'',
                tel:'',
                email:'',
                sex:''
            },
            ruleCustom: {
                account: [
                  {required: true,validator: validateAccount, trigger: 'blur'}
                ],
                userName: [
                  {required: true,validator: validateUserName, trigger: 'blur'}
                ],
                password: [
                   {required: true,validator: validatePassword, trigger: 'blur'}
                ],
                repassword: [
                   {required: true,validator: validateRepassword, trigger: 'blur'}
                ],
            },
            selectionUid:[],
            selection:[],
            batchImportContent:'',
            tabName:'name1',
            successCount:0,
            errorCount:0,
            successList:(h) => {
                return h('div', [
                    h('span', this.$t('user_table_import_success_list')),
                    h('Badge', {
                        props: {
                            count: this.successCount
                        },
                        style:{
                            'margin-left':'5px',
                        }

                    })
                ])
            },
            errorList:(h) => {
                return h('div', [
                    h('span', this.$t('user_table_import_falied_list')),
                    h('Badge', {
                        props: {
                            count: this.errorCount
                        },
                        style:{
                            'margin-left':'5px',
                        }
                    })
                ])
            },
            importSuccessColumns:[
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: this.$t('user_table_col_userName'),
                    key: 'userName'
                },
                {
                    title: this.$t('user_table_col_account'),
                    key: 'account'
                }
               
            ],
            importSuccessData:[],
            importFailurecolumns:[
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: this.$t('user_table_col_userName'),
                    key: 'userName'
                },
                {
                    title: this.$t('user_table_col_account'),
                    key: 'account'
                },
                {
                    title: this.$t('ERRS'),
                    key: 'ext1'
                },
            ],
            importFailureData:[],
            uploadTableDataContent:[],
            changePassword: { // 修改密码时
                password: '',
                repassword: '',
                uid: ''
            },
            pages:{
                page:1,
                rows:10,
                total:0
            },
            role_assign: { // 分配角色
                roid: '',
                uids: []
              },
            role_assign_List:[],
        }
    },
    
    created:function(){
        this._getMes()
        this._getRoleAssignList()
    },
    methods: {
        _getMes(){
            let _this = this
            let params = {
                agentId : this.agentId,
                userName : this.searchTxt,
                page:this.pages.page,
                rows:this.pages.rows
            }
            queryAgentUser(params)
            .then(res=>{
                if(res.data.code==0){
                    _this.tableData = _this.turnData(res.data.data)
                    _this.pages.total = res.data.count
                }
                _this.newQuery = true

            })
        },
        turnData(data){
            for(let i=0;i<data.length;i++){
                switch(data[i].userType){
                    case 1:
                        data[i].userType = this.$t('employee_type_List2')
                        break;
                    case 2:
                        data[i].userType = this.$t('normal_user')
                        break;    
                }
                switch(data[i].sex){
                    case '1':
                        data[i].sex = this.$t('user_table_modal1_gender_man')
                        break;
                    case '2':
                        data[i].sex = this.$t('user_table_modal1_gender_woman')
                        break;
                    case '3':
                        data[i].sex = this.$t('user_table_modal1_gender_secrecy')
                        break;    
                }
            }
            return data
        },
        changePage (current) {
            this.pages.page = current
            this._getMes()
        },
        changePageSize (pageSize) {
            this.pages.row = current
            this._getMes()
        },
        searchBox(n){
            this.$refs.pages.currentPage = 1
            this.pages.page = 1
            if(n==1){
                if(this.searchTxt=='') this._getMes()
            }else{
               this._getMes() 
            } 
        },
        // 获取所有被选择的员工的uid
        tableSelection (selection) {
          this.newQuery = false
          this.selection = selection
          this.selectionUid = []
          for (var i = 0; i < selection.length; i++) {
            this.selectionUid.push(selection[i].uid)
          }
        },
        openAddUser(){
            this.modal1 = true
            this.clearEmp()
        },
        // 当点击添加员工modal确定时
        addMes (n) {
            let _this = this
            if(n==1){
                this.$refs.userAdd.validate((valid) => {
                    if (valid) {
                        this.sendSave()
                    }
                })
            }else{
                this.$refs.userModify.validate((valid) => {
                    if (valid) {
                        this.sendSave()
                    }
                })
            }
        },
        sendSave(){
            let _this = this
            saveAgentUser(this.empMes)
            .then(function (res) {
              if (res.data.code==0) {
                // 重新查找数据
                _this.$Message.success(_this.$t('user_table_add_ok'))
                _this._getMes()
                _this.modal1 = false
                _this.modal2 = false
              }
            })
        },
        modify(param){
            this.empMes.account = param.row.account
            this.empMes.userName = param.row.userName
            this.empMes.agentUid = param.row.agentUid
            this.empMes.tel = param.row.tel
            this.empMes.email = param.row.email
            let sex = ''
            switch(param.row.sex){
                case this.$t('user_table_modal1_gender_man'):
                    sex = 1
                    break;
                case this.$t('user_table_modal1_gender_woman'):
                    sex = 2
                    break;
                case this.$t('user_table_modal1_gender_secrecy'):
                    sex = 3 
                    break;    
            }

            this.empMes.sex = sex
            console.log(this.empMes.sex)
            this.modal2 = true
        },
        batchImportModal(){
            this.modal11 = true
            this.batchImportContent=''
            this.$refs.uploadExcel.initUpload()
        },
        uploadTableData(data){
            this.uploadTableDataContent = data
        },
        sendBatchImport(){
            let _this = this
            if(this.uploadTableDataContent.length==0){
                this.$Message.error(this.$t('user_table_import_Content_error'))
                return
            }
            batchCheckAgentUsers({agentId:this.agentId,'agentUsers':this.uploadTableDataContent})
            .then(function(res){
                // console.log(res)
                if(res.data.code==0){
                    _this.modal11 = false
                    _this.modal12 = true
                    _this.turnDate(res.data.data.errorUsers)
                    _this.turnDate(res.data.data.successUsers)
                    _this.errorCount = res.data.data.errorUsers.length
                    _this.importFailureData = res.data.data.errorUsers
                    _this.successCount = res.data.data.successUsers.length
                    _this.importSuccessData = res.data.data.successUsers
                }
            })
        },
        turnDate(arr){
            for(let i=0;i<arr.length;i++){
                if(arr[i].ext1) arr[i].ext1 = this.$t(arr[i].ext1)
            }
        },
        batchSaveEdposUser(){
            const _this = this
            if(this.successCount==0){
                this.$Message.error(this.$t('user_table_import_Content_error'))
                return
            }
            batchSaveAgentUsers(this.importSuccessData)
            .then(function(res){
                if(res.data.code==0){
                    _this.$Message.success(_this.$t('user_table_import_success_list'))
                    _this.modal12=false
                    _this._getMes()
                }
            })
        },
        tabChange(name){
            if(this.tabName==name){return}
            if(this.tabName=='name1'){
                this.tabName='name2'
            }else{
                this.tabName='name1'
            }
        },
        changePwd (param) {
            this.changePassword.password = ''
            this.changePassword.repassword = ''
            this.changePassword.uid = param.row.agentUid
            this.modal6 = true
        },
        sendNewpwd () {
            const _this = this
            this.$refs.changePassword.validate((valid) => {
                if (valid) {
                    this.changePassword.partyId = this.mypartyId
                    chgAgentPassword(this.changePassword)
                    .then(function (res) {
                        if (res.data.code==0) {
                          _this.modal6 = false
                          _this.$Message.success(_this.$t('user_table_modify_ok'))
                          _this.$emit('search')
                        } else {
                          _this.$Message.error(res.data.msg)
                        }
                    })
                }
            })
        },
        roleAssign(params){
          getSecRoleByUid({uid:params.row.agentUid}).then(res=>{
            // console.log(res)
            this.role_assign.uids=[]
            if(res.data.obj){
              this.role_assign.roid=res.data.obj.roid
            }
            
            this.role_assign.uids.push(params.row.agentUid)
            this.modal8 = true
          })
         
        },
        _getRoleAssignList(){
          let _this = this
          _this.role_assign_List=[]
          queryPrisonSecRole().then(res=>{
            for(let i=0;i<res.data.data.length;i++){
              _this.role_assign_List.push({
                value:res.data.data[i].roid,
                label:res.data.data[i].roleName,
              })
            }
            
          })
        },
        sendRoleAssign(){
          let _this = this
          this.role_assign.uids = this.role_assign.uids.join(',')
          batchUpdateUserRole(this.role_assign).then(res=>{
            if(res.data.code ==0 ) 
                _this.$Message.success(_this.$t('user_table_modify_ok'))
                _this.modal8=false
                // location.reload()
          })
        },
        clearEmp () {
          this.empMes={
                agentId:this.agentId,
                account:'',
                userName:''
          }    
        }
    },
    computed:{
       batchImport: function () {
          return this.$t('user_table_btn_batchImport')
        },
        user_table_batchImportContent:function () {
          return this.$t('user_table_batchImportContent')
        },
        Result:function () {
          return this.$t('Result')
        },
        modal6_title: function () {
          return this.$t('user_table_modal6_title')
        },
        user_table_modal6_newPwd_label: function () {
          return this.$t('user_table_modal6_newPwd_label')
        },
        user_table_modal6_newPwd_placeholder: function () {
          return this.$t('user_table_modal6_newPwd_placeholder')
        },
        add_account: function () {
          return this.$t('add_account')
        },
        user_table_modal1_account_label: function () {
          return this.$t('user_table_modal1_account_label')
        },
        user_table_modal1_account_placeholder: function () {
          return this.$t('user_table_modal1_account_placeholder')
        },
        user_table_modal1_userName_label: function () {
          return this.$t('user_table_modal1_userName_label')
        },
        user_table_modal1_userName_label: function () {
          return this.$t('user_table_modal1_userName_label')
        },
        user_table_modal1_userName_placeholder: function () {
          return this.$t('user_table_modal1_userName_placeholder')
        },
        modal2_title: function () {
          return this.$t('user_table_modal2_title')
        },
        searchByNameOrAccount: function () {
          return this.$t('searchByNameOrAccount')
        },
        repeat: function () {
          return this.$t('repeat')
        },
        register_repeat_pwd_placeholder: function () {
          return this.$t('register_repeat_pwd_placeholder')
        },
        role_assign_modal_title: function () {
          return this.$t('user_table_col_role_assign')
        },
        user_table_col_role1: function () {
          return this.$t('user_table_col_role1')
        },
        user_table_modal1_tel_label: function () {
          return this.$t('user_table_modal1_tel_label')
        },
        user_table_modal1_email_label: function () {
          return this.$t('user_table_modal1_email_label')
        },
        user_table_modal1_gender_label: function () {
          return this.$t('user_table_modal1_gender_label')
        },
        user_table_modal1_email_placeholder: function () {
          return this.$t('user_table_modal1_email_placeholder')
        },
        user_table_modal1_tel_placeholder: function () {
          return this.$t('user_table_modal1_tel_placeholder')
        },
    },
    mounted:function(){
        // console.log(this.empMes)
        window.document.title = localStorage.getItem('platformNameLong')
    }

};    
</script>

<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import './myAccount-management.less';
</style>