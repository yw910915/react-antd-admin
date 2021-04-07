import React, {Component} from "react";
import {Button, Space, Table} from "antd";
import {getAdminList} from "../../api/admin";
import EditAdmin from "./EditAdmin";
import DeleteAdmin from "./DeleteAdmin";
import Auth from "../../Components/Auth";
import AddAdmin from "./AddAdmin";

export interface IAdmin {
    id: number
    roleId: number
    name: string
    email: string
    mobile: string
    createdAt: string
}

interface IState {
    adminList: IAdmin[]
    pageSize: number
    page: number
    totalCount: number
    visible: boolean
    loading: boolean
    admin?: IAdmin
    showAddAdminModal: boolean
}

export default class AdminList extends Component<any, IState> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            adminList: [],
            page: 1,
            totalCount: 0,
            pageSize: 15,
            visible: false,
            loading: true,
            showAddAdminModal: false
        }
    }

    getAdminList = (page: number = 1) => {
        getAdminList(page).then(response => {
            const {data: {currentPage, dataList, totalCount, limit}} = response.data
            this.setState({
                page: currentPage,
                adminList: dataList,
                totalCount: totalCount,
                pageSize: limit,
                loading: false
            })
        })
    }

    onChange = (page: number) => {
        this.getAdminList(page)
    }

    componentDidMount() {
        this.getAdminList()
    }

    deleteAdmin = (admin: IAdmin) => {
        this.setState((state) => ({
            adminList: state.adminList.filter(a => a.id !== admin.id)
        }))
    }
    show = (admin: IAdmin) => {
        this.setState(() => ({
            admin: admin,
            visible: true
        }))
    }
    cancel = () => {
        this.setState({
            visible: false
        })
    }
    saveAdmin = (admin: IAdmin) => {
        this.setState((state) => ({
            adminList: state.adminList.map(a => {
                if (a.id === admin.id) {
                    return admin
                }
                return a
            }),
            visible: false
        }))
    }
    showAddAdminModal = () => {
        this.setState({
            showAddAdminModal: true
        })
    }
    cancelAddAdminModal = () => {
        this.setState({
            showAddAdminModal: false
        })
    }
    refresh = () => {
        this.getAdminList()
    }

    render() {
        return (
            <>
                <Button type='primary' onClick={() => {
                    this.showAddAdminModal()
                }}>添加管理员</Button>
                <AddAdmin
                    visible={this.state.showAddAdminModal}
                    cancel={() => {
                        this.cancelAddAdminModal()
                    }}
                    refresh={this.refresh}
                />
                <EditAdmin
                    saveAdmin={this.saveAdmin}
                    visible={this.state.visible}
                    cancel={this.cancel}
                    admin={this.state.admin}
                />

                <Table
                    loading={this.state.loading}
                    dataSource={this.state.adminList}
                    rowKey={'id'}
                    pagination={{
                        position: ['bottomCenter'],
                        total: this.state.totalCount,
                        hideOnSinglePage: true,
                        defaultCurrent: this.state.page,
                        defaultPageSize: this.state.pageSize,
                        showSizeChanger: false,
                        onChange: this.onChange
                    }}
                >
                    <Table.Column
                        title={'id'}
                        dataIndex={'id'}
                    />
                    <Table.Column
                        title={'姓名'}
                        dataIndex={'name'}
                    />
                    <Table.Column
                        title={'电话'}
                        dataIndex={'mobile'}
                    />
                    <Table.Column
                        title={'邮箱'}
                        dataIndex={'email'}
                    />
                    <Table.Column
                        title={'创建日期'}
                        dataIndex={'createdAt'}
                    />
                    <Table.Column
                        title={'管理'}
                        render={(admin: IAdmin) => (
                            <Space>
                                <Auth path={'editAdmin'}>
                                    <Button type='primary' onClick={() => {
                                        this.show(admin)
                                    }}>
                                        编辑管理员
                                    </Button>
                                </Auth>
                                <DeleteAdmin admin={admin} callback={this.deleteAdmin}/>
                            </Space>
                        )}/>
                </Table>
            </>
        )
    }
}
