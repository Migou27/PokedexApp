import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions,
  Animated,
  StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ onEnter }) {
  // State for managing transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Entry animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Transition animations
  const transitionScale = useRef(new Animated.Value(1)).current;
  const transitionOpacity = useRef(new Animated.Value(1)).current;
  const logoTransition = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for indicator
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  // Enhanced transition function
  const handleEnterApp = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);

    // Sophisticated transition animation
    Animated.parallel([
      // Logo grows and becomes focal point
      Animated.timing(logoTransition, {
        toValue: 3,
        duration: 800,
        useNativeDriver: true,
      }),
      // All content fades out
      Animated.timing(transitionOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // White overlay for smooth transition
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Global scaling for dramatic effect
      Animated.timing(transitionScale, {
        toValue: 1.2,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Delay to let animation finish visually
      setTimeout(() => {
        onEnter();
      }, 200);
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1f36" />
      <TouchableOpacity 
        style={styles.container} 
        onPress={handleEnterApp}
        activeOpacity={0.95}
        disabled={isTransitioning}
      >
        <Animated.View
          style={[
            styles.transitionContainer,
            {
              transform: [{ scale: transitionScale }],
            }
          ]}
        >
          <LinearGradient
            colors={['#1a1f36', '#2d3561', '#4c5e8f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {/* Background decorative elements */}
            <View style={styles.backgroundDecorations}>
              <View style={[styles.circle, styles.circle1]} />
              <View style={[styles.circle, styles.circle2]} />
              <View style={[styles.circle, styles.circle3]} />
            </View>

            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [
                    { scale: scaleAnim },
                    { translateY: slideAnim }
                  ]
                }
              ]}
            >
              {/* Logo with glassmorphism effect and transition */}
              <Animated.View 
                style={[
                  styles.logoContainer,
                  {
                    opacity: transitionOpacity,
                    transform: [{ scale: logoTransition }]
                  }
                ]}
              >
                <View style={styles.logoBackground}>
                  <Image
                    source={require('../../assets/images/radar.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              </Animated.View>

              {/* Main content with transition */}
              <Animated.View 
                style={[
                  styles.mainContent,
                  { opacity: transitionOpacity }
                ]}
              >
                {/* Modern title effect */}
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Pokedex-App</Text>
                  <View style={styles.titleUnderline} />
                </View>
                
                {/* Subtitle with better hierarchy */}
                <Text style={styles.subtitle}>
                  Your pokedex app with all the pokemons, moves, items, abilities and more!
                </Text>

                {/* Stats with modern design */}
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>1000+</Text>
                    <Text style={styles.statLabel}>Pokemons</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>800+</Text>
                    <Text style={styles.statLabel}>Moves</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>400+</Text>
                    <Text style={styles.statLabel}>Abilities</Text>
                  </View>
                </View>
              </Animated.View>
            </Animated.View>

            {/* Modern action button with transition animation */}
            <Animated.View 
              style={[
                styles.actionContainer,
                { 
                  transform: [{ scale: pulseAnim }],
                  opacity: transitionOpacity 
                }
              ]}
            >
              <View style={styles.actionButton}>
                <Text style={styles.actionText}>
                  {isTransitioning ? 'Loading...' : 'Begin Adventure'}
                </Text>
                <View style={styles.actionIcon}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </View>
              <Text style={styles.hintText}>Tap anywhere to continue</Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Transition overlay */}
        <Animated.View 
          style={[
            styles.transitionOverlay,
            { opacity: overlayOpacity }
          ]} 
          pointerEvents="none"
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transitionContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  backgroundDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    top: height * 0.3,
    left: width * 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -50,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
    zIndex: 10,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: {
    width: 60,
    height: 60,
    tintColor: '#FFFFFF',
  },
  mainContent: {
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    textAlign: 'center',
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#64FFDA',
    marginTop: 8,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 48,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#64FFDA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 60,
    left: 32,
    right: 32,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 255, 218, 0.15)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    marginBottom: 12,
    minWidth: 220,
    justifyContent: 'center',
  },
  actionText: {
    color: '#64FFDA',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  actionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#64FFDA',
    fontSize: 14,
    fontWeight: '700',
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  transitionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
});