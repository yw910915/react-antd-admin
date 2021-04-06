import React, {Component, RefObject} from "react";
import {Button, Form, Input, message, Modal, Space, Tree} from "antd";
import {FormInstance} from "antd/lib/form";
import {addRole} from "../../api/role";
import {getAllPermission} from "../../api/permission";

interface IProps {
    visible: boolean
    cancel: (r?: boolean) => void
}

interface IRole {
    roleName: string
    permissionList: number[]
}

interface IPermission {
    id: number
    key: number
    isMenu: number
    parentId: number
    path: string
    title: string
    children: IPermission[]
}

interface IState {
    nodeList: IPermission[]
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
export default class AddRole extends Component<IProps, IState> {
    formRef: RefObject<FormInstance>

    constructor(props: IProps, context: any) {
        super(props, context);
        this.formRef = React.createRef<FormInstance>()
        this.state = {
            nodeList: []
        }
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
                this.props.cancel(true)
            } else {
                message.error(msg)
            }
        })
    }
    getAllPermission = () => {
        getAllPermission().then(response => {
            const {data} = response.data
            this.setState({
                nodeList: this.generatePermissionList(data),
            })
        })
    }
    generatePermissionList = (permissionList: IPermission[], parentId: number = 0): IPermission[] => {
        let pl: IPermission[] = []
        permissionList.forEach((permission: IPermission) => {
            if (permission.parentId === parentId) {
                permission.key = permission.id
                permission.children = this.generatePermissionList(permissionList, permission.id)
                pl.push(permission)
            }
        })
        return pl
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (!prevProps.visible && prevState.nodeList.length === 0) {
            this.getAllPermission()
        }
    }

    onCheck = (checkedKeys: any, info: any) => {
        this.formRef.current?.setFieldsValue({
            permissionList: checkedKeys.checked
        })
    };
    reset = () => {
        this.formRef.current?.resetFields()
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
                        onReset={this.reset}
                        initialValues={{
                            roleName: '',
                            permissionList: []
                        }}
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
                        <Form.Item
                            name='permissionList'
                            rules={[
                                {
                                    type: "array",
                                    min: 1,
                                    required: true,
                                    validator: (rule, value) => {
                                        if (value.length <= 0) {
                                            return Promise.reject('至少要选择一个权限！')
                                        }
                                        return Promise.resolve()
                                    }
                                },

                            ]}
                            label='权限'>
                            <Tree
                                defaultExpandAll
                                checkStrictly
                                showLine
                                checkable
                                treeData={this.state.nodeList}
                                onCheck={this.onCheck}
                            />
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
