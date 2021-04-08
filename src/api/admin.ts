import request from '../utils/request'

export const getAdminInfo = (data: any) => {
    return request({
        url: '/admin/admin/info'
    })
}
export const getAdminList = (page: number = 1) => {
    return request({
        url: '/admin/admin/list',
        params: {page: page}
    })
}
export const deleteAdmin = (adminId: number) => {
    return request({
        url: '/admin/admin/delete/' + adminId,
        method: 'delete'
    })
}
export const updateAdmin = (adminId: number, data: any) => {
    return request({
        url: '/admin/admin/update/' + adminId,
        method: 'put',
        data: data
    })
}

export const addAdmin = (admin: any) => {
    return request({
        url: '/admin/admin/add',
        method: 'post',
        data: admin
    })
}
