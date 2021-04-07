import React, {Component, RefObject} from "react";
import {Button, Form, Input, message, Modal, Space} from "antd";
import {FormInstance} from "antd/es";
import {addAdmin} from "../../api/admin";

interface IProps {
    visible: boolean
    cancel: () => void
    refresh: () => void
}

interface IAdmin {
    name: string
    password: string
    email: string
    mobile: string
}

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
};
const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};
export default class AddAdmin extends Component<IProps, any> {
    formRef: RefObject<FormInstance>

    constructor(props: IProps, context: any) {
        super(props, context);
        this.formRef = React.createRef<FormInstance>()
    }

    cancel = () => {
        message.info('取消添加')
        this.formRef.current?.resetFields()
        this.props.cancel()
    }
    addAdmin = (admin: IAdmin) => {
        addAdmin(admin).then(response => {
            const {code, msg} = response.data
            if (code === 0) {
                message.success(msg)
                this.formRef.current?.resetFields()
                this.props.refresh()
                this.props.cancel()
            } else {
                message.error(msg)
            }
        })
    }
    reset = () => {
        this.formRef.current?.resetFields()
    }

    render() {
        return (
            <>
                <Modal
                    title='添加管理员'
                    visible={this.props.visible}
                    onCancel={this.cancel}
                    footer={null}
                >
                    <Form
                        ref={this.formRef}
                        {...layout}
                        onFinish={this.addAdmin}
                        onReset={this.reset}
                    >

                        <Form.Item
                            name={'name'}
                            label='姓名'
                            rules={[
                                {
                                    type: 'string',
                                    message: '用户名不可以为空',
                                    required: true
                                }
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name={'mobile'}
                            label='手机号'
                            rules={[
                                {
                                    type: 'string',
                                    message: '手机号不可以为空',
                                    required: true
                                }
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name={'email'}
                            label='邮箱'
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name={'password'}
                            label='密码'
                            rules={[
                                {
                                    type: 'string',
                                    validator: (rule, value) => {
                                        if (value.length > 0 && value.length < 6) {
                                            return Promise.reject('密码长度不能小于6位')
                                        }
                                        return Promise.resolve()
                                    }
                                }
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    提交
                                </Button>
                                <Button type="default" htmlType="reset">
                                    重置
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>

                </Modal>
            </>
        )
    }
}
