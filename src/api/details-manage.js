/* eslint-disable */
import axios from '@/libs/api.request'

export const queryCreditRecordAgent = (params) => {
  return axios.request({
    url: '/agent/api/queryCreditRecordAgent',
    method: 'get',
    params
  })
}
export const queryCreditRecordCompany = (params) => {
  return axios.request({
    url: '/agent/api/queryCreditRecordCompany',
    method: 'get',
    params
  })
}

export const setCreditRecordRemark = (params) => {
  return axios.request({
    url: '/agent/api/setCreditRecordRemark',
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
export const queryUserPartyCompanyShort = (params) => {
  return axios.request({
    url: '/agent/api/queryUserPartyCompanyShort',
    method: 'get',
    params
  })
}
export const queryUserBasicShort = (params) => {
  return axios.request({
    url: '/agent/api/queryUserBasicShort',
    method: 'get',
    params
  })
}