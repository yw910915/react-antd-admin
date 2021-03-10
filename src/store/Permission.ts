import {makeAutoObservable, observable} from "mobx";

interface IPermission {
    permissionList: IPermission[]
}

export default class Permission {
    @observable
    permission: IPermission[]

    constructor(permission: IPermission[] = []) {
        this.permission = permission;
        makeAutoObservable(this)
    }
}
