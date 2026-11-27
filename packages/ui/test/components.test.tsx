import { describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Avatar, Button, Card, Icon, IconButton, SyncStatus, Text, TextField, ThemeProvider } from '../src';

afterEach(cleanup);
const wrap = (ui: React.ReactNode, preference: 'light' | 'dark' = 'light') =>
  render(<ThemeProvider preference={preference}>{ui}</ThemeProvider>);

describe('Button', () => {
  it('is an accessible button that fires once per tap', () => {
    const onPress = vi.fn();
    wrap(<Button label="Start exchange" onPress={onPress} />);
    const b = screen.getByRole('button', { name: 'Start exchange' });
    fireEvent.click(b);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  it('blocks taps while loading and reports busy', () => {
    const onPress = vi.fn();
    wrap(<Button label="Send" onPress={onPress} loading />);
    const b = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(b);
    expect(onPress).not.toHaveBeenCalled();
    expect(b.getAttribute('aria-busy')).toBe('true');
  });
  it('blocks taps when disabled', () => {
    const onPress = vi.fn();
    wrap(<Button label="Send" onPress={onPress} disabled />);
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('IconButton', () => {
  it('requires and exposes a label', () => {
    wrap(<IconButton icon="close" accessibilityLabel="Close" onPress={() => {}} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });
});

describe('Icon', () => {
  it('is hidden from screen readers when decorative', () => {
    wrap(<Icon name="world" />);
    expect(screen.queryByRole('img')).toBeNull();
  });
  it('is announced when labelled', () => {
    wrap(<Icon name="passport" label="Passport" />);
    expect(screen.getByRole('img', { name: 'Passport' })).toBeTruthy();
  });
  it('uses the tinted version when selected', () => {
    wrap(<Icon name="world" selected />);
    expect(screen.getByTestId('svg').innerHTML).toContain('fill-opacity="0.16"');
  });
  it('takes the theme text colour by default (dark theme)', () => {
    wrap(<Icon name="world" />, 'dark');
    expect(screen.getByTestId('svg').getAttribute('data-color')).toBe('#F7F8FC');
  });
});

describe('Text', () => {
  it('marks headings as headings', () => {
    wrap(<Text variant="heading.screen">Your passport</Text>);
    expect(screen.getByRole('heading', { name: 'Your passport' })).toBeTruthy();
  });
  it('renders body text as plain text', () => {
    wrap(<Text>Hello from Douala</Text>);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('Hello from Douala')).toBeTruthy();
  });
});

describe('TextField', () => {
  it('shows a visible label and an error in words', () => {
    wrap(<TextField label="Display name" error="Please add a name" value="" onChangeText={() => {}} />);
    expect(screen.getByText('Display name')).toBeTruthy();
    expect(screen.getByText('Please add a name')).toBeTruthy();
    expect(screen.getByLabelText('Display name')).toBeTruthy();
  });
});

describe('SyncStatus', () => {
  it('says the status in words with an icon', () => {
    wrap(<SyncStatus state="on-its-way" />);
    const s = screen.getByTestId('sync-on-its-way');
    expect(s.textContent).toContain('Your postcard is on its way');
    expect(s.querySelector('[data-testid="icon-on-its-way"]')).toBeTruthy();
  });
  it('accepts a localised label', () => {
    wrap(<SyncStatus state="delivered" label="Livrée" />);
    expect(screen.getByText('Livrée')).toBeTruthy();
  });
});

describe('Avatar', () => {
  it('shows initials and is named for screen readers', () => {
    wrap(<Avatar name="Amara Nwosu" hue="#20C6B2" />);
    expect(screen.getByRole('img', { name: 'Amara Nwosu' })).toBeTruthy();
    expect(screen.getByText('AN')).toBeTruthy();
  });
});

describe('Card', () => {
  it('renders its children', () => {
    wrap(<Card><Text>Inside</Text></Card>);
    expect(screen.getByText('Inside')).toBeTruthy();
  });
});
