import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Admin from "../store/Admin";
import {Avatar, Dropdown, Layout, Menu} from "antd";
import {DownOutlined} from '@ant-design/icons';
import {topRoute} from "../router";
import {NavLink, RouteComponentProps, withRouter} from "react-router-dom";

const {Header} = Layout;

interface IProps extends RouteComponentProps {
    admin?: Admin
}


@inject('admin')
@observer
class AdminHeader extends Component<IProps, any> {

    logout = () => {
        this.props.admin?.logout()
        this.props.history.push('/login')
    }

    render() {
        return (
            <>
                <Header className="header">
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="1" onClick={this.logout}>
                                    退出
                                </Menu.Item>
                            </Menu>
                        }
                        className={'admin'}
                    >
                        <div>
                            <Avatar
                                src={this.props.admin?.admin?.avatar}
                            />

                            <span className={'admin-name'}>
                                {this.props.admin?.admin.name}
                            </span>
                            <DownOutlined/>
                        </div>
                    </Dropdown>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['5-0']}>
                        {
                            topRoute.map(route => (
                                <Menu.Item key={route.id}>
                                    <NavLink to={route.path}>
                                        {route.title}
                                    </NavLink>
                                </Menu.Item>
                            ))
                        }
                    </Menu>
                </Header>
            </>
        )
    }
}

export default withRouter(AdminHeader)
