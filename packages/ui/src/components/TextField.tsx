import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { borderWidth, radius, space, touchTarget, typography } from '@yuhshi/tokens';
import { useTheme } from '../theme';
import { fontFamilyFor } from '../fonts';
import { maxFontSizeMultiplier } from '../logic';
import { Text } from './Text';
import { Icon } from './Icon';

export interface TextFieldProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  /** Visible label, always shown (placeholders are not labels). */
  label: string;
  hint?: string;
  /** Error message: shown with an icon and text, never colour alone. */
  error?: string;
}

export function TextField({ label, hint, error, onFocus, onBlur, ...rest }: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const t = typography['body.primary'];
  const borderColor = error ? colors.state.error.text : focused ? colors.brand.text : colors.border.control;
  const describedBy = error ?? hint;
  return (
    <View style={{ gap: space.xs }}>
      <Text variant="label.control" tone="primary">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={describedBy}
        aria-invalid={error ? true : undefined}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        placeholderTextColor={colors.text.muted}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        style={{
          minHeight: touchTarget.comfortable,
          paddingHorizontal: space.md,
          paddingVertical: space.sm,
          borderRadius: radius.md,
          borderWidth: focused || error ? borderWidth.focus : borderWidth.control,
          borderColor,
          backgroundColor: colors.background.card,
          color: colors.text.primary,
          fontFamily: fontFamilyFor(t.fontWeight),
          fontSize: t.fontSize,
          writingDirection: 'auto',
        }}
        {...rest}
      />
      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }} accessibilityLiveRegion="polite" accessible>
          <Icon name="failed" size={16} color={colors.state.error.text} />
          <Text variant="meta.footnote" color={colors.state.error.text}>{error}</Text>
        </View>
      ) : hint ? (
        <Text variant="meta.footnote" tone="secondary">{hint}</Text>
      ) : null}
    </View>
  );
}
