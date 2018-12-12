<script type="text/javascript">
  /* eslint-disable */
</script>

<style lang="less">
    @import "../../../styles/common.less";
    @import "./home.less";    
</style>
<template>
    <div class="home-main" style="margin-bottom:30px;">
        <h2><span style="font-weight:normal">{{$t('home_welcome')}}</span> {{logoText}}</h2>
        <Card>
            <p slot="title">{{$t('personal_center')}}</p>
            <Row>
                <Col :span='10'>{{$t('company')}}</Col>
                <Col :span='14'>{{company}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('user_table_modal1_account_label')}}</Col>
                <Col :span='14'>{{account}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('user_table_modal1_userName_label')}}</Col>
                <Col :span='14'>{{userName}}</Col>
            </Row>
        </Card>
        <Card>
            <p slot="title">{{$t('agent_count')}}</p>
            <Row>
                <Col :span='10'>{{$t('balance')}}</Col>
                <Col :span='14'>{{balance}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('accountNum')}}</Col>
                <Col :span='14'>{{count.accountNum}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('childAgentNum')}}</Col>
                <Col :span='14'>{{count.childAgentNum}}</Col>
            </Row>
        <!--     
        </Card>
        <Card>
            <p slot="title">{{$t('company_count')}}</p>
            -->
            <Row>
                <Col :span='10'>{{$t('agentCompanyNum')}}</Col>
                <Col :span='14'>{{count.agentCompanyNum}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('agentCompanyUserNum')}}</Col>
                <Col :span='14'>{{count.agentCompanyUserNum}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('expiringUserNum')}}</Col>
                <Col :span='14'>{{count.expiringUserNum}} <a @click="toDetails" style="margin-left:20px;">{{$t('channel_col_view')}}</a></Col>
            </Row>
        </Card>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { getCounts } from '@/api/home';
export default {
    name: 'home',
    created:function(){
        this.getCount()
    },
    components: {
        
    },
    data () {
        return {
            count: {
                accountNum: 0,
                agentCompanyNum: 0,
                agentCompanyUserNum:0,
                childAgentNum: 0,
                expiringUserNum: 0
            },

            logoText:localStorage.getItem('platformNameLong'),
            userName:this.$store.state.user.userObj.userName || '  ',
            company:this.$store.state.user.CompanyObj.companyName,
            account:this.$store.state.user.userObj.account,
            balance:this.$store.state.user.CompanyObj.authMonth || 0
        };
    },
    computed: {
       
    },
    mounted:function(){
    },
    methods: {   
        getCount(){
            let _this = this 
            getCounts()
            .then(function(res){
                if(res.data.code==0){
                    _this.count = res.data.obj
                }
            })
        },
        toDetails(){
            this.$router.push({
                name:'Expiring',
                params:{ 
                    
                }
            });
        }
    }
};
</script>
