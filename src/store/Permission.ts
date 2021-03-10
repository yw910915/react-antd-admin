import {action, makeAutoObservable, observable} from "mobx";
import {authRoutes, IRoute} from "../router";
import {getAdminPermissionList} from "../api/permission";


export default class Permission {
    @observable
    permission: IRoute[]

    constructor() {
        this.permission = authRoutes;
        makeAutoObservable(this)
    }

    @action
    initPermission = () => {
        getAdminPermissionList().then(response => {
            const {data} = response.data
            this.permission = data
        })
    }
    @action
    getPermissionList = () => {
        return this.permission
    }
}
