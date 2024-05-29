import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, TextInput, ActivityIndicator, Alert } from 'react-native';
import PokemonItem from '../components/PokemonItem';


const WIDTH = Dimensions.get('window').width;
const numColumns = 3;


export default function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nombrePokemon, setNombrePokemon] = useState('');
  const [allPokemonList, setAllPokemon] = useState(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      let allPokemonList = [];
      let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';

      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error(`Error de la solicitud: ${response.status}`);
        }
        const data = await response.json();
        allPokemonList = [...allPokemonList, ...data.results];
        nextUrl = data.next;
      }

      setAllPokemon(allPokemonList);
      setPokemon(allPokemonList);
    } catch (error) {
      console.log("Hubo un error al obtener la lista de Pokémon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchPokemon = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`Error de la solicitud: ${response.status}`);
      }
      const data = await response.json();
      setPokemon([data]);
    } catch (error) {
      console.log("Hubo un error al obtener el Pokémon:", error);
      Alert.alert('Error', 'No se pudo encontrar el Pokémon. Verifique el nombre ingresado.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (nombrePokemon.trim() !== '') {
      searchPokemon();
    } else {
      setPokemon(allPokemon);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el nombre del Pokémon"
          onChangeText={setNombrePokemon}
          value={nombrePokemon}
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={pokemon}
          renderItem={({ item }) => (
            <PokemonItem item={item} />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  list: {
    justifyContent: 'center',
  },
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
    width: 80,
    height: 80,
  },
  loading: {
    marginTop: 20,
  },
});
