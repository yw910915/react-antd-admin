import {action, makeAutoObservable, observable} from "mobx";

export interface IAdmin {
    name: string
    avatar?: string
    password: string
}

export default class Admin {
    @observable
    admin: IAdmin = {name: '', avatar: '', password: ''}

    constructor(admin: IAdmin = {name: '', avatar: '', password: ''}) {
        this.admin = admin;
        makeAutoObservable(this)
    }

    @action
    logout = () => {
        this.admin = {name: '', avatar: '', password: ''}
    }
    @action
    login = (admin: IAdmin) => {
        this.admin = admin
    }
}
