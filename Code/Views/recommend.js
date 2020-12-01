import React, { Component } from "react";
import * as firebase from "firebase";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { StyleSheet, Text, View, YellowBox, Image } from "react-native";
import { Container, Content, Button, Icon, Root, DeckSwiper, Left, Body, List, Toast, Card, CardItem } from "native-base";
import SimpleHeader from "../Components/Header/simple";
import LottieView from "lottie-react-native";

export default class friends extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Friends: {},
			restaurent: {},
			isLoading: true,
			restaurantInfo: {},
		};
	}

	componentDidMount() {
		YellowBox.ignoreWarnings(["Setting a timer", "Animated: `useNativeDriver` was not specified."]);
		this.getFriends();
	}

	async getFriends() {
		const db = firebase.firestore();
		await db
			.collection("user")
			.doc(firebase.auth().currentUser.email.toString())
			.get()
			.then(async (doc) => {
				for (let i = 0; i < doc.data().restaurant.length; i++) {
					await db
						.collection("restaurant")
						.doc(doc.data().restaurant[i].id)
						.get()
						.then((doc) => {
							for (let i = 0; i < doc.data().user.length; i++) {
								if (doc.data().user[i] !== firebase.auth().currentUser.email.toString()) {
									let friend = this.state.Friends;
									if (friend[doc.data().user[i]] == null) {
										friend[doc.data().user[i]] = 0;
									}
									friend[doc.data().user[i]]++;
									this.setState({ Friends: friend });
								}
							}
						});
				}
			});
		let list = this.state.Friends;
		this.setState({
			Friends: Object.keys(list).sort(function (a, b) {
				return list[b] - list[a];
			}),
		});

		var resID = [];
		db.collection("user")
			.doc(firebase.auth().currentUser.email.toString())
			.get()
			.then((snapshot) => {
				snapshot.data().restaurant.forEach((doc) => {
					resID.push(doc.id);
				});
			});
		var lenF = this.state.Friends.length;
		for (let i = 0; i < this.state.Friends.length; i++) {
			var resto = this.state.restaurent;
			await db
				.collection("restaurant")
				.where("user", "array-contains", this.state.Friends[i])
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach(function (doc, index) {
						if (resID.indexOf(doc.id) < 0) {
							if (resto[doc.id] == null) resto[doc.id] = 0;
							resto[doc.id] += 10 * (lenF - i);
						}
					});
				});
		}

		resto = Object.keys(resto).sort(function (a, b) {
			return resto[b] - resto[a];
		});

		var info = [];
		for (let i = 0; i < resto.length; i++) {
			await db
				.collection("restaurant")
				.doc(resto[i])
				.get()
				.then((doc) => {
					info.push(doc.data().restaurantInfo);
				});
		}
		this.setState({ restaurantInfo: info, isLoading: false });
	}

	async orderFood(item) {
		const db = firebase.firestore();
		let isRecommended = false;
		let rest = db.collection("restaurant").doc(item.id);
		await rest.get().then((doc) => {
			if (doc.exists) {
				let ex = doc.data().user.indexOf(firebase.auth().currentUser.email.toString());
				if (ex >= 0) {
					isRecommended = true;
				}
			}
		});

		let usr = db.collection("orders").add({
			id: item.id,
			name: item.name,
			createTime: new Date(),
			isRecommended: isRecommended,
			user: firebase.auth().currentUser.email.toString(),
		});

		this._handlePressButtonAsync(item.url.split("?")[0] + "/order");
	}

	_handlePressButtonAsync = async (url) => {
		let result = await WebBrowser.openBrowserAsync(url);
	};

	render() {
		return (
			<Root>
				<SimpleHeader title="Recommendations" left={true} />
				<Container>
					<Text />
					<View>
						{this.state.isLoading ? null : (
							<DeckSwiper
								dataSource={this.state.restaurantInfo}
								looping={false}
								renderItem={(item) => (
									<Card
										style={{
											elevation: 3,
											width: "100%",
										}}
									>
										<CardItem
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											<Text>{item.name}</Text>
											<Text
												style={{
													color: "#" + item.user_rating.rating_color.toString(),
												}}
											>
												{item.user_rating.rating_text}
											</Text>
										</CardItem>
										<CardItem
											style={{
												flexDirection: "column",
												alignItems: "flex-start",
											}}
										>
											<Text>{item.location.address}</Text>
											<View
												style={{
													flexDirection: "row",
												}}
											>
												<Icon name="thumbs-up" style={{ color: "#0278ae" }} />
												<Text
													style={{
														textAlignVertical: "center",
													}}
												>
													{" "}
													{item.user_rating.votes}
												</Text>
											</View>
											<Text />
											<Text>Highlights</Text>
											<Text>
												{item.highlights.map((it, idx) => (
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
										</CardItem>
										<CardItem footer>
											<Button
												rounded
												onPress={() => this.orderFood(item)}
												style={{
													backgroundColor:"#b8de6f",
													paddingHorizontal: 15,
												}}
											>
												<Text>Order Food</Text>
											</Button>
										</CardItem>
									</Card>
								)}
							/>
						)}
						<View
							style={{
								zIndex: -1,
								flex: 1,
								alignItems: "center",
								marginTop: 30,
							}}
						></View>
					</View>
					{this.state.isLoading ? (
						<View style={styles.animationContainer}>
							<Image source={require("../assets/animation_500_kgd3qkzy.gif")} style={{ width: 300, height: 200 }} />
						</View>
					) : (
						<Text style={{ zIndex: -100, textAlign: "center" }}>Empty Stack</Text>
					)}
				</Container>
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
