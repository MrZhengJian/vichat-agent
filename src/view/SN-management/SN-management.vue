<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import "./SN-management.less";
    
</style>
<template>
    <div class="SN_manager">
        <Card class="searchCard">
            <div style="overflow:hidden">
                <div class="searchBox">
                    <span>{{$t('SN')}}：</span> 
                    <Input v-model="searchMes.sn" clearable  type="text"  style="width:180px"/>
                </div>
                <div class="searchBox">
                    <span>{{$t('alarmType')}}：</span>
                    <Input v-model="searchMes.snType" clearable type="text"  style="width:180px"/>
                </div>
                <div class="searchBox">
                    <span>{{$t('state')}}：</span>
                    <Select v-model="searchMes.resState" style="width:100px">
                        <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="searchBox">
                    <Button type="primary" @click='search'>&nbsp;&nbsp;{{$t('search')}}&nbsp;&nbsp;</Button>
                </div>
                <div class="searchBox" style="float:right">
                    <Button type="primary" @click="batchImportModal">{{$t('batchAssign')}}</Button>
                    <Button type="primary" @click="assign" style="margin-left:20px;">{{$t('assign')}}</Button>
                </div>
                
            </div>
        </Card>
        <div class="content">
            <div class="btns">
                <!-- <Select v-model="isAllSN" @on-change="changeIsAllSN" style="width:100px">
                    <Option :value="1" :key="1">{{ $t('allSN') }}</Option>
                    <Option :value="0" :key="0">{{ $t('mySN') }}</Option>
                </Select> -->
                <!-- <Button v-if="!isAllSN" type="primary" @click="batchImportModal">{{$t('account_import')}}</Button> -->
                
            </div>
            <div class="tableBox">
                <Table @on-selection-change="tableSelection" ref="selection" :columns="tableColums" :data="tableData"></Table>
            </div>
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
        <!-- 批量导入 -->
        <Modal :title="modal11Title" v-model="modal11" :width="800">
            <div class="example1">
                <span style="display:inline-block;text-align:right;">{{$t('agent')}}：</span>
                <Select clearable filterable v-model="assignAgentId" style="width:300px">
                    <Option v-for="item in agentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <a class="example" href="./example-SN.xlsx">{{$t('Example')}}</a>
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
                <Button type="primary" size="large" @click="modal12=false">
                    {{$t('close')}}
                </Button>
            </div>
        </Modal>
        <Modal 
            :title="Assign" 
            v-model="modal1" 
            class='AssginSN'
            >
            <div style="margin:15px 0">
                <span style="display:inline-block;text-align:right;width:120px;">{{$t('agent')}}：</span>
                <Select  v-model="assignAgentId" style="width:300px">
                    <Option v-for="item in agentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            
            <div slot="footer">
                <Button  type="default" size="large" @click="modal1=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="comfirmAssign">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
        <Modal 
            :title="Assign" 
            v-model="modal2" 
            class='AssginSN'
            >
           
            <h1 style="text-align:center;margin:10px;">{{confirmAssign}}</h1>
            <div slot="footer">
                <Button  type="default" size="large" @click="modal2=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="sendAssign(0)">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
    </div>
    
</template>

<script type="ecmascript-6">
import { querySnResources,batchCheckSN,batchSaveSN,assignSN } from '@/api/sn'
import uploadExcel from '@/view/excel/upload-excel'
import { queryAgentCompany,queryAgentCompanyShort } from '@/api/agent'
export default {
    components:{
        uploadExcel
    },
    created:function(){
        this.getSnResources()
        this.getAgentList()
    },
    data () {
    	return{
            confirmAssign:this.$t('confirmAssign'),
            myAgentId:this.$store.state.user.userObj.agentId,
            myAgentName:this.$store.state.user.userObj.agentName,
            isAllSN:1,
            modal1: false, // 
            modal2: false, // 
            modal11: false, // 批量导入
            modal12: false, // 批量导入结果
            searchMes:{
                sn:'',
                snType:'',
                resState:2
            },
            stateList:[
                {
                    value:2,
                    label:this.$t('all')
                },
                {
                    value:0,
                    label:this.$t('used')
                },
                {
                    value:1,
                    label:this.$t('unused')
                }
            ],
            tableData:[],
            tableColums:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                  title: this.$t('SN'),
                  key: 'sn',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.sn,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.sn)
                    ])
                  }
                },
                {
                  title: this.$t('alarmType'),
                  key: 'snType',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.snType,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.snType)
                    ])
                  }
                },
                {
                  title: this.$t('state'),
                  key: 'resState',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' },
                      style:{
                        color:params.row.resState==this.$t('used')?'#19be6b':'#515a6e'
                      }
                    }, [
                      params.row.resState,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.resState)
                    ])
                  }
                },
                {
                  title: this.$t('agent'),
                  key: 'agentCompanyName',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.agentCompanyName,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.agentCompanyName)
                    ])
                  }
                },
                {
                    title: this.$t('org_table_col_action'),
                    key: 'action',
                    align: 'center',
                    fixed: 'right',
                    width:150,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', 
                                {
                                    on: {
                                        click: () => {
                                            // params.row.resState = params.row.resState==this.$t('unused')?1:0
                                            this.singleAssign=[]
                                            this.singleAssign.push(JSON.parse(JSON.stringify(params.row)))
                                            this.singleAssign[0].resState=this.singleAssign[0].resState==this.$t('unused')?1:0
                                            this.modal1 = true
                                            this.isSingleAssign = true
                                        }
                                    },
                                    style:{
                                        // display:this.accessList.company_edit?'inline-block':'none',
                                        color:params.row.resState==this.$t('used')?'#ccc':'#2DB7F5',
                                        // color:'#2DB7F5',
                                        cursor:'pointer'
                                    },
                                    props: {
                                        disabled:params.row.resState==this.$t('used')?true:false,
                                        type: 'text',
                                        size: 'small'
                                    } 
                                },this.$t('assign'))
                        ]);
                    }
                }
    
            ],
            page:{
                total:0,
                current:1,
                size:10
            },
            singleAssign:[],
            isSingleAssign:false,
            selection:[],
            selectionUid:[],
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
                    title: this.$t('SN'),
                    key: 'sn'
                },
                {
                    title: this.$t('alarmType'),
                    key: 'snType'
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
                    title: this.$t('SN'),
                    key: 'sn'
                },
                {
                    title: this.$t('alarmType'),
                    key: 'snType'
                },
                {
                    title: this.$t('ERRS'),
                    key: 'ext1'
                },
            ],
            importFailureData:[],
            uploadTableDataContent:[],
            assignAgentId:'',
            agentList:[],
            modal11Title:this.$t('assign')
    	}
    },


    methods:{
        changeIsAllSN(){
            this.page.current=1
            this.getSnResources()
        },
        getSnResources(){
            let _this = this
            let param = {
                page:this.page.current,
                rows:this.page.size,
                sn:this.searchMes.sn,
                snType:this.searchMes.snType,
                resState:this.searchMes.resState==2?'':this.searchMes.resState
            }
            let url = 'agent/api/querySnResourcesByAgentId'
            param.agentId = this.myAgentId
            // if(this.isAllSN){
            //     url = 'agent/api/querySnResources'
            // }else{
            //     url = 'agent/api/querySnResourcesByAgentId'
            //     param.agentId = this.myAgentId
            // }
            querySnResources(url,param).
            then(res=>{
                _this.page.total = res.data.count
                _this.tableData = _this.turnData(res.data.data)
                _this.selection = []
            })
        },
        turnData(data){
            let _this = this
            data.forEach(function(item,index){
                item.resState=item.resState==1?_this.$t('unused'):_this.$t('used')
            })
            return data
        },
        changePage(current){
            this.page.current = current
            this.getSnResources()
        },
        changePageSize(current){
            this.page.size = current
            this.getSnResources()
        },
        tableSelection (selection) {
            let _this = this
            this.newQuery = false
            this.selection = selection
            
            this.selection.forEach(function(item){
                item.resState=item.resState==_this.$t('used')?0:1
            })
        },
        batchImportModal(){
            this.modal11 = true
            this.batchImportContent=''
            this.uploadTableDataContent=""
            // this.assignAgentId=""
            this.$refs.uploadExcel.initUpload()
        },
        uploadTableData(data){
            let tableData=[]
            for(let i=0;i<data.length;i++){
                if(!data[i].SN||!data[i]['SN Type']){
                    this.$Message.error(this.$t('impotError'))
                    this.$refs.uploadExcel.tableData=[]
                    this.$refs.uploadExcel.tableTitle=[]
                    this.$refs.uploadExcel.showProgress=false
                    this.$refs.uploadExcel.file=null
                    return
                }
                let obj = {
                    sn:data[i].SN,
                    snType:data[i]['SN Type'],
                } 

                tableData.push(obj)
            }
           
            this.uploadTableDataContent = tableData
        },
        sendBatchImport(){

            let _this = this
            if(this.uploadTableDataContent.length==0){
                this.$Message.error(this.$t('user_table_import_Content_error'))
                return
            }
            if(this.assignAgentId==''){
                this.$Message.error(this.$t('user_table_import_agentId_error'))
                return
            }
            this.sendAssign(this.uploadTableDataContent)
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
            batchSaveSN(this.importSuccessData)
            .then(function(res){
                if(res.data.code==0){
                    _this.$Message.success(_this.$t('user_table_import_success_list'))
                    _this.modal12=false
                    _this.getSnResources()
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
        search(){
            this.$refs.page.currentPage=1
            this.page.current = 1
            this.getSnResources()
        },
        getAgentList(){
            let _this = this
            queryAgentCompany()
            .then((res)=>{
                if(res.data.code==0){
                    res.data.data.forEach(function(item){
                        let obj = {
                            value:item.agentId,
                            label:item.companyName+'【'+item.account+'】'
                        }
                        _this.agentList.push(obj)
                    })
                }
                
            })
        },
        assign(){
            let _this=this
            let used = false
            this.selection.forEach(function(item){
                if(item.resState==0){
                    
                    used = true
                    return
                }
            })
            this.isSingleAssign = false
            if(used){
                this.$Message.error( _this.$t('usedError'))
                return
            }
            if (this.selection.length == 0) {
                this.$Message.warning(this.$t('user_table_select_warning'))
            } else {
                this.modal1 = true
            }
        },
        comfirmAssign(){
            if(this.assignAgentId==0){
                this.$Message.error(this.$t('user_table_import_agentId_error'))
                return
            }
            this.modal1=false;
            this.modal2=true
        },
        sendAssign(data){
            // console.log(data,this.assignAgentId)
            if(data==0){
                data = this.isSingleAssign?this.singleAssign:this.selection
            }
            let _this = this
            let param = {
                agentId:this.assignAgentId,
                snResources:data
            }
            assignSN(param).
            then((res)=>{
                if(res.data.code==0){
                    _this.modal11 = false
                    _this.modal12 = true
                    _this.turnDate(res.data.data.errorUsers)
                    _this.turnDate(res.data.data.successUsers)
                    _this.errorCount = res.data.data.errorUsers.length
                    _this.importFailureData = res.data.data.errorUsers
                    _this.successCount = res.data.data.successUsers.length
                    _this.importSuccessData = res.data.data.successUsers
                    // _this.$Message.success(_this.$t('assignSuccess'))
                    _this.getSnResources()
                    _this.modal2 = false
                    _this.modal11 = false

                }
            })
        },

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
        Assign:function () {
          return this.$t('assign')
        },
    },
}
</script>

