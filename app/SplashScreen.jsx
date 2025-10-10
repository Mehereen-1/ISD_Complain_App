import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Signup'); // Navigate to Signup after 3 seconds
    }, 3000); // 3000 ms = 3 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../assets/logo.png')} // your logo
        style={styles.logo}
      /> */}
      <Text style={styles.text}>Welcome to MyApp</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
