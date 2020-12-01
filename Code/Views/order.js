import React, { Component } from "react";
import * as firebase from "firebase";
import { StyleSheet, Text, View, YellowBox } from "react-native";
import { Container, Content, Button, Icon, Root, List, ListItem, Right, Left, Toast } from "native-base";
import { Actions } from "react-native-router-flux";
import SimpleHeader from "../Components/Header/simple";
import OrderList from "../Components/List/OrderList";

class Order extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: [],
			isLoading: true,
		};
	}

	componentDidMount() {
		YellowBox.ignoreWarnings(["Setting a timer"]);
		this._handleOrder();
	}

	async _handleOrder() {
		const db = firebase.firestore();
		var ord = [];
		await db
			.collection("orders")
			.where("user", ">=", firebase.auth().currentUser.email.toString())
			.where("user", "<=", firebase.auth().currentUser.email.toString())
			.orderBy("user")
			.orderBy("createTime", "desc")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					ord.push(doc.data());
				});
				this.setState({
					isLoading: false,
					orders: ord,
				});
			});
	}

	// setStar(idx) {
	// 	this.recommendRestaurent(idx);
	// }

	// recommendRestaurent(item) {
	// 	const db = firebase.firestore();

	// 	let usr = db.collection("user").doc(firebase.auth().currentUser.email.toString());
	// 	let reste = db.collection("restaurant").doc(item.id);
	// 	let ord = db.collection("orders");

	// 	db.collection("restaurant")
	// 		.doc(item.id)
	// 		.get()
	// 		.then((doc) => {
	// 			if (doc.exists) {
	// 				let ex = doc.data().user.indexOf(firebase.auth().currentUser.email.toString());
	// 				if (ex >= 0) {
	// 					usr.get().then((docSnapshot) => {
	// 						usr.update({
	// 							restaurant: firebase.firestore.FieldValue.arrayRemove({
	// 								id: item.id,
	// 							}),
	// 						});
	// 					});

	// 					reste.get().then((docSnapshot) => {
	// 						rest.update({
	// 							user: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.email.toString()),
	// 						});
	// 					});
	// 					Toast.show({
	// 						text: "Successfully deleted",
	// 						buttonText: "OK",
	// 						duration: 53000,
	// 						type: "danger",
	// 					});

	// 					ord.where("id", "==", item.id)
	// 						.get()
	// 						.then((docSnapshot) => {
	// 							docSnapshot.forEach((doc) => {
	// 								ord.doc(doc.id).update({
	// 									isRecommended: false,
	// 								});
	// 							});
	// 						});
	// 				} else {
	// 					usr.get().then((docSnapshot) => {
	// 						if (docSnapshot.exists) {
	// 							usr.update({
	// 								restaurant: firebase.firestore.FieldValue.arrayUnion({
	// 									id: item.id,
	// 								}),
	// 							}).then((data) =>
	// 								Toast.show({
	// 									text: "Successfully added",
	// 									buttonText: "OK",
	// 									duration: 53000,
	// 									type: "success",
	// 								})
	// 							);
	// 							ord.where("id", "==", item.id)
	// 								.get()
	// 								.then((docSnapshot) => {
	// 									docSnapshot.forEach((doc) => {
	// 										ord.doc(doc.id).update({
	// 											isRecommended: true,
	// 										});
	// 									});
	// 								});
	// 						} else {
	// 							usr.set(
	// 								{
	// 									restaurant: [
	// 										{
	// 											id: item.id,
	// 										},
	// 									],
	// 								},
	// 								{ merge: true }
	// 							).then((data) =>
	// 								Toast.show({
	// 									text: "Successfully added",
	// 									buttonText: "OK",
	// 									duration: 53000,
	// 									type: "success",
	// 								})
	// 							);

	// 							ord.where("id", "==", item.id)
	// 								.get()
	// 								.then((docSnapshot) => {
	// 									docSnapshot.forEach((doc) => {
	// 										ord.doc(doc.id).update({
	// 											isRecommended: true,
	// 										});
	// 									});
	// 								});
	// 						}
	// 					});
	// 				}
	// 			} else {
	// 				usr.get().then((docSnapshot) => {
	// 					if (docSnapshot.exists) {
	// 						usr.update({
	// 							restaurant: firebase.firestore.FieldValue.arrayUnion({
	// 								id: item.id,
	// 							}),
	// 						}).then((data) =>
	// 							Toast.show({
	// 								text: "Successfully added",
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
	// 										id: item.id,
	// 									},
	// 								],
	// 							},
	// 							{ merge: true }
	// 						).then((data) =>
	// 							Toast.show({
	// 								text: "Successfully added",
	// 								buttonText: "OK",
	// 								duration: 53000,
	// 								type: "success",
	// 							})
	// 						);

	// 						ord.where("id", "==", item.id)
	// 							.get()
	// 							.then((docSnapshot) => {
	// 								docSnapshot.forEach((doc) => {
	// 									ord.doc(doc.id).update({
	// 										isRecommended: true,
	// 									});
	// 								});
	// 							});
	// 					}
	// 				});
	// 			}
	// 		});

	// 	let rest = db.collection("restaurant").doc(item.id);
	// 	rest.get().then((docSnapshot) => {
	// 		if (docSnapshot.exists) {
	// 			rest.update({
	// 				user: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.email.toString()),
	// 			}).then((data) => console.log("restaurant added"));
	// 		} else {
	// 			rest.set(
	// 				{
	// 					user: [firebase.auth().currentUser.email.toString()],
	// 				},
	// 				{ merge: true }
	// 			).then((data) => console.log("success in creation"));
	// 		}
	// 	});
	// }

	render() {
		return (
			<Root>
				<SimpleHeader title="Orders" />
				<Content>
					<List>
						{this.state.isLoading ? null : this.state.orders.map((items, idx) => <OrderList key={idx} items={items} idx={idx} />)}
					</List>
				</Content>
			</Root>
		);
	}
}

export default Order;
