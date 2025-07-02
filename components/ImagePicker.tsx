import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Camera, Upload, X } from 'lucide-react-native';
import * as ImagePickerExpo from 'expo-image-picker';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

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
  const convex = useConvex();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const requestPermissions = async () => {
    const { status } = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow media permissions.');
      return false;
    }
    return true;
  };


  const uploadToConvex = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadUrl = await generateUploadUrl();

      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        body: blob,
        headers: { 'Content-Type': blob.type },
      });

      const { storageId } = await uploadRes.json();

      // ✅ Correct query usage
      const fileUrl = await convex.query(api.files.getFileUrl, { storageId });

      return fileUrl;
    } catch (err) {
      console.error('Upload failed:', err);
      Alert.alert('Upload failed', 'Could not upload image');
      return null;
    }
  };

  const handlePick = async (fromCamera: boolean) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = fromCamera
        ? await ImagePickerExpo.launchCameraAsync({ allowsEditing: true, aspect: aspectRatio, quality })
        : await ImagePickerExpo.launchImageLibraryAsync({ mediaTypes: ImagePickerExpo.MediaTypeOptions.Images, allowsEditing: true, aspect: aspectRatio, quality });

      if (!result.canceled && result.assets[0]) {
        const localUri = result.assets[0].uri;
        const uploadedUrl = await uploadToConvex(localUri);
        if (uploadedUrl) {
          onImageChange(uploadedUrl); // Save the public URL
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Select Image', 'Choose how to add an image', [
      { text: 'Camera', onPress: () => handlePick(true) },
      { text: 'Gallery', onPress: () => handlePick(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <View style={[styles.container, style]}>
      {value ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: value }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <X size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.changeButton} onPress={showImageOptions}>
            <Text style={styles.changeButtonText}>Change Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.pickerButton} onPress={showImageOptions} disabled={loading}>
          <Upload size={24} color="#FFD700" />
          <Text style={styles.pickerText}>{loading ? 'Uploading...' : placeholder}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
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
  pickerText: { fontSize: 16, color: '#ccc' },
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
