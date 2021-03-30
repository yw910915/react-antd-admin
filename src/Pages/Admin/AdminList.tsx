import React, {Component} from "react";
import {Space, Table} from "antd";
import {getAdminList} from "../../api/admin";
import EditAdmin from "./EditAdmin";
import DeleteAdmin from "./DeleteAdmin";

export interface IAdmin {
    id: number
    name: string
}

interface IState {
    adminList: IAdmin[]
    pageSize: number
    page: number
    totalCount: number
    visible: boolean
    loading: boolean
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
            loading: true
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

    render() {
        return (
            <>
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
                        title={'name'}
                        dataIndex={'name'}
                    />
                    <Table.Column
                        title={'管理'}
                        render={(admin: IAdmin) => (
                            <Space>
                                <EditAdmin/>
                                <DeleteAdmin admin={admin} callback={this.deleteAdmin}/>
                            </Space>
                        )}/>
                </Table>
            </>
        )
    }
}
