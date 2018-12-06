/* eslint-disable */
import axios from '@/libs/api.request'

export const getCounts = (params) => {
  return axios.request({
    url: '/agent/api/getMainInfo',
    method: 'get'
  })
}
export const getExpiringUsers = (params) => {
  return axios.request({
    url: '/agent/api/getExpiringUsers',
    method: 'get',
    params
  })
}
