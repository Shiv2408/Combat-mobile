import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Camera, Upload, X } from 'lucide-react-native';
import * as ImagePickerExpo from 'expo-image-picker';

interface ImagePickerProps {
  value?: string;
  onImageChange: (uri: string | null) => void;
  placeholder?: string;
  style?: any;
  aspectRatio?: [number, number];
  quality?: number;
}

export default function ImagePicker({ 
  value, 
  onImageChange, 
  placeholder = "Select image", 
  style,
  aspectRatio = [4, 3],
  quality = 0.8
}: ImagePickerProps) {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to select images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ImagePickerExpo.MediaTypeOptions.Images, // Fixed deprecation warning
        allowsEditing: true,
        aspect: aspectRatio,
        quality: quality,
      });

      if (!result.canceled && result.assets[0]) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePickerExpo.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePickerExpo.launchCameraAsync({
        allowsEditing: true,
        aspect: aspectRatio,
        quality: quality,
      });

      if (!result.canceled && result.assets[0]) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <View style={[styles.container, style]}>
      {value ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: value }} style={styles.selectedImage} />
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={removeImage}
          >
            <X size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.changeButton}
            onPress={showImageOptions}
          >
            <Text style={styles.changeButtonText}>Change Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={showImageOptions}
          disabled={loading}
        >
          <Upload size={24} color="#FFD700" />
          <Text style={styles.pickerText}>
            {loading ? 'Loading...' : placeholder}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
    gap: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#ccc',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  changeButton: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});