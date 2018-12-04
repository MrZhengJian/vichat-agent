<template>
    <div class="Enterprise_management">
    	<Card class="searchCard" :bordered="false">

            <div style="overflow:hidden">
            	<div class="searchBox">
            		<span>{{$t('name')}}：</span> 
            		<Input v-model="searchMes.companyName" clearable  type="text" :placeholder="register_firm_name_placeholder" style="width:200px"/>
            	</div>
            	
            	<div class="searchBox">
            		<span>{{$t('user_table_modal1_account_label')}}：</span>
            		<Input v-model="searchMes.account" clearable type="text" :placeholder="user_table_modal1_account_placeholder" style="width:200px"/>
            	</div>
                <div class="searchBox">
                    <Button type="primary" @click="search">&nbsp;&nbsp;{{$t('search')}}&nbsp;&nbsp;</Button>
                </div>
                <div class="searchBox" style="float:right">
                    <Button type="primary" v-if="accessList.child_agent_add" @click="addAgent">&nbsp;&nbsp;{{$t('user_table_btn_add')}}&nbsp;&nbsp;</Button>
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
        <!-- 添加子代理商 -->
        <Modal :title="add_agent" v-model="modal1" :width="600">
            <Form class="myForm" :model="form" :label-width="150" ref="form" :rules="ruleCustom">
                <FormItem :label="agent_name_label" prop="companyName">
                    <Input type="text" v-model='form.companyName' :maxlength='60' :placeholder="agent_name_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="agent_acount_label" prop="account">
                    <Input type="text" v-model="form.account" :maxlength='20' :placeholder="agent_acount_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_pwd_label" prop="password">
                    <Input type="password" v-model='form.password' :maxlength='16' :minlength='6' :placeholder="user_table_modal1_pwd_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="confirm_password" prop="repassword">
                    <Input type="password" v-model='form.repassword' :maxlength='16' :minlength='6' :placeholder="register_repeat_pwd_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts" prop="adminName">
                    <Input type="text" v-model='form.adminName' :maxlength='20' :placeholder="contacts_palcehoolder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts_number" prop="mobile">
                    <Input type="text" v-model="form.mobile" :maxlength='20' :placeholder="user_table_modal1_tel_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem label="URL" prop="url">
                    <Input type="text" v-model='form.url' :maxlength='40'  style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="agent_address_label" prop="address">
                    <Input type="text" v-model="form.address" :maxlength='40' :placeholder="agent_address_placeholder" style="width:300px;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal1=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendAddAgent">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 编辑 -->
        <Modal :title="channel_col_edit"  v-model="modal4" >
            <Form class="myForm" :model="form" :label-width="120" ref="form1" :rules="ruleCustom">
                <FormItem :label="agent_name_label" prop="companyName">
                    <Input disabled type="text" v-model='form.companyName' :maxlength='60' :placeholder="agent_name_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="agent_acount_label" prop="account">
                    <Input disabled type="text" v-model="form.account" :maxlength='20' :placeholder="agent_acount_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts" prop="adminName">
                    <Input type="text" v-model='form.adminName' :maxlength='20' :placeholder="contacts_palcehoolder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts_number" prop="mobile">
                    <Input type="text" v-model="form.mobile":maxlength='20' :placeholder="user_table_modal1_tel_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem label="URL" prop="url">
                    <Input type="text" v-model='form.url' :maxlength='40' style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="agent_address_label" prop="address">
                    <Input type="text" v-model="form.address" :maxlength='40' :placeholder="agent_address_placeholder" style="width:300px;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal4=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendModify">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 续约 -->
        <Modal :title="Recharge" v-model="modal3">
            <Form :model="renew_form" ref="renew" :rules="renewRule"  :label-width="120">
                <FormItem :label="current_balance"  style="margin:12px;">
                   <span style="font-size:26px;font-weight:bold;color:red">{{comRenewMax}}</span>
                </FormItem>
                <FormItem  :label="RechargeByMonth"  style="margin:12px;">
                    <InputNumber :max="renewPriceMax" :min="1" v-model="renew_form.monthNumber" style="width: 300px"></InputNumber> 
                </FormItem>
               <!--  <FormItem :label="total"  style="margin:12px;">
                    <span style="font-size:24px;font-weight:bold"> {{renewCount}} </span>{{$t('month')}}
                    （ 1 {{$t('people')}} x {{renew_form.monthNumber}} {{$t('month')}} ）
                </FormItem> -->
                <FormItem :label="surplus"  style="margin:12px;">
                   <span style="font-size:24px;font-weight:bold"> {{renewBlance}} </span>{{$t('month')}}
                </FormItem>
            </Form>
             <div slot="footer">
                <Button type="default" size="large" @click="modal3=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="renewConfirm">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 续约确认 -->
        <Modal :title="Recharge" v-model="modal2" >
           <h1 style="text-align:center;margin:20px;">{{$t('Recharge_confirm')}}</h1>
           <div slot="footer">
                <Button type="default" size="large" @click="modal2=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendRenew">{{$t('ok')}}</Button>
            </div>
        </Modal>
        
    </div>
    
</template>

<script type="ecmascript-6">
import { queryCompany,batchUpdateCompanyExpiredDate,queryAgentCompany,registerAgentCompany,batchUpdateAgentUsersExpiredDate,saveAgentCompany} from '@/api/agent'
import { getSession} from '@/api/user'
import {dateFormat} from '@/libs/tools'
import { mapMutations } from 'vuex'
export default {
    data () {
        const validateAccount = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('cannotEmpty')));
            } else if (value.length>20) {
                callback(new Error(this.$t('max_len_rules')));
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                callback(new Error(this.$t('account_reg_error')));
            }else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('cannotEmpty')));
            } else if (value.length>18 || value.length<6) {
                callback(new Error(this.$t('pwd_len_rules')));
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                callback(new Error(this.$t('account_reg_error')));
            }else {
                callback();
            }
        };
        const validateRepassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('cannotEmpty')));
            } else if (value.length>18 || value.length<6) {
                callback(new Error(this.$t('pwd_len_rules')));
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                callback(new Error(this.$t('account_reg_error')));
            } else if (value !== this.form.password) {
                callback(new Error(this.$t('register_password_repeat')));
            } else {
                callback();
            }
        };
        const validateUserName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('cannotEmpty')));
            } else if (value.length>20) {
                callback(new Error(this.$t('max_len_rules')));
            } else {
                callback();
            }
        };
        const validateUserName1 = (rule, value, callback) => {
            if (value === '') {
                callback();
            }else if (value.length>20) {
                callback(new Error(this.$t('max_len_rules')));
            } else {
                callback();
            }
        };
        return {
            accessList:{
                "child_agent_edit":this.$store.state.user.funcObj.child_agent_edit||false,
                "child_agent_recharge":this.$store.state.user.funcObj.child_agent_recharge||false,
                "child_agent_add":this.$store.state.user.funcObj.child_agent_add||false
            },
            parentId:this.$store.state.user.userObj.agentId,
            newQuery:false,
            modal1:false,
            modal2:false,
            modal3:false,
        	modal4:false,
            modifyParam:{},
            selectionUid:[],
            selection:[],
        	searchMes:{
        		companyName:'',
        		account:''
        	},
        	tableData:[],
        	tableColums:[
        		{
                    title: this.$t('agent_name_label'),
                    key: 'companyName'
                },
                {
                    title: this.$t('agent_acount_label'),
                    key: 'account'
                },
                
                {
                    title: this.$t('contacts'),
                    key: 'adminName'
                },
                {
                    title: this.$t('contacts_number'),
                    key: 'mobile'
                },
                {   
                    title: this.$t('balance'),
                    key: 'authMonth'
                },
                
                {
                    title: this.$t('org_table_col_action'),
                    key: 'action',
                    align: 'center',
                    width:250,
                    fixed: 'right',
                    render: (h, params) => {
                        return h('div', [
                            h('Button',
                                {
                                    on: {
                                        click: () => {
                                            this.openRenew(params)
                                        }
                                    },
                                    style:{
                                        display:this.accessList.child_agent_recharge?'inline-block':'none',
                                        cursor:'pointer',
                                        color:'#2DB7F5'
                                    },
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    } 
                                },this.$t('Recharge')),
                            h('Button',
                                {
                                    on: {
                                        click: () => {
                                            this.edit(params)
                                        }
                                    },
                                    style:{
                                        display:this.accessList.child_agent_edit?'inline-block':'none',
                                        cursor:'pointer',
                                        color:'#2DB7F5'
                                    },
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    } 
                                },this.$t('channel_col_edit')),
                            // h('Button', 
                            //     {
                            //         on: {
                            //             click: () => {
                            //                 this.toUser(params)
                            //             }
                            //         },
                            //         style:{
                            //             display:'inline-block',
                            //             color:'#2DB7F5',
                            //             cursor:'pointer'
                            //         },
                            //         props: {
                            //             type: 'text',
                            //             size: 'small'
                            //         } 
                            //     },this.$t('user_table_modal1_account_label')),
                        ]);
                    }
                }
            ],
            page:{
                total:0,
                current:1,
                size:10
            },
            form:{
                companyName:'',
                account:'',
                password:'',
                parentId:this.parentId,
                adminName:'',
                url:'http://',
                address:'',
                mobile:'',
            },
            ruleCustom:{
                companyName:[
                    {required: true,validator: validateUserName, trigger: 'blur'}
                ],
                password: [
                    {required: true,validator: validatePassword, trigger: 'blur'}
                ],
                repassword:[
                    {required: true,validator: validateRepassword, trigger: 'blur'}
                ],
                account:[
                    {required: true,validator: validateAccount, trigger: 'blur'}
                ],
                adminName:[
                    {validator: validateUserName1, trigger: 'blur'}
                ],
                
            },
            renewMax:0,
            renew_form:{
                agentIds:'',
                monthNumber:1            },
            renewRule:{
                monthNumber: [
                  {required: true, message: this.$t('renew_by_month_rule'), trigger: 'blur'}
                ],
                expiredDate: [
                  {required: true, message: this.$t('renew_by_date_rule'), trigger: 'blur'}
                ]
            },
        }
    },
   
    created:function(){
        this.parentId=this.$store.state.user.userObj.agentId
        this.queryAgentCompany()
    },
    methods: {
        ...mapMutations([
          'setCompanyName'
        ]),
        addAgent(){
            this.clear()
            this.modal1 = true
        },
        sendAddAgent(){
            let _this = this
            let params = JSON.parse(JSON.stringify(this.form))
            this.$refs.form.validate((valid) => {
                if (valid) {
                    registerAgentCompany(params).then(res=>{
                        if(res.data.code==0){
                            _this.$Message.success(_this.$t('success'))
                            _this.queryAgentCompany()
                            _this.modal1=false
                        }
                    }) 
                }
            })
            
            
        },
        search(){
            this.page.current=1
            this.$refs.page.currentPage=1
            this.queryAgentCompany()
        },
        queryAgentCompany(){
            this.newQuery = true
            const _this = this
            let param = {
                page:this.page.current,
                rows:this.page.size,
                companyName:this.searchMes.companyName,
                account:this.searchMes.account,
                parentId:this.parentId
            }
            queryAgentCompany(param)
            .then(function(res){
                if(res.data.code==0){
                    // _this.$Message.success('加载成功')
                    _this.page.total = res.data.count
                    _this.trunTableData(res.data.data)
                }else if(res.data.code==-1){
                    _this.$router.push({
                        name: 'login'
                    });
                }
            })
        },
        trunTableData(data){
            this.tableData=[]
            for(let i=0;i<data.length;i++){
                if(!data[i].authMonth){
                    data[i].authMonth = 0
                }
            }
            this.tableData=data
        },
        changePage(current){
            this.page.current = current
            this.queryAgentCompany()
        },
        changePageSize(current){
            this.page.size = current
            this.queryAgentCompany()
        },
        toUser(param){
            localStorage.setItem('agentId',param.row.agentId)
            localStorage.setItem('companyName',param.row.companyName)
            this.setCompanyName(param.row.companyName)
            this.$router.push({
                name:'a_user',
                params:{ 
                    'agentId':param.row.agentId,
                    'companyName':param.row.companyName,
                }
            });
        },
        
        edit(param){
            this.modifyParam = this.tableData[param.index]
            this.form.account = param.row.account || ''
            this.form.companyName = param.row.companyName || ''
            this.form.adminName = param.row.adminName || ''
            this.form.mobile = param.row.mobile || ''
            this.form.url = param.row.url || ''
            this.form.address = param.row.address || ''
            this.modal4 = true
        },
        sendModify(){
            let _this = this 
            this.modifyParam.account = this.form.account
            this.modifyParam.companyName = this.form.companyName
            this.modifyParam.adminName = this.form.adminName
            this.modifyParam.mobile = this.form.mobile
            this.modifyParam.url = this.form.url
            this.modifyParam.address = this.form.address
            delete this.modifyParam.createTime
            delete this.modifyParam.updateTime
            this.$refs.form1.validate((valid) => {
                if (valid) {
                    saveAgentCompany(this.modifyParam)
                    .then(res=>{
                        if(res.data.code == 0){
                            _this.$Message.success(_this.$t('channel_modifyChannel_ok'))
                            _this.queryAgentCompany()
                            _this.modal4 = false
                        }
                        
                    })
                }
            })
            
        },
        tableSelection (selection) {
          this.newQuery = false
          this.selection = selection
          this.selectionUid = []
          for (var i = 0; i < selection.length; i++) {
            this.selectionUid.push(selection[i].agentId)
          }
        },
        openRenew(param){
            let _this = this
            
            this.renew_form.monthNumber = 1
            this.renew_form.agentIds = param.row.agentId
            getSession()
            .then((res)=>{
                if(res.data.code==0){
                    _this.renewMax = res.data.data.company.authMonth
                    _this.modal3 = true
                    // console.log(_this.renewMax )
                }
            })
            // console.log(this.renew_form)
            
        },
        
        erpiredFormat(){
          if( this.renew_form.expiredDate!=''){
            this.renew_form.expiredDate=dateFormat(new Date(this.renew_form.expiredDate), 'yyyy-MM-dd')
          }
        },
        clear(){
            this.form={
                companyName:'',
                account:'',
                password:'',
                repassword:'',
                parentId:this.parentId,
                adminName:'',
                url:'http://',
                address:'',
                mobile:'',
            }
        },
        renewConfirm(){
            this.modal2=true
            this.modal3=false  
        },
        sendRenew(){
          let _this = this
          let params = JSON.parse(JSON.stringify(this.renew_form))
          batchUpdateAgentUsersExpiredDate(params).then(res=>{
            if(res.data.code==0){
              _this.$Message.success(_this.$t('Recharge_success'))
              _this.queryAgentCompany()
              _this.modal2=false
            }
          }) 
        },
    },
    computed:{
        renewPriceMax:function () {
          return parseInt(this.comRenewMax)
        },
        renewBlance:function () {
          return this.comRenewMax-this.renewCount
        },
        renewCount:function () {
          return this.renew_form.monthNumber
        },
        comRenewMax: function () {
          return this.renewMax
        },
         addagent: function () {
          return this.$t('addagent')
        },
        employee_type_List2: function () {
          return this.$t('employee_type_List2')
        },
        channel_col_edit: function () {
          return this.$t('channel_col_edit')
        },
        addConfirm: function () {
          return this.$t('addConfirm')
        },
        name: function () {
          return this.$t('name')
        },
        channel_col_edit: function () {
          return this.$t('channel_col_edit')
        },
        user_table_modal1_pwd_placeholder: function () {
          return this.$t('user_table_modal1_pwd_placeholder')
        },
        user_table_modal1_userName_placeholder: function () {
          return this.$t('user_table_modal1_userName_placeholder')
        },
        register_repeat_pwd_placeholder: function () {
          return this.$t('register_repeat_pwd_placeholder')
        },
        user_table_modal1_pwd_label:function () {
          return this.$t('user_table_modal1_pwd_label')
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
        user_table_btn_add: function () {
          return this.$t('user_table_btn_add')
        },
        user_table_modal1_expireDate_placeholder: function () {
          return this.$t('user_table_modal1_expireDate_placeholder')
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
        Recharge: function () {
          return this.$t('Recharge')
        },
        RechargeByMonth: function () {
          return this.$t('RechargeByMonth')
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
        my_balance: function () {
          return this.$t('my_balance')
        },
        add_agent: function () {
          return this.$t('add_agent')
        },
        agent_acount_label: function () {
          return this.$t('agent_acount_label')
        },
        agent_acount_placeholder: function () {
          return this.$t('agent_acount_placeholder')
        },
        agent_name_label: function () {
          return this.$t('agent_name_label')
        },
        agent_name_placeholder: function () {
          return this.$t('agent_name_placeholder')
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
        user_table_modal1_tel_placeholder:function(){
            return this.$t('user_table_modal1_tel_placeholder')
        },
        agent_address_label:function(){
            return this.$t('agent_address_label')
        },
        agent_address_placeholder:function(){
            return this.$t('agent_address_placeholder')
        },
        contacts_number:function(){
            return this.$t('contacts_number')
        },
        current_balance:function(){
            return this.$t('current_balance')
        },
        surplus:function(){
            return this.$t('surplus')
        },
        total:function(){
            return this.$t('total')
        },
        

    },
    mounted:function(){
        window.document.title = localStorage.getItem('platformNameLong')
    }

};    
</script>

<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import './Agent-management.less';
</style>