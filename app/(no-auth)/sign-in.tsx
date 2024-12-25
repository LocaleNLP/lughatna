import React from 'react';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/common/view';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/common/typography';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/theme/useTheme';
import FormField from '@/components/common/form-field';
import { ICON_SIZE } from '@/constants/AppConstants';
import { useAuth } from '@/context/SupabaseProvider';
import { useRouter } from 'expo-router';
import Button from '@/components/common/buttons/button';
import PressableOpacity from '@/components/common/buttons/pressable-opacity';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AuthButton from '@/components/common/buttons/auth';
import { authStyles } from '@/constants/AuthStyles';

interface SignInFormInputs extends FieldValues {
  email: string;
  password: string;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

const SignIn = () => {
  const { mode } = useTheme();
  const { t } = useTranslation();
  const {
    signIn,
    isLoading,
    signInWithGoogle,
    signInWithApple,
    showPassword,
    handleShowPassword,
  } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await signIn(data.email, data.password);
    reset();
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollViewContent}
        style={{ backgroundColor: Colors[mode].background }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={authStyles.imageTitleContainer}>
          <AnimatedImage
            entering={FadeInDown.delay(200)}
            source={require('@/assets/images/logo.png')}
            style={authStyles.logo}
          />

          <ThemedText type="title" style={authStyles.title}>
            {t('auth.signIn')}
          </ThemedText>
        </ThemedView>

        <ThemedView style={authStyles.viewContainer}>
          <Animated.View entering={FadeInDown.delay(250)}>
            <FormField<SignInFormInputs>
              name="email"
              control={control}
              placeholder={t('auth.emailPlaceholder')}
              keyboardType="email-address"
              rightIcon={
                <Ionicons
                  name="mail-outline"
                  size={ICON_SIZE.sm}
                  color={Colors[mode].placeholderColor}
                />
              }
              rules={{
                required: t('auth.emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('auth.invalidEmail'),
                },
              }}
              containerStyle={authStyles.input}
              error={errors.email?.message}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            <FormField<SignInFormInputs>
              name="password"
              control={control}
              placeholder={t('auth.passwordPlaceholder')}
              secureTextEntry={!showPassword}
              rules={{
                required: t('auth.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('auth.passwordMinLength'),
                },
              }}
              containerStyle={authStyles.input}
              error={errors.password?.message}
              rightIcon={
                <PressableOpacity onPress={handleShowPassword}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={ICON_SIZE.sm}
                    color={Colors[mode].placeholderColor}
                  />
                </PressableOpacity>
              }
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(350)}
            style={authStyles.forgotPassword}
          >
            <PressableOpacity
              onPress={() => {
                router.push('/forgot-password');
              }}
              disabled={isLoading}
            >
              <ThemedText
                type="link"
                lightColor={Colors.light.primary}
                darkColor={Colors.dark.primary}
                style={authStyles.linkText}
              >
                {t('auth.forgotPassword')}
              </ThemedText>
            </PressableOpacity>
          </Animated.View>

          <ThemedView style={authStyles.buttonWrapper}>
            <Animated.View entering={FadeInDown.delay(400)}>
              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                bgColor={Colors[mode].primary}
                loading={isLoading}
              >
                <ThemedText
                  type="title"
                  lightColor={Colors.light.text}
                  darkColor={Colors.light.text}
                  style={authStyles.buttonText}
                >
                  {t('auth.signIn')}
                </ThemedText>
              </Button>
            </Animated.View>
          </ThemedView>

          <Animated.View entering={FadeInDown.delay(450)}>
            <ThemedText style={authStyles.orText}>{t('auth.or')}</ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500)}>
            <AuthButton
              onPress={signInWithGoogle}
              icon="logo-google"
              text={t('auth.continueWithGoogle')}
              disabled={isLoading}
              loading={isLoading}
            />
          </Animated.View>

          {Platform.OS === 'ios' && (
            <Animated.View entering={FadeInDown.delay(550)}>
              <AuthButton
                onPress={signInWithApple}
                icon="logo-apple"
                text={t('auth.continueWithApple')}
                disabled={isLoading}
                loading={isLoading}
              />
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.delay(600)}
            style={authStyles.bottomText}
          >
            <PressableOpacity
              onPress={() => {
                router.push('/(no-auth)/sign-up-with-email');
              }}
              disabled={isLoading}
            >
              <ThemedText style={authStyles.linkText}>
                {t('auth.dontHaveAccount')}
              </ThemedText>
              <ThemedText
                type="link"
                lightColor={Colors.light.primary}
                darkColor={Colors.dark.primary}
                style={authStyles.linkText}
              >
                {t('auth.signUp')}
              </ThemedText>
            </PressableOpacity>
          </Animated.View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
