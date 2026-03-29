# Components Pattern

## Purpose

Components are **reusable UI elements** that:

- Render visual elements
- Accept props for customization
- Are predictable and testable
- Have minimal logic

## Rules

✅ **DO** keep components small and focused
✅ **DO** use props for customization
✅ **DO** separate UI from logic
✅ **DO** use styled-components
✅ **DO** extract to `@components` when reused

❌ **DO NOT** put business logic in components
❌ **DO NOT** make API calls
❌ **DO NOT** use inline styles
❌ **DO NOT** use variant props

## File Organization

```
src/resources/components/
└── button/                   # kebab-case folder
    ├── index.tsx            # Component logic
    ├── styles.ts            # Styled-components
    ├── types.ts             # Props interface (optional)
    └── constants/           # Component constants (optional)
```

**CRITICAL**: Always separate into `index.tsx` and `styles.ts`

## Component Structure

```typescript
// src/resources/components/button/index.tsx
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { ButtonContainer, ButtonText } from './styles';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  testID,
}) => {
  return (
    <ButtonContainer onPress={onPress} disabled={disabled || loading} testID={testID}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <ButtonText>{title}</ButtonText>
      )}
    </ButtonContainer>
  );
};
```

## Styles (styled-components)

```typescript
// src/resources/components/button/styles.ts
import styled from "styled-components/native";

export const ButtonContainer = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray : theme.colors.primary};
  padding: 16px 32px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  min-height: 56px;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
```

## Props Interface

```typescript
// src/resources/components/button/types.ts
export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}
```

## Component Best Practices

### Use Specific Props (Not Variants)

```typescript
// ❌ WRONG - Generic variant prop
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
}

// ✅ CORRECT - Specific props
interface ButtonProps {
  isPrimary?: boolean;
  isSecondary?: boolean;
  isDanger?: boolean;
}
```

### Extract Enums When Needed

```typescript
// src/resources/components/button/types.ts
export enum ButtonSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export interface ButtonProps {
  size?: ButtonSize;
}

// Usage
<Button size={ButtonSize.Large} />
```

### NO Inline Styles

```typescript
// ❌ WRONG - Inline styles
<View style={{ flex: 1, padding: 16 }}>

// ✅ CORRECT - Create styled component
const Container = styled.View`
  flex: 1;
  padding: 16px;
`;
```

## Common Component Patterns

### Input Component

```typescript
// index.tsx
import React from 'react';
import { StyledInput, InputContainer, Label, ErrorText } from './styles';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
}) => {
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        hasError={!!error}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};
```

### Card Component

```typescript
import React, { ReactNode } from 'react';
import { CardContainer, CardTitle, CardContent } from './styles';

interface CardProps {
  title?: string;
  children: ReactNode;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, children, onPress }) => {
  return (
    <CardContainer onPress={onPress} disabled={!onPress}>
      {title && <CardTitle>{title}</CardTitle>}
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};
```

### List Item Component

```typescript
import React from 'react';
import { Container, Title, Subtitle, Icon } from './styles';

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({ title, subtitle, icon, onPress }) => {
  return (
    <Container onPress={onPress}>
      {icon && <Icon source={{ uri: icon }} />}
      <View>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </View>
    </Container>
  );
};
```

## Conditional Rendering

```typescript
export const UserCard: React.FC<UserCardProps> = ({ user, showEmail }) => {
  return (
    <Container>
      <Name>{user.name}</Name>
      {showEmail && <Email>{user.email}</Email>}
      {user.verified ? <VerifiedBadge /> : <UnverifiedWarning />}
    </Container>
  );
};
```

## Children Pattern

```typescript
interface ContainerProps {
  children: ReactNode;
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ children, centered }) => {
  return (
    <StyledContainer centered={centered}>
      {children}
    </StyledContainer>
  );
};
```

## Accessing Theme

```typescript
import { useTheme } from 'styled-components/native';
import { AppThemeProps } from '@theme/types';

export const MyComponent: React.FC = () => {
  const theme: AppThemeProps = useTheme();

  return (
    <Container>
      <Text style={{ color: theme.colors.primary }}>
        Themed Text
      </Text>
    </Container>
  );
};
```

## Component Naming

- **Folder**: kebab-case (`button`, `user-card`, `post-item`)
- **File**: `index.tsx` (always)
- **Component**: PascalCase (`Button`, `UserCard`, `PostItem`)
- **Styles**: `styles.ts`
- **Types**: `types.ts` (optional, only if > 3 props)

## When to Create a Component

Create a reusable component when:

✅ UI element is used in 2+ places
✅ Component is self-contained
✅ Logic is minimal (just props → render)
✅ Can be tested in isolation

Keep as inline JSX when:

❌ Used only once
❌ Tightly coupled to parent
❌ Very simple (< 10 lines)

## Component Composition

```typescript
// Compose smaller components
export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <Card>
      <Avatar url={user.avatar} />
      <UserName name={user.name} />
      <UserBio bio={user.bio} />
      <Button title="Follow" onPress={() => followUser(user.id)} />
    </Card>
  );
};
```

## Best Practices

✅ **One component = one file (index.tsx)**
✅ **Always use styled-components**
✅ **Extract styles to styles.ts**
✅ **Type all props**
✅ **Keep components under 100 lines**
✅ **Use descriptive prop names**
✅ **Handle empty/loading states**

❌ **Don't use inline styles**
❌ **Don't use variant props**
❌ **Don't put logic in components**
❌ **Don't make components too complex**
❌ **Don't mix concerns**
