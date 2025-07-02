import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignIn, useSignUp, useOAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { X, Mail, Lock, User, Eye, EyeOff, Shield } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import LoadingSpinner from './LoadingSpinner';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ visible, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const resetForm = () => {
    setSignInEmail('');
    setSignInPassword('');
    setFirstName('');
    setLastName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setConfirmPassword('');
    setCode('');
    setPendingVerification(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignIn = async () => {
    if (!signInLoaded) return;
    
    if (!signInEmail.trim() || !signInPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!validateEmail(signInEmail.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: signInEmail.trim(),
        password: signInPassword,
      });

      await setSignInActive({ session: completeSignIn.createdSessionId });
      handleClose();
      // Navigation will be handled by the main app logic
    } catch (err: any) {
      console.error('Sign In Error', err);
      Alert.alert("Sign In Failed", err.errors?.[0]?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpLoaded) return;
    
    if (!firstName.trim() || !lastName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!validateEmail(signUpEmail.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!validatePassword(signUpPassword)) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
    
    if (signUpPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: signUpEmail.trim(),
        password: signUpPassword,
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
    if (!signUpLoaded) return;
    
    if (!code.trim()) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }
    
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      
      if (signUpAttempt.status === 'complete') {
        await setSignUpActive({ session: signUpAttempt.createdSessionId });
        handleClose();
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
        redirectUrl: Linking.createURL('/role-selection', { scheme: 'myapp' }),
      });

      if (createdSessionId && typeof setActiveSession === 'function') {
        await setActiveSession({ session: createdSessionId });
        handleClose();
        // Navigation will be handled by main app logic
      }
    } catch (err: any) {
      console.error('Google OAuth error', err);
      Alert.alert("Google Sign-In Failed", err.errors?.[0]?.message || "Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Mail size={48} color="#FFD700" />
            </View>

            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to{'\n'}{signUpEmail}
            </Text>

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
              style={[styles.primaryButton, loading && styles.buttonDisabled]} 
              onPress={handleVerification}
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size={20} color="#1a1a1a" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify Email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.resendButton}
              onPress={() => {
                // Resend verification code
                signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });
              }}
            >
              <Text style={styles.resendText}>Didn't receive the code? Resend</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Shield size={48} color="#FFD700" />
          </View>

          <Text style={styles.title}>
            {mode === 'signin' ? 'Welcome Back' : 'Join Combat Domain'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'signin' 
              ? 'Sign in to access your fighting community' 
              : 'Create your account and start building your legacy'
            }
          </Text>

          {mode === 'signup' && (
            <>
              <View style={styles.inputContainer}>
                <User size={20} color="#FFD700" />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#666"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <User size={20} color="#FFD700" />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#666"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Mail size={20} color="#FFD700" />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#666"
              value={mode === 'signin' ? signInEmail : signUpEmail}
              onChangeText={mode === 'signin' ? setSignInEmail : setSignUpEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#FFD700" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={mode === 'signin' ? signInPassword : signUpPassword}
              onChangeText={mode === 'signin' ? setSignInPassword : setSignUpPassword}
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

          {mode === 'signup' && (
            <View style={styles.inputContainer}>
              <Lock size={20} color="#FFD700" />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
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
          )}

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={mode === 'signin' ? handleSignIn : handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size={20} color="#1a1a1a" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={[styles.googleButton, loading && styles.buttonDisabled]} 
            onPress={handleGoogleAuth}
            disabled={loading}
          >
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              resetForm();
            }}
          >
            <Text style={styles.switchText}>
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#fff',
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  googleButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 24,
  },
  googleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
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
});