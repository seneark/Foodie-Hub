import React, { Component } from "react";
import { StyleSheet, Text, View, YellowBox } from "react-native";
import { Container, Content, Button, Icon, Root, Footer, FooterTab } from "native-base";
import { Actions } from "react-native-router-flux";

export default class ProfileFooter extends Component {
	constructor(props){
		super(props);
	}
	componentDidMount() {
}
	render() {
		return (
			<Footer>
				<FooterTab style={{ backgroundColor: "#01c5c4" }}>
					<Button vertical style={{ backgroundColor: "#b8de6f" }}>
						<Icon style={{...styles.FootIcon, color:"black"}} name="person" />
						<Text>Profile</Text>
					</Button>
					<Button vertical onPress={() => Actions.push("Search", {location: this.props.location})}>
						<Icon style={styles.FootIcon} name="search" />
						<Text>Search</Text>
					</Button>
					<Button vertical onPress={() => Actions.push("Friend")}>
						<Icon style={styles.FootIcon} active name="restaurant" />
						<Text>Suggestion</Text>
					</Button>
					<Button style={styles.FootIcon} vertical onPress={() => Actions.push("Order")}>
						<Icon style={styles.FootIcon} name="list" />
						<Text>Orders</Text>
					</Button>
				</FooterTab>
			</Footer>
		);
	}
}

const styles = StyleSheet.create({
	FootIcon:{
        color:"#686d76"
    }
});