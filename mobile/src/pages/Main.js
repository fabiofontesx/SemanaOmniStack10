import React, {useState, useEffect} from 'react';
import {  StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import {MaterialIcons} from '@expo/vector-icons';

import api from '../services/api';
import {connect, disconnect, subscribeToNewDevs, subscribeToRemoveDevs } from '../services/websocket';

//A prop navigation vem automatica para todas paginas
function Main({navigation}){

    const [currentRegion, setCurrentRegion] = useState(null);
    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState('');
    const [isSocketConnected, setSocketConnected] = useState(false);

    useEffect(()=>{
        async function loadInitialPosition(){
            const {granted} = await requestPermissionsAsync();
            if(granted){
                const {coords} = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                });

                const {latitude, longitude} = coords;
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                })
            }

        }
        loadInitialPosition();
        /**
         Keyboard.addListener('keyboardDidShow', keyboardShow);
         Keyboard.addListener('keyboardDidHide', keyboardHide);
         * 
         */
    }, [devs]);


    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));

        subscribeToRemoveDevs(dev => setDevs(devs.filter(devRemove => devRemove._id != dev._id)));

    }, [devs]);

    

    function setupWebSocket(){
        if(currentRegion){
            const {latitude, longitude} = currentRegion;
            if(isSocketConnected){
                console.log("Socket esta aberto desconectando");
                disconnect();
            }
            
            connect(
                latitude,
                longitude,
                techs
            );
            setSocketConnected(true);
        }
    }
    

    async function loadDevs(){
        const { latitude, longitude } = currentRegion;
        console.log(latitude, longitude);
        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });
        setDevs(response.data.devs);
    }

    function handleRegionChanged(region){
        setCurrentRegion(region);
    }

    if(!currentRegion){
        return null;
    }
    
    return (
        <>
            <MapView 
                onRegionChangeComplete ={handleRegionChanged}
                style= {styles.map} 
                initialRegion ={currentRegion}
            >
            
            {devs.map( dev => (
                
                <Marker 
                    coordinate={{
                        longitude: dev.location.coordinates[0],
                        latitude: dev.location.coordinates[1]
                    }}
                    key={dev._id}
                >
                    <Image 
                        style={styles.avatar}
                        source={{
                            uri: dev.avatar_url
                        }}
                    />

                    <Callout 
                        onPress={() => {
                            //Navegação
                            navigation.navigate('Profile', { github_username : dev.github_username} )
                        }}
                    >
                        <View style={styles.callout}>
                            <Text style ={styles.devName}> {dev.name} </Text>
                            <Text style ={styles.devBio}>{dev.bio}</Text>
                            <Text style ={styles.devTechs}>{dev.techs.join(', ')}</Text>
                        </View>
                    </Callout>
            </Marker>
            ))}

            </MapView>
            <View style= {styles.searchForm}>
                <TextInput
                    style = {styles.searchInput}
                    placeholder="Buscar devs por tecnologias separado por virgula"
                    autoCorrect = {false}
                    onChangeText = {setTechs}
                />


                <TouchableOpacity style= {styles.loadButton} onPress = {() =>{
                    loadDevs();
                    setupWebSocket();
                }}>
                    <MaterialIcons name="my-location" syze={20} color="#FFF"/>
                </TouchableOpacity>
            </View>       
        </>

    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFFF',
    },

    callout:{
        width: 250
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },

    devBio:{
        color: '#666',
        marginTop: 5
    },

    devTechs: {
        marginTop: 5,
    },

    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 2
    },

    loadButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#8E4Dff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    }


});

export default Main;