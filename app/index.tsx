import {useRouter} from 'expo-router';
import {Image,StyleSheet,Text,TouchableOpacity,View} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const startGame = () => {
    router.push({
      pathname: '/rezultat',
      params: {
        rounds: JSON.stringify([]),
      },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B7D5AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    color: '#334030',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 28,
    color: '#334030',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 180,
    marginVertical: 30,
  },
  button: {
    backgroundColor: '#6F8F68',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});