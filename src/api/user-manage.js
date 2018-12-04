/* eslint-disable */
import axios from '@/libs/api.request'

export const queryEdposUsers = (params) => {
  return axios.request({
    url: '/agent/api/queryUserBasic',
    method: 'get',
    params
  })
}

export const saveEdposUser = (params) => {
  return axios.request({
    url: '/agent/api/saveUserBasic',
    method: 'post',
    params
  })
}

export const deleteEdposUser = (params) => {
  return axios.request({
    url: '/agent/api/deleteUser',
    method: 'post',
    params
  })
}

export const batchDeleteUser = (params) => {
  return axios.request({
    url: '/agent/api/batchDelUser',
    method: 'post',
    data:params
  })
}
export const chgEdposUserOrg = (params) => {
  return axios.request({
    url: '/agent/api/batchUpdateUserOrg',
    method: 'post',
    params
  })
}

export const chgUserPassword = (params) => {
  return axios.request({
    url: '/agent/api/chgPassword',
    method: 'post',
    params
  })
}

export const imsPush = (params) => {
  return axios.request({
    url: '/agent/api/setLocation',
    method: 'get',
    params
  })
}

export const orgZTree = (params) => {
  return axios.request({
    url: '/agent/api/getOrgTree',
    method: 'get',
    params
  })
}

export const loadSysStaticData = (params) => {
  return axios.request({
    url: '/agent/api/loadSysStaticData',
    method: 'get'
  })
}

export const batchUpdateUserRole = (params) => {
  return axios.request({
    url: '/agent/api/batchUpdateUserRole',
    method: 'get',
    params
  })
}

export const batchUpdateUserExpiredDate = (params) => {
  return axios.request({
    url: '/agent/api/batchUpdateUserExpiredDate',
    method: 'get',
    params
  })
}

export const getSecRoleByUid = (params) => {
  return axios.request({
    url: '/agent/api/getSecRoleByUid',
    method: 'get',
    params
  })
}

export const batchCheckUsers = (params) => {
  return axios.request({
    url: '/agent/api/batchCheckUserBasic',
    method: 'post',
    data:params
  })
}

export const batchSaveUserBasic = (params) => {
  return axios.request({
    url: '/agent/api/batchSaveUserBasic',
    method: 'post',
    data:params
  })
}