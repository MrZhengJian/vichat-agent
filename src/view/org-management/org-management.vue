<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
    @import "./org-management.less";
    @import "../../styles/common.less";
</style>

<template>
    <div class="org">
        <div class="title">
            {{$t('companyNameLabel')}}：{{companyName}}
        </div>
        <Row class="main" :gutter="8">
            <Col ref='col3' span="4">
                <Spin fix size="large" v-show="spin2"></Spin>
                <!-- 向子组件传值，:aaa="1"传递的是数字1   aaa="1"传递的是字符串1 -->
                <org-tree v-on:search="search" :partyId="partyId" @defaultOrg="defaultOrg" origin="org" :updateTreeList="updateTreeList"></org-tree>
            </Col>
            <Col span="20">
                <Spin fix size="large" v-show="spin1"></Spin>
                <org-table v-on:search="search" :orgMes="orgMes" :orgId="orgId" :partyId="partyId" v-on:updateTree="updateTree" :orgData="orgData" :updateTreeList="updateTreeList"></org-table>
            </Col>
        </Row>
    </div>
    
</template>

<script type="ecmascript-6">
import orgTable from '@/view/common-components/org-table/org-table'
import orgTree from '@/view/common-components/org-tree/org-tree'
import { orgZTree } from '@/api/user-manage'
import { queryEdposOrgByParentId } from '@/api/org-manage'

export default {
    components:{
        orgTree,
        orgTable
    },
    data () {
    	return{
            partyId:this.$route.params.partyId || localStorage.getItem('partyId'),
            orgData:[],
            updateTreeList:[],
            searchParams:{
                partyId:this.partyId,
                parentId:0
            },
            orgId:0,
            orgMes:{},
            spin1:false,
            spin2:false,
            companyName:localStorage.getItem('companyName')
    	}
    },
    created:function(){
        // window.document.title = localStorage.getItem('platformNameLong')
    },
    methods:{
        search(arr){
            this.spin1 = true
            let _this = this
            if(arr){
                if(arr.length>2){
                    this.orgMes = arr[2]
                }
                
                this.searchParams.parentId = arr[1]
                this.orgId = arr[1]
            }else{
                this.searchParams.parentId = 0
            }
            this.searchParams.partyId = this.partyId
            // console.log(this.searchParams)
            queryEdposOrgByParentId(this.searchParams)
            .then(function(res){
                if(res.data.code&&res.data.code==-1){
                    _this.$router.push({
                        name:'login'
                    });
                }
                _this.orgData = res.data.rows
                _this.spin1 = false
            })
        },
        updateTree(){
            this.spin2 = true
            const _this = this
            let param = {
               partyId:this.partyId 
            }
            orgZTree(param)
            .then(function(res){
               _this.updateTreeList = res.data
               _this.spin2 = false
            })
        },
        defaultOrg(obj){
            this.orgMes = obj
        }
    }
}    
</script>
