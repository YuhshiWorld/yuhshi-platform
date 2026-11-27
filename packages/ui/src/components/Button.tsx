import { ActivityIndicator, Pressable, View } from 'react-native';
import { borderWidth, radius, space } from '@yuhshi/tokens';
import { useTheme } from '../theme';
import { buttonColors, buttonHeight, type ButtonSize, type ButtonVariant } from '../logic';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  disabled?: boolean;
  /** Shows a spinner, keeps the label for screen readers and blocks repeat taps. */
  loading?: boolean;
  fullWidth?: boolean;
  /** Extra screen-reader context, e.g. what happens after the tap. */
  accessibilityHint?: string;
  testID?: string;
}

export function Button({
  label, onPress, variant = 'primary', size = 'md', icon, disabled = false, loading = false,
  fullWidth = false, accessibilityHint, testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const c = buttonColors(colors, variant);
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      aria-busy={loading}
      aria-disabled={inactive}
      disabled={inactive}
      onPress={onPress}
      testID={testID}
      hitSlop={size === 'sm' ? 4 : 0}
      style={({ pressed }) => ({
        minHeight: buttonHeight[size],
        paddingHorizontal: size === 'md' ? space.xl : space.lg,
        borderRadius: radius.full,
        borderWidth: variant === 'secondary' ? borderWidth.control : 0,
        borderColor: c.border,
        backgroundColor: c.background,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: space.sm,
        opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
        transform: pressed && !inactive ? [{ scale: 0.98 }] : undefined,
      })}
    >
      {loading ? (
        <ActivityIndicator color={c.text} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
      ) : icon ? (
        <Icon name={icon} size={20} color={c.text} />
      ) : null}
      <View>
        <Text variant={size === 'md' ? 'label.button' : 'label.buttonSmall'} color={c.text} numberOfLines={2}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
