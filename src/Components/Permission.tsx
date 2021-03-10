import React, {Component, ReactNode} from 'react'
import {inject, observer} from "mobx-react";
import {default as PermissionList} from '../store/Permission'

interface IProps {
    path: string
    permission?: PermissionList
    children?: ReactNode
}

// 把权限的唯一标识【path】传过来 ，把需要页面里做限制的组件传过来 判断权限 返回最终的组件
// 如果没有权限就隐藏
@inject('permission')
@observer
class Permission extends Component<IProps, any> {
    checkPermission = (permission: string): boolean => {
        if (this.props.permission) {
            return this.props.permission?.getPermissionList().filter((p) => p.path === permission).length > 0;
        }
        return false
    }

    render() {
        return (
            <>
                {
                    this.checkPermission(this.props.path) ?
                        this.props.children
                        :
                        null
                }
            </>
        )
    }
}

export default Permission
