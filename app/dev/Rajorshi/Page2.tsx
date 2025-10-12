import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from './colors';

const { width, height } = Dimensions.get('window');

export default function Page2() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0) // Add one for the User Profile button
  ]).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();

    // Staggered button animations
    buttonAnimations.forEach((anim, index) => {
      Animated.delay(600 + index * 200).start();
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const navigateToSubmitComplaint = () => {
    router.push('/dev/Rajorshi/SubmitComplaint');
  };

  const navigateToComplaintsFeed = () => {
    router.push('/dev/Rajorshi/ComplaintsFeed');
  };

  const navigateToMyComplaints = () => {
    router.push('/dev/Rajorshi/MyComplaints');
  };

  const navigateToUserProfile = () => {
    router.push('/dev/Rajorshi/UserProfile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primaryLight} />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <Animated.Text 
            style={[
              styles.title,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            Student Complaint Management System
          </Animated.Text>
          <Animated.View 
            style={[
              styles.headerDecor,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
            <View style={styles.decorCircle3} />
          </Animated.View>
        </View>
      </Animated.View>

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Animated.Text 
          style={[
            styles.welcomeText,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          Welcome back! 👋
        </Animated.Text>
        <Text style={styles.descriptionText}>
          Manage your complaints efficiently and stay connected with the community
        </Text>
        
        <View style={styles.navigationContainer}>
          {[
            { 
              icon: '📝', 
              title: 'Submit Complaint', 
              subtitle: 'Report a new issue',
              color: colors.primary,
              onPress: navigateToSubmitComplaint,
              index: 0
            },
            { 
              icon: '📰', 
              title: 'All Complaints', 
              subtitle: 'View community feed',
              color: colors.success,
              onPress: navigateToComplaintsFeed,
              index: 1
            },
            { 
              icon: '📋', 
              title: 'My Complaints', 
              subtitle: 'Track your submissions',
              color: colors.warning,
              onPress: navigateToMyComplaints,
              index: 2
            },
            { 
              icon: '👤', 
              title: 'User Profile', 
              subtitle: 'Edit your info',
              color: colors.primaryLight, 
              onPress: navigateToUserProfile,
              index: 3
            }
          ].map((button, buttonIndex) => (
            <Animated.View
              key={buttonIndex}
              style={{
                transform: [
                  { scale: buttonAnimations[buttonIndex] },
                  { 
                    translateX: buttonAnimations[buttonIndex].interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0]
                    })
                  }
                ]
              }}
            >
              <TouchableOpacity 
                style={[styles.navButton, { borderLeftColor: button.color }]}
                onPress={button.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.buttonContainer}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.navIcon}>{button.icon}</Text>
                  </View>
                  <View style={styles.buttonContent}>
                    <Text style={styles.navButtonText}>{button.title}</Text>
                    <Text style={styles.navButtonSubtext}>{button.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  headerContent: {
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
    lineHeight: 26,
  },
  headerDecor: {
    position: 'absolute',
    top: -10,
    right: -20,
  },
  decorCircle1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gradient1,
    opacity: 0.2,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  decorCircle2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gradient2,
    opacity: 0.15,
    position: 'absolute',
    top: 10,
    right: 30,
  },
  decorCircle3: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: colors.gradient3,
    opacity: 0.1,
    position: 'absolute',
    top: -5,
    right: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
    fontWeight: '500',
  },
  navigationContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  navButton: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 0,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  navIcon: {
    fontSize: 24,
  },
  buttonContent: {
    flex: 1,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  navButtonSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});