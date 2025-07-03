import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Shield, UserPlus, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignUp = async () => {
    if (!isLoaded) return;
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        password: password,
      });
      
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign Up Error', err);
      Alert.alert("Sign Up Failed", err.errors?.[0]?.message || "Please check your information and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!isLoaded) return;
    
    if (!code.trim()) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }
    
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        // User will be redirected to role selection by main app logic
      } else {
        Alert.alert("Verification Failed", "Please check the code and try again.");
      }
    } catch (err: any) {
      console.error('Verification Error', err);
      Alert.alert("Verification Failed", err.errors?.[0]?.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive: setActiveSession } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/', { scheme: 'myapp' }),
      });

      if (createdSessionId && typeof setActiveSession === 'function') {
        await setActiveSession({ session: createdSessionId });
        // User will be redirected automatically by the main app logic
      }
    } catch (err: any) {
      console.error('Google OAuth error', err);
      Alert.alert("Google Sign-Up Failed", err.errors?.[0]?.message || "Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0a0a0a', '#1a1a1a', '#2a2a2a']}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setPendingVerification(false)}
              activeOpacity={0.8}
            >
              <ArrowLeft size={24} color="#FFD700" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify Email</Text>
            <View style={styles.placeholder} />
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Verification Section */}
              <View style={styles.heroSection}>
                <View style={styles.iconContainer}>
                  <Mail size={60} color="#FFD700" />
                  <View style={styles.iconGlow} />
                </View>
                
                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.subtitle}>
                  We've sent a verification code to{'\n'}{email}
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#FFD700" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter verification code"
                    placeholderTextColor="#666"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.verifyButton, loading && styles.buttonDisabled]} 
                  onPress={handleVerification}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <LoadingSpinner size={20} color="#1a1a1a" />
                  ) : (
                    <>
                      <CheckCircle size={20} color="#1a1a1a" />
                      <Text style={styles.verifyButtonText}>Verify Email</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.resendButton}
                  onPress={() => {
                    signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });
                  }}
                >
                  <Text style={styles.resendText}>Didn't receive the code? Resend</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a1a', '#2a2a2a']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Up</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.iconContainer}>
                <Shield size={60} color="#FFD700" />
                <View style={styles.iconGlow} />
              </View>
              
              <Text style={styles.title}>Join the Elite</Text>
              <Text style={styles.subtitle}>
                Create your account and become part of the world's premier fighting community
              </Text>
            </View>

            {/* Google Sign-Up Button */}
            <TouchableOpacity 
              style={[styles.googleButton, loading && styles.buttonDisabled]} 
              onPress={handleGoogleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or create account with email</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.nameRow}>
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <User size={20} color="#FFD700" />
                  <TextInput
                    style={styles.input}
                    placeholder="First name"
                    placeholderTextColor="#666"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>

                <View style={[styles.inputContainer, styles.halfInput]}>
                  <User size={20} color="#FFD700" />
                  <TextInput
                    style={styles.input}
                    placeholder="Last name"
                    placeholderTextColor="#666"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#FFD700" />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#FFD700" />
                <TextInput
                  style={styles.input}
                  placeholder="Password (min. 8 characters)"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#FFD700" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.signUpButton, loading && styles.buttonDisabled]} 
                onPress={handleSignUp}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <LoadingSpinner size={20} color="#1a1a1a" />
                ) : (
                  <>
                    <UserPlus size={20} color="#1a1a1a" />
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>

            {/* Sign In Link */}
            <View style={styles.signInSection}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => router.push('/sign-in')}
                activeOpacity={0.8}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Background Elements */}
        <View style={styles.backgroundImageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.backgroundImage}
          />
          <View style={styles.backgroundOverlay} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 44,
  },
  keyboardView: {
    flex: 1,
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 300,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    gap: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  googleText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  form: {
    gap: 20,
    marginBottom: 40,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  halfInput: {
    flex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
  },
  signUpButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 8,
  },
  signUpButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 8,
  },
  verifyButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  termsText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  resendText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  signInSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  signInText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 16,
  },
  signInButton: {
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  signInButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: '100%',
    opacity: 0.2,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
  },
});