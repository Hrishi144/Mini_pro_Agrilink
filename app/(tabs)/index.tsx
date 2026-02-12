import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import {
  Camera,
  RotateCcw,
  X
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from '../../contexts/AuthContext';
import { createListing } from '../../services/listingService';
import { uploadImages } from '../../services/storageService';

const { width } = Dimensions.get("window");

const MAX_IMAGES = 10;
const MAX_NARRATIVE_LENGTH = 500;

export default function EditorialEntry() {
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);

  const [nomenclature, setNomenclature] = useState("");
  const [classification, setClassification] = useState("");
  const [price, setPrice] = useState("");
  const [narrative, setNarrative] = useState("");
  const [provenanceCertified, setProvenanceCertified] = useState(true);
  const [logisticsProvided, setLogisticsProvided] = useState(false);

  const [publishing, setPublishing] = useState(false);

  const [cameraVisible, setCameraVisible] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const pickImage = async () => {
    // Check image limit
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Limit Reached", `You can only add up to ${MAX_IMAGES} images.`);
      return;
    }

    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant camera roll permissions to add images.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    if (!permission) {
      // Camera permissions are still loading.
      return;
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permission Required", "You need to grant camera permissions to take photos.");
        return;
      }
    }

    setCameraVisible(true);
  };

  const capturePhoto = async () => {
    // Check image limit
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Limit Reached", `You can only add up to ${MAX_IMAGES} images.`);
      setCameraVisible(false);
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      if (photo) {
        setImages([...images, photo.uri]);
        setCameraVisible(false);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = (): string | null => {
    if (!nomenclature.trim()) {
      return 'Nomenclature is required';
    }

    if (images.length === 0) {
      return 'At least one image is required';
    }

    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      return 'Valid price is required (must be >= 0)';
    }

    if (narrative.length > MAX_NARRATIVE_LENGTH) {
      return `Narrative must be ${MAX_NARRATIVE_LENGTH} characters or less`;
    }

    return null;
  };

  const handlePublish = async () => {
    // Check authentication
    if (!user) {
      Alert.alert(
        'Authentication Required',
        'Please log in to publish listings',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => router.push('/auth/login') },
        ]
      );
      return;
    }

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setPublishing(true);

    try {
      // Upload images to storage
      const imageUrls = await uploadImages(images, user.id);

      // Create listing in database
      await createListing({
        user_id: user.id,
        nomenclature: nomenclature.trim(),
        classification: classification.trim() || undefined,
        price: Number(price),
        narrative: narrative.trim() || undefined,
        image_urls: imageUrls,
        provenance_certified: provenanceCertified,
        logistics_provided: logisticsProvided,
      });

      // Success!
      Alert.alert('Success', 'Listing published successfully!');

      // Clear form
      setImages([]);
      setNomenclature('');
      setClassification('');
      setPrice('');
      setNarrative('');
      setProvenanceCertified(true);
      setLogisticsProvided(false);
    } catch (error: any) {
      console.error('Error publishing listing:', error);
      Alert.alert('Error', error.message || 'Failed to publish listing');
    } finally {
      setPublishing(false);
    }
  };

  if (cameraVisible) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraBtn} onPress={() => setCameraVisible(false)}>
              <X size={32} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cameraBtn} onPress={toggleCameraFacing}>
              <RotateCcw size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EDITORIAL ENTRY</Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* VISUAL DOCS */}
        <Text style={styles.sectionLabel}>VISUAL DOCUMENTATION</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageCard}>
              <Image source={{ uri: img }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeImage(index)}
              >
                <X size={12} color="#000" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addCard} onPress={pickImage}>
            <Camera size={26} color="#777" />
            <Text style={styles.addText}>ADD VIEW</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* INPUTS */}
        <AnimatedInput
          style={styles.inputXL}
          placeholder="Item nomenclature"
          value={nomenclature}
          onChangeText={setNomenclature}
        />

        <AnimatedInput
          style={styles.inputXL}
          placeholder="Classification"
          value={classification}
          onChangeText={setClassification}
        />

        <View style={styles.priceRow}>
          <Text style={styles.currency}>₹</Text>
          <AnimatedInput
            style={styles.inputXL}
            keyboardType="numeric"
            value={price}
            onChangeText={(text: string) => {
              // Only allow numbers
              const numericValue = text.replace(/[^0-9]/g, '');
              setPrice(numericValue);
            }}
          />
        </View>

        <AnimatedInput
          style={styles.textArea}
          multiline
          placeholder="Narrative & origin..."
          value={narrative}
          onChangeText={setNarrative}
        />

        {/* TOGGLES */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>PROVENANCE CERTIFIED</Text>
          <TouchableOpacity
            style={provenanceCertified ? styles.toggleOn : styles.toggleOff}
            onPress={() => setProvenanceCertified(!provenanceCertified)}
          >
            <View style={provenanceCertified ? styles.toggleKnobOn : styles.toggleKnobOff} />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>LOGISTICS PROVIDED</Text>
          <TouchableOpacity
            style={logisticsProvided ? styles.toggleOn : styles.toggleOff}
            onPress={() => setLogisticsProvided(!logisticsProvided)}
          >
            <View style={logisticsProvided ? styles.toggleKnobOn : styles.toggleKnobOff} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FLOATING CAMERA */}
      <TouchableOpacity style={styles.fab} onPress={takePhoto}>
        <Camera size={28} color="#000" />
        <View style={styles.plusBadge}>
          <Text style={styles.plusText}>+</Text>
        </View>
      </TouchableOpacity>

      {/* PUBLISH BUTTON - Now fixed at bottom */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.publishBtn, publishing && styles.publishBtnDisabled]}
          onPress={handlePublish}
          disabled={publishing}
        >
          {publishing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.publishText}>PUBLISH LISTING</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Animated Input Component
const AnimatedInput = ({
  style,
  ...props
}: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const borderWidthAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(borderColorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderWidthAnim, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(borderColorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderWidthAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000', '#96D5B4'],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Animated.View style={{ borderBottomWidth: borderWidthAnim, borderColor }}>
        <TextInput
          {...props}
          style={[style, { borderBottomWidth: 0, outline: 'none' } as any]}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 10,
    letterSpacing: 4,
    fontWeight: "700",
  },

  content: {
    padding: 24,
    paddingBottom: 180, // Space for publish button + tab bar
    gap: 24,
  },

  sectionLabel: {
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "700",
  },

  imageCard: {
    width: 160,
    height: 220,
    marginRight: 16,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
  },

  addCard: {
    width: 160,
    height: 220,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  addText: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#777",
  },

  inputXL: {
    fontSize: 28,
    fontWeight: "300",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 12,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  currency: {
    fontSize: 28,
  },

  textArea: {
    fontSize: 22,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 12,
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },

  toggleLabel: {
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "700",
  },

  toggleOn: {
    width: 44,
    height: 22,
    backgroundColor: "#96D5B4",
    borderRadius: 11,
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  toggleKnobOn: {
    width: 16,
    height: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignSelf: "flex-end",
  },

  toggleOff: {
    width: 44,
    height: 22,
    backgroundColor: "#ddd",
    borderRadius: 11,
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  toggleKnobOff: {
    width: 16,
    height: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },

  fab: {
    position: "absolute",
    right: 24,
    top: 70,
    width: 64,
    height: 64,
    backgroundColor: "#96D5B4",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  camera: {
    flex: 1,
  },

  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  cameraBtn: {
    padding: 10,
  },

  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },

  plusBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#000",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  plusText: { color: "#fff", fontSize: 12 },

  bottom: {
    position: "absolute",
    bottom: 0, // Right above navbar
    left: 0,
    right: 0,
    backgroundColor: "#000",
    paddingBottom: 0,
  },

  publishBtn: {
    backgroundColor: "#96D5B4",
    margin: 16,
    paddingVertical: 18,
  },

  publishBtnDisabled: {
    opacity: 0.6,
  },

  publishText: {
    textAlign: "center",
    fontSize: 10,
    letterSpacing: 4,
    fontWeight: "700",
  },
});
