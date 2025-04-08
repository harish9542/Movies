import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Movie App' }} 
      />
      <Stack.Screen 
        name="MovieDetail" 
        component={MovieDetailScreen} 
        options={{ 
          title: 'Movie Details', 
          headerBackTitleVisible: false,  // ✅ hides "Movie App" from back button
        }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
