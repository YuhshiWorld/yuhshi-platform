import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type ColorTheme } from '@yuhshi/tokens';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface YuhshiTheme {
  colors: ColorTheme;
  scheme: 'light' | 'dark';
}

const ThemeContext = createContext<YuhshiTheme>({ colors: lightTheme, scheme: 'light' });

export function resolveScheme(preference: ThemePreference, system: string | null | undefined): 'light' | 'dark' {
  if (preference !== 'system') return preference;
  return system === 'dark' ? 'dark' : 'light';
}

export interface ThemeProviderProps {
  /** Follows the device by default; users can force light or dark in settings. */
  preference?: ThemePreference;
  children: ReactNode;
}

export function ThemeProvider({ preference = 'system', children }: ThemeProviderProps) {
  const system = useColorScheme();
  const scheme = resolveScheme(preference, system);
  const value = useMemo<YuhshiTheme>(
    () => ({ scheme, colors: scheme === 'dark' ? darkTheme : lightTheme }),
    [scheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): YuhshiTheme {
  return useContext(ThemeContext);
}
