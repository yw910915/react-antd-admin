import request from '../utils/request'

export const getRoleList = (page: number = 1) => {
    return request({
        url: '/admin/role/list',
        params: {page: page}
    })
}

export const deleteRole = (roleId: number) => {
    return request({
        url: '/admin/role/delete/' + roleId,
        method: 'delete'
    })
}

export const getRoleDetail = (roleId: number) => {
    return request({
        url: '/admin/role/detail/' + roleId
    })
}
export const saveRole = (roleId: number, roleName: string, permissionList: number[]) => {
    return request({
        url: '/admin/role/update/' + roleId,
        method: 'put',
        data: {
            roleName: roleName,
            permissionList: permissionList
        }
    })
}
export const getAllRole = () => {

    return request({
        url: '/admin/role/all'
    })
}
