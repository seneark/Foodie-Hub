import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import * as firebase from "firebase";
import firebaseConfig from "./config/firebase";
import Routes from "./Routes"
import { Root } from "native-base";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { AppRegistry } from "react-native";
import "firebase/firestore";
// var db = firebase.firestore();

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = { loading: true };
	}
	async componentDidMount() {
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}
		await Font.loadAsync({
			Roboto: require("native-base/Fonts/Roboto.ttf"),
			Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
		});
		this.setState({ loading: false });
	}

	render() {
		if (this.state.loading) {
			return (
				<Root>
					<AppLoading />
				</Root>
			);
		} else {
			return (
				<Root>
					<Routes />
				</Root>
			);
		}
	}
}
AppRegistry.registerComponent("Foodie", () => App);
