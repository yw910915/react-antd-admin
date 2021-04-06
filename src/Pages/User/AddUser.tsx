import React, {Component, RefObject} from "react";
import {Button, Form, Input, message, Modal, Space} from "antd";
import {FormInstance} from "antd/lib/form";
import {addUser} from "../../api/user";

const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
}

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
};

interface IProps {
    visible: boolean
    closeAddUser: (refresh?: boolean) => void
}

export default class AddUser extends Component<IProps, any> {
    formRef: RefObject<FormInstance>

    constructor(props: IProps, context: any) {
        super(props, context);
        this.formRef = React.createRef<FormInstance>();
    }

    cancel = () => {
        this.props.closeAddUser()
    }
    addUser = (user: any) => {
        addUser(user).then(response => {
            const {code, msg} = response.data
            if (code === 0) {
                this.props.closeAddUser(true)
                this.formRef.current?.resetFields()
                message.success(msg)
            } else {
                message.error(msg)
            }
        })
    }

    render() {
        this.formRef.current?.setFieldsValue({})
        return (
            <>
                <Modal
                    title="添加用户"
                    cancelText='取消'
                    okText='确认'
                    visible={this.props.visible}
                    onCancel={this.cancel}
                    footer={null}
                >
                    <Form
                        {...layout}
                        ref={this.formRef}
                        onFinish={this.addUser}
                    >
                        <Form.Item
                            shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
                            label='姓名'
                            name='name'
                            rules={[{required: true, message: '用户姓名不可以为空'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
                            label='手机号'
                            name='mobile'
                            rules={[{required: true, message: '手机号不可以为空'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
                            label='密码'
                            name='password'
                            rules={[
                                {
                                    type: 'string',
                                    validator: (rule, value) => {
                                        if (value.length < 6) {
                                            return Promise.reject('密码长度至少6位')
                                        }
                                        return Promise.resolve()
                                    }
                                }
                            ]}
                        >
                            <Input.Password autoComplete='off'/>
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
