import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {clear} from "../utils/storage";
import {getAdminInfo} from "../api/login";

export interface IAdmin {
    name: string
    avatar?: string
    password: string
}

export default class Admin {
    @observable
    admin: IAdmin = {name: '', avatar: '', password: ''}
    @observable state: string = 'loading';

    constructor(admin: IAdmin = {name: '', avatar: '', password: ''}) {
        this.admin = admin;
        makeAutoObservable(this)
    }

    @action
    initAdmin = async () => {
        try {
            const data = await getAdminInfo().then(response => {
                const {data} = response.data
                return data
            })
            runInAction(() => {
                this.admin = observable(data);
            })
        } catch (e) {
            console.log(e)
            runInAction(() => {
                this.state = "error"
            })

        }
    }
    @action
    logout = () => {
        this.admin = {name: '', avatar: '', password: ''}
        clear()
    }
    @action
    login = (admin: IAdmin) => {
        this.admin = admin
    }
}
