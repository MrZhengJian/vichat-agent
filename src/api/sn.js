/* eslint-disable */
import axios from '@/libs/api.request'

export const querySnResources = (url,params) => {
  return axios.request({
    url: url,
    method: 'get',
    params
  })
}


export const batchCheckSN = (params) => {
  return axios.request({
    url: '/agent/api/batchCheckSN',
    method: 'post',
    data:params
  })
}

export const batchSaveSN = (params) => {
  return axios.request({
    url: '/agent/api/batchSaveSN',
    method: 'post',
    data:params
  })
}

export const assignSN = (params) => {
  return axios.request({
    url: '/agent/api/assignSN',
    method: 'post',
    data:params
  })
}