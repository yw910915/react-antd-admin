import React, {Component} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {Button, Form, Input, message} from 'antd'
import '../../static/css/login/login.css'
import {inject} from "mobx-react";
import Admin from "../../store/Admin";
import {login} from "../../api/login";
import {set} from "../../utils/storage";

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
};
const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

interface IState {
    name: string
    password: string

    width: number
    height: number
}

interface IProps extends RouteComponentProps {
    admin?: Admin
}

@inject('admin')
class Index extends Component<IProps, IState> {
    constructor(props: IProps, context: any) {
        super(props, context);
        let height = window.document.body.clientHeight
        let width = window.document.body.clientWidth
        this.state = {
            width: width,
            height: height,
            name: '',
            password: ''
        }
        window.addEventListener('resize', this.handleResize.bind(this)) //监听窗口大小改变
    }

    handleResize = () => {
        let height = window.document.body.clientHeight
        let width = window.document.body.clientWidth
        this.setState({
            width: width,
            height: height
        })
    }
    onFinish = (values: IState) => {
        login(values).then((response) => {
            const {code, msg} = response.data
            if (code === 0) {
                const {token} = response.data.data;
                set('token', token)
                this.props.admin?.login(values)
                this.props.history.replace('/admin/index')
            } else {
                message.error(msg)
                return Promise.reject(msg)
            }
        })
    }
    onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        return (
            <div
                className='login'
                style={{
                    width: this.state.width + 'px',
                    height: this.state.height + 'px'
                }}
            >
                <Form
                    id='login-form'
                    className='login-form'
                    ref={null}
                    initialValues={this.state}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    {...layout}
                >
                    <Form.Item
                        label="用户名"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '用户名不可以为空'
                            },
                            {
                                type: "string",
                                min: 2,
                                message: '用户名长度不可以小于2位'
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '密码不可以为空'
                            },
                            {
                                type: "string",
                                min: 2,
                                message: '密码长度不可以小于2位'
                            }
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

}

export default withRouter(Index)
