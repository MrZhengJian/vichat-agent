<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
@import "../../../styles/common.less";
@import "./person-table.less";
</style>

<template>
  <div class="table">
    <p class="btn-group">
      <Dropdown style="float:right" trigger="click" @on-click="exportData">
        <Button type="primary">
          {{$t('user_table_btn_export')}}
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="1">{{$t('all')}}</DropdownItem>
          <DropdownItem name="2">{{$t('current_page')}}</DropdownItem>
          <DropdownItem name="3">{{$t('selected_item')}}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button
        type="primary"
        v-if="accessList.company_account_import"
        @click="batchImportModal"
      >{{$t('user_table_btn_batchImport')}}</Button>
      <!-- <Button type="primary" @click="btnClick(4)">{{$t('user_table_btn_location')}}</Button> -->
      <!-- <Button type="primary" @click="btnClick(3)">{{$t('user_table_btn_delete')}}</Button> -->
      <Button
        type="primary"
        v-if="accessList.company_account_org"
        @click="btnClick(5)"
      >{{$t('user_table_btn_org')}}</Button>
      <!-- <Button type="primary" @click="btnClick(8)">{{$t('user_table_col_role_assign')}}</Button> -->
      <Button
        type="primary"
        v-if="accessList.company_account_recharge"
        @click="btnClick(9)"
      >{{$t('renew')}}</Button>
      <Button
        type="primary"
        v-if="accessList.company_account_add"
        @click="openAddUser"
      >{{$t('user_table_btn_add')}}</Button>
      <Input
        search
        enter-button
        @on-search="searchBox"
        v-model="searchTxt"
        :placeholder="user_table_search_placeholder"
        style="width: 250px;float:left"
      ></Input>
    </p>
    <div class="table-main">
      <Table
        ref="table"
        stripe
        @on-selection-change="tableSelection"
        :columns="columns"
        :data="tableData"
      ></Table>
    </div>
    <div class="page">
      <div style="float: right;">
        <Page
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :total="total"
          show-total
          :page-size-opts="[10,20,50]"
          show-elevator
          show-sizer
          placement="top"
        ></Page>
      </div>
    </div>
    <!-- 添加员工 -->
    <Modal :title="add_account" v-model="modal1" class="adduser">
      <Form ref="userAdd" :model="empMes" :rules="ruleCustom" :label-width="120">
        <FormItem :label="user_table_modal1_account_label" prop="imei">
          <Input
            type="text"
            v-model="empMes.imei"
            :maxlength="20"
            :placeholder="user_table_modal1_account_placeholder"
            style="width: 300px"
          ></Input>
        </FormItem>
        <FormItem :label="user_table_modal1_userName_label" prop="userName">
          <Input
            type="text"
            v-model="empMes.userName"
            :maxlength="20"
            :placeholder="user_table_modal1_userName_placeholder"
            style="width: 300px"
          ></Input>
        </FormItem>
        <div class="selectOrg">
          <span>{{$t('user_table_modal1_org_label')}}</span>
          <div class="treeBox">
            <Input
              type="text"
              @on-focus="show=true"
              :maxlength="20"
              v-model="empMes.orgName"
              style="width: 300px"
              :placeholder="user_table_modal1_org_placeholder"
            ></Input>
          </div>
        </div>
        <org-tree v-show="show" :partyId="mypartyId" v-on:changeOrg="addUserChangeOrg"></org-tree>
        <FormItem :label="user_table_modal1_userType_label" prop="type">
          <Select v-model="empMes.userType" disabled style="width:300px">
            <Option value="1" key="1">{{ $t('employee_type_List1') }}</Option>
            <Option value="2" key="2">{{ $t('employee_type_List2') }}</Option>
            <Option value="3" key="3">{{ $t('employee_type_List3') }}</Option>
            <Option value="4" key="4">{{ $t('employee_type_List4') }}</Option>
          </Select>
        </FormItem>

        <FormItem :label="user_table_modal1_tel_label" prop="phone">
          <Input
            v-model="empMes.phone"
            :maxlength="30"
            :placeholder="user_table_modal1_tel_placeholder"
            style="width: 300px"
          ></Input>
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
    <Modal :title="modal2_title" v-model="modal2" class="modify_modal">
      <Form ref="formCustom" :model="empMes" :rules="ruleCustom" :label-width="120">
        <FormItem :label="user_table_modal1_account_label" prop="imei">
          <Input disabled type="text" :maxlength="20" v-model="empMes.imei" style="width: 300px"></Input>
        </FormItem>
        <FormItem :label="user_table_modal1_userName_label" prop="userName">
          <Input type="text" :maxlength="20" v-model="empMes.userName" style="width: 300px"></Input>
        </FormItem>
        <FormItem :label="user_table_modal1_userType_label" prop="type">
          <Select v-model="empMes.userType" disabled style="width:300px">
            <!-- <Option v-for="item in employee_type_List" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
            <Option value="1" key="1">{{ $t('employee_type_List1') }}</Option>
            <Option value="2" key="2">{{ $t('employee_type_List2') }}</Option>
            <Option value="3" key="3">{{ $t('employee_type_List3') }}</Option>
            <Option value="4" key="4">{{ $t('employee_type_List4') }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="user_table_modal1_tel_label">
          <Input
            v-model="empMes.phone"
            :maxlength="30"
            :placeholder="user_table_modal1_tel_placeholder"
            style="width: 300px"
          ></Input>
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
        <Button type="default" size="large" @click="modal2=false">{{$t('cancel')}}</Button>
        <Button type="primary" size="large" @click="sendModify">{{$t('ok')}}</Button>
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
            <Option
              v-for="item in switch_List"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
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
    <Modal
      class="userModifyOrg"
      @on-visible-change="showTree=false"
      :title="modal5_title"
      v-model="modal5"
      :styles="{top: '10px'}"
    >
      <div class="selectOrg">
        <span class="selectOrg-title">{{$t('user_table_modal5_changeOrg_label')}}</span>
        <div class="selectOrg-content">
          <Input
            type="text"
            @on-focus="showTree=true"
            :placeholder="user_table_modal5_changeOrg_placeholder"
            v-model="orgName"
            style="width: 300px"
          ></Input>
        </div>
      </div>
      <org-tree v-show="showTree" :partyId="mypartyId" v-on:changeOrg="changeOrg"></org-tree>
      <div slot="footer">
        <Button type="default" size="large" @click="modal5=false">{{$t('cancel')}}</Button>
        <Button type="primary" size="large" @click="sendChangeOrg">{{$t('ok')}}</Button>
      </div>
    </Modal>
    <!-- 修改密码 -->
    <Modal :title="modal6_title" v-model="modal6">
      <Form ref="changePassword" :model="changePassword" :label-width="120" :rules="ruleCustom">
        <FormItem :label="user_table_modal6_newPwd_label" prop="password">
          <Input
            type="password"
            v-model="changePassword.password"
            :placeholder="user_table_modal6_newPwd_placeholder"
            :minlength="6"
            :maxlength="16"
            style="width: 300px"
          ></Input>
        </FormItem>
        <FormItem :label="repeat" prop="repassword">
          <Input
            type="password"
            v-model="changePassword.repassword"
            :placeholder="register_repeat_pwd_placeholder"
            :minlength="6"
            :maxlength="16"
            style="width: 300px"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" size="large" @click="modal6=false">{{$t('cancel')}}</Button>
        <Button type="primary" size="large" @click="sendNewpwd">{{$t('ok')}}</Button>
      </div>
    </Modal>
    <!-- 行内删除提示 -->
    <Modal :title="modal3_title" v-model="modal7">
      <p style="margin:20px 0;text-align:center;font-size:20px">{{$t('user_table_modal7_content')}}</p>
      <div slot="footer">
        <Button type="default" size="large" @click="modal7=false">{{$t('cancel')}}</Button>
        <Button type="primary" size="large" @click="confirmDeletion">{{$t('ok')}}</Button>
      </div>
    </Modal>
    <!-- 角色分配 -->
    <Modal :title="role_assign_modal_title" v-model="modal8">
      <Form :model="role_assign" :label-width="100">
        <FormItem :label="user_table_col_role1" style="margin:12px;">
          <Select v-model="role_assign.roid" style="width:300px">
            <Option
              v-for="item in role_assign_List"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
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
      <Form :model="renew_form" ref="renew" :rules="renewRule" :label-width="120">
        <FormItem :label="current_balance" style="margin:12px;">
          <span style="font-size:26px;font-weight:bold;color:red">{{comRenewMax}}</span>
        </FormItem>
        <FormItem :label="renew_by_month_label" style="margin:12px;">
          <InputNumber
            :max="renewPriceMax"
            :min="1"
            v-model="renew_form.monthNumber"
            style="width: 300px"
          ></InputNumber>
        </FormItem>

        <FormItem :label="renewtotal" style="margin:12px;">
          <span style="font-size:24px;font-weight:bold">{{renewCount}}</span>
          {{$t('month')}}
          （ {{renewLenth}} {{$t('user_table_modal1_account_label')}} x {{renew_form.monthNumber}} {{$t('month')}} ）
        </FormItem>
        <FormItem :label="surplus" style="margin:12px;">
          <span style="font-size:24px;font-weight:bold">{{renewBlance}}</span>
          {{$t('month')}}
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
        <Button type="default" size="large" @click="modal11=false">{{$t('cancel')}}</Button>
        <Button type="primary" size="large" @click="sendBatchImport">{{$t('ok')}}</Button>
      </div>
    </Modal>
    <!-- 导入结果 -->
    <Modal :title="Result" class="importResult" v-model="modal12" :value="tabName">
      <Tabs type="card" @on-click="tabChange">
        <TabPane :label="successList" name="name1">
          <Table border :columns="importSuccessColumns" :data="importSuccessData"></Table>
        </TabPane>
        <TabPane :label="errorList" name="name2">
          <Table border :columns="importFailurecolumns" :data="importFailureData"></Table>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button type="default" size="large" @click="modal12=false">{{$t('cancel')}}</Button>
        <Button
          v-if="tabName=='name1'"
          type="primary"
          size="large"
          @click="batchSaveEdposUser"
        >{{$t('user_table_btn_batchImport')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="ecmascript-6">
/* eslint-disable */
</script>
