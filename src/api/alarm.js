/* eslint-disable */
import axios from '@/libs/api.request'

export const queryAlarm = (params) => {
  return axios.request({
    url: '/vcapi/alarm/queryAlarm',
    method: 'get',
    params
  })
}

export const finishAlarm = (params) => {
  return axios.request({
    url: '/vcapi/alarm/finishAlarm',
    method: 'get',
    params
  })
}

export const saveDealResult = (params) => {
  return axios.request({
    url: '/vcapi/alarm/saveDealResult',
    method: 'post',
    params

  })
}
