import React, {Component} from 'react';
import View from "./Components/View";
import 'antd/dist/antd.css';
import './App.css';
import {inject, observer} from "mobx-react";
import Permission from "./store/Permission";
import Admin from "./store/Admin";

interface IProps {
    permission?: Permission
    admin?: Admin
}

@inject('permission', 'admin')
@observer
class App extends Component<IProps, any> {


    componentDidMount() {
        this.props.admin?.initAdmin();
        this.props.permission?.initPermission()
    }

    render() {
        return (
            <div className="App">
                <View/>
            </div>
        );
    }
}

export default App;
