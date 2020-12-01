import React, { Component } from "react";
import * as firebase from "firebase";
import { StyleSheet, Text, View, Modal, Alert, TouchableHighlight } from "react-native";
import { Container, Content, Button, Icon, Root, List, ListItem, Right, Left, Toast } from "native-base";
import * as axios from "axios";

class OrderList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Color: null,
			restaurantInfo: null,
			modelVisible: false,
			listVisible: true,
		};
	}
	recommendRestaurent(item) {
		const db = firebase.firestore();

		let usr = db.collection("user").doc(firebase.auth().currentUser.email.toString());
		let reste = db.collection("restaurant").doc(item.id);
		let ord = db.collection("orders");

		db.collection("restaurant")
			.doc(item.id)
			.get()
			.then((doc) => {
				if (doc.exists) {
					let ex = doc.data().user.indexOf(firebase.auth().currentUser.email.toString());
					if (ex >= 0) {
						usr.get().then((docSnapshot) => {
							usr.update({
								restaurant: firebase.firestore.FieldValue.arrayRemove({
									id: item.id,
								}),
							});
						});

						reste.get().then((docSnapshot) => {
							rest.update({
								user: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.email.toString()),
							});
						});
						Toast.show({
							text: "Successfully removed from Recommendation",
							buttonText: "OK",
							duration: 53000,
							type: "danger",
						});

						ord.where("id", "==", item.id)
							.get()
							.then((docSnapshot) => {
								docSnapshot.forEach((doc) => {
									ord.doc(doc.id).update({
										isRecommended: false,
									});
								});
							});
						this.setState({ Color: "#a0c1b8" });
					} else {
						usr.get().then((docSnapshot) => {
							if (docSnapshot.exists) {
								usr.update({
									restaurant: firebase.firestore.FieldValue.arrayUnion({
										id: item.id,
									}),
								}).then((data) =>
									Toast.show({
										text: "Successfully added to recommendations",
										buttonText: "OK",
										duration: 53000,
										type: "success",
									})
								);
								ord.where("id", "==", item.id)
									.get()
									.then((docSnapshot) => {
										docSnapshot.forEach((doc) => {
											ord.doc(doc.id).update({
												isRecommended: true,
											});
										});
									});
								this.setState({ Color: "#fcf876" });
							} else {
								usr.set(
									{
										restaurant: [
											{
												id: item.id,
											},
										],
									},
									{ merge: true }
								).then((data) =>
									Toast.show({
										text: "Successfully added to recommendations",
										buttonText: "OK",
										duration: 53000,
										type: "success",
									})
								);

								ord.where("id", "==", item.id)
									.get()
									.then((docSnapshot) => {
										docSnapshot.forEach((doc) => {
											ord.doc(doc.id).update({
												isRecommended: true,
											});
										});
									});
								this.setState({ Color: "#fcf876" });
							}
						});
					}
				} else {
					usr.get().then((docSnapshot) => {
						if (docSnapshot.exists) {
							usr.update({
								restaurant: firebase.firestore.FieldValue.arrayUnion({
									id: item.id,
								}),
							}).then((data) =>
								Toast.show({
									text: "Successfully added to recommendations",
									buttonText: "OK",
									duration: 53000,
									type: "success",
								})
							);
						} else {
							usr.set(
								{
									restaurant: [
										{
											id: item.id,
										},
									],
								},
								{ merge: true }
							).then((data) =>
								Toast.show({
									text: "Successfully added to recommendations",
									buttonText: "OK",
									duration: 53000,
									type: "success",
								})
							);

							ord.where("id", "==", item.id)
								.get()
								.then((docSnapshot) => {
									docSnapshot.forEach((doc) => {
										ord.doc(doc.id).update({
											isRecommended: true,
										});
									});
								});
							this.setState({ Color: "#fcf876" });
						}
					});
				}
			});

		let rest = db.collection("restaurant").doc(item.id);
		rest.get().then((docSnapshot) => {
			if (docSnapshot.exists) {
				rest.update({
					user: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.email.toString()),
				}).then((data) => console.log("restaurant added"));
			} else {
				axios.defaults.headers.common["user-key"] = "2a2e243fdaffb804cc3fb4f3a9ccb277";

				this.getRestaurantInfo(item.id);
				this.setState({ Color: "#fcf876" });
			}
		});
	}

	async getRestaurantInfo(id) {
		const db = firebase.firestore();
		let rest = db.collection("restaurant").doc(id);
		await axios.get("https://developers.zomato.com/api/v2.1/restaurant?res_id=" + id.toString()).then((result) => {
			rest.set(
				{
					user: [firebase.auth().currentUser.email.toString()],
					restaurantInfo: result.data,
				},
				{ merge: true }
			).then((data) => console.log("success in creation"));
		});
	}

	deleteOrder(item) {
		const db = firebase.firestore();
		let ord = db.collection("orders");
		ord.where("createTime", "==", item.createTime)
			.get()
			.then((docSnapshot) => {
				docSnapshot.forEach((doc) => {
					ord.doc(doc.id).delete();
				});
            });
        this.setState({listVisible:false})
		this.setState({ modelVisible: false });
	}

	render() {
		return (
			<ListItem key={this.props.idx}>
				{this.state.listVisible ? (
					<View style={{display:"flex", flexDirection:"row"}}>
						<Modal
							animationType="fade"
							transparent={true}
							visible={this.state.modelVisible}
							onRequestClose={() => {
								Alert.alert("Modal has been closed.");
							}}
						>
							<View style={styles.centeredView}>
								<View style={styles.modalView}>
									<Text style={styles.modalText}>Are you Sure you wanna delete this from list?</Text>

									<View style={{ display: "flex", flexDirection: "row" }}>
										<TouchableHighlight
											style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
											onPress={() => {
												this.deleteOrder(this.props.items);
											}}
										>
											<Text style={styles.textStyle}>Yes</Text>
										</TouchableHighlight>
										<TouchableHighlight
											style={{ ...styles.openButton, backgroundColor: "#fff" }}
											onPress={() => {
												this.setState({ modelVisible: false });
											}}
										>
											<Text style={{ ...styles.textStyle, color: "black" }}>No</Text>
										</TouchableHighlight>
									</View>
								</View>
							</View>
						</Modal>
						<Button
							transparent
							onPress={() => {
								this.setState({ modelVisible: true });
							}}
						>
							<Icon
								name="trash"
								style={{
									color: "#fa697c",
									fontSize: 24,
								}}
							/>
						</Button>
						<Left style={{ display: "flex", flexDirection: "row" }}>
							<View style={{ display: "flex", flexDirection: "column" }}>
								<Text>{this.props.items.name}</Text>
								<Text style={{ color: "grey" }}>{this.props.items.createTime.toDate().toDateString()}</Text>
							</View>
						</Left>
						<Right>
							<Button transparent onPress={() => this.recommendRestaurent(this.props.items)}>
								<Icon
									name="star"
									style={{
										color: this.state.Color ? this.state.Color : this.props.items.isRecommended ? "#fcf876" : "#a0c1b8",
										fontSize: 32,
									}}
								/>
							</Button>
						</Right>
					</View>
				) : null}
			</ListItem>
		);
	}
}
const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		width: 300,
		height: 300,
		justifyContent: "center",
		alignItems: "center",
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		width: 100,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});
export default OrderList;
