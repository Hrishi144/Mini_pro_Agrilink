import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../../services/supabase';

export default function SignupScreen() {
    const [fullName, setFullName] = useState('');
    const [farmName, setFarmName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!fullName || !farmName || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!agreedToTerms) {
            Alert.alert('Error', 'Please agree to the terms of cultivation');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: fullName.trim(),
                        farm_name: farmName.trim(),
                    },
                    emailRedirectTo: undefined, // Disable email confirmation redirect
                },
            });

            if (error) {
                Alert.alert('Signup Failed', error.message);
            } else {
                // Check if email confirmation is required
                const confirmationRequired = data.user && !data.session;

                if (confirmationRequired) {
                    // Email confirmation is enabled in Supabase
                    Alert.alert(
                        'Confirmation Required',
                        'Please check your email to confirm your account before logging in.',
                        [
                            {
                                text: 'OK',
                                onPress: () => router.replace('/auth/login'),
                            },
                        ]
                    );
                } else {
                    // Email confirmation is disabled or user is auto-logged in
                    Alert.alert('Success', 'Account created! You can now log in.', [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/auth/login'),
                        },
                    ]);
                }
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>JOIN THE{'\n'}ECOSYSTEM</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>FULL NAME</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ENTER NAME"
                        placeholderTextColor="#ccc"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                    />
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>FARM NAME</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ESTATE NAME"
                        placeholderTextColor="#ccc"
                        value={farmName}
                        onChangeText={setFarmName}
                        autoCapitalize="words"
                    />
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>EMAIL</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="EMAIL@EXAMPLE.COM"
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>SET PASSWORD</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#ccc"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {/* Terms Checkbox */}
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setAgreedToTerms(!agreedToTerms)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                        {agreedToTerms && <View style={styles.checkmark} />}
                    </View>
                    <Text style={styles.checkboxLabel}>I AGREE TO THE TERMS OF CULTIVATION</Text>
                </TouchableOpacity>

                {/* Create Account Button */}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSignup}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                    )}
                </TouchableOpacity>

                {/* Login Link */}
                <TouchableOpacity onPress={() => router.back()} style={styles.linkContainer}>
                    <Text style={styles.linkText}>
                        ALREADY PART OF THE NETWORK?{' '}
                        <Text style={styles.linkBold}>LOG IN</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#96D5B4',
        paddingTop: 80,
        paddingBottom: 60,
        paddingHorizontal: 40,
    },
    headerTitle: {
        fontSize: 48,
        fontWeight: '900',
        color: '#000',
        letterSpacing: -1,
        lineHeight: 52,
    },
    form: {
        flex: 1,
        paddingHorizontal: 40,
        paddingTop: 40,
        paddingBottom: 24,
    },
    fieldGroup: {
        marginBottom: 32,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#000',
        marginBottom: 8,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingVertical: 12,
        fontSize: 16,
        color: '#000',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#000',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#000',
    },
    checkmark: {
        width: 10,
        height: 10,
        backgroundColor: '#96D5B4',
    },
    checkboxLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        color: '#000',
        flex: 1,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 20,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 2,
    },
    linkContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 12,
        color: '#999',
        letterSpacing: 0.5,
    },
    linkBold: {
        color: '#000',
        fontWeight: '700',
    },
});
