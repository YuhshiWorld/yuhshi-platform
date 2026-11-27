import type { Weight } from '@yuhshi/tokens';

/**
 * Figtree font family names as registered by @expo-google-fonts/figtree.
 * Native platforms need one family per weight; web uses the CSS stack with fontWeight.
 * Non-Latin scripts fall back to the system's Noto fonts automatically (Font Blueprint §15.4).
 */
export const figtreeFamilies: Record<Weight, string> = {
  400: 'Figtree_400Regular',
  500: 'Figtree_500Medium',
  600: 'Figtree_600SemiBold',
  700: 'Figtree_700Bold',
  800: 'Figtree_800ExtraBold',
};

export function fontFamilyFor(weight: Weight): string {
  return figtreeFamilies[weight];
}
