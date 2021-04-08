import React, {Component, ReactNode} from "react";
import {MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons';

import {Layout, message} from 'antd';
import AdminHeader from "./AdminHeader";
import '../static/css/footer.css'
import LeftBar from "./LeftBar";
import {inject, observer} from "mobx-react";
import Permission from "../store/Permission";
import {withRouter} from "react-router-dom";
import {RouteComponentProps} from "react-router";

const {Sider, Content, Footer} = Layout;

interface IProps extends RouteComponentProps {
    children?: ReactNode
    permission?: Permission
}

interface IState {
    collapsed: boolean
    auth: boolean
    permissionList?: string[]
    permissionSet: Set<String>
}

@inject('permission')
@observer
class AdminLayout extends Component<IProps, IState> {
    constructor(props: IProps, context: any) {
        super(props, context);
        this.state = {
            collapsed: false,
            auth: false,
            permissionSet: new Set<String>(),
        };
    }

    static getDerivedStateFromProps(nextProps: Readonly<IProps>, nextState: Readonly<IState>) {
        if (nextProps.permission?.state === 'error') {
            message.error('error')
            nextProps.history.replace('/login')
            return null
        }
        if (nextProps.permission?.state === 'success') {
            let permissionSet = new Set<string>()
            for (let permission of nextProps.permission?.permission) {
                permissionSet.add(permission.path)
            }
            if (permissionSet.size === 0) {
                nextProps.history.replace('/login');
                return null;
            }
            return {permissionSet: permissionSet, auth: true};
        } else {
            return null;
        }
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };


    render() {
        if (this.props.permission?.state === 'loading') {
            return (
                <>
                    loading
                </>
            )
        }
        return (
            <>
                <Layout>
                    <AdminHeader/>
                    <Layout>
                        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                            <LeftBar permissionSet={this.state.permissionSet}/>
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

        );
    }
}

export default withRouter(AdminLayout)
