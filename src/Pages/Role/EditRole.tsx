import React, {Component, RefObject} from "react";
import {Button, Form, Input, message, Modal, Space, Tree} from "antd";
import {FormInstance} from "antd/lib/form";
import {getRoleDetail, saveRole} from "../../api/role";

const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};
const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16},
};

interface IRole {
    id: number
    roleName: string
    permissionList?: number[]
}

interface IProps {
    visible: boolean
    role?: IRole
    callback: (visible: boolean) => void
    saveRole: (role?: IRole) => void
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
    defaultCheckedKeys: number[]
    defaultSelectedKeys: number[]
    defaultExpandedKeys: number[]
}

export default class EditRole extends Component<IProps, IState> {
    formRef: RefObject<FormInstance>

    constructor(props: IProps, context: any) {
        super(props, context);
        this.formRef = React.createRef<FormInstance>()
        this.state = {
            nodeList: [],
            defaultCheckedKeys: [],
            defaultExpandedKeys: [],
            defaultSelectedKeys: [],
        }
    }

    handleCancel = () => {
        this.setState({
            nodeList: [],
            defaultCheckedKeys: [],
            defaultExpandedKeys: [],
            defaultSelectedKeys: [],
        })
        this.props.callback(false)

    }
    saveRole = (role: IRole) => {
        role.id = this.props.role?.id as number
        saveRole(role.id, role.roleName, role.permissionList as []).then(response => {
            const {code, msg} = response.data
            if (code === 0) {
                this.props.saveRole({id: role.id, roleName: role.roleName});
                message.success(msg)
            } else {
                message.warn(msg)
            }
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
    loadPermission = () => {
        getRoleDetail(this.props.role?.id as number).then(response => {
            const {code} = response.data
            if (code !== 0) {
                return
            }
            const {permissionList, permissionAll} = response.data.data;
            let permissions = permissionList.map((permission: IPermission) => {
                return permission.id
            })
            this.setState({
                nodeList: this.generatePermissionList(permissionAll),
                defaultCheckedKeys: permissions,
            })
            this.formRef.current?.setFieldsValue({
                permissionList: permissions
            })

        })
    }
    /**
     * https://react.docschina.org/docs/react-component.html#componentdidupdate
     * 你也可以在 componentDidUpdate() 中直接调用 setState()，但请注意它必须被包裹在一个条件语句里，正如上述的例子那样进行处理，否则会导致死循环。它还会导致额外的重新渲染，虽然用户不可见，但会影响组件性能。
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate = (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) => {
        if (!prevProps.visible) {
            // 删除一个角色，会造成在删除之后继续查询一次，加个判断，防止轻轻详情
            if (this.props.role && prevState.nodeList.length === 0) {
                this.loadPermission();
            }
        }
    }

    onCheck = (checkedKeys: any, info: any) => {
        this.formRef.current?.setFieldsValue({
            permissionList: checkedKeys.checked
        })
    };

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
                        {...layout}
                        ref={this.formRef}
                        onFinish={this.saveRole}
                        initialValues={{
                            ...this.props.role,
                            permissionList: []
                        }}
                    >
                        <Form.Item
                            label='编辑角色信息'
                            name='roleName'
                            rules={[{required: true, message: '角色名称不可以为空'}]}
                            shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
                        >
                            <Input/>
                        </Form.Item>

                        {
                            this.state.nodeList.length > 0 ?
                                <Form.Item
                                    name='permissionList'
                                    label='选择权限'
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
                                    shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
                                >

                                    <Tree
                                        defaultExpandAll
                                        checkStrictly
                                        showLine
                                        checkable
                                        treeData={this.state.nodeList}
                                        defaultCheckedKeys={this.state.defaultCheckedKeys}
                                        onCheck={this.onCheck}
                                    />
                                </Form.Item>
                                :
                                null
                        }
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
