import React, { Component } from 'react';
import {Header, Left, Body, Right, Title } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import {StyleSheet,Image} from "react-native"
export default class HeaderTitleExample extends Component {
  render() {
    return (
      
        <Header>
          <Left/>
          <Body style={styles.body}>
            <FontAwesome5 name="user" size={24} color="black"  style={{marginHorizontal:5}}/>
            <Title>Login Page</Title>
          </Body>
          <Right />
        </Header>
     
    );
  }
}
const styles = StyleSheet.create({
    body:{
        flexDirection:"row"
    }
})