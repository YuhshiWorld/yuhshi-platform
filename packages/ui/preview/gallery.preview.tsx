// Renders the component gallery to preview/gallery.html (light + dark) for visual review.
// Run: npx vitest run --config preview/vitest.config.ts
import { it } from 'vitest';
import { render } from '@testing-library/react';
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { View } from 'react-native';
import { space, darkTheme, lightTheme } from '@yuhshi/tokens';
import { Avatar, Button, Card, Icon, IconButton, SyncStatus, Text, TextField, ThemeProvider, useTheme } from '../src';

const require = createRequire(import.meta.url);
const fontDir = dirname(require.resolve('@expo-google-fonts/figtree/package.json'));
const faces = ['400Regular', '500Medium', '600SemiBold', '700Bold', '800ExtraBold']
  .map((w) => `@font-face{font-family:'Figtree_${w}';src:url('file://${join(fontDir, w, `Figtree_${w}.ttf`)}')}`)
  .join('');

function Panel() {
  const { colors, scheme } = useTheme();
  return (
    <View style={{ backgroundColor: colors.background.secondary, padding: space.xxl, gap: space.xl, width: 420 }}>
      <Text variant="meta.footnote" tone="secondary">{scheme === 'dark' ? 'DARK' : 'LIGHT'}</Text>
      <Text variant="heading.screen">Collect the world</Text>
      <Text tone="secondary">Share one small thing from your world. Discover one from theirs.</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
        <Button label="Start exchange" icon="exchange" onPress={() => {}} />
        <Button label="Join" variant="connection" onPress={() => {}} />
        <Button label="Later" variant="secondary" onPress={() => {}} />
        <Button label="Skip" variant="ghost" size="sm" onPress={() => {}} />
        <Button label="Leave exchange" variant="destructive" icon="leave" size="sm" onPress={() => {}} />
        <Button label="Sending" loading onPress={() => {}} />
      </View>
      <Card>
        <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
          <Avatar name="Amara Nwosu" hue="#20C6B2" />
          <View style={{ flex: 1, gap: space.xxs }}>
            <Text variant="heading.card">Amara · Lagos</Text>
            <Text variant="body.secondary" tone="secondary">Taught you “ndewo”: hello in Igbo</Text>
          </View>
          <IconButton icon="more" accessibilityLabel="More options" onPress={() => {}} />
        </View>
        <View style={{ marginTop: space.md, gap: space.xs }}>
          <SyncStatus state="saved-locally" />
          <SyncStatus state="on-its-way" />
          <SyncStatus state="delivered" />
          <SyncStatus state="failed" />
        </View>
      </Card>
      <TextField label="Display name" value="Kofi" onChangeText={() => {}} hint="Shown to people you exchange with" />
      <TextField label="One word from your world" value="" onChangeText={() => {}} error="Add a word to continue" />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.background.card, paddingVertical: space.sm, borderRadius: 16 }}>
        <Icon name="world" selected color={colors.brand.text} />
        <Icon name="discover" />
        <Icon name="yuhshi" />
        <Icon name="phrasebook" />
        <Icon name="profile" />
      </View>
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <Avatar name="Mei Tanaka" hue="#FF705E" size={32} />
        <Avatar name="Leïla Benali" hue="#F5B942" size={32} />
        <Avatar name="Diego Ruiz" hue="#4389F5" size={32} />
        <Avatar name="Ana" hue="#5141D7" size={32} />
      </View>
    </View>
  );
}

it('renders the gallery', () => {
  const { container } = render(
    <View style={{ flexDirection: 'row' }}>
      <ThemeProvider preference="light"><Panel /></ThemeProvider>
      <ThemeProvider preference="dark"><Panel /></ThemeProvider>
    </View>,
  );
  // react-native-web inserts its rules through the CSSOM, so read them from the style sheets.
  const rules = Array.from(document.styleSheets).flatMap((sh) => Array.from(sh.cssRules).map((r) => r.cssText)).join('\n');
  const styles = `<style>${rules}</style>`;
  writeFileSync(
    join(process.cwd(), 'preview', 'gallery.html'),
    `<!doctype html><html><head><meta charset="utf-8"><style>${faces} body{margin:0}</style>${styles}</head><body>${container.innerHTML}</body></html>`,
  );
  void lightTheme; void darkTheme;
});
