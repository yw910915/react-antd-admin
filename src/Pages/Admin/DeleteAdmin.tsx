import React, {Component} from "react";
import {Button, message, Popconfirm} from "antd";
import {IAdmin} from "./AdminList";
import {deleteAdmin} from "../../api/admin";

interface IProps {
    admin: IAdmin
    callback: (admin: IAdmin) => void
}

export default class DeleteAdmin extends Component<IProps, any> {
    confirm = () => {
        deleteAdmin(this.props.admin.id).then(response => {
            const {code, msg} = response.data
            if (code === 0) {
                message.success(msg)
                this.props.callback(this.props.admin)
            } else {
                message.error(msg)
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
