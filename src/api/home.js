/* eslint-disable */
import axios from '@/libs/api.request'

export const getCounts = (params) => {
  return axios.request({
    url: '/agent/api/getMainInfo',
    method: 'get'
  })
}

export const logDetails = (params) => {
  return axios.request({
    url: 'vcapi/queryOnlineUserDetailByPage',
    method: 'get',
    params
  })
}

export const chartData = (url) => {
  return axios.request({
    url: url,
    method: 'get',
  })
}