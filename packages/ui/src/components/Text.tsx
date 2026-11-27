import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { typography, type TypographyToken } from '@yuhshi/tokens';
import { useTheme } from '../theme';
import { fontFamilyFor } from '../fonts';
import { maxFontSizeMultiplier } from '../logic';

export type TextTone = 'primary' | 'secondary' | 'muted' | 'link';

export interface TextProps extends RNTextProps {
  /** Semantic typography token (Font Blueprint §15.5). */
  variant?: TypographyToken;
  tone?: TextTone;
  /** Override colour with a semantic role colour, e.g. theme.colors.connection.text. */
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center';
}

const headingVariants: TypographyToken[] = ['display.hero', 'heading.screen', 'heading.section', 'heading.card'];

export function Text({ variant = 'body.primary', tone = 'primary', color, align = 'auto', style, ...rest }: TextProps) {
  const { colors } = useTheme();
  const t = typography[variant];
  const base: TextStyle = {
    fontFamily: fontFamilyFor(t.fontWeight),
    fontWeight: String(t.fontWeight) as TextStyle['fontWeight'],
    fontSize: t.fontSize,
    lineHeight: Math.round(t.fontSize * t.lineHeight),
    color: color ?? colors.text[tone],
    textAlign: align,
    // 'auto' alignment follows the script direction, so RTL text aligns right on its own.
    writingDirection: 'auto',
    ...('tabularNums' in t && t.tabularNums ? { fontVariant: ['tabular-nums'] as TextStyle['fontVariant'] } : {}),
  };
  return (
    <RNText
      accessibilityRole={headingVariants.includes(variant) ? 'header' : undefined}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[base, style]}
      {...rest}
    />
  );
}
