import request from '../utils/request'

export const getAdminInfo = (data: any) => {
    return request({
        url: '/admin/admin/info'
    })
}
