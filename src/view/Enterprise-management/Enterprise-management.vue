<template>
    <div class="Enterprise_management">
    	<Card class="searchCard" >
            <div style="overflow:hidden">
            	<div class="searchBox">
            		<span>{{$t('name')}}：</span>
            		<Input v-model="searchMes.name" clearable  type="text" :placeholder="register_firm_name_placeholder" style="width:200px"/>
            	</div>
            	<div class="searchBox">
            		<span>{{$t('user_table_modal1_account_label')}}：</span>
            		<Input v-model="searchMes.terminal" clearable type="text" :placeholder="user_table_modal1_account_placeholder" style="width:200px"/>
            	</div>
                <div class="searchBox">
                    <Button type="primary" @click="search">&nbsp;&nbsp;{{$t('search')}}&nbsp;&nbsp;</Button>
                </div>
                <div class="searchBox" style="float:right">
                    <Button type="primary" v-if="accessList.company_add" @click="addCompany">&nbsp;&nbsp;{{$t('user_table_btn_add')}}&nbsp;&nbsp;</Button>
                </div>
            </div>
        </Card>

        <div class="tableBox">
	        <Table stripe @on-selection-change="tableSelection" ref="selection" :columns="tableColums" :data="tableData"></Table>
	    </div>
        <div class="page">
            <div style="float: right;">
                <Page
                    ref='page'
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"
                    :total=page.total
                    :page-size-opts = "[10,20,50]"
                    show-elevator
                    show-sizer
                    show-total
                    placement="top"
                ></Page>
            </div>
        </div>
        <!-- 添加企业 -->
        <Modal :title="add_company" v-model="modal3" :width="600">
            <Form class="myForm" :model="form" :label-width="150" ref="companyform" :rules="ruleCustom">
                <FormItem :label="register_firm_name_label" prop="companyName">
                    <Input type="text" v-model='form.companyName' :maxlength='60' :placeholder="register_firm_name_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="register_firm_account_label" prop="terminal">
                    <Input  type="text" v-model="form.terminal" :maxlength='20' :placeholder="register_firm_account_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_pwd_label" prop="password">
                    <Input type="password" v-model='form.password' :maxlength='16' :minlength='6' :placeholder="user_table_modal1_pwd_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="confirm_password" prop="repassword">
                    <Input type="password" v-model='form.repassword' :maxlength='16' :minlength='6' :placeholder="register_repeat_pwd_placeholder" style="width:300px;"></Input>
                </FormItem>
                <!-- <FormItem :label="user_name" prop="userName">
                    <Input type="text" v-model='form.userName' :maxlength='20' :placeholder="login_user_placeholder" style="width:300px;"></Input>
                </FormItem> -->
                <FormItem :label="contacts" prop="contactName">
                    <Input type="text" v-model='form.contactName' :maxlength='20' :placeholder="contacts_palcehoolder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts_number" prop="tel">
                    <Input type="text" v-model="form.tel" :placeholder="user_table_modal1_tel_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="functions" >
                    <CheckboxGroup v-model="formFunction">
                      <Checkbox v-for="item in functionList" :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal3=false">{{$t('cancel')}}</Button>
                <Button size="large" @click="clear">{{$t('reset')}}</Button>
                <Button type="primary" size="large" @click="submit">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 修改信息 -->
        <Modal :title="user_table_modal2_title" v-model="modal4" :width="600">
            <Form class="myForm" :model="form" :label-width="150" ref="companyform1" :rules="ruleCustom">
                <FormItem  :label="register_firm_name_label" prop="companyName">
                    <Input disabled type="text" v-model='form.companyName' :maxlength='60' :placeholder="register_firm_name_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="register_firm_account_label" prop="terminal">
                    <Input disabled type="text" v-model="form.terminal" :maxlength='20' :placeholder="register_firm_account_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts" prop="userName">
                    <Input type="text" v-model='form.userName' :maxlength='20' :placeholder="login_user_placeholder" style="width:300px;"></Input>
                </FormItem>

                <FormItem :label="contacts_number" prop="tel">
                    <Input type="text" v-model="form.tel" :placeholder="user_table_modal1_tel_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="functions" >
                    <CheckboxGroup v-model="formFunction">
                      <Checkbox v-for="item in functionList" :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal4=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="saveModify">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 行内删除提示 -->
        <Modal :title="modal3_title" v-model="modal13">
            <p style="margin:20px 0;text-align:center;font-size:20px">
                {{$t('user_table_modal7_content')}}
            </p>
            <div slot="footer">
                <Button type="default" size="large" @click="modal13=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="confirmDeletion">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
    </div>

</template>

<script type="ecmascript-6">
import { queryCompany, batchUpdateCompanyExpiredDate, saveCompany, deleteCompany } from '@/api/agent'
import { registerCompany } from '@/api/register'
import {dateFormat} from '@/libs/tools'
import { mapMutations } from 'vuex'
export default {
  data () {
    const validateAccount = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 20) {
        callback(new Error(this.$t('max_len_rules')))
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error(this.$t('account_reg_error')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 18 || value.length < 6) {
        callback(new Error(this.$t('pwd_len_rules')))
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error(this.$t('account_reg_error')))
      } else {
        callback()
      }
    }
    const validateRepassword = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 18 || value.length < 6) {
        callback(new Error(this.$t('pwd_len_rules')))
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error(this.$t('account_reg_error')))
      } else if (value != this.form.password) {
        callback(new Error(this.$t('register_password_repeat')))
      } else {
        callback()
      }
    }
    const validateUserName = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 20) {
        callback(new Error(this.$t('max_len_rules')))
      } else {
        callback()
      }
    }
    const validateUserName1 = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 20) {
        callback(new Error(this.$t('max_len_rules')))
      } else {
        callback()
      }
    }
    return {
      accessList: {
        'company_room': this.$store.state.user.funcObj.company_room || false,
        'company_org': this.$store.state.user.funcObj.company_org || false,
        'company_account': this.$store.state.user.funcObj.company_account || false,
        'company_edit': this.$store.state.user.funcObj.company_edit || false,
        'company_add': this.$store.state.user.funcObj.company_add || false,
        'company_del': this.$store.state.user.funcObj.company_del || false
      },
      newQuery: false,
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      modal13: false,
      selectionUid: [],
      selection: [],
      searchMes: {
        name: '',
        freeType: '',
        terminal: ''
      },
      tableData: [],
      tableColums: [
        {
          title: this.$t('register_firm_name_label'),
          key: 'companyName'
        },
        {
          title: this.$t('register_firm_account_label'),
          key: 'account'
        },

        {
          title: this.$t('contacts'),
          key: 'userName'
        },
        {
          title: this.$t('contacts_number'),
          key: 'tel'
        },
        {
          title: this.$t('org_table_col_action'),
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 320,
          render: (h, params) => {
            return h('div', [
              h('Button',
                {
                  on: {
                    click: () => {
                      this.edit(params)
                    }
                  },
                  style: {
                    display: this.accessList.company_edit ? 'inline-block' : 'none',
                    color: '#2DB7F5',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('channel_col_edit')),
              h('Button',
                {
                  on: {
                    click: () => {
                      this.toUser(params)
                    }
                  },
                  style: {
                    display: this.accessList.company_account ? 'inline-block' : 'none',
                    color: '#2DB7F5',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('user_table_modal1_account_label')),
              h('Button',
                {
                  on: {
                    click: () => {
                      this.toOrg(params)
                    }
                  },
                  style: {
                    display: this.accessList.company_org ? 'inline-block' : 'none',
                    color: '#2DB7F5',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('home_organize')),
              h('Button',
                {
                  on: {
                    click: () => {
                      this.toChannel(params)
                    }
                  },
                  style: {
                    display: this.accessList.company_room ? 'inline-block' : 'none',
                    color: '#2DB7F5',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('rec_tab_label1')),
              h('Button',
                {
                  on: {
                    click: () => {
                      this.partyId = params.row.partyId
                      this.modal13 = true
                    }
                  },
                  style: {
                    display: this.accessList.company_del ? 'inline-block' : 'none',
                    color: '#F25E43',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('user_table_col_delete'))

            ])
          }
        }
      ],
      partyId: '',
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      formFunction:[],
      form: {
        terminal: '',
        companyName: '',
        tel: '',
        password: '',
        repassword: '',
        userName: '',
        contactName: '',
        function:''
      },
      functionList:[
        {
          value:0,
          label:this.$t('QuickAlarm')
        },
        {
          value:1,
          label:this.$t('rec')
        } 
      ],
      ruleCustom: {
        companyName: [
          {required: true, validator: validateUserName, trigger: 'blur'}
        ],
        userName: [
          {required: true, validator: validateUserName1, trigger: 'blur'}
        ],
        contactName: [
          {required: true, validator: validateUserName, trigger: 'blur'}
        ],
        terminal: [
          {required: true, validator: validateAccount, trigger: 'blur'}
        ],
        password: [
          {required: true, validator: validatePassword, trigger: 'blur'}
        ],
        repassword: [
          {required: true, validator: validateRepassword, trigger: 'blur'}
        ]
      },
      modifyObj: {}
    }
  },

  created: function () {
    this.queryEdposCompany()
  },
  methods: {
    ...mapMutations([
      'setCompanyName'
    ]),
    search () {
      this.page.current = 1
      this.$refs.page.currentPage = 1
      this.queryEdposCompany()
    },
    queryEdposCompany () {
      this.newQuery = true
      const _this = this
      let param = {
        page: this.page.current,
        rows: this.page.size,
        companyName: this.searchMes.name,
        freeType: this.searchMes.freeType,
        terminal: this.searchMes.terminal
      }
      queryCompany(param)
        .then(function (res) {
          if (res.data.code == 0) {
            if(res.data.data.length==0&&_this.page.page>1){
              _this.page.page--
              _this.queryEdposCompany()
              return
            }
            // _this.$Message.success('加载成功')
            _this.page.total = res.data.count
            _this.trunTableData(res.data.data)
          } else if (res.data.code == -1) {
            _this.$router.push({
              name: 'login'
            })
          }
        })
    },
    trunTableData (data) {
      this.tableData = []
      this.tableData = data
    },
    changePage (current) {
      this.page.current = current
      this.queryEdposCompany()
    },
    changePageSize (current) {
      this.page.size = current
      this.queryEdposCompany()
    },
    toUser (param) {
      localStorage.setItem('partyId', param.row.partyId)
      localStorage.setItem('companyName', param.row.companyName)
      this.setCompanyName(param.row.companyName)
      this.$router.push({
        name: 'user',
        params: {
          'partyId': param.row.partyId,
          'companyName': param.row.companyName
        }
      })
    },
    toOrg (param) {
      localStorage.setItem('partyId', param.row.partyId)
      localStorage.setItem('companyName', param.row.companyName)
      this.setCompanyName(param.row.companyName)
      this.$router.push({
        name: 'org',
        params: {
          'partyId': param.row.partyId,
          'companyName': param.row.companyName
        }
      })
    },
    toChannel (param) {
      localStorage.setItem('partyId', param.row.partyId)
      localStorage.setItem('companyName', param.row.companyName)
      localStorage.setItem('freeType', param.row.freeType)
      localStorage.setItem('authNumber', param.row.authNumber)
      this.setCompanyName(param.row.companyName)
      this.$router.push({
        name: 'channel',
        params: {
          'partyId': param.row.partyId,
          'companyName': param.row.companyName,
          'freeType': param.row.freeType,
          'authNumber': param.row.authNumber
        }
      })
    },
    tableSelection (selection) {
      this.newQuery = false
      this.selection = selection
      this.selectionUid = []
      for (var i = 0; i < selection.length; i++) {
        this.selectionUid.push(selection[i].partyId)
      }
    },
    addCompany () {
      this.clear()
      this.modal3 = true
    },
    submit () {
      let _this = this
      // console.log(this.form.function)
      // return
      this.$refs.companyform.validate((valid) => {
        if (valid) {
          if (this.form.password != this.form.repassword) {
            this.$Message.error(this.$t('register_password_repeat'))
            return
          }
          delete this.form.repassword
          // this.form.userNumber = this.form.terminal
          this.form.authNumber = this.form.freeType == '1' ? 1000 : -1


          let str = ''
          this.functionList.forEach(item=>{
            if(this.formFunction.indexOf(item.value)>-1){
              str+=1
            }else{
              str+=0
            }
          })
          this.form.function = str


          registerCompany(this.form)
            .then(function (res) {
              // console.log( _this.form)
              if (res.data.code == 0) {
                _this.$Message.success(_this.$t('register_success'))
                _this.modal3 = false
                _this.queryEdposCompany()
              } else {

              }
            })
        }
      })
    },
    edit (param) {
      this.modifyObj = this.tableData[param.index]
      this.form.terminal = param.row.account || ''
      this.form.companyName = param.row.companyName || ''
      this.form.userName = param.row.userName || ''
      this.form.tel = param.row.tel || ''
      if(param.row.function){
        for(let i=0,arr=param.row.function;i<arr.length;i++){
          if(arr[i]=='1'){
            this.formFunction.push(i)
          }
        }
      }
      

      // this.formFunction = param.row.userName || ''
      this.modal4 = true
    },
    saveModify () {
      let _this = this
      this.$refs.companyform1.validate((valid) => {
        if (valid) {
          this.modifyObj.account = this.form.terminal
          this.modifyObj.companyName = this.form.companyName
          this.modifyObj.userName = this.form.userName
          this.modifyObj.tel = this.form.tel
          delete this.modifyObj.createTime

          let str = ''
          this.functionList.forEach(item=>{
            if(this.formFunction.indexOf(item.value)>-1){
              str+=1
            }else{
              str+=0
            }
          })
          this.modifyObj.function = str

          saveCompany(this.modifyObj)
            .then(res => {
              if (res.data.code == 0) {
                _this.$Message.success(_this.$t('user_table_modify_ok'))
                _this.queryEdposCompany()
                _this.modal4 = false
              }
            })
        }
      })
    },
    confirmDeletion () {
      let _this = this
      // console.log(this.tableData[this.delIndex])
      deleteCompany({partyId: this.partyId})
        .then(res => {
          if (res.data.code == 0) {
            _this.$Message.success(_this.$t('user_table_delete_ok'))
            _this.queryEdposCompany()
            _this.modal13 = false
          }
        })
    },
    clear () {
      this.form = {
        contactName: '',
        terminal: '',
        companyName: '',
        userName: '',
        tel: '',
        password: '',
        repassword: '',
        freeType: '0'
      }
    }
  },
  computed: {
    modal3_title: function () {
      return this.$t('user_table_modal3_title')
    },
    register_firm_name_placeholder: function () {
      return this.$t('register_firm_name_placeholder')
    },
    user_table_modal1_account_label: function () {
      return this.$t('user_table_modal1_account_label')
    },
    user_table_modal1_account_placeholder: function () {
      return this.$t('user_table_modal1_account_placeholder')
    },
    renew: function () {
      return this.$t('renew')
    },
    renew_type: function () {
      return this.$t('renew_type')
    },
    renew_by_month: function () {
      return this.$t('renew_by_month')
    },
    renew_by_date: function () {
      return this.$t('renew_by_date')
    },
    renew_by_month_label: function () {
      return this.$t('renew_by_month_label')
    },
    renew_by_date_label: function () {
      return this.$t('renew_by_date_label')
    },
    renew_by_month_placeholder: function () {
      return this.$t('renew_by_month_placeholder')
    },
    renew_by_date_placeholder: function () {
      return this.$t('renew_by_date_placeholder')
    },
    renew_expiredDate: function () {
      return this.$t('renew_expiredDate')
    },
    user_table_modal1_expireDate_placeholder: function () {
      return this.$t('user_table_modal1_expireDate_placeholder')
    },
    user_table_modal1_account_label: function () {
      return this.$t('user_table_modal1_account_label')
    },
    register_firm_account_placeholder: function () {
      return this.$t('register_firm_account_placeholder')
    },
    name: function () {
      return this.$t('name')
    },
    register_firm_name_placeholder: function () {
      return this.$t('register_firm_name_placeholder')
    },
    user_table_modal1_pwd_label: function () {
      return this.$t('user_table_modal1_pwd_label')
    },
    user_table_modal1_pwd_placeholder: function () {
      return this.$t('user_table_modal1_pwd_placeholder')
    },
    register_repeat_pwd_placeholder: function () {
      return this.$t('register_repeat_pwd_placeholder')
    },
    user_table_modal1_tel_label: function () {
      return this.$t('user_table_modal1_tel_label')
    },
    user_table_modal1_tel_placeholder: function () {
      return this.$t('user_table_modal1_tel_placeholder')
    },
    user_table_btn_add: function () {
      return this.$t('user_table_btn_add')
    },
    repeat: function () {
      return this.$t('repeat')
    },
    register_repeat_pwd_placeholder: function () {
      return this.$t('register_repeat_pwd_placeholder')
    },
    add_company: function () {
      return this.$t('add_company')
    },
    register_firm_name_label: function () {
      return this.$t('register_firm_name_label')
    },
    register_firm_account_label: function () {
      return this.$t('register_firm_account_label')
    },
    confirm_password: function () {
      return this.$t('confirm_password')
    },
    contacts: function () {
      return this.$t('contacts')
    },
    contacts_palcehoolder: function () {
      return this.$t('contacts_palcehoolder')
    },
    contacts_number: function () {
      return this.$t('contacts_number')
    },
    user_table_modal2_title: function () {
      return this.$t('user_table_modal2_title')
    },
    login_user_placeholder: function () {
      return this.$t('login_user_placeholder')
    },
    user_name: function () {
      return this.$t('user_name')
    },
    functions: function () {
      return this.$t('functions')
    }

  },
  mounted: function () {
    window.document.title = localStorage.getItem('platformNameLong')
  }

}
</script>

<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import './Enterprise-management.less';
</style>
