import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
	StyleProvider,
	Header,
	Left,
	Right,
	Body,
	Title,
	Button,
	Icon,
} from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColor from "../../native-base-theme/variables/platform";
import { Actions } from "react-native-router-flux";

const simple = ({ title, left = true }) => {
	return (
		<StyleProvider style={getTheme(commonColor)}>
			{left ? (
				<Header style={styles.header} androidStatusBarColor="black" noShadow>
					<Left>
						<Button transparent onPress={() => Actions.pop()}>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title style={styles.title}>{title}</Title>
					</Body>
					<Right />
				</Header>
			) : (
				<Header
					style={styles.header}
					androidStatusBarColor="black"
					noLeft={true}
				>
					<Left />
					<Body>
						<Title style={styles.title}>{title}</Title>
					</Body>
					<Right />
				</Header>
			)}
		</StyleProvider>
	);
};

const styles = StyleSheet.create({
	header: {
		backgroundColor:"#01c5c4",
		borderBottomColor: "white",
		borderBottomWidth: 0.5,
	},
	title: {
		color: "#f6f6f6",
	},
});

export default simple;
