/* eslint-disable */
import axios from '@/libs/api.request'

export const queryChannels = (params) => {
  return axios.request({
    url: '/agent/api/queryRooms',
    method: 'get',
    params
  })
}
export const saveChannel = (params) => {
  return axios.request({
    url: '/agent/api/saveRoom',
    method: 'get',
    params
  })
}
export const deleteChannel = (params) => {
  console.log(params)
  return axios.request({
    url: '/agent/api/deleteRoom',
    method: 'post',
    params
  })
}

export const queryRoomMembers = (params) => {
  return axios.request({
    url: '/agent/api/queryRoomMembers',
    method: 'get',
    params
  })
}

export const saveRoomMembers = (params) => {
  return axios.request({
    url: '/agent/api/saveRoomMembers',
    method: 'post',
    data:params
  })
}
export const deleteRoomMember = (params) => {
  return axios.request({
    url: '/agent/api/deleteRoomMember',
    method: 'post',
    params
  })
}
export const loadRoomCache = (params) => {
  return axios.request({
    url: '/agent/api/loadRoomCache',
    method: 'get',
    params
  })
}

export const batchDeleteRoomMember = (params) => {
  return axios.request({
    url: '/agent/api/batchDeleteRoomMember',
    method: 'post',
    data:params
  })
}

export const switchRec = (params) => {
  return axios.request({
    url: '/agent/switchRec',
    method: 'post',
    params
  })
}

export const setRoomMemberAdminGrade = (params) => {
  return axios.request({
    url: '/agent/api/setRoomMemberAdminGrade',
    method: 'get',
    params
  })
}