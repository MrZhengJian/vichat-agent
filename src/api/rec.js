/* eslint-disable */
import axios from '@/libs/api.request'

export const getChannelResouces = (params) => {
  return axios.request({
    url: '/agent/api/getRoomResouces',
    method: 'get',
    params
  })
}