import React, {Component} from 'react';
import View from "./Components/View";
import 'antd/dist/antd.css';
import './App.css';
import {inject} from "mobx-react";
import Permission from "./store/Permission";

interface IProps {
    permission?: Permission
}

@inject('permission')
class App extends Component<IProps, any> {
    componentDidMount() {
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
