/* eslint-disable */
import axios from '@/libs/api.request'

export const queryPrisonSecRole = (params) => {
  return axios.request({
    url: '/agent/api/querySecRole',
    method: 'get',
    params
  })
}

export const saveOrUpdSecRole = (params) => {
  return axios.request({
    url: '/agent/api/saveOrUpdSecRole',
    method: 'get',
    params
  })
}

export const delSecRole = (params) => {
  return axios.request({
    url: '/agent/api/delSecRole',
    method: 'get',
    params
  })
}

export const getTree = (params) => {
  return axios.request({
    url: '/agent/api/secZTree',
    method: 'get',
    params
  })
}

export const saveSecRoleFunction = (params) => {
  return axios.request({
    url: '/agent/api/saveSecRoleFunction',
    method: 'post',
    data:params
  })
}

export const querySecRoleFunctionByRoid = (params) => {
  return axios.request({
    url: '/agent/api/querySecRoleFunctionByRoid',
    method: 'get',
    params
  })
}