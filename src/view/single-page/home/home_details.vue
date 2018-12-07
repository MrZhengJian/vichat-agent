<script type="text/javascript">
  /* eslint-disable */
</script>

<style lang="less">
    @import "../../../styles/common.less";
    @import "./home_details.less";    
</style>
<template>
    <div class="home_details">
        <Card class="searchCard">
            <div style="overflow:hidden">
                <div class="searchBox">
                    <span>{{$t('account')}}：</span> 
                    <Input v-model="searchMes.terminal" clearable  type="text"  style="width:200px"/>
                </div>
                <div class="searchBox">
                    <span>{{$t('name')}}：</span>
                    <Input v-model="searchMes.userName" clearable type="text"  style="width:200px"/>
                </div>
                <div class="searchBox">
                    <span>{{$t('company')}}：</span>
                    <Input v-model="searchMes.companyName" clearable type="text"  style="width:200px"/>
                </div>
                <div class="searchBox">
                    <Button type="primary" @click='search'>&nbsp;&nbsp;{{$t('search')}}&nbsp;&nbsp;</Button>
                </div>
            </div>
        </Card>
        <div class="content">
                <Table @on-selection-change="tableSelection" ref="selection" :columns="tableColums" :data="tableData"></Table>
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

        <!-- 续约 -->
        <Modal :title="renew" class="aaa" v-model="modal9">
            <Form :model="renew_form" ref="renew" :rules="renewRule"  :label-width="120">
                <FormItem :label="current_balance"  style="margin:12px;">
                   <span style="font-size:26px;font-weight:bold;color:red">{{comRenewMax}}</span>
                </FormItem>
                <FormItem :label="renew_by_month_label"  style="margin:12px;">
                    <InputNumber :max="renewPriceMax" :min="1" v-model="renew_form.monthNumber" style="width: 300px"></InputNumber> 
                </FormItem>

                <!-- <FormItem :label="renewtotal"  style="margin:12px;">
                    
                    <span style="font-size:24px;font-weight:bold"> {{renewCount}} </span>{{$t('month')}}
                    （ {{renewLenth}} {{$t('user_table_modal1_account_label')}} x {{renew_form.monthNumber}} {{$t('month')}} ）
                </FormItem> -->
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
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { getExpiringUsers } from '@/api/home';
import { dateFormat } from '@/libs/tools';
import { getSession } from '@/api/user';
import { batchUpdateUserExpiredDate } from '@/api/user-manage';
export default {
    created:function(){
        this.queryExpiringUsers()
    },
    components: {
        
    },
    data () {
        return {
            tableData:[],
            tableColums:[
                {
                  title: this.$t('user_table_col_account'),
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
                  title: this.$t('company'),
                  key: 'companyName',
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.companyName,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.companyName)
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
                  width: 150,
                  fixed: 'right',
                  render: (h, params) => {
                    return h('div', [
                     
                      h('Button',
                        {
                          on: {
                            click: () => {
                              this.renew_form={
                                uids:params.row.uid+'',
                                type:'0',
                                monthNumber:1,
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
            searchMes:{
                userName:'',
                terminal:'',
                companyName:'',
            },
            page:{
                total:0,
                page:1,
                rows:10
            },
            renewMax:0,
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
            modal9:false,
            modal10:false,
        };
    },
    mounted:function(){
    },
    methods: {   
        queryExpiringUsers(){
            let _this = this
            let param = {
                userName:this.searchMes.userName,
                terminal:this.searchMes.terminal,
                companyName:this.searchMes.companyName,
                page:this.page.page,
                rows:this.page.rows
            }
            getExpiringUsers(param)
            .then(res=>{
                if(res.data.code==0){
                    _this.page.total = res.data.count
                    _this.turnData(res.data.data)
                }
                // console.log(res)
            })
        },
        turnData(data){
            data.forEach(item=>{
                item.expiredDate = dateFormat(new Date(item.expiredDate),'yyyy-MM-dd')
            })
            this.tableData = data
        },
        search(){
            this.page.page=1
            this.queryExpiringUsers()
        },
        tableSelection(){

        },
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
              _this.queryExpiringUsers()
              _this.modal10=false
            }
          }) 
        },
        changePage(current){
            this.page.page = current
            this.queryExpiringUsers()
        },
        changePageSize(size){
            this.page.rows = size
            this.queryExpiringUsers()
        }
    },
    computed: {
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
        current_balance: function () {
          return this.$t('current_balance')
        },
        surplus:function(){
            return this.$t('surplus')
        },
        renewtotal:function(){
            return this.$t('total')
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
    }
};
</script>
