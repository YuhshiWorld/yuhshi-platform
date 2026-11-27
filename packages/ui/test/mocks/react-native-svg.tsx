// Test stand-in for react-native-svg: renders the icon markup at the requested size and colour,
// as the real SvgXml does, so tests and the preview gallery can inspect it.
export function SvgXml({ xml, color, width, height }: { xml: string; color?: string; width?: number; height?: number }) {
  const sized = xml.replace('width="24" height="24"', `width="${width ?? 24}" height="${height ?? 24}"`);
  return (
    <span
      data-testid="svg"
      data-color={color}
      data-width={width}
      data-height={height}
      style={{ display: 'flex', color, width, height }}
      dangerouslySetInnerHTML={{ __html: sized }}
    />
  );
}
