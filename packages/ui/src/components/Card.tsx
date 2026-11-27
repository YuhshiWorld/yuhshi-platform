import { View, type ViewProps } from 'react-native';
import { borderWidth, radius, space } from '@yuhshi/tokens';
import { useTheme } from '../theme';

export interface CardProps extends ViewProps {
  /** Padding from the spacing scale; default lg (16). */
  padding?: 'md' | 'lg' | 'xxl';
}

/** Neutral surface. Cards stay neutral: colour is reserved for meaning (Color Blueprint §16.12). */
export function Card({ padding = 'lg', style, ...rest }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.background.card,
          borderColor: colors.border.subtle,
          borderWidth: borderWidth.hairline,
          borderRadius: radius.lg,
          padding: space[padding],
        },
        style,
      ]}
      {...rest}
    />
  );
}
