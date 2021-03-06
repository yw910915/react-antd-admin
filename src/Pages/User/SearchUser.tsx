import React, {Component, RefObject} from "react";
import {Button, DatePicker, Form, Input, Space} from "antd";
import {PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {FormInstance} from "antd/lib/form";


const {RangePicker} = DatePicker;

interface ISearch {
    [index: string]: string
}

interface IProps {
    showAddUserVisible: (visible: boolean) => void
    search: (keyword: ISearch) => void
}

export default class SearchUser extends Component<IProps, any> {
    formRef: RefObject<FormInstance>

    constructor(props: IProps, context: any) {
        super(props, context);
        this.formRef = React.createRef<FormInstance>()
    }

    search = (keyword: any) => {
        if (keyword.date) {
            this.props.search({
                keyword: keyword.keyword,
                startDate: keyword.date[0].format('l'),
                endDate: keyword.date[1].format('l')
            })
        } else {
            this.props.search({keyword: keyword.keyword})
        }
    }

    showAddUserModal = () => {
        this.props.showAddUserVisible(true)
    }
    change = (e: any) => {
        let keyword = this.formRef.current?.getFieldValue('keyword')
        if (keyword === '') {
            this.props.search({})
        }
    }
    changeDate = (dates: any, dateStrings: [string, string]) => {
        if (dates === null) {
            let keyword = this.formRef.current?.getFieldValue('keyword')
            this.props.search({keyword: keyword})
        }
    }

    render() {
        return (
            <>
                <Form
                    ref={this.formRef}
                    layout={'inline'}
                    onFinish={this.search}
                >
                    <Form.Item
                        label='关键词'
                        name='keyword'
                    >
                        <Input placeholder={'姓名/手机号/邮箱'} allowClear onChange={this.change}/>
                    </Form.Item>
                    <Form.Item
                        label='添加日期'
                        name='date'
                    >
                        <RangePicker format={'YYYY-MM-DD'} onChange={this.changeDate}/>
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
