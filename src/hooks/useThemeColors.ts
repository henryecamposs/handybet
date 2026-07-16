import { useColorScheme } from 'nativewind';

/**
 * Paleta de colores Light de global.css
 */
export const lightColors = {
  background: 'oklch(0.843 0.086 24.866)',
  foreground: 'oklch(0.147 0.031 29.034)',
  muted: 'oklch(0.657 0.229 29.729)',
  mutedForeground: 'oklch(0.223 0.025 147.449)',
  popover: 'oklch(0.973 0.007 23.656)',
  popoverForeground: 'oklch(0.134 0.026 29.44)',
  card: 'oklch(0.935 0.029 23.913)',
  cardForeground: 'oklch(0.134 0.026 29.44)',
  border: 'oklch(0.277 0.083 29.660)',
  input: 'oklch(0.927 0.007 23.654)',
  primary: 'oklch(0.657 0.229 29.729)',
  primaryLight: 'oklch(0.857 0.229 29.729)',
  primaryDark: 'oklch(0.457 0.229 29.729)',
  primaryForeground: 'oklch(1 0 180)',
  secondary: 'oklch(0.872 0.274 143.533)',
  secondaryLight: 'oklch(0.95 0.274 143.533)',
  secondaryDark: 'oklch(0.65 0.274 143.533)',
  secondaryForeground: 'oklch(0 0 0)',
  backgroundDark: 'oklch(0.743 0.086 24.866)',
  accent: 'oklch(0.498 0.283 272.767)',
  accentForeground: 'oklch(0.987 0.007 290.118)',
  destructive: 'oklch(0.565 0.159 43.872)',
  destructiveForeground: 'oklch(1 0 180)',
  ring: 'oklch(0.657 0.229 29.729)',
};

/**
 * Paleta de colores Dark de global.css
 */
export const darkColors = {
  background: 'oklch(13.948% 0.02893 34.084)',
  foreground: 'oklch(0.991 0.002 23.598)',
  muted: 'oklch(0.241 0.014 24.265)',
  mutedForeground: 'oklch(0.378 0.022 147.75)',
  popover: 'oklch(16.237% 0.03684 29.4)',
  popoverForeground: 'oklch(1 0 180)',
  card: 'oklch(16.237% 0.03684 29.4)',
  cardForeground: 'oklch(1 0 180)',
  border: 'oklch(0.277 0.083 29.660)',
  input: 'oklch(0.241 0.014 24.265)',
  primary: 'oklch(0.657 0.229 29.729)',
  primaryLight: 'oklch(0.857 0.229 29.729)',
  primaryDark: 'oklch(0.457 0.229 29.729)',
  primaryForeground: 'oklch(1 0 180)',
  secondary: 'oklch(0.872 0.274 143.533)',
  secondaryLight: 'oklch(0.95 0.274 143.533)',
  secondaryDark: 'oklch(0.65 0.274 143.533)',
  secondaryForeground: 'oklch(0 0 0)',
  backgroundDark: 'oklch(0.08 0.02893 34.084)',
  accent: 'oklch(0.403 0.273 266.181)',
  accentForeground: 'oklch(0.987 0.007 290.118)',
  destructive: 'oklch(0.611 0.244 13.521)',
  destructiveForeground: 'oklch(1 0 180)',
  ring: 'oklch(0.657 0.229 29.729)',
};

/**
 * Hook para acceder a la paleta de colores activa (Light o Dark)
 * basado en la configuración actual de NativeWind.
 * 
 * Uso:
 * const colors = useThemeColors();
 * <ActivityIndicator color={colors.primary} />
 */
export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return isDark ? darkColors : lightColors;
}

/**
 * Función utilitaria para aplicar opacidad a un color devuelto por useThemeColors
 * 
 * Uso:
 * const colors = useThemeColors();
 * <Icon color={withOpacity(colors.primary, 0.2)} />
 */
export function withOpacity(colorString: string, opacity: number) {
  if (colorString.startsWith('oklch(')) {
    return colorString.replace(')', ` / ${opacity})`);
  }
  return colorString;
}
