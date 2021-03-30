import React, {Component} from "react";
import {Button, DatePicker, Form, Input, Space} from "antd";
import {PlusOutlined, SearchOutlined} from "@ant-design/icons";

const {RangePicker} = DatePicker;

interface IProps {
    showAddUserVisible: (visible: boolean) => void
}

export default class SearchUser extends Component<IProps, any> {
    search = (keyword: any) => {
        if (keyword.date) {
            console.log(keyword.date[0].format('l LTS'));
            console.log(keyword.date[1].format('l LTS'))
        }
    }

    showAddUserModal = () => {
        this.props.showAddUserVisible(true)
    }

    render() {
        return (
            <>
                <Form
                    layout={'inline'}
                    onFinish={this.search}
                >
                    <Form.Item
                        label='关键词'
                        name='keyword'
                    >
                        <Input placeholder={'姓名/手机号/邮箱'} allowClear/>
                    </Form.Item>
                    <Form.Item
                        label='添加日期'
                        name='date'
                    >
                        <RangePicker/>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" icon={<SearchOutlined/>} htmlType="submit">搜索</Button>
                            <Button type="primary" icon={<PlusOutlined/>}
                                    onClick={() => {
                                        this.showAddUserModal()
                                    }}>新增</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </>
        )
    }
}
