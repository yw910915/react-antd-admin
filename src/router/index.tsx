import React, {lazy, ReactNode} from "react"
import {
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    ApartmentOutlined,
} from '@ant-design/icons';

const Login = lazy(() => import('../Pages/Login'))
const Index = lazy(() => import('../Pages/Dashboard/Index'))
const UserList = lazy(() => import('../Pages/User/UserList'))
const Page403 = lazy(() => import('../Pages/Page403'))
const Page404 = lazy(() => import('../Pages/Page404'))
const RoleList = lazy(() => import('../Pages/Role/RoleList'))
const AdminList = lazy(() => import('../Pages/Admin/AdminList'))

export interface IRoute {
    id: string,
    exact?: boolean
    path: string
    title: string
    parentId?: number
    isMenu?: number
    component?: ReactNode
    routes?: IRoute[]
    redirect?: string
    icon?: ReactNode
}

export const leftRoute: IRoute[] = [
    {
        id: '1-0',
        path: '/admin/index',
        redirect: '/admin/dashboard',
        title: '仪表盘',
        isMenu: 1,
        icon: <DashboardOutlined/>,
        component: <Index/>
    },
    {
        id: '2-0',
        path: '/admin/user',
        title: '用户管理',
        icon: <UserOutlined/>,
        routes: [
            {
                id: '2-1',
                path: '/admin/user/list',
                title: '用户列表',
                icon: <UserOutlined/>,
                component: <UserList/>
            }
        ]
    },
    {
        id: '3-0',
        path: '/admin/role',
        title: '角色管理',
        icon: <TeamOutlined/>,
        routes: [
            {
                id: '3-1',
                path: '/admin/role/list',
                title: '角色列表',
                icon: <TeamOutlined/>,
                component: <RoleList/>
            }
        ]
    },
    {
        id: '4-0',
        path: '/admin/admin',
        title: '管理员管理',
        icon: <ApartmentOutlined/>,
        routes: [
            {
                id: '4-1',
                path: '/admin/admin/list',
                title: '管理员列表',
                icon: <ApartmentOutlined/>,
                component: <AdminList/>
            }
        ]
    },
]
export const topRoute: IRoute[] = []

export const authRoutes: IRoute[] = [
    ...leftRoute,
    ...topRoute
]
export const unAuthRouters: IRoute[] = [

    {
        id: '0-0',
        path: '/login',
        title: '登录',
        isMenu: 1,
        component: <Login/>
    },
    {
        id: '403-0',
        path: '/403',
        title: '403',
        isMenu: 1,
        component: <Page403/>
    },
    {
        id: '404-0',
        path: '/*',
        title: '404',
        isMenu: 1,
        component: <Page404/>
    }
]
