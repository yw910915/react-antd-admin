import React, {Component, RefObject} from "react";
import {Button, Form, Input, Modal, Space} from "antd";
import {IRole} from "./RoleList";
import {FormInstance} from "antd/lib/form";

const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

interface IProps {
    visible: boolean
    role?: IRole
    callback: (visible: boolean) => void
    saveRole: (role?: IRole) => void
}

export default class EditRole extends Component<IProps, any> {
    formRef: RefObject<FormInstance>

    constructor(props: IProps, context: any) {
        super(props, context);
        this.formRef = React.createRef<FormInstance>()
    }

    handleCancel = () => {
        this.props.callback(false)
    }
    saveRole = (role: IRole) => {
        this.props.saveRole({id: this.props.role?.id as number, roleName: role.roleName})
    }

    render() {
        this.formRef.current?.setFieldsValue({...this.props.role})
        return (
            <>
                <Modal
                    visible={this.props.visible}
                    title="编辑用户信息"
                    onCancel={this.handleCancel}
                    cancelText='取消'
                    okText='确认'
                    footer={null}
                >
                    <Form
                        ref={this.formRef}
                        onFinish={this.saveRole}
                        initialValues={{
                            ...this.props.role
                        }}
                    >
                        <Form.Item
                            name='roleName'
                            rules={[{required: true, message: '角色名称不可以为空'}]}
                            shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    提交
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )
    }
}
