import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {getAdminPermissionList} from "../api/permission";
import {IRoute} from "../router";

export default class Permission {
    @observable
    permission: IRoute[] = []
    @observable state: string = 'loading';

    constructor() {
        makeAutoObservable(this)
    }

    @action
    initPermission = async () => {
        try {
            const data = await getAdminPermissionList().then(response => {
                const {data} = response.data
                return data
            })
            runInAction(() => {
                this.permission = observable.array(data);
                this.state = 'success'
            })
        } catch (e) {
            runInAction(() => {
                this.state = "error"
            })

        }
    }
    @action
    changeState = (state: string) => {
        this.state = state
    }
    @action
    getPermissionList = () => {
        return this.permission
    }
}
