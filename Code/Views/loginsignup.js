import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import * as firebase from "firebase";
import { Actions } from "react-native-router-flux";
import { StyleSheet, Text, View, KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Image } from "react-native";
import {
	Container,
	Content,
	Form,
	Input,
	Item,
	Button,
	Label,
	Toast,
	Root,
} from "native-base";
import validateRegisterInput from "../utils/Validation/register";
import Header from  "../Components/Header/loginpgheader"
export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: {},
			email: "",
			password: "",
		};
	}
	componentDidMount() {
		if (firebase.auth().currentUser) {
			Actions.replace("Profile");
		}
	}

	signUpUser = (email, password) => {
		// console.warn("Signup");
		try {
			let valid = validateRegisterInput({
				email: this.state.email,
				password: this.state.password,
			});
			if (!valid.isValid) {
				let err = this.state.error;
				err["email"] = valid.errors.email;
				err["password"] = valid.errors.password;
				if (err["email"])
					Toast.show({
						text: err["email"],
						buttonText: "OK",
						duration: 5000,
						type: "danger",
					});
				if (err["password"])
					Toast.show({
						text: err["password"],
						buttonText: "OK",
						duration: 5000,
						type: "danger",
					});
				this.setState({ error: err });
				return;
			}

			firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((result) => {
					console.log(result);
					Toast.show({
						text: "Account Created Now login",
						buttonText: "OK",
						duration: 5000,
						type: "success",
					});
				})
				.catch((err) =>
					Toast.show({
						text: err.toString(),
						buttonText: "OK",
						duration: 5000,
						type: "danger",
					})
				);
		} catch (error) {
			let err = this.state.error;
			err["account"] = error.toString();
			Toast.show({
				text: err["account"],
				buttonText: "OK",
				duration: 5000,
				type: "danger",
			});
			this.setState({ error: err });
		}
	};

	loginUser = (email, password) => {
		try {
			firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then((user) => {
					Toast.show({
						text: "User Logged in and verification mail sent",
						buttonText: "OK",
						duration: 5000,
						type: "success",
					});

					if (!firebase.auth().currentUser.emailVerified)				
						firebase
							.auth()
							.currentUser.sendEmailVerification()
							.catch((err) => console.log(err));
					Actions.replace("Profile");
				})
				.catch((err) =>
					Toast.show({
						text: err.toString(),
						buttonText: "OK",
						duration: 5000,
						type: "danger",
					})
				);
		} catch (error) {
			Toast.show({
				text: error,
				buttonText: "OK",
				duration: 5000,
				type: "danger",
			});
		}
	};

	render() {
		return (
			
				<Root>
					    <Header/>
						<View style={styles.logoview}>
						   <Image source={require("../assets/profile.png")} style={styles.logo}/>
						</View>
						<TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
						
								<Container style={styles.container}>
									
									<Form>
										<Item floatingLabel>
											<Label>Email</Label>
											<Input
												autoCorrect={false}
												autoCapitalize="none"
												onChangeText={(email) =>
													this.setState({ email })
												}
											/>
										</Item>
										<Item floatingLabel>
											<Label>Password</Label>
											<Input
												autoCorrect={false}
												autoCapitalize="none"
												secureTextEntry={true}
												onChangeText={(password) =>
													this.setState({ password })
												}
											/>
										</Item>
										<Button
											style={styles.button}
											full
											rounded
											success
											onPress={() =>
												this.loginUser(
													this.state.email,
													this.state.password
												)
											}
										>
											<Text  style={styles.text}>Login</Text>
										</Button>
										<Button
											style={styles.button}
											full
											rounded
											primary
											onPress={() =>
												this.signUpUser(
													this.state.email,
													this.state.password
												)
											}
										>
											<Text style={styles.text}>Signup</Text>
										</Button>
									</Form>
								</Container>
						</TouchableWithoutFeedback>
				</Root>
				
			
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
		padding: 10,
	},
	button:{
		marginTop:15
	},
	text:{
		textTransform:"uppercase",
		fontWeight:"bold"
	},
	logo:{
		width:200,
		height:200,
	},
	logoview:{
		marginTop:20,
		justifyContent:"center",
		alignItems:"center"
	}

});
