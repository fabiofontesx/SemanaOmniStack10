import React from 'react';
import {  StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview'
function Profile({navigation}){

    const githubUsername = navigation.getParam('github_username');
    const url = `https://github.com/${githubUsername}`
    return (

        <WebView styles = { styles.webview } source= {{uri: url}} />

    )
}

const styles = StyleSheet.create({
    webview: {
        flex:1 
    }
});
export default Profile;