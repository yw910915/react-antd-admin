import React, {Component, ReactNode} from "react";
import {MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons';

import {Layout} from 'antd';
import AdminHeader from "./AdminHeader";
import '../static/css/footer.css'
import LeftBar from "./LeftBar";
import {authRoutes, IRoute} from "../router";
import {inject} from "mobx-react";
import Permission from "../store/Permission";

const {Sider, Content, Footer} = Layout;

interface IProps {
    children?: ReactNode
    permissionList?: IRoute[]
    permission?: Permission
}

interface IState {
    collapsed: boolean
    auth: boolean
}

@inject('permission')
export default class AdminLayout extends Component<IProps, IState> {
    constructor(props: IProps, context: any) {
        super(props, context);
        this.state = {
            collapsed: false,
            auth: false
        };
    }

    static getDerivedStateFromProps(nextProps: Readonly<IProps>, nextState: Readonly<IState>) {
        nextProps.permission?.getPermissionList()
        return {auth: true}
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <>
                <Layout>
                    <AdminHeader/>
                    <Layout>
                        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                            <LeftBar permissionList={authRoutes}/>
                        </Sider>
                        <Layout className="site-layout">
                            <span className={'trigger'} onClick={this.toggle}>
                                {
                                    this.state.collapsed ?
                                        <MenuUnfoldOutlined/>
                                        :
                                        <MenuFoldOutlined/>
                                }
                            </span>
                            <Content
                                className="site-layout-background"
                                style={{
                                    margin: '24px 16px',
                                    padding: 24,
                                    minHeight: 280,
                                }}
                            >
                                {this.props.children}
                            </Content>
                            <Footer className='footer'>

                            </Footer>
                        </Layout>
                    </Layout>
                </Layout>
            </>

        )
    }
}
