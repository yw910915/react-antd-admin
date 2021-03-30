import React, {Component, RefObject} from "react";
import {IAdmin} from "./AdminList";
import {Button, Form, Input, message, Modal, Select, Space} from "antd";
import {FormInstance} from "antd/lib/form";
import {getAllRole} from "../../api/role";
import {updateAdmin} from "../../api/admin";

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
};
const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

interface IProps {
    visible: boolean
    admin?: IAdmin
    cancel: () => void
    saveAdmin: (admin: IAdmin) => void
}

interface IRole {
    id: number
    roleName: string
}

interface IState {
    roleList: IRole[]
}

export default class EditAdmin extends Component<IProps, IState> {

    formRef: RefObject<FormInstance>

    constructor(props: IProps, context: any) {
        super(props, context);
        this.formRef = React.createRef<FormInstance>()
        this.state = {
            roleList: []
        }
    }

    handleCancel = () => {
        this.props.cancel()
    }
    saveAdmin = (admin: IAdmin) => {
        admin.id = this.props.admin?.id as number
        updateAdmin(admin.id, admin).then(response => {
            const {code, msg} = response.data
            if (code === 0) {
                message.success(msg)
                this.props.saveAdmin(admin)
            } else {
                message.error(msg)
            }
        })
    }

    componentDidMount() {
        this.getAllRole()
    }

    getAllRole() {
        getAllRole().then(response => {
            const {data} = response.data
            this.setState({
                roleList: data
            })
        })
    }

    render() {
        this.formRef.current?.setFieldsValue({...this.props.admin, ...{password: '', roleId: this.props.admin?.roleId}})
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
                        {...layout}
                        ref={this.formRef}
                        initialValues={{
                            ...this.props.admin,
                            ...{password: ''}
                        }}
                        onFinish={this.saveAdmin}
                    >
                        <Form.Item
                            label='管理员名称'
                            name={'name'}
                            rules={[{required: true, message: '管理员名称不可以为空'}]}
                            shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
                        >
                            <Input autoComplete='off'/>
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
                            rules={[{
                                validator: (rules, value: string) => {
                                    if (value === '') {
                                        return Promise.resolve()
                                    }
                                    if (value.length < 6) {
                                        return Promise.reject('密码长度不能小于6位')
                                    } else if (value.length > 22) {
                                        return Promise.reject('密码长度不能大于22位')
                                    }
                                    return Promise.resolve()
                                }
                            }]}
                        >
                            <Input.Password/>
                        </Form.Item>

                        <Form.Item
                            label='角色'
                            name='roleId'
                        >
                            <Select
                                placeholder="请选择角色"
                                showSearch
                            >
                                {
                                    this.state.roleList.map((role) => (
                                        <Select.Option
                                            value={role.id}
                                            key={role.id}>
                                            {role.roleName}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
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
