import {useRouter} from 'expo-router';
import {Image,StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import {INITIAL_GAME_STATE,ROUTES,THEMES} from './constants/app_const';

const COLORS=THEMES.light;

export default function HomeScreen() {
  const router=useRouter();

  const startGame=() => {
    router.push({
      pathname: ROUTES.rezultat,
      params: INITIAL_GAME_STATE,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Belot</Text>
      <Text style={styles.subtitle}>Dobrodošli!</Text>

      <Image
        source={require('../assets/images/cards.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.button} onPress={startGame}>
        <Text style={styles.buttonText}>ZAPOČNI IGRU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 40,
    color: COLORS.text,
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 20,
  },

  image: {
    width: 250,
    height: 180,
    marginVertical: 30,
  },

  button: {
    backgroundColor: COLORS.dark,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});