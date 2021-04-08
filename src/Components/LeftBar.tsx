import React, {Component} from 'react'
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom'
import {Menu} from 'antd';
import {matchPath} from "react-router";
import {authRoutes, IRoute, leftRoute} from '../router';

interface ILeftBarState {
    defaultKeys: string[]
    defaultOpenKeys: string[]
    height: number
}

interface IProps extends RouteComponentProps {
    permissionSet: Set<String>
}

class LeftBar extends Component<IProps, ILeftBarState> {
    state: ILeftBarState = {
        defaultKeys: [],
        defaultOpenKeys: [],
        height: 0
    }
    highLightMenu = (authRoutes?: IRoute[], route?: IRoute) => {
        let path = this.props.history.location.pathname
        authRoutes?.forEach((r: IRoute) => {
            let match = matchPath(path, {
                path: r.path,
                exact: true,
                strict: false
            })
            if (match !== null) {
                if (route) {
                    this.setState({
                        defaultKeys: [r.id],
                        defaultOpenKeys: [route.id]
                    });
                } else {
                    this.setState({
                        defaultKeys: [r.id]
                    });
                }
                return
            } else {
                this.highLightMenu(r?.routes, r)
            }
        })
    }

    componentDidMount() {
        this.highLightMenu(authRoutes)
        this.setState(() => (
            {
                height: document.body.clientHeight - 62
            }
        ))
    }

    generatePermission = (permissionList: IRoute[]): Set<string> => {
        let permissionSet: Set<string> = new Set<string>()
        for (let permission of permissionList) {
            permissionSet.add(permission.path);
            if (permission.routes) {
                let p = this.generatePermission(permission.routes)
                permissionSet = new Set([...Array.from(permissionSet), ...Array.from(p)])
            }
        }
        return permissionSet
    }

    generateMenu = (routerList?: IRoute[]) => {
        return (
            <>
                {
                    routerList?.filter(r => this.props.permissionSet.has(r.path)).map((route) => {
                        if (route.routes) {
                            return (
                                <Menu.SubMenu
                                    key={route.id}
                                    title={
                                        <span>
                                                {route.icon}
                                            <span>{route.title}</span>
                                            </span>
                                    }
                                >
                                    {this.generateMenu(route.routes)}
                                </Menu.SubMenu>
                            )
                        } else {
                            return (
                                <Menu.Item key={route.id} icon={route.icon}>
                                    <NavLink to={route.path}>{route.title}</NavLink>
                                </Menu.Item>
                            )
                        }
                    })
                }
            </>
        )
    }
    getTitle = (path: string, permissionList: IRoute[]) => {
        for (let permission of permissionList) {
            let match = matchPath(path, {path: permission.path, exact: permission.exact})
            if (match !== null) {
                if (!match.isExact && permission.routes) {
                    this.getTitle(path, permission.routes)
                } else {
                    document.title = permission.title;
                }
                break
            } else {
                if (permission.routes) {
                    this.getTitle(path, permission.routes)
                }
            }
        }
    }
    //
    // shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<ILeftBarState>, nextContext: any): boolean {
    //     this.getTitle(nextProps.location.pathname, nextProps.permissionList)
    //     return true
    // }

    render() {
        return (
            <div style={{minHeight: this.state.height + 'px'}}>
                <div className="logo"/>
                {
                    this.state.defaultKeys.length > 0 ?
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={this.state.defaultKeys}
                            defaultOpenKeys={this.state.defaultOpenKeys}
                        >
                            {this.generateMenu(leftRoute)}
                        </Menu>
                        :
                        null
                }
            </div>
        )
    }
}

export default withRouter(LeftBar)
