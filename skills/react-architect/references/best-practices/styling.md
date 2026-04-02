# Styling Best Practices

## Mandatory: styled-components

**NEVER use `StyleSheet.create()` or inline styles.** All styling must use `styled-components/native`.

## File Organization

```
component-name/
  index.tsx       # Component logic
  styles.ts       # styled-components ONLY
  types.ts        # Interfaces, types (optional)
```

## Basic Usage

```typescript
// styles.ts
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Button = styled.TouchableOpacity`
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
`;

// index.tsx
import { Container, Title, Button } from './styles';

const MyComponent: React.FC = () => {
  return (
    <Container>
      <Title>Hello World</Title>
      <Button>
        <Text>Press Me</Text>
      </Button>
    </Container>
  );
};
```

## Theme Access

```typescript
import { useTheme } from 'styled-components/native';
import { AppThemeProps } from '@theme/types';

const MyComponent: React.FC = () => {
  const theme: AppThemeProps = useTheme();

  return (
    <Container>
      <Text style={{ color: theme.colors.primary }}>
        Use theme for dynamic values
      </Text>
    </Container>
  );
};
```

## Props-Based Styling

```typescript
// styles.ts
interface ButtonWrapperProps {
  disabled?: boolean;
  size?: 'small' | 'large';
}

export const ButtonWrapper = styled.TouchableOpacity<ButtonWrapperProps>`
  padding: ${({ size }) => (size === 'small' ? '8px' : '16px')};
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.disabled : theme.colors.primary};
  border-radius: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

// index.tsx
<ButtonWrapper disabled={!isValid} size="large">
  <ButtonText>Submit</ButtonText>
</ButtonWrapper>
```

## Conditional Styling

```typescript
// ✅ GOOD - Use props
export const Card = styled.View<{ active: boolean }>`
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.background};
`;

// ❌ BAD - Inline styles
<View style={{ backgroundColor: active ? 'blue' : 'white' }} />
```

## Avoid Variant Props

```typescript
// ❌ BAD - Generic variant prop
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
}

// ✅ GOOD - Specific props
interface ButtonProps {
  isPrimary?: boolean;
  isDanger?: boolean;
}

export const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({ theme, isPrimary, isDanger }) => {
    if (isDanger) return theme.colors.danger;
    if (isPrimary) return theme.colors.primary;
    return theme.colors.secondary;
  }};
`;
```

## Theme Structure

```typescript
// @theme/types.ts
export interface AppThemeProps {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: {
      primary: string;
      secondary: string;
    };
    danger: string;
    success: string;
    disabled: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// @theme/index.ts
export const theme: AppThemeProps = {
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    background: "#FFFFFF",
    text: {
      primary: "#000000",
      secondary: "#8E8E93",
    },
    danger: "#FF3B30",
    success: "#34C759",
    disabled: "#C7C7CC",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};
```

## Spacing Helpers

```typescript
// Use theme spacing consistently
export const Container = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

// For complex spacing
export const Card = styled.View`
  padding-top: ${({ theme }) => theme.spacing.xl}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;
```

## Responsive Styling

```typescript
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const Container = styled.View`
  width: ${width > 768 ? "50%" : "100%"};
  padding: ${width > 768 ? "24px" : "16px"};
`;

// Or use helpers
const isTablet = width > 768;

export const Container = styled.View`
  width: ${isTablet ? "50%" : "100%"};
`;
```

## Text Styling

```typescript
// Define text variants
export const TitleText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const BodyText = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 24px;
`;

export const CaptionText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
```

## Platform-Specific Styling

```typescript
import { Platform } from "react-native";

export const Container = styled.View`
  padding-top: ${Platform.OS === "ios" ? "44px" : "24px"};
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.1;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 4;
    `,
  })}
`;
```

## Animation-Ready Components

```typescript
import styled from "styled-components/native";
import Animated from "react-native-reanimated";

export const AnimatedContainer = styled(Animated.View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const AnimatedText = styled(Animated.Text)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;
```

## Reusable Components

```typescript
// @components/card/styles.ts
export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 2;
`;

// Usage across the app
import { Card } from '@components/card/styles';

<Card>
  <Title>My Card</Title>
</Card>
```

## Best Practices Checklist

✅ **Use styled-components** - NEVER `StyleSheet.create()` or inline styles
✅ **Separate styles file** - `styles.ts` for all styled components
✅ **Access theme** - Use `theme` for colors, spacing, etc.
✅ **Use props for variants** - Specific props instead of generic "variant"
✅ **Consistent spacing** - Use theme spacing values
✅ **Type styled components** - Add TypeScript interfaces for props
✅ **Reuse common styles** - Create shared styled components

❌ **Don't use inline styles** - `style={{}}` is forbidden
❌ **Don't use StyleSheet.create** - Use styled-components only
❌ **Don't hardcode colors** - Use theme values
❌ **Don't hardcode spacing** - Use theme spacing
❌ **Don't create variant props** - Use specific boolean/enum props
❌ **Don't mix styling approaches** - All styled-components, no StyleSheet

## Migration Example

```typescript
// ❌ BEFORE - StyleSheet
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
});

<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>

// ✅ AFTER - styled-components
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

<Container>
  <Title>Hello</Title>
</Container>
```
