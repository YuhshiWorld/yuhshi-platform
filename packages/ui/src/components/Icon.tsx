import { I18nManager, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { iconSize } from '@yuhshi/tokens';
import { icons, iconSvg, type IconName } from '@yuhshi/icons';
import { useTheme } from '../theme';

export type { IconName };

export interface IconProps {
  name: IconName;
  /** Size in px/dp; default 24. */
  size?: number;
  color?: string;
  /** Tab-bar selected state: the tinted version. */
  selected?: boolean;
  /**
   * Give a label only when the icon carries meaning on its own.
   * Without a label the icon is decorative and hidden from screen readers.
   */
  label?: string;
}

/** The wrapper View carries accessibility, so the inner SVG's own title and role are removed. */
function plainXml(xml: string): string {
  return xml.replace(/ role="img" aria-label="[^"]*"/, '').replace(/<title>[^<]*<\/title>/, '');
}

export function Icon({ name, size = iconSize.md, color, selected = false, label }: IconProps) {
  const { colors } = useTheme();
  const mirror = icons[name].mirrorInRtl && I18nManager.isRTL;
  const decorative = !label;
  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={label}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      accessibilityElementsHidden={decorative}
      aria-hidden={decorative}
      style={{ width: size, height: size, transform: mirror ? [{ scaleX: -1 }] : undefined }}
      testID={`icon-${name}`}
    >
      <SvgXml xml={plainXml(iconSvg(name, selected))} width={size} height={size} color={color ?? colors.text.primary} />
    </View>
  );
}
