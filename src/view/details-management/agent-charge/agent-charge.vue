<template>
    <div class="agent_charge">
        <Card class="search">
            <div>
                <!-- <div class="search_item">
                    <div class="search_label">{{$t('agent')}}</div>
                    <div class="search_input agentTree">
                        <Input @on-focus="showTree=true" v-model='searchMes.agentName' clearable :placeholder="agent_name_placeholder" @on-change="clearSearchAgent" style="width:250px"/>
                        <Tree v-if="showTree" @on-select-change="clickTreeNode" :data="treeDate" :load-data="getChildAgent" style="width:250px"></Tree>
                    </div>
                </div> -->
                <div class="search_item">
                    <div class="search_label">{{$t('home_echart_date')}}</div>
                    <div class="search_input">
                        <DatePicker v-model='searchMes.date'  type="datetimerange" :options="dateOptions"  style="width: 300px"></DatePicker>
                    </div>
                </div>
                <div class="search_item">
                    <div class="search_label">{{$t('alarmType')}}</div>
                    <div class="search_input">
                        <Select v-model="searchMes.busiState" style="width:150px">
                            <Option v-for="item in busiStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>

                <div class="search_item">
                    <Button type='primary' @click="search">{{$t('search')}}</Button>
                </div>
            </div>
        </Card>
    	<div class="content" ref='content'>
          <Table :columns="columns" :data="tableData"></Table>
      </div>
      <div class="pages">
          <div>
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
      <Modal v-model="modal1" class='details_remark'>
          <p slot="header">
              <span>{{$t('remark')}}</span>
          </p>
              <Input v-model="remarkContent" :maxlength="1000" type="textarea" :rows="4" :placeholder="enterRemark" />
          <div slot="footer">
              <Button type="default" size="large" @click="modal1=false">{{$t('cancel')}}</Button>
              <Button type="primary" size="large" @click="sendRemark">{{$t('ok')}}</Button>
          </div>
      </Modal>
    </div>

</template>

<script type="ecmascript-6">
import { queryCreditRecordAgent, setCreditRecordRemark, queryAgentCompanyShort, queryUserPartyCompanyShort, queryUserBasicShort } from '@/api/details-manage'
import { getSession} from '@/api/user'
import {dateFormat} from '@/libs/tools'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      moreSearch: this.$t('moreSearch'),
      columns: [
        {
          title: this.$t('home_echart_date'),
          key: 'createTime',
          width: 150,
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.createTime,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.createTime)
            ])
          }
        },

        {
          title: this.$t('turn_out'),
          key: 'myName',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.myName,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.myName)
            ])
          }
        },
        {
          title: this.$t('turn_in'),
          key: 'objName',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.objName,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.objName)
            ])
          }
        },
        {
          title: this.$t('alarmType'),
          key: 'busiState',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.busiState,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.busiState)
            ])
          }
        },
        {
          title: this.$t('beforeBalance'),
          key: 'chgBefore',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.chgBefore,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.chgBefore)
            ])
          }
        },

        {
          title: this.$t('value'),
          key: 'chgValue',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.chgValue,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.chgValue)
            ])
          }
        },
        {
          title: this.$t('afterBalance'),
          key: 'chgAfter',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.chgAfter,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.chgAfter)
            ])
          }
        },
        {
          title: this.$t('operator'),
          key: 'dealName',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.dealName,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.dealName)
            ])
          }
        },
        {
          title: this.$t('user_table_col_action'),
          key: 'action',
          align: 'center',
          width: 150,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button',
                {
                  on: {
                    click: () => {
                      this.remarkContent = params.row.ext1 || ''
                      this.remarkDesc = params.row.remark || ''
                      this.logId = params.row.logId
                      this.modal1 = true
                    }
                  },
                  style: {
                    // display:this.accessList.child_agent_recharge?'inline-block':'none',
                    cursor: 'pointer',
                    color: '#2DB7F5'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('remark'))

            ])
          }
        }
      ],
      tableData: [],
      modal1: false,
      remarkContent: '',
      remarkDesc: '',
      logId: '',
      searchMes: {
        busiState: '',
        date: ['', ''],
        agentId: '',
        agentName: ''
      },
      busiStateList: [
        {
          value: '0',
          label: this.$t('all')
        },
        {
          value: '1',
          label: this.$t('recharge_in')
        },
        {
          value: '2',
          label: this.$t('recharge_out')
        }
      ],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      dateOptions: {
        shortcuts: [
          {
            text: this.$t('1week'),
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: this.$t('1month'),
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: this.$t('3months'),
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ]
      },
      agentList: [],
      saveAgentList: [],
      companyList: [],
      userList: [],
      loading1: false,
      loading2: false,
      loading3: false,
      treeDate: [],
      agentTreeSearchText: '',
      showTreeSpin: false,
      showTree: false
    }
  },

  created: function () {
    this.queryCreditRecord()
    this.queryAgentList({parentId: 0})
  },
  methods: {
    queryCreditRecord () {
      let _this = this
      let params = {
        page: this.page.current,
        rows: this.page.size
      }
      let data = {
        busiState: this.searchMes.busiState==0?'':this.searchMes.busiState,
        startDate: this.searchMes.date[0] ? dateFormat(new Date(this.searchMes.date[0]), 'yyyy-MM-dd hh:mm:ss') : '',
        endDate: this.searchMes.date[1] ? dateFormat(new Date(this.searchMes.date[1]), 'yyyy-MM-dd hh:mm:ss') : '',
        agentId: this.searchMes.agentId
      }
      queryCreditRecordAgent(params, data)
        .then((res) => {
          if (res.data.code == 0) {
            _this.page.total = res.data.count
            _this.trunTableData(res.data.data)
          }
        })
    },
    trunTableData (data) {
      this.tableData = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i].authMonth) {
          data[i].authMonth = 0
        }
        data[i].createTime = dateFormat(new Date(data[i].createTime), 'yyyy-MM-dd hh:mm:ss')

        // busiType : 1=代理商充企业  2=代理商充代理商   3=客服充代理商
        // busiState : 1=充入  2=充出
        // dealname=处理人名字   myName=所查企业名字    objName=充入火充出对象名字

        if (data[i].busiType == 1) { // 代理商充企业
          if (data[i].busiState == 2) {
            data[i].dealName = data[i].agentUname
            data[i].myName = data[i].agentName
            data[i].objName = data[i].companyName + '【' + data[i].uname + '】'
          } else {
            data[i].dealName = data[i].agentUname
            data[i].myName = data[i].companyName + '【' + data[i].uname + '】'
            data[i].objName = data[i].agentName
          }
        } else if (data[i].busiType == 2) { // 代理商充代理商
          if (data[i].busiState == 2) { // 充出
            data[i].dealName = data[i].agentUname
            data[i].myName = data[i].agentName
            data[i].objName = data[i].companyName
          } else { // 充入
            data[i].dealName = data[i].agentUname
            data[i].myName = data[i].companyName
            data[i].objName = data[i].agentName
          }
        } else if (data[i].busiType == 3) { // 客服充代理商
          if (data[i].busiState == 2) { // 充出
            data[i].dealName = data[i].ccsUname
            data[i].myName = this.$t('customer_service')
            data[i].objName = data[i].companyName
          } else {
            data[i].dealName = data[i].ccsUname
            data[i].myName = data[i].companyName
            data[i].objName = this.$t('customer_service')
          }
        }
        switch (data[i].busiState) {
          case 1:
            data[i].busiState = this.$t('recharge_in')
            break
          case 2:
            data[i].busiState = this.$t('recharge_out')
            break
        }
      }
      this.tableData = data
    },
    changePage (current) {
      this.page.current = current
      this.queryCreditRecord()
    },
    changePageSize (current) {
      this.page.size = current
      this.queryCreditRecord()
    },
    search () {
      this.page.current = 1
      this.$refs.page.currentPage = 1
      this.queryCreditRecord()
    },
    sendRemark () {
      let _this = this
      if (this.remarkContent == '') {
        this.$Message.error(this.$t('ctremark'))
      } else {
        let params = {
          logId: this.logId,
          remark: this.remarkContent
        }
        setCreditRecordRemark(params)
          .then(function (res) {
            if (res.data.code == 0) {
              _this.$Message.success(_this.$t('user_table_modify_ok'))
              _this.queryCreditRecord()
              _this.modal1 = false
            }
          })
      }
    },
    showMoreSearch () {
      if (this.moreSearch == this.$t('moreSearch')) {
        this.moreSearch = this.$t('normalSearch')
        this.$refs.content.style.top = '130px'
      } else {
        this.moreSearch = this.$t('moreSearch')
        this.$refs.content.style.top = '70px'
      }
    },
    queryAgentList (param) {
      this.showTreeSpin = true
      let _this = this
      _this.treeDate = []
      queryAgentCompanyShort(param)
        .then((res) => {
          if (res.data.code == 0) {
            res.data.obj.forEach(function (item) {
              let obj = {
                id: item.agentId,
                title: item.companyName
              }
              if (item.isParent) {
                obj.loading = false
                obj.children = []
              }
              _this.treeDate.push(obj)
            })
            _this.showTreeSpin = false
          }
        })
    },
    getChildAgent (item, callback) {
      // console.log(item)
      queryAgentCompanyShort({parentId: item.id})
        .then((res) => {
          let result = []
          // console.log(res.dzata.obj)
          res.data.obj.forEach(function (item) {
            let obj = {
              id: item.agentId,
              title: item.companyName
            }
            if (item.isParent) {
              obj.loading = false
              obj.children = []
            }
            result.push(obj)
          })
          callback(result)
        })
    },
    agentTreeSearch () {
      let param = this.agentTreeSearchText == '' ? {parentId: 0} : {companyName: this.agentTreeSearchText}
      this.queryAgentList(param)
    },
    clickTreeNode (param) {
      this.showTree = false
      this.searchMes.agentId = param[0].id
      this.searchMes.agentName = param[0].title
    },
    clearSearchAgent () {
      if (this.searchMes.agentName == '') {
        this.searchMes.id = ''
        this.showTree = false
      }
    }
  },
  computed: {
    Search: function () {
      return this.$t('search')
    },
    enterRemark: function () {
      return this.$t('enterRemark')
    },
    SelectDate: function () {
      return this.$t('SelectDate')
    },
    agentUname_placeholder: function () {
      return this.$t('agentUname_placeholder')
    },
    busiType_placeholder: function () {
      return this.$t('busiType_placeholder')
    },
    please_enter_name: function () {
      return this.$t('please_enter_name')
    },
    renewPriceMax: function () {
      return parseInt(this.comRenewMax)
    },
    renewBlance: function () {
      return this.comRenewMax - this.renewCount
    },
    renewCount: function () {
      return this.renew_form.monthNumber
    },
    comRenewMax: function () {
      return this.renewMax
    },
    edit_agent: function () {
      return this.$t('edit_agent')
    },
    addConfirm: function () {
      return this.$t('addConfirm')
    },
    name: function () {
      return this.$t('name')
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
    user_table_modal1_pwd_label: function () {
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
    user_table_modal1_tel_placeholder: function () {
      return this.$t('user_table_modal1_tel_placeholder')
    },
    agent_address_label: function () {
      return this.$t('agent_address_label')
    },
    agent_address_placeholder: function () {
      return this.$t('agent_address_placeholder')
    },
    contacts_number: function () {
      return this.$t('contacts_number')
    },
    current_balance: function () {
      return this.$t('current_balance')
    },
    surplus: function () {
      return this.$t('surplus')
    },
    total: function () {
      return this.$t('total')
    }
  },
  mounted: function () {
    window.document.title = localStorage.getItem('platformNameLong')
  }

}
</script>

<style rel="stylesheet" lang="less">
    @import "../../../styles/common.less";
    @import './agent-charge.less';
</style>
