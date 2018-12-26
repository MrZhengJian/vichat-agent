<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
    @import "../../../styles/common.less";
    @import "./person-table.less";
</style>

<template>
	<div class="table">
		<div ref="btnGroup" class="btn-group">
        <Dropdown style="float:right" trigger="click" @on-click="exportData">
            <Button type="primary" style="width:80px;">
                {{$t('user_table_btn_export')}}
                <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
                <DropdownItem name='1'>{{$t('all')}}</DropdownItem>
                <DropdownItem name='2'>{{$t('current_page')}}</DropdownItem>
                <DropdownItem name='3'>{{$t('selected_item')}}</DropdownItem>
            </DropdownMenu>
        </Dropdown>

        <p v-if="!btnCollapse"  style="float:right;display:flex;margin-right:5px;">
          <Button type="primary" v-if="accessList.company_account_add" @click="openAddUser('4')">{{$t('add_dispatcher')}}</Button>
          <Button type="primary" v-if="accessList.company_account_add" @click="openAddUser('3')">{{$t('add_terminal')}}</Button>
          <Button type="primary" v-if="accessList.company_account_recharge" @click="btnClick(9)">{{$t('renew')}}</Button>
          <Button type="primary" v-if="accessList.company_account_org" @click="btnClick(5)">{{$t('user_table_btn_org')}}</Button>
          <Button type="primary" v-if="accessList.company_account_import" @click="batchImportModal">{{$t('user_table_btn_batchImport')}}</Button>
        </p>
        
        <p v-if="btnCollapse" style="float:right;display:flex;margin-right:5px;">
          <Tooltip :content="$t('add_dispatcher')">
            <Button type="primary" v-if="accessList.company_account_add" @click="openAddUser('4')">
              <Icon custom="iconfont icon-tianjiarenyuan"/>
            </Button>
          </Tooltip>
          <Tooltip :content="$t('add_terminal')">
            <Button type="primary" v-if="accessList.company_account_add" @click="openAddUser('3')">
              <Icon custom="iconfont icon-xitong_tianjiashebei"/>
            </Button>
          </Tooltip>
          <Tooltip :content="$t('renew')">
            <Button type="primary" v-if="accessList.company_account_recharge" @click="btnClick(9)">
              <Icon type="md-paper" />
            </Button>
          </Tooltip>
          <Tooltip :content="$t('user_table_btn_org')">
            <Button type="primary" v-if="accessList.company_account_org"  @click="btnClick(5)">
              <Icon type="md-contacts" />
            </Button>
          </Tooltip>
          <Tooltip :content="$t('user_table_btn_batchImport')">
            <Button type="primary" v-if="accessList.company_account_import" @click="batchImportModal">
              <Icon type="ios-download-outline" />
            </Button>
          </Tooltip>
        </p>

        <Input clearable search enter-button @on-search="searchBox(0)" v-model="searchTxt" :placeholder="user_table_search_placeholder" style="width: 220px;float:left"></Input>
        <Select clearable v-model="searchUserType" style="width:180px;float:left;margin-left:20px;" :placeholder="searchByUserType"  @on-change="searchBox(1)">
            <Option value="1" key="1">{{ $t('employee_type_List1') }}</Option>
            <Option value="2" key="2">{{ $t('employee_type_List2') }}</Option>
            <Option value="3" key="3">{{ $t('employee_type_List3') }}</Option>
            <Option value="4" key="4">{{ $t('employee_type_List4') }}</Option>
        </Select>
    </div>
		<div class="table-main">
            <Table ref="table" stripe @on-selection-change="tableSelection" :columns="columns" :data="tableData"></Table>
        </div>
		<div class="page">
	        <div style="float: right;">
	            <Page
                  ref="pages"
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"
                  :total='total'
                  show-total
                  :page-size-opts = "[10,20,50]"
                  show-elevator
                  show-sizer
                  placement="top"
              ></Page>
	        </div>
	    </div>
        <!-- 添加员工 -->
        <Modal
            :title="add_account"
            v-model="modal1"
            class='adduser'
            >
            <Form ref="userAdd" :model="empMes" :rules="ruleCustom" :label-width="120">
                <FormItem :label="user_table_modal1_account_label" prop="imei">
                    <Input type="text" v-model="empMes.imei" :maxlength='20' :placeholder="user_table_modal1_account_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_userName_label" prop="userName">
                    <Input type="text" v-model="empMes.userName" :maxlength='20' :placeholder="user_table_modal1_userName_placeholder" style="width: 300px"></Input>
                </FormItem>
                <div class='selectOrg'>
                    <span>{{$t('user_table_modal1_org_label')}}</span>
                    <div class="treeBox">
                        <Input type="text" @on-focus="show=true" :maxlength='20' v-model="empMes.orgName" style="width: 300px" :placeholder="user_table_modal1_org_placeholder"></Input>
                    </div>
                </div>
                <org-tree v-show="show" :partyId='mypartyId' v-on:changeOrg="addUserChangeOrg"></org-tree>
                <!-- <FormItem :label="user_table_modal1_userType_label" prop="type">
                    <Select v-model="empMes.userType" style="width:300px" >
                        <Option v-for="item in employee_type_List" :disabled="(item.value=='1'||item.value=='2')"  :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem> -->
              
                <FormItem :label="user_table_modal1_tel_label" prop="phone">
                    <Input v-model="empMes.phone" :maxlength='30' :placeholder="user_table_modal1_tel_placeholder" style="width: 300px" ></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_gender_label" prop="gender">
                    <RadioGroup v-model="empMes.sex">
                        <Radio :label="1">{{$t('user_table_modal1_gender_man')}}</Radio>
                        <Radio :label="2">{{$t('user_table_modal1_gender_woman')}}</Radio>
                        <Radio :label="3">{{$t('user_table_modal1_gender_secrecy')}}</Radio>
                    </RadioGroup>
                </FormItem>
               
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal1=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="addMes">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 修改员工信息 -->
        <Modal
            :title="modal2_title"
            v-model="modal2"
            class="modify_modal"
            >   
            <Form ref="formCustom" :model="empMes" :rules="ruleCustom" :label-width="120">
                <FormItem :label="user_table_modal1_account_label" prop="imei">
                    <Input  disabled type="text" :maxlength='20' v-model="empMes.imei" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_userName_label" prop="userName">
                    <Input type="text" :maxlength='20' v-model="empMes.userName" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_userType_label" prop="type">
                    <Select v-model="empMes.userType" disabled style="width:300px">
                        <Option v-for="item in employee_type_List" :disabled="(item.value==1)" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="user_table_modal1_tel_label">
                    <Input v-model="empMes.phone" :maxlength='30' :placeholder="user_table_modal1_tel_placeholder" style="width: 300px" ></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_gender_label">
                    <RadioGroup v-model="empMes.sex">
                        <Radio :label="1">{{$t('user_table_modal1_gender_man')}}</Radio>
                        <Radio :label="2">{{$t('user_table_modal1_gender_woman')}}</Radio>
                        <Radio :label="3">{{$t('user_table_modal1_gender_secrecy')}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal2=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="sendModify">
                    {{$t('ok')}}
                </Button>
            </div>

        </Modal>
        <!-- 多选删除提示 -->
        <Modal :title="modal3_title" v-model="modal3" :styles="{top: '10px'}">
            <p style="margin:30px 0;text-align:center;font-size:20px">
                {{$t('user_table_modal3_content1')}}
                {{selectionUid.length}}
                {{$t('user_table_modal3_content2')}}
            </p>
            <div slot="footer">
                <Button type="default" size="large" @click="modal3=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="checkDelete">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 修改定位 -->
        <Modal :title="modal4_title" v-model="modal4" :styles="{top: '10px'}">
            <Form ref="locForm" :model="locMes" :rules="ruleCustom" :label-width="120">
                <FormItem :label="user_table_modal4_loc_label" prop="loc">
                    <Select v-model="locMes.loc" style="width:300px">
                        <Option v-for="item in switch_List" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="user_table_modal4_locTime_label" prop="locTime">
                        <InputNumber :max="300" :min="1" v-model="locMes.locTime" style="width:300px"></InputNumber>
                </FormItem>
            </Form>
             <div slot="footer">
                <Button type="default" size="large" @click="modal4=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendChangeLoc">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 修改组织 -->
        <Modal class="userModifyOrg" @on-visible-change="showTree=false" :title="modal5_title" v-model="modal5" :styles="{top: '10px'}">
            <div class='selectOrg'>
                <span class="selectOrg-title">{{$t('user_table_modal5_changeOrg_label')}}</span>
                <div class="selectOrg-content">
                    <Input type="text" @on-focus="showTree=true" :placeholder="user_table_modal5_changeOrg_placeholder" v-model="orgName" style="width: 300px"></Input>
                </div>
            </div>
            <org-tree v-show="showTree" :partyId='mypartyId' v-on:changeOrg="changeOrg"></org-tree>
            <div slot="footer">
                <Button type="default" size="large" @click="modal5=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendChangeOrg">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 修改密码 -->
        <Modal :title="modal6_title" v-model="modal6">
            <Form ref="changePassword" :model="changePassword" :label-width="120" :rules="ruleCustom">
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
        <!-- 行内删除提示 -->
        <Modal :title="modal3_title" v-model="modal7">
            <p style="margin:20px 0;text-align:center;font-size:20px">
                {{$t('user_table_modal7_content')}}
            </p>
            <div slot="footer">
                <Button type="default" size="large" @click="modal7=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="confirmDeletion">
                    {{$t('ok')}}
                </Button>
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
        <!-- 续约 -->
        <Modal :title="renew" class="aaa" v-model="modal9">
            <Form :model="renew_form" ref="renew" :rules="renewRule"  :label-width="120">
                <FormItem :label="current_balance"  style="margin:12px;">
                   <span style="font-size:26px;font-weight:bold;color:red">{{comRenewMax}}</span>
                </FormItem>
                <FormItem :label="renew_by_month_label"  style="margin:12px;">
                    <InputNumber :max="renewPriceMax" :min="1" v-model="renew_form.monthNumber" style="width: 300px"></InputNumber> 
                </FormItem>

                <FormItem :label="renewtotal"  style="margin:12px;">
                    
                    <span style="font-size:24px;font-weight:bold"> {{renewCount}} </span>{{$t('month')}}
                    （ {{renewLenth}} {{$t('user_table_modal1_account_label')}} x {{renew_form.monthNumber}} {{$t('month')}} ）
                </FormItem>
                <FormItem :label="surplus"  style="margin:12px;">
                   <span style="font-size:24px;font-weight:bold"> {{renewBlance}} </span>{{$t('month')}}
                </FormItem>
               

            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal9=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="renewConfirm">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 续约确认 -->
        <Modal :title="renew" v-model="modal10" @on-ok="sendRenew">
           <h1 style="text-align:center;margin:20px;">{{$t('renew_confirm')}}</h1>
           <div slot="footer">
                <Button type="default" size="large" @click="modal10=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendRenew">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 批量导入 -->
        <Modal :title="batchImport" v-model="modal11" :width="800">
            <a class="example" href="./example.xlsx">{{$t('Example')}}</a>
            <upload-excel ref="uploadExcel" @uploadTableData="uploadTableData"></upload-excel>
            <div slot="footer">
                <Button type="default" size="large" @click="modal11=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="sendBatchImport">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
        <!-- 导入结果 -->
        <Modal 
            :title="Result" 
            class="importResult"
            v-model="modal12" 
            :value="tabName"     
            >
            <Tabs type="card" @on-click="tabChange">
                <TabPane :label="successList" name="name1">
                    <Table border :columns="importSuccessColumns" :data="importSuccessData"></Table>
                </TabPane>
                <TabPane :label="errorList" name="name2">
                    <Table border :columns="importFailurecolumns" :data="importFailureData"></Table>
                </TabPane>
            </Tabs>
            <div slot="footer">
                <Button  type="default" size="large" @click="modal12=false">
                    {{$t('cancel')}}
                </Button>
                <Button  v-if="tabName=='name1'" type="primary" size="large" @click="batchSaveEdposUser">
                    {{$t('user_table_btn_batchImport')}}
                </Button>
            </div>
        </Modal>
	</div>
</template>

<script type="ecmascript-6">

import orgTree from '@/view/common-components/org-tree/table-tree'
import uploadExcel from '@/view/excel/upload-excel'
import expandRow from './table-expend'
import {dateFormat} from '@/libs/tools'
import { saveEdposUser, deleteEdposUser, chgEdposUserOrg, chgUserPassword, imsPush, loadSysStaticData, batchDeleteUser,batchUpdateUserRole,batchUpdateUserExpiredDate,getSecRoleByUid,batchCheckUsers,batchSaveUserBasic,queryEdposUsers} from '@/api/user-manage'
import {queryPrisonSecRole} from '@/api/role'
import { getSession} from '@/api/user'
export default {
  props: {
    personData: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    orgMes: {
      type: Object
    },
    partyId:{
        required: true
    }
  },
  components: {
    orgTree,
    expandRow,
    uploadExcel
  },
  created: function () {
    this._getMes()
  },
   mounted:function(){
    let _this = this
    
    // this.winHeight = document.body.clientHeight
    window.onresize = () => {
        return (() => {
            window.screenWidth = document.body.clientWidth
            _this.winWidth = window.screenWidth
            // window.screenHeight = document.body.clientHeight
            // _this.winHeight = window.screenHeight
        })()
    }
  },
  watch: {
      // winHeight (val) {
      //     if (!this.timer) {
      //         this.winHeight = val
      //         this.timer = true
      //         let _this = this
      //         setTimeout(function () {
      //             // that.screenWidth = that.$store.state.canvasWidth
      //             // console.log(_this.winHeight)
      //             // _this.init()
      //             _this.timer = false
      //         }, 400)
      //     }
      // },
      winWidth (val) {
          if (!this.timer) {
              this.winWidth = val
              this.timer = true
              let _this = this
              setTimeout(function () {
                  // that.screenWidth = that.$store.state.canvasWidth
                  // console.log(_this.winWidth)
                  // _this.init()
                  _this.timer = false
              }, 400)
          }
      },
  },
data () {
    const validateAccount = (rule, value, callback) => {
        value = value.trim()
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
        value = value.trim()
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
        value = value.trim()
        if (value === '') {
            callback(new Error(this.$t('login_pwd_rules')));
        } else if (value.length>18 || value.length<6) {
            callback(new Error(this.$t('pwd_len_rules')));
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback(new Error(this.$t('account_reg_error')));
        } else if (value != this.changePassword.password) {
            callback(new Error(this.$t('register_password_repeat')));
        } else {
            callback();
        }
    };
    const validateUserName = (rule, value, callback) => {
        value = value.trim()
        if (value === '') {
            callback(new Error(this.$t('user_table_userName_rules')));
        } else if (value.length>20) {
            callback(new Error(this.$t('max_len_rules')));
        } else {
            callback();
        }
    };
    return {
      winWidth:document.body.clientWidth,
      allUser:[],
      searchUserType:'',
      accessList:{
        "company_account_pwd":this.$store.state.user.funcObj.company_account_pwd||false,
        "company_account_edit":this.$store.state.user.funcObj.company_account_edit||false,
        "company_account_export":this.$store.state.user.funcObj.company_account_export||false,
        "company_account_import":this.$store.state.user.funcObj.company_account_import||false,
        "company_account_org":this.$store.state.user.funcObj.company_account_org||false,
        "company_account_recharge":this.$store.state.user.funcObj.company_account_recharge||false,
        "company_account_add":this.$store.state.user.funcObj.company_account_add||false
      },
      renewMax:0,
      mypartyId:this.partyId,
      EnterpriseUid:[],
      UTdisabled: false, // 修改信息时，当员工类型是企业管理员时，禁用员工类型select
      show: false, // 添加员工时的组织树
      showTree: false, // 修改组织时的组织树
      params: {}, // 确认修改时 url参数
      isUpdateExpriedDate:localStorage.getItem('isUpdateExpriedDate'),
      empMes: {
            partyId:this.mypartyId,
            phone: '',
            imei: '',
            post: 3,
            mobile: '',
            sex: 1,
            orgName: '',
            orgId: 0, // 添加和修改员工时表单数据
            userType: '3',
            expiredDate:'',
            userName:''
      },
      locMes: { // 定位信息
        loc: 0,
        locTime: 60
      },
      pages:{
        page:1,
        rows:10,
      },
      ruleCustom: {
            imei: [
              {required: true,validator: validateAccount, trigger: 'blur'}
            ],
            password: [
              {required: true,validator: validatePassword, trigger: 'blur'}
            ],
            repassword: [
               {required: true,validator: validateRepassword, trigger: 'blur'}
            ],
            userName: [
              {required: true,validator: validateUserName, trigger: 'blur'}
            ],
            email: [
              { type: 'email', message: this.$t('user_table_email_rules'), trigger: 'blur' }
            ],
            loc: [],
            locTime: []
      },
      modal1: false, // 添加员工
      add_account:this.$t('add_account'),
      modal2: false, // 修改信息
      modal3: false, // 多选删除提示
      modal4: false, // 定位信息
      modal5: false, // 修改组织
      modal6: false, // 修改密码
      modal7: false, // 确认删除
      modal8: false, // 角色分配
      modal9: false, // 续约
      modal10: false, // 续约确认
      modal11: false, // 批量导入
      modal12: false, // 批量导入结果
      columns: [
            {
              type: 'selection',
              width: 30,
              align: 'center'
            },
            {
              type: 'expand',
              width: 30,
              align: 'center',
              render: (h, params) => {
                return h(expandRow, {
                  props: {
                    row: params.row
                  }
                })
              }
            },
            {
              title: this.$t('user_table_col_account'),
              width: 150,
              key: 'terminal',
              ellipsis: true,
              render: (h, params) => {
                return h('Tooltip', {
                  props: { placement: 'top-start' }
                }, [
                  params.row.terminal,
                  h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.terminal)
                ])
              }
            },

            {
              title: this.$t('user_table_col_userName'),
              key: 'userName',
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
              title: this.$t('user_table_col_orgName'),
              key: 'orgName',
              ellipsis: true,
              render: (h, params) => {
                return h('Tooltip', {
                  props: { placement: 'top-start' }
                }, [
                  params.row.orgName,
                  h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.orgName)
                ])
              }
            },
            {
              title: this.$t('user_table_modal1_userType_label1'),
              key: 'userType',
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
              title: this.$t('user_table_col_displayImsPush'),
              key: 'displayImsPush',
              render: (h, params) => {
                return h('Tooltip', {
                  props: { placement: 'top-start' }
                }, [
                  params.row.displayImsPush,
                  h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.displayImsPush)
                ])
              }
            },
            {
              title: this.$t('user_table_col_expiredDate'),
              key: 'expiredDate',
              render: (h, params) => {
                return h('Tooltip', {
                    props: { placement: 'top-start' },
                    style:{
                        color:params.row.isExpried==0?'#c5c8ce':(params.row.isExpried==2?'#19be6b':'#ff9900')
                    }
                }, [
                  params.row.expiredDate,
                  h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.expiredDate)
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
                          this.modify(params.index)
                        }
                      },
                      style: {
                        display: this.accessList.company_account_edit?'inline-block':'none',
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
                          this.changePwd(params.index)
                        }
                      },
                      style: {
                        display: this.accessList.company_account_pwd?'inline-block':'none',
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
                          this.renew_form={
                            uids:params.row.uid+'',
                            type:'0',
                            monthNumber:1,
                            expiredDate:''
                          }
                          let _this = this
                          getSession()
                            .then((res)=>{
                                if(res.data.code==0){
                                    _this.renewMax = res.data.data.company.authMonth
                                    _this.modal9 = true
                                    // console.log(_this.renewMax )
                                }
                            })
                        }
                      },
                      style: {
                        display: this.accessList.company_account_recharge?'inline-block':'none',
                        cursor: 'pointer',
                        // color: (this.personData[params.index].userType!='1'?'#ccc':'#2DB7F5')
                        color: '#2DB7F5'
                      },
                      props: {
                        type: 'text',
                        size: 'small',
                        // disabled:(this.personData[params.index].userType!='1'?true:false)
                      }
                    }, this.$t('renew')),
                ])
              }
            }
      ],
      renew_form:{
        uids:'',
        type:'0',
        monthNumber:1,
        expiredDate:''
      },
      renewRule:{
        monthNumber: [
          {required: true, message: this.$t('renew_by_month_rule'), trigger: 'blur'}
        ],
        expiredDate: [
          {required: true, message: this.$t('renew_by_date_rule'), trigger: 'blur'}
        ]
      },
      employee_type_List: [
            {
              value: '1',
              label: this.$t('employee_type_List1')
            },
            {
              value: '2',
              label: this.$t('employee_type_List2')
            },
            {
              value: '3',
              label: this.$t('employee_type_List3')
            },
            {
              value: '4',
              label: this.$t('employee_type_List4')
            }
      ],
      switch_List: [ // 退出开关
            {
              value: 1,
              label: this.$t('user_table_switch_open')
            },
            {
              value: 0,
              label: this.$t('user_table_switch_close')
            }
      ],
      ModifyIndex: 0, // 修改信息时保存当前行的index
      DeleteIndex: 0, // 点击删除时保存当前行的index
      urlParams: {},
      searchTxt: '', // 搜索框内容
      selection: [],
      selectionUid: [], // 多选框已选员工ID
      orgName: '', // 修改组织时，接收组织树传回的组织名称
      orgId: 0, // 修改组织时，接收组织树传回的组织ID
      changePassword: { // 修改密码时
        password: '',
        repassword: '',
        uid: ''
      },
      role_assign: { // 分配角色
        roid: '',
        uids: []
      },
      role_assign_List:[],
      renew_type_List:[
        {
          label:this.$t('renew_by_month'),
          value:'0'
        },
        {
          label:this.$t('renew_by_date'),
          value:'1'
        }
      ],
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
                key: 'terminal'
            },
            {
                title: this.$t('user_table_col_orgName'),
                key: 'orgName'
            },
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
                key: 'terminal'
            },
            {
                title: this.$t('user_table_col_orgName'),
                key: 'orgName'
            },
            {
                title: this.$t('ERRS'),
                key: 'ext1'
            },
        ],
        importFailureData:[],
        uploadTableDataContent:[]
    }
  },
methods: {

    renewConfirm(){
      if(String(this.renew_form.monthNumber)=='null'){
        this.$Message.error(this.$t('renew_by_month_rule'))
      }else{
        this.modal10=true
        this.modal9=false
      }
      
    },
    sendRenew(){
      let _this = this
      let params = JSON.parse(JSON.stringify(this.renew_form))
      batchUpdateUserExpiredDate(params).then(res=>{
        if(res.data.code==0){
          _this.$Message.success(_this.$t('renew_success'))
          _this.$emit('search')
          _this.modal10=false
        }
      }) 
    },
    changeOrg (arr) { // 改变组织时，传递给组织树
      this.showTree = false
      this.orgName = arr.orgName
      this.orgId = arr.orgId
    },
    addUserChangeOrg (arr) { // 添加员工modal
      this.show = false
      this.empMes.orgName = arr.orgName
      this.empMes.orgId = arr.orgId
    },
    openAddUser (n) {
      this.clearEmp()
      this.add_account = n=='3'?this.$t('add_terminal'):this.$t('add_dispatcher')
      this.empMes.orgName = this.orgMes.orgName
      this.empMes.orgId = this.orgMes.orgId
      this.empMes.userType = n
      this.modal1 = true
      this.show = false
    },
    // 点击修改密码按钮时
    changePwd (index) {
      this.modal6 = true
      this.changePassword.password = ''
      this.changePassword.uid = this.personData[index].uid
    },
    // 发送修改密码的新密码
    sendNewpwd () {
        const _this = this
        this.$refs.changePassword.validate((valid) => {
            if (valid) {
                this.changePassword.partyId = this.mypartyId
                chgUserPassword(this.changePassword)
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
    // 确认修改组织
    sendChangeOrg () {
      const _this = this
      // 把修改信息发送到后台
      let ids = this.selectionUid.join(',')
      chgEdposUserOrg({'orgId': this.orgId, 'uids': ids, 'partyId':this.mypartyId})
        .then(function (res) {
          if (res.data.code==0) {
            // 重新查找数据
            _this.modal5 = false
            _this.$Message.success(_this.$t('user_table_modify_ok'))
            _this.$emit('search')
          }
        })
    },
    // 修改定位信息
    sendChangeLoc () {
      const _this = this
      let ids = this.selectionUid.join(',')
      imsPush({'uids': ids, 'flag': this.locMes.loc, 'interval': this.locMes.locTime,'partyId':this.mypartyId})
        .then(function (res) {
          if (res.data.code==0) {
            // 重新查找数据
            _this.$Message.success(_this.$t('user_table_modify_ok'))
            _this.$emit('search')
            _this.modal4 = false
          }
        })
    },
    // 确认删除时执行删除操作
    confirmDeletion () {
      this.remove(this.DeleteIndex)
      this.modal7 = false
    },
    btnClick (modal) {
      for(let i =0;i<this.selectionUid.length;i++){
        let n = this.EnterpriseUid.indexOf(this.selectionUid[i])
        if(modal == 3 && n>=0){
            this.$Message.warning(this.$t('user_table_enterprise_warning3'))
            return
        }else if(modal == 8 && n>=0){
            this.$Message.warning(this.$t('user_table_enterprise_warning8'))
            return
        }
      }

        let _this = this

      if (this.selectionUid.length == 0) {
        this.$Message.warning(this.$t('user_table_select_warning'))
      } else if (modal == 5) {
        this.modal5 = true
      } else if (modal == 3) {
        this.modal3 = true
      } else if (modal == 4) {
        this.modal4 = true
      } else if (modal == 8) {
        this.role_assign.uids = this.selectionUid
        this.role_assign.roid=''
        this.modal8 = true
      } else if (modal == 9) {
        getSession()
        .then((res)=>{
            if(res.data.code==0){
                _this.renewMax = res.data.data.company.authMonth
                _this.modal9 = true
                // console.log(_this.renewMax )
            }
        })
        this.renew_form.uids = this.selectionUid.join(',')
        this.renew_form.monthNumber = 1
      }
    },
    // 当点击添加员工modal确定时
    addMes () {
      let _this = this
      this.$refs.userAdd.validate((valid) => {
        if (valid) {
          saveEdposUser(this.empMes)
            .then(function (res) {
              if (res.data.code==0) {
                // 重新查找数据
                _this.$Message.success(_this.$t('user_table_add_ok'))
                _this.$emit('search')
                _this.modal1 = false
              }
            })
         
        }
      })
    },
    // 点击行内图标删除
    remove (index) {
      let _this = this
      this.urlParams.uid = this.personData[index].uid
      this.urlParams.partyId = this.mypartyId
      deleteEdposUser(this.urlParams)
        .then(function (res) {
          if (res.data.code==0) {
            // 重新查找数据
            _this.$Message.success(_this.$t('user_table_delete_ok'))
            _this.$emit('search')
          }
        })
      this.urlParams = {}
    },
    erpiredFormat(){
      if( this.renew_form.expiredDate!=''){
        this.renew_form.expiredDate=dateFormat(new Date(this.renew_form.expiredDate), 'yyyy-MM-dd')
      }
    },

    // 多选删除
    checkDelete () {
      let _this = this
      for(let i=0;i<this.selection.length;i++){
        switch (this.selection[i].userType) {
          case this.$t('employee_type_List3'):
            this.selection[i].userType = 3
            break
          case this.$t('employee_type_List2'): 
            this.selection[i].userType = 2
            break
          case this.$t('employee_type_List1'):
            this.selection[i].userType = 1
            break
        }
      }
      
      batchDeleteUser(this.selection)
        .then(function (res) {
          if (res.data.code==0) {
            // 重新查找数据
            _this.modal3=false
            _this.$Message.success(_this.$t('user_table_delete_ok'))
            _this.$emit('search')
          }
        })
    },
    // 点击modify按钮时
    modify (index) {
      this.modal2 = true
      this.ModifyIndex = index
      // console.log(this.personData[index])
      this.empMes.phone = this.personData[index].phone
      this.empMes.userName = this.personData[index].userName
      this.empMes.imei = this.personData[index].terminal
      // console.log(this.personData[index].userType)
      this.empMes.userType = this.personData[index].userType + ''
      this.empMes.mobile = this.personData[index].mobile
      this.empMes.sex = this.personData[index].sex
      this.UTdisabled = this.personData[index].userType=='1'?true:false
      // console.log(this.personData[index].expiredDate)
      this.empMes.expiredDate = dateFormat(new Date(this.personData[index].expiredDate), 'yyyy-MM-dd')
    },
    // 确认修改
    sendModify () {
        let _this = this
        this.$refs.formCustom.validate((valid) => {
            if (valid) {
                this.params = this.empMes
                this.params.uid = this.personData[this.ModifyIndex].uid
                this.params.orgId = this.personData[this.ModifyIndex].orgId
                this.params.partyId = this.mypartyId
                saveEdposUser(this.params)
                .then(function (res) {
                  if (res.data.code==0) {
                    // 重新查找数据
                    _this.$Message.success(_this.$t('user_table_modify_ok'))
                    _this.$emit('search')
                    _this.modal2 = false
                  }
                })    
            }
        })
    },
    // 清空表单信息
    clearEmp () {
      this.empMes={
            partyId:this.mypartyId,
            phone: '',
            imei: '',
            post: 3,
            mobile: '',
            sex: 1,
            orgName: '',
            orgId: 0, // 添加和修改员工时表单数据
            userType: '3',
            expiredDate:'',
            userName:''
      }

      
    },

    changePage (current) {
      this.pages.page = current
      this.$emit('search', ['page', current])
    },
    changePageSize (pageSize) {
      this.pages.rows = pageSize
      this.$emit('search', ['limit', pageSize])
    },
    searchBox (n) {
      this.$refs.pages.currentPage=1
      this.pages.page = 1
      if(n==0){
        this.$emit('search', ['userName', this.searchTxt])
      }else if(n==1){
        this.$emit('search', ['userType', this.searchUserType])
      }
      
    },
    // 获取所有被选择的员工的uid
    tableSelection (selection) {
      this.selection = selection
      this.selectionUid = []
      for (var i = 0; i < selection.length; i++) {
        this.selectionUid.push(selection[i].uid)
      }
    },
    // 首次加载数据
    _getMes () {
      this.$emit('search')
    },
    // 把personData转化为tableData
    turnData (data) {
      this.EnterpriseUid=[]
      let arr = JSON.parse(JSON.stringify(data))
      for (let i = 0; i < arr.length; i++) {
        switch (arr[i].userType) {
            case 3:
                arr[i].userType = this.$t('employee_type_List3')
                break
            case 2:
                arr[i].userType = this.$t('employee_type_List2')
                break
            case 1:
                arr[i].userType = this.$t('employee_type_List1')
                // console.log(arr[i])
                this.EnterpriseUid.push(arr[i].uid)
                break
            case 4:
                arr[i].userType = this.$t('employee_type_List4')
                break
        }
        arr[i].displayImsPush = arr[i].locFlag==1?this.$t('user_table_loc_open')+' | '+arr[i].locInterval+'s':'-'
        arr[i].expiredDate = dateFormat(new Date(arr[i].expiredDate), 'yyyy-MM-dd')
      }
      this.selectionUid = []
      this.selection = []
      return arr
    },
    exportData (n) {
        let _this = this
        let data = []
        if(n=='1'){
            queryEdposUsers({partyId:this.mypartyId})
            .then(res=>{
                data = _this.turnData(res.data.data)
                _this.exportData1(data,_this.$t('allacounts'))
            })
        }else if(n=='2'){
            data = this.tableData
            let str = _this.$t('pagenum')+_this.pages.page+_this.$t('pageaccount')
            this.exportData1(data,str)
        }else if(n=='3'){
            data = this.selection
            this.exportData1(data,_this.$t('selectedaccount'))
        }
      
    },
    exportData1(data,name){
      this.$refs.table.exportCsv({
        filename: this.$t('account')+name,
        columns: this.columns.filter((col, index) => ((index > 1 && index < 6) || index == 7)),
        data: data
      })
    },
    roleAssign(params){
      getSecRoleByUid({uid:params.row.uid}).then(res=>{
        // console.log(res)
        // 
        this.role_assign.uids=[]
        if(res.data.obj){
          this.role_assign.roid=res.data.obj.roid
        }
        
        this.role_assign.uids.push(params.row.uid)
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
      this.role_assign.partyId = this.mypartyId
      batchUpdateUserRole(this.role_assign).then(res=>{
        if(res.data.code ==0 ) 
            _this.$Message.success(_this.$t('user_table_modify_ok'))
            _this.modal8=false
            // location.reload()
      })
    },
    batchImportModal(){
        this.modal11 = true
        this.batchImportContent=''
        this.$refs.uploadExcel.initUpload()
    },
    uploadTableData(data){
      let arr = []
      data.forEach(function(item){
        let obj = {
          orgName:item.OrgName,
          phone:item.Phone,
          imei:item.SN,
          userName:item.UserName
        }
        arr.push(obj)
      })
      this.uploadTableDataContent = arr
    },
    sendBatchImport(){
        let _this = this
        if(this.uploadTableDataContent.length==0){
            this.$Message.error(this.$t('user_table_import_Content_error'))
            return
        }
        batchCheckUsers({partyId:this.partyId,'userBasics':this.uploadTableDataContent})
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
        batchSaveUserBasic(this.importSuccessData)
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
    }
  },
  computed: {
    btnCollapse:function(){
      return this.winWidth<=1500?true:false
    },
    searchByUserType:function () {
      return this.$t('searchByUserType')
    },
    renewPriceMax:function () {
      return parseInt(this.comRenewMax/this.renewLenth)
    },
    renewBlance:function () {
      return this.comRenewMax-this.renewCount
    },
    renewCount:function () {
      return this.renew_form.uids.split(',').length*this.renew_form.monthNumber
    },
    renewLenth: function () {
      return this.renew_form.uids.split(',').length
    },
    comRenewMax: function () {
      return this.renewMax
    },
    tableData: function () {
      if (this.personData.length > 0) {
        return this.turnData(this.personData)
      }
    },
    user_table_search_placeholder: function () {
      return this.$t('user_table_search_placeholder')
    },
    modal1_title: function () {
      return this.$t('user_table_modal1_title')
    },
    user_table_modal1_account_label: function () {
      return this.$t('user_table_modal1_account_label')
    },
    user_table_modal1_account_placeholder: function () {
      return this.$t('user_table_modal1_account_placeholder')
    },
    user_table_modal1_pwd_label: function () {
      return this.$t('user_table_modal1_pwd_label')
    },
    user_table_modal1_pwd_placeholder: function () {
      return this.$t('user_table_modal1_pwd_placeholder')
    },
    user_table_modal1_userName_label: function () {
      return this.$t('user_table_modal1_userName_label')
    },
    user_table_modal1_userName_placeholder: function () {
      return this.$t('user_table_modal1_userName_placeholder')
    },
    user_table_modal1_org_placeholder: function () {
      return this.$t('user_table_modal1_org_placeholder')
    },
    user_table_modal1_userType_label: function () {
      return this.$t('user_table_modal1_userType_label')
    },
    user_table_modal1_expireDate_label: function () {
      return this.$t('user_table_modal1_expireDate_label')
    },
    user_table_modal1_expireDate_placeholder: function () {
      return this.$t('user_table_modal1_expireDate_placeholder')
    },
    user_table_modal1_tel_label: function () {
      return this.$t('user_table_modal1_tel_label')
    },
    user_table_modal1_tel_placeholder: function () {
      return this.$t('user_table_modal1_tel_placeholder')
    },
    user_table_modal1_gender_label: function () {
      return this.$t('user_table_modal1_gender_label')
    },
    user_table_modal1_email_label: function () {
      return this.$t('user_table_modal1_email_label')
    },
    user_table_modal1_email_placeholder: function () {
      return this.$t('user_table_modal1_email_placeholder')
    },

    modal2_title: function () {
      return this.$t('user_table_modal2_title')
    },
    modal3_title: function () {
      return this.$t('user_table_modal3_title')
    },
    modal4_title: function () {
      return this.$t('user_table_modal4_title')
    },
    user_table_modal4_loc_label: function () {
      return this.$t('user_table_modal4_loc_label')
    },
    user_table_modal4_locTime_label: function () {
      return this.$t('user_table_modal4_locTime_label')
    },

    modal5_title: function () {
      return this.$t('user_table_modal5_title')
    },
    user_table_modal5_changeOrg_placeholder: function () {
      return this.$t('user_table_modal5_changeOrg_placeholder')
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
    role_assign_modal_title: function () {
      return this.$t('user_table_col_role_assign')
    },
    user_table_col_role1: function () {
      return this.$t('user_table_col_role1')
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
    batchImport: function () {
      return this.$t('user_table_btn_batchImport')
    },
    user_table_batchImportContent:function () {
      return this.$t('user_table_batchImportContent')
    },
    Result:function () {
      return this.$t('Result')
    },
    repeat: function () {
      return this.$t('repeat')
    },
    register_repeat_pwd_placeholder: function () {
      return this.$t('register_repeat_pwd_placeholder')
    },
    current_balance: function () {
      return this.$t('current_balance')
    },
    surplus:function(){
        return this.$t('surplus')
    },
    renewtotal:function(){
        return this.$t('total')
    },
  }
}
</script>
