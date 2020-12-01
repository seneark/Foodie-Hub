import React, { Component } from "react";
import * as firebase from "firebase";
import { StyleSheet, Text, View, YellowBox, Image, AppState, Platform, Linking } from "react-native";
import { Container, Content, Button, Icon, Root, Footer, FooterTab } from "native-base";
import { Actions } from "react-native-router-flux";
import ProfileFooter from "../Components/Footer/profile";

import BASE from "../utils/descisionTree/tree";
import SimpleHeader from "../Components/Header/simple";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Modal from "react-native-modal";
import * as IntentLauncher from "expo-intent-launcher";
import Constants from "expo-constants";

export default class profile extends Component {
	constructor(props) {
		super(props);
		this._getLocationAsync = this._getLocationAsync.bind(this);
		this.openSetting = this.openSetting.bind(this);
		this.handleAppStateChange = this.handleAppStateChange.bind(this);

		this.changeTree = this.changeTree.bind(this);
		this.state = {
			base: BASE,
			location: {},
			errors: "",
			isLocationModalVisible: false,
			openSetting: false,
			appState: AppState.currentState,
		};
	}
	componentWillUnmount() {
		AppState.removeEventListener("change", this.handleAppStateChange);
	}
	componentDidMount() {
		YellowBox.ignoreWarnings(["Can't perform a"]);
		AppState.addEventListener("change", this.handleAppStateChange);
		this._getLocationAsync();
	}

	handleAppStateChange = (nextAppState) => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
			console.log("App has come to the foreground!");
			this._getLocationAsync();
		}
		this.setState({ appState: nextAppState });
	};

	_getLocationAsync = async () => {
		try {
			let { status } = await Permissions.askAsync(Permissions.LOCATION);
			if (status !== "granted") {
				this.setState({
					errorMessage: "Permission to access location was denied",
				});
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			this.setState({ location });
			console.log(location);
		} catch (error) {
			let status = Location.getProviderStatusAsync();
			if (!status.locationServicesEnabled) {
				this.setState({ isLocationModalVisible: true });
			}
		}
	};

	openSetting = () => {
		if (Platform.OS == "ios") {
			Linking.openURL("app-settings:");
		} else {
			IntentLauncherAndroid.startActivityAsync(IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS);
		}
		this.setState({ openSetting: false });
	};

	changeTree(idx) {
		let foo = this.state.base.descendents[idx];
		if (foo.isTerm) {
			this.setState({
				base: BASE,
			});
			console.log(foo.descendents);
			Actions.push("Restaurent", { Text: foo.descendents, location: this.state.location });
		} else {
			this.setState({
				base: foo,
			});
		}
	}
	bringHome() {
		this.setState({
			base: BASE,
		});
	}

	render() {
		return (
			<Root>
				<SimpleHeader title="Profile" left={false} />
				<Content>
					<Modal
						onModalHide={this.state.openSetting ? this.openSetting : undefined}
						isVisible={this.state.isLocationModalVisible}
					>
						<View
							style={{
								height: 300,
								width: 300,
								backgroundColor: "white",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Button
								onPress={() =>
									this.setState({
										isLocationModalVisible: false,
										openSetting: true,
									})
								}
								title="Enable Location Services"
							></Button>
						</View>
					</Modal>
					<View style={styles.container}>
						<Image source={require("../assets/profileP.gif")} style={{ width: 300, height: 300 }} />
						<Text
							style={{
								marginTop: -40,
								backgroundColor: "black",
								color: "white",
								padding: 10,
								paddingHorizontal: 15,
							}}
						>
							Hello {firebase.auth().currentUser.email.toString()}
						</Text>
						<Text />

						<View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
							<Button
								iconLeft
								transparent
								style={{ paddingHorizontal: 20, paddingRight: 20 }}
								onPress={() => this.bringHome()}
							>
								<Icon
									name="ios-close"
									style={{
										fontSize: 34,
										marginLeft: 0,
										color: "blue",
									}}
								/>
							</Button>
							<Text style={{ marginVertical: 12 }}>{this.state.base.qtn}</Text>
						</View>

						{!this.state.base.isTerm
							? this.state.base.descendents.map((item, idx) => {
									return (
										<Button
											key={idx}
											rounded
											large
											block
											style={{ marginBottom: 10, backgroundColor: "#01c5c4" }}
											onPress={() => this.changeTree(idx)}
										>
											<Text>{item.value}</Text>
										</Button>
									);
							  })
							: null}
					</View>
				</Content>
				<ProfileFooter location={this.state.location} />
			</Root>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 10,
		alignItems: "center",
	},
	animationContainer: {
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
	buttonContainer: {
		paddingTop: 20,
	},
});
