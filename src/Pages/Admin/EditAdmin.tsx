import React, {Component, RefObject} from "react";
import {IAdmin} from "./AdminList";
import {Button, Form, Input, Modal, Space} from "antd";
import {FormInstance} from "antd/lib/form";


const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

interface IProps {
    visible: boolean
    admin?: IAdmin
    cancel: () => void
    saveAdmin: (admin: IAdmin) => void
}

export default class EditAdmin extends Component<IProps, any> {
    formRef: RefObject<FormInstance>

    constructor(props: IProps, context: any) {
        super(props, context);
        this.formRef = React.createRef<FormInstance>()
    }

    handleCancel = () => {
        this.props.cancel()
    }
    saveAdmin = (admin: IAdmin) => {
        admin.id = this.props.admin?.id as number
        this.props.saveAdmin(admin)
    }

    render() {
        this.formRef.current?.setFieldsValue({...this.props.admin})
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
                        onFinish={this.saveAdmin}
                        initialValues={{...this.props.admin}}
                    >
                        <Form.Item
                            label='管理员名称'
                            name={'name'}
                            rules={[{required: true, message: '管理员名称不可以为空'}]}
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
