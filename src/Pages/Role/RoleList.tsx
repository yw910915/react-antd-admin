import React, {Component} from "react";
import {getRoleList} from "../../api/role";
import {Button, Space, Table} from "antd";
import DeleteRole from "./DeleteRole";
import EditRole from "./EditRole";

export interface IRole {
    id: number
    roleName: string
}

interface IState {
    roleList: IRole[]
    pageSize: number
    page: number
    totalCount: number
    visible: boolean
    loading: boolean
    role?: IRole
}

export default class RoleList extends Component<any, IState> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            roleList: [],
            page: 1,
            totalCount: 0,
            pageSize: 15,
            visible: false,
            loading: true
        }
    }

    getRoleList = (page: number = 1) => {
        this.setState({
            loading: true
        })
        getRoleList(page).then(response => {
            const {data: {currentPage, dataList, totalCount, limit}} = response.data
            this.setState({
                page: currentPage,
                roleList: dataList,
                totalCount: totalCount,
                pageSize: limit,
                loading: false
            })
        })
    }

    componentDidMount() {
        this.getRoleList()
    }

    deleteRole = (role: IRole) => {
        this.setState({
            roleList: this.state.roleList.filter(r => r.id !== role.id)
        })
    }
    callback = (visible: boolean) => {
        this.setState(() => ({
            visible: visible
        }))
    }
    show = (role?: IRole, visible: boolean = true) => {
        this.setState(() => ({
            visible: visible,
            role: role
        }))
    }
    saveRole = (role?: IRole) => {
        this.setState((state) => ({
            visible: false,
            roleList: state.roleList.map(r => {
                if (r.id === role?.id) {
                    return role
                } else {
                    return r
                }
            }),
            role: role
        }))
    }

    render() {
        return (
            <>
                <EditRole visible={this.state.visible}
                          role={this.state.role}
                          callback={this.callback}
                          saveRole={this.saveRole}/>
                <Table
                    loading={this.state.loading}
                    dataSource={this.state.roleList}
                    rowKey={'id'}
                >
                    <Table.Column
                        title={'id'}
                        dataIndex={'id'}
                    />
                    <Table.Column
                        title={'角色名称'}
                        dataIndex={'roleName'}
                    />
                    <Table.Column
                        title={'管理'}
                        render={(role: IRole) => (
                            <Space>
                                <Button type='primary' onClick={() => {
                                    this.show(role, true)
                                }}>编辑</Button>
                                <DeleteRole role={role} callback={this.deleteRole}/>
                            </Space>
                        )}
                    />
                </Table>
            </>
        )
    }
}
