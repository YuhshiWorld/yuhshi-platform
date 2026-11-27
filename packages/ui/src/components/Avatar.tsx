import { View } from 'react-native';
import { brand, radius } from '@yuhshi/tokens';
import { initials, onHue } from '../logic';
import { Text } from './Text';

export interface AvatarProps {
  name: string;
  /** The person's personal hue (E2). Defaults to Spirit indigo. */
  hue?: string;
  size?: 32 | 40 | 56 | 72;
}

const variantFor = { 32: 'meta.timestamp', 40: 'label.control', 56: 'heading.card', 72: 'heading.section' } as const;

/** Initials on the person's own hue; text colour chosen for contrast. No ranks, badges or counts. */
export function Avatar({ name, hue = brand.spirit, size = 40 }: AvatarProps) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={name}
      style={{ width: size, height: size, borderRadius: radius.full, backgroundColor: hue, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text variant={variantFor[size]} color={onHue(hue)} accessibilityElementsHidden importantForAccessibility="no" maxFontSizeMultiplier={1}>
        {initials(name)}
      </Text>
    </View>
  );
}
