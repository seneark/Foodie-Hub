import React, { Component } from "react";
import * as firebase from "firebase";
import { Actions } from "react-native-router-flux";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { ScrollView, Text, View, TouchableOpacity, YellowBox, Image, StyleSheet, Dimensions } from "react-native";
import * as axios from "axios";
import { Container, Button, Left, Right, Body, Title, List, Toast, Content, Card, CardItem, Root, Icon, Spinner } from "native-base";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import SimpleHeader from "../Components/Header/simple";
import marker from "../assets/marker.png";

import LottieView from "lottie-react-native";

const screenWidth = Math.round(Dimensions.get("window").width);
export default class restaurent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: [],
			category: [],
			cuisines: [],
			restaurant: [],
			resShow: null,
			isLoading: true,
			catLoading: true,
			location: {},
		};
	}

	componentDidMount() {
		YellowBox.ignoreWarnings(["Setting a timer"]);
		this.animation.play();
		this._getLocation();
		let name = this.state.name,
			category = this.state.category,
			cuisines = this.state.cuisines;
		for (let i = 0; i < this.props.Text.length; i++) {
			let foo = this.props.Text[i].split(",");
			name.push(foo[0]);
			if (foo[1] === "C") category.push(foo[2]);
			else cuisines.push(foo[2]);
		}
		this.setState({ category: category, cuisines: cuisines, name: name });

		axios.defaults.headers.common["user-key"] = "2a2e243fdaffb804cc3fb4f3a9ccb277";
		this.zomatofind();
	}

	async zomatofind() {
		let category = this.state.category;
		// console.log(category);
		var arr = [];
		if (category.length > 0) {
			for (let t = 0; t < category.length; t++) {
				var prev = [];
				for (let i = 0; i < 10; i += 2) {
					await axios
						.get(
							"https://developers.zomato.com/api/v2.1/search?entity_id=1&entity_type=city&start=" +
								(i * 10).toString() +
								"&lat=28.704&lon=77.041&category=" +
								category[t].toString() +
								"&sort=real_distance&order=desc"
						)
						.then((result) => {
							prev = prev.concat(result.data.restaurants);
						});
				}
				arr.push(prev);
			}
		}
		let cuisine = this.state.cuisines;
		// console.log(cuisine);
		if (cuisine.length > 0) {
			for (let t = 0; t < cuisine.length; t++) {
				var prev = [];
				for (let i = 0; i < 10; i += 2) {
					await axios
						.get(
							"https://developers.zomato.com/api/v2.1/search?entity_id=1&entity_type=city&start=" +
								(i * 10).toString() +
								"&lat=28.7404&lon=77.1259&cuisines=" +
								cuisine[t].toString() +
								"&sort=real_distance&order=desc"
						)
						.then((result) => {
							prev = prev.concat(result.data.restaurants);
						});
				}
				arr.push(prev);
			}
		}
		console.log(arr.length);
		this.setState({ restaurant: arr, catLoading: false });
	}

	async showRest(idx) {
		console.log(idx);
		var re = this.state.restaurant[idx];
		await this.setState({ resShow: re, isLoading: false });
	}

	// recommendRestaurent(item) {
	// 	const db = firebase.firestore();

	// 	let usr = db.collection("user").doc(firebase.auth().currentUser.email.toString());

	// 	db.collection("restaurant")
	// 		.doc(item.restaurant.id)
	// 		.get()
	// 		.then((doc) => {
	// 			if (doc.exists) {
	// 				let ex = doc.data().user.indexOf(firebase.auth().currentUser.email.toString());
	// 				if (ex >= 0) {
	// 					console.log("Already there");
	// 				} else {
	// 					usr.get().then((docSnapshot) => {
	// 						if (docSnapshot.exists) {
	// 							usr.update({
	// 								restaurant: firebase.firestore.FieldValue.arrayUnion({
	// 									id: item.restaurant.id,
	// 									createdAt: new Date(),
	// 								}),
	// 							}).then((data) =>
	// 								Toast.show({
	// 									text: "Sucessfully added",
	// 									buttonText: "OK",
	// 									duration: 53000,
	// 									type: "success",
	// 								})
	// 							);
	// 						} else {
	// 							usr.set(
	// 								{
	// 									restaurant: [
	// 										{
	// 											id: item.restaurant.id,
	// 											createdAt: new Date(),
	// 										},
	// 									],
	// 								},
	// 								{ merge: true }
	// 							).then((data) =>
	// 								Toast.show({
	// 									text: "Sucessfully added",
	// 									buttonText: "OK",
	// 									duration: 53000,
	// 									type: "success",
	// 								})
	// 							);
	// 						}
	// 					});
	// 				}
	// 			} else {
	// 				usr.get().then((docSnapshot) => {
	// 					if (docSnapshot.exists) {
	// 						usr.update({
	// 							restaurant: firebase.firestore.FieldValue.arrayUnion({
	// 								id: item.restaurant.id,
	// 								createdAt: new Date(),
	// 							}),
	// 						}).then((data) =>
	// 							Toast.show({
	// 								text: "Sucessfully added",
	// 								buttonText: "OK",
	// 								duration: 53000,
	// 								type: "success",
	// 							})
	// 						);
	// 					} else {
	// 						usr.set(
	// 							{
	// 								restaurant: [
	// 									{
	// 										id: item.restaurant.id,
	// 										createdAt: new Date(),
	// 									},
	// 								],
	// 							},
	// 							{ merge: true }
	// 						).then((data) =>
	// 							Toast.show({
	// 								text: "Sucessfully added",
	// 								buttonText: "OK",
	// 								duration: 53000,
	// 								type: "success",
	// 							})
	// 						);
	// 					}
	// 				});
	// 			}
	// 		});

	// 	let rest = db.collection("restaurant").doc(item.restaurant.id);
	// 	rest.get().then((docSnapshot) => {
	// 		if (docSnapshot.exists) {
	// 			rest.update({
	// 				user: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.email.toString()),
	// 			}).then((data) => console.log("restuarent added"));
	// 		} else {
	// 			rest.set(
	// 				{
	// 					user: [firebase.auth().currentUser.email.toString()],
	// 					restaurantInfo: item.restaurant,
	// 				},
	// 				{ merge: true }
	// 			).then((data) => console.log("sucess in creation"));
	// 		}
	// 	});
	// }

	async orderFood(item) {
		const db = firebase.firestore();
		let isRecommended = false;
		let rest = db.collection("restaurant").doc(item.restaurant.id);
		await rest.get().then((doc) => {
			if (doc.exists) {
				let ex = doc.data().user.indexOf(firebase.auth().currentUser.email.toString());
				if (ex >= 0) {
					isRecommended = true;
				}
			}
		});

		let usr = db.collection("orders").add({
			id: item.restaurant.id,
			name: item.restaurant.name,
			createTime: new Date(),
			isRecommended: isRecommended,
			user: firebase.auth().currentUser.email.toString(),
		});

		this._handlePressButtonAsync(item.restaurant.url.split("?")[0] + "/order");
	}

	_handlePressButtonAsync = async (url) => {
		let result = await WebBrowser.openBrowserAsync(url);
	};

	_getLocation = async () => {
		this.setState({
			location: {
				longitude: 77.1259,
				latitude: 28.7404,
				latitudeDelta: 0.009,
				longitudeDelta: 0.009,
			},
		});
	};

	onRegionChange(region) {
		this.setState({ location: region });
	}

	resetAnimation = () => {
		this.animation.reset();
		this.animation.play();
	};

	render() {
		return (
			<Root>
				<SimpleHeader title="Restaurant" />
				{this.state.catLoading ? (
					<View style={styles.animationContainer}>
						<LottieView
							ref={(animation) => {
								this.animation = animation;
							}}
							style={{
								width: 300,
								height: 300,
								backgroundColor: "#fff",
							}}
							source={require("../assets/56-location-pin.json")}
						/>
						<View style={styles.buttonContainer}>
							<Button title="Restart Animation" onPress={this.resetAnimation} />
						</View>
					</View>
				) : (
					<ScrollView>
						<View style={{ height: "10%", marginTop: 3 }}>
							<ScrollView horizontal>
								{this.state.name.map((item, idx) => {
									return (
										<Button info rounded style={{ marginHorizontal: 3 }} key={idx} onPress={() => this.showRest(idx)}>
											<Text
												style={{
													paddingHorizontal: 15,
												}}
											>
												{item}
											</Text>
										</Button>
									);
								})}
							</ScrollView>
						</View>
						<MapView
							style={styles.mapStyle}
							provider={PROVIDER_GOOGLE}
							region={this.state.location}
							followUserLocation={true}
							ref={(ref) => (this.mapView = ref)}
							zoomEnabled={true}
							showsUserLocation={true}
						>
							<Marker
								coordinate={{
									longitude: 77.1259,
									latitude: 28.7404,
								}}
								title={"Home"}
								pinColor={"#0f3057"}
							/>
							{this.state.isLoading
								? null
								: this.state.resShow.map((item, idx) => (
										<Marker
											key={idx}
											coordinate={{
												longitude: parseFloat(item.restaurant.location.longitude),
												latitude: parseFloat(item.restaurant.location.latitude),
											}}
											title={item.restaurant.name}
										>
											<Image source={marker} style={{ width: 40, height: 40 }} />
										</Marker>
								  ))}
						</MapView>
						<View>
							<ScrollView horizontal>
								{this.state.isLoading
									? null
									: this.state.resShow.map((item, idx) => {
											return (
												<Card key={idx} style={{ width: screenWidth }}>
													<TouchableOpacity onPress={() => this._handlePressButtonAsync(item.restaurant.url)}>
														<View>
															<CardItem
																style={{
																	flexDirection: "row",
																	justifyContent: "space-between",
																}}
															>
																<Text>{item.restaurant.name}</Text>
																<Text>{item.restaurant.user_rating.rating_text}</Text>
															</CardItem>
															<CardItem
																style={{
																	flexDirection: "column",
																}}
															>
																<Text>{item.restaurant.location.address}</Text>
																<Button
																	rounded
																	onPress={() => this.orderFood(item)}
																	style={{
																		backgroundColor: "#b8de6f",
																		paddingHorizontal: 15,
																	}}
																>
																	<Text>Order Food</Text>
																</Button>
															</CardItem>
														</View>
													</TouchableOpacity>
												</Card>
											);
									  })}
							</ScrollView>
						</View>
					</ScrollView>
				)}
			</Root>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: 400,
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
