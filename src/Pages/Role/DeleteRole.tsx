import React, {Component} from "react";
import {IRole} from "./RoleList";
import {Button, message, Popconfirm} from "antd";
import {deleteRole} from "../../api/role";

interface IProps {
    role: IRole
    callback: (role: IRole) => void
}

export default class DeleteRole extends Component<IProps, any> {
    confirm = () => {
        deleteRole(this.props.role.id).then(response => {
            const {code, msg} = response.data
            if (code === 0) {
                message.success('删除成功！')
                this.props.callback(this.props.role)
            } else {
                message.warn(msg)
            }
        })
    }
    cancel = () => {
        message.info('你取消了删除！')
    }

    render() {
        return (
            <>
                <Popconfirm
                    title='你确定要删除用户吗？删除后不可以恢复！'
                    okText="删除"
                    placement="topRight"
                    onConfirm={this.confirm}
                    onCancel={this.cancel}
                    cancelText="取消"
                >
                    <Button type='primary' danger>删除</Button>
                </Popconfirm>
            </>
        )
    }
}
