import { Pressable } from 'react-native';
import { radius, touchTarget } from '@yuhshi/tokens';
import { useTheme } from '../theme';
import { Icon, type IconName } from './Icon';

export interface IconButtonProps {
  icon: IconName;
  /** Required: an icon-only button must say what it does to screen-reader users. */
  accessibilityLabel: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  selected?: boolean;
  testID?: string;
}

export function IconButton({ icon, accessibilityLabel, onPress, color, disabled = false, selected = false, testID }: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
      aria-disabled={disabled}
      aria-selected={selected}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => ({
        width: touchTarget.min,
        height: touchTarget.min,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? colors.background.secondary : 'transparent',
        opacity: disabled ? 0.45 : 1,
      })}
    >
      <Icon name={icon} color={color ?? (selected ? colors.brand.text : colors.text.primary)} selected={selected} />
    </Pressable>
  );
}
