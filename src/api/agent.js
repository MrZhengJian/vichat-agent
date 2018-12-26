/* eslint-disable */
import axios from '@/libs/api.request'

export const queryCompany = (params) => {
  return axios.request({
    url: '/agent/api/queryCompany',
    method: 'get',
    params
  })
}

export const getCompany = (params) => {
  return axios.request({
    url: '/agent/api/getCompany',
    method: 'get',
    params
  })
}

export const saveCompany = (params) => {
  return axios.request({
    url: '/agent/api/saveCompany',
    method: 'get',
    params
  })
}

export const registerCompany = (params) => {
  return axios.request({
    url: '/agent/api/registerCompany',
    method: 'post',
    data:params
  })
}
deleteCompany
export const deleteCompany = (params) => {
  return axios.request({
    url: '/agent/api/deleteCompany',
    method: 'get',
    params
  })
}
export const batchUpdateCompanyExpiredDate = (params) => {
  return axios.request({
    url: '/agent/api/batchUpdateCompanyExpiredDate',
    method: 'get',
    params
  })
}

export const queryAgentCompany = (params) => {
  return axios.request({
    url: '/agent/api/queryAgentCompany',
    method: 'get',
    params
  })
}
export const registerAgentCompany = (params) => {
  return axios.request({
    url: '/agent/api/registerAgentCompany',
    method: 'get',
    params
  })
}

export const batchUpdateAgentUsersExpiredDate = (params) => {
  return axios.request({
    url: '/agent/api/batchUpdateAgentExpiredDate',
    method: 'get',
    params
  })
}

export const saveAgentCompany = (params) => {
  return axios.request({
    url: '/agent/api/saveAgentCompany',
    method: 'get',
    params
  })
}

export const deleteAgentCompany = (params) => {
  return axios.request({
    url: '/agent/api/deleteAgentCompany',
    method: 'get',
    params
  })
}

// AGENT USERS
export const queryAgentUser = (params) => {
  return axios.request({
    url: '/agent/api/queryAgentUser',
    method: 'get',
    params
  })
}

export const batchCheckAgentUsers = (params) => {
  return axios.request({
    url: '/agent/api/batchCheckAgentUsers',
    method: 'post',
    data:params
  })
}

export const batchSaveAgentUsers = (params) => {
  return axios.request({
    url: '/agent/api/batchSaveAgentUsers',
    method: 'post',
    data:params
  })
}

export const chgAgentPassword = (params) => {
  return axios.request({
    url: '/agent/api/chgAgentPassword',
    method: 'get',
    params
  })
}

export const saveAgentUser = (params) => {
  return axios.request({
    url: '/agent/api/saveAgentUser',
    method: 'get',
    params
  })
}

export const deleteAgentUser = (params) => {
  return axios.request({
    url: '/agent/api/deleteAgentUser',
    method: 'get',
    params
  })
}

export const queryAgentCompanyShort = (params) => {
  return axios.request({
    url: '/agent/api/queryAgentCompanyShort',
    method: 'get',
    params
  })
}

export const chgChildAgentPassword = (params) => {
  return axios.request({
    url: '/agent/api/chgChildAgentPassword',
    method: 'get',
    params
  })
}