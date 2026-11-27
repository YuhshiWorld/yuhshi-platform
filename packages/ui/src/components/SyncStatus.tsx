import { View } from 'react-native';
import { space } from '@yuhshi/tokens';
import { useTheme } from '../theme';
import { syncSpecs, toneTextColor, type SyncState } from '../logic';
import { Text } from './Text';
import { Icon } from './Icon';

export interface SyncStatusProps {
  state: SyncState;
  /** Localised label; defaults to the English postcard wording. */
  label?: string;
}

/**
 * Honest sync status (Blueprint §12.12, E7): icon + words, never colour alone.
 * Nothing shows as Delivered until the server confirms it.
 */
export function SyncStatus({ state, label }: SyncStatusProps) {
  const { colors } = useTheme();
  const spec = syncSpecs[state];
  const color = toneTextColor(colors, spec.tone);
  const text = label ?? spec.label;
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={text}
      accessibilityLiveRegion="polite"
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}
      testID={`sync-${state}`}
    >
      <Icon name={spec.icon} size={16} color={color} />
      <Text variant="meta.timestamp" color={color}>{text}</Text>
    </View>
  );
}
