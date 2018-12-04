/* eslint-disable */
import axios from '@/libs/api.request'

export const registerCompany = (params) => {
  return axios.request({
    url: '/agent/api/registerCompany',
    method: 'get',
    params
  })
}