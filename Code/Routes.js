import React, {Component} from "react";
import {Router, Scene} from "react-native-router-flux";

import Auth from "./Views/loginsignup";
import Profile from "./Views/profile";
import Restaurent from "./Views/restaurent";
import Friend from "./Views/recommend";
import Order from "./Views/order";
import Search from "./Views/search";

const Routes = (props) => {
    return (
        <Router>
            <Scene key="root">
                <Scene
                    key="Auth"
                    component={Auth}
                    initial={true}
                    title={"Login and Signup"}
                    hideNavBar={true}
                />
                <Scene
                    key="Profile"
                    component={Profile}
                    title={"Profile"}
                    hideNavBar={true}
                    // initial={true}
                />
                <Scene
                    key="Restaurent"
                    component={Restaurent}
                    hideNavBar={true}
                />
                <Scene
                    key="Friend"
                    component={Friend}
                    hideNavBar={true}
                />
                <Scene
                    key="Order"
                    component={Order}
                    hideNavBar={true}
                />
                <Scene
                    key="Search"
                    component={Search}
                    hideNavBar={true}
                />
            </Scene>
        </Router>
    );
};

export default Routes;
