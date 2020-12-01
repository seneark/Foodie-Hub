import React, { Component } from "react";
import * as firebase from "firebase";
import * as WebBrowser from "expo-web-browser";
import { encodeBase64 } from "../utils/base64";
import { ScrollView, Text, View, TouchableOpacity, YellowBox, Image, StyleSheet, Dimensions } from "react-native";
import {
	Container,
	Button,
	Left,
	Right,
	Body,
	Title,
	List,
	Toast,
	Content,
	Card,
	CardItem,
	Root,
	Icon,
	Item,
	Input,
} from "native-base";
import SimpleHeader from "../Components/Header/simple";
import LottieView from "lottie-react-native";
import * as axios from "axios";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			results: [],
			isLoading: true,
			resShow: [],
			input: "",
		};
	}
	componentDidMount() {
		YellowBox.ignoreWarnings(["Setting a timer"]);
		this.animation.play();
		axios.defaults.headers.common["user-key"] = "2a2e243fdaffb804cc3fb4f3a9ccb277";
		this.zomatofind();
	}

	async zomatofind() {
		var arr = [];
		for (let i = 0; i < 1; i++) {
			await axios
				.get(
					"https://developers.zomato.com/api/v2.1/search?entity_id=1&entity_type=city&start=" +
						(i * 10).toString() +
						"&lat=28.704&lon=77.041" +
						"&sort=real_distance&order=desc"
				)
				.then((result) => {
					arr = arr.concat(result.data.restaurants);
				});
		}
		this.setState({ results: arr, isLoading: false, resShow: arr });

		this.Search("Piz");
	}

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

	Search() {
		var arr = [];
		for (let i = 0; i < this.state.results.length; i++) {
			let regex = new RegExp(this.state.input.toLowerCase(), "gi");
			let str = this.state.results[i].restaurant.name;
			if (str.match(regex)) {
				arr.push(this.state.results[i]);
			}
		}
		this.setState({
			resShow: arr,
		});
	}

	resetAnimation = () => {
		this.animation.reset();
		this.animation.play();
	};

	render() {
		return (
			<Root>
				<SimpleHeader title="Search" left={true} />
				{this.state.isLoading ? null : (
					<View style={{ width: "100%", alignItems: "center" }}>
						<Item style={{ width: "95%" }}>
							<Icon name="ios-search" />
							<Input placeholder="Search" onChangeText={(text) => this.setState({ input: text })} />
							<Button transparent onPress={() => this.Search()}>
								<Text style={{ marginHorizontal: 10, color: "blue" }}>Search</Text>
							</Button>
						</Item>
					</View>
				)}
				<Content>
					<List>
						{this.state.isLoading ? (
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
									source={require("../assets/wheel.json")}
								/>
								<View style={styles.buttonContainer}>
									<Button title="Restart Animation" onPress={this.resetAnimation} />
								</View>
							</View>
						) : (
							this.state.resShow.map((item, idx) => {
								return (
									<Card key={idx} style={{ width: screenWidth, textAlign: "left" }}>
										<TouchableOpacity onPress={() => this._handlePressButtonAsync(item.restaurant.url)}>
											<View>
												<CardItem
													style={{
														flexDirection: "row",
														justifyContent: "space-between",
													}}
												>
													<Text>{item.restaurant.name}</Text>
													<Text
														style={{
															color: "#" + item.restaurant.user_rating.rating_color.toString(),
														}}
													>
														{item.restaurant.user_rating.rating_text}
													</Text>
												</CardItem>
												<CardItem
													style={{
														flexDirection: "column",
													}}
												>
													<Text>{item.restaurant.location.address}</Text>
													<Text></Text>
													<TouchableOpacity
														onPress={() => this._handlePressButtonAsync(`http://localhost:8081/vr?id=${encodeBase64(item.restaurant.name)}`)}
														style={{
															backgroundColor: "#fff",
															display: "flex",
															justifyContent: "center",
														}}
													>
														<Text style={{ color: "blue" }}>
															localhost:8081/vr?id={encodeBase64(item.restaurant.name)}
														</Text>
													</TouchableOpacity>
													<Text></Text>
													<Text>
														{item.restaurant.highlights.map((it, idx) => (
															<Text
																key={idx}
																style={{
																	color:
																		"rgb(" +
																		Math.floor(Math.random() * 128) +
																		"," +
																		Math.floor(Math.random() * 128) +
																		"," +
																		Math.floor(Math.random() * 128) +
																		")",
																}}
															>
																{it}
																{"   "}
															</Text>
														))}
													</Text>
													<Text />
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
							})
						)}
					</List>
				</Content>
			</Root>
		);
	}
}

const styles = StyleSheet.create({
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
