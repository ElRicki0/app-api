import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const numColumns = 2;
// 
const PokemonItem = React.memo(({ item }) => {
    const [descripcion, setDescripcion] = useState('');
    const [cargandoDescripcion, setCargandoDescripcion] = useState(true);
    const [pokemonId, setPokemonId] = useState('');

    useEffect(() => {
        const fetchPokemonId = async () => {
            try {
                const response = await fetch(item.url);
                if (!response.ok) {
                    throw new Error(`Error de la solicitud: ${response.status}`);
                }
                const data = await response.json();
                const id = data.id;
                setPokemonId(id);
                fetchPokemonDescription(id);
            } catch (error) {
                console.error('Error al obtener el ID del Pokémon:', error);
                setCargandoDescripcion(false);
            }
        };
        fetchPokemonId();
    }, [item.url]);

    const fetchPokemonDescription = async (id) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
            if (!response.ok) {
                throw new Error(`Error de la solicitud: ${response.status}`);
            }
            const data = await response.json();
            const entradaEnEspañol = data.flavor_text_entries.find(entrada => entrada.language.name === 'es');
            if (entradaEnEspañol) {
                setDescripcion(entradaEnEspañol.flavor_text);
            } else {
                setDescripcion('Descripción no encontrada');
            }
            setCargandoDescripcion(false);
        } catch (error) {
            console.error('Error al obtener la descripción del Pokémon:', error);
            setDescripcion('Error al obtener la descripción');
            setCargandoDescripcion(false);
        }
    };

    return (
        <View style={styles.card}>
            {pokemonId ? (
                <Image
                    style={styles.image}
                    source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png` }}
                />
            ) : (
                <ActivityIndicator style={styles.loading} />
            )}
            <Text style={styles.title}>{item.name}</Text>
            {cargandoDescripcion ? (
                <ActivityIndicator style={styles.loading} />
            ) : (
                <Text style={styles.description}>{descripcion}</Text>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        margin: 5,
        width: WIDTH / numColumns - 10,
        alignItems: 'center',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5,
        textTransform: 'capitalize',
    },
    image: {
        width: 90,
        height: 140,
    },
    description: {
        fontSize: 20,
        textAlign: 'center',
    },
    loading: {
        marginTop: 20,
    },
});

export default PokemonItem;
