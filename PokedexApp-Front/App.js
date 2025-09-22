import * as React from 'react';
import { useEffect, useState } from 'react';
import { Image, View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorageService from './services/AsyncStorageService';

import HomeScreen from './screens/HomePage/HomePage.js';
import PokemonDetailScreen from './screens/PokemonDetail/PokemonDetail.js';
import MovesList from './screens/MovesList/MovesList.js';
import ItemsList from './screens/ItemsList/ItemsList.js';
import AbilitiesList from './screens/AbilitiesList/AbilitiesList.js';
import WelcomeScreen from './screens/WelcomePage/WelcomePage.js';
import TeamsList from './screens/TeamsList/TeamsList.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomePage"
        component={HomeScreen}
        options={{ title: 'Pokédex' }}
      />
      <Stack.Screen
        name="PokemonDetail"
        component={PokemonDetailScreen}
        options={{ title: 'Pokemon Details' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [dataInitialized, setDataInitialized] = useState(false);
  const [userEntered, setUserEntered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialiser AsyncStorage
        await AsyncStorageService.init();
        setDataInitialized(true);
      } catch (error) {
        console.error('Erreur d\'initialisation:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {dataInitialized && userEntered ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconSource;
              if (route.name === 'Pokemons') {
                iconSource = require('./assets/images/poke-ball.png');
              } else if (route.name === 'Moves') {
                iconSource = require('./assets/images/tm.png');
              } else if (route.name === 'Items') {
                iconSource = require('./assets/images/leftovers.png');
              } else if (route.name === 'Abilities') {
                iconSource = require('./assets/images/ability-capsule.png');
              } else if (route.name === 'Teams') {
                iconSource = require('./assets/images/radar.png'); // Vous pouvez créer une icône spécifique
              }
              return (
                <Image
                  source={iconSource}
                  style={{ width: size, height: size }}
                  resizeMode="contain"
                />
              );
            },
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Pokemons" component={HomeStack} />
          <Tab.Screen name="Moves" component={MovesList} />
          <Tab.Screen name="Abilities" component={AbilitiesList} />
          <Tab.Screen name="Items" component={ItemsList} />
          <Tab.Screen name="Teams" component={TeamsList} />
        </Tab.Navigator>
      ) : (
        <WelcomeScreen onEnter={() => setUserEntered(true)} />
      )}
    </NavigationContainer>
  );
}