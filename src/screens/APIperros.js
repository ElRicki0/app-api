import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import axios from 'axios';

const HomeScreen = () => {
    const [dogImage, setDogImage] = useState(null);

    const fetchDogImage = () => {
        axios.get('https://dog.ceo/api/breeds/image/random')
            .then(response => {
                setDogImage(response.data.message);
            })
            .catch(error => {
                console.error('Error fetching dog image:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Button title="generar image de perro :3" onPress={fetchDogImage} />
            {dogImage && <Image source={{ uri: dogImage }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
    },
});

export default HomeScreen;
