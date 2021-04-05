import React, {Component, RefObject} from "react";
import {Button, Form, Input, message, Modal, Space} from "antd";
import {FormInstance} from "antd/lib/form";
import {addRole} from "../../api/role";

interface IProps {
    visible: boolean
    cancel: () => void
}

interface IRole {
    roleName: string
}

const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};
const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
};
// 为什么用类写呢，因为类的变量作用域更加明确
// 聪明人利用规则，选择合适的方式处理问题
// 有么有人知道怎么在电脑回复弹幕的
export default class AddRole extends Component<IProps, any> {
    formRef: RefObject<FormInstance>

    constructor(props: IProps, context: any) {
        super(props, context);
        this.formRef = React.createRef<FormInstance>()
    }

    cancel = () => {
        this.formRef.current?.resetFields()
        this.props.cancel()
    }
    addRole = (role: IRole) => {
        addRole(role).then(response => {
            const {msg, code} = response.data
            if (code === 0) {
                message.success(msg)
                this.props.cancel()
            } else {
                message.error(msg)
            }
        })
    }

    render() {
        return (
            <>
                <Modal
                    title="添加角色"
                    visible={this.props.visible}
                    onCancel={this.cancel}
                    footer={null}
                >
                    <Form
                        ref={this.formRef}
                        {...layout}
                        onFinish={this.addRole}
                    >
                        <Form.Item
                            label={'角色名称'}
                            name='roleName'
                            rules={[
                                {
                                    type: "string",
                                    required: true,
                                    message: '角色名称不可以为空'
                                }
                            ]}
                        >
                            <Input/>
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