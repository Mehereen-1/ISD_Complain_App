import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';


const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const title = "Complains";

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 2000, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      navigation.replace('Signup'); // navigate to SignIn
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}> {/* ✅ Container View holds everything */}
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        {title}
      </Animated.Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFECC0",
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
});

export default SplashScreen;
