# Navigation Pattern

## Purpose

Navigation handles **app routing and screen transitions** using React Navigation:

- Stack navigation
- Tab navigation
- Deep linking
- Route guards
- Navigation helpers

## Navigation Structure

```
src/navigators/
├── MainNavigation.tsx        # Root navigator
├── PublicStack.tsx           # Public routes (SignIn, SignUp)
├── PrivateStack.tsx          # Private routes (Home, Profile)
└── TabNavigator.tsx          # Bottom tabs
```

## Stack Navigator

```typescript
// MainNavigation.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIsAuthenticated } from '@contexts/authentication';
import { PublicStack } from './PublicStack';
import { PrivateStack } from './PrivateStack';

const Stack = createNativeStackNavigator();

export const MainNavigation: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Private" component={PrivateStack} />
      ) : (
        <Stack.Screen name="Public" component={PublicStack} />
      )}
    </Stack.Navigator>
  );
};
```

## Route Types

```typescript
// @routes/types.ts
export type AppNavigationProps = {
  // Public routes
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;

  // Private routes
  Home: undefined;
  Profile: undefined;
  PostDetail: { id: string };
  EditProfile: { userId: string };

  // Common routes
  Webview: { url: string; title?: string };
};
```

## Navigation Hook

```typescript
// Using navigation
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNavigationProps } from '@routes/types';

const MyComponent: React.FC = () => {
  const navigation: NavigationProp<AppNavigationProps> = useNavigation();

  const handlePress = () => {
    // Navigate to screen
    navigation.navigate('Home');

    // Navigate with params
    navigation.navigate('PostDetail', { id: '123' });

    // Go back
    navigation.goBack();

    // Replace (no back button)
    navigation.replace('Home');
  };

  return <Button onPress={handlePress}>Go Home</Button>;
};
```

## Route Params Hook

```typescript
// Using route params
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppNavigationProps } from '@routes/types';

type PostDetailRouteProp = RouteProp<AppNavigationProps, 'PostDetail'>;

const PostDetailScreen: React.FC = () => {
  const route = useRoute<PostDetailRouteProp>();
  const { id } = route.params;

  return <View>{/* Use id */}</View>;
};
```

## Tab Navigator

```typescript
// TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@screens/home';
import { ProfileScreen } from '@screens/profile';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
```

## Deep Linking

```typescript
// @contexts/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Linking } from 'react-native';

const linking = {
  prefixes: ['ailu://', 'https://app.ailu.com'],
  config: {
    screens: {
      Public: {
        screens: {
          Welcome: 'welcome',
          SignIn: 'signin',
          ResetPassword: 'reset-password/:token',
        },
      },
      Private: {
        screens: {
          Home: 'home',
          PostDetail: 'posts/:id',
          Profile: 'profile/:userId',
        },
      },
    },
  },
};

export const NavigationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <NavigationContainer linking={linking}>
      {children}
    </NavigationContainer>
  );
};
```

## Navigation Helpers

```typescript
// @helpers/navigation.helper.ts
import { NavigationProp } from "@react-navigation/native";
import { AppNavigationProps } from "@routes/types";

export const navigateToHome = (
  navigation: NavigationProp<AppNavigationProps>,
) => {
  navigation.navigate("Home");
};

export const navigateToPostDetail = (
  navigation: NavigationProp<AppNavigationProps>,
  postId: string,
) => {
  navigation.navigate("PostDetail", { id: postId });
};

export const navigateToWebview = (
  navigation: NavigationProp<AppNavigationProps>,
  url: string,
  title?: string,
) => {
  navigation.navigate("Webview", { url, title });
};

export const navigateBack = (
  navigation: NavigationProp<AppNavigationProps>,
) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
};
```

## Route Guards

```typescript
// @hooks/use-next-behavior.hook.ts
import { useEffect } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppNavigationProps } from "@routes/types";

export const useNextBehavior = () => {
  const navigation: NavigationProp<AppNavigationProps> = useNavigation();

  useEffect(() => {
    checkAndRedirect();
  }, []);

  const checkAndRedirect = async () => {
    // Check for forced update
    const needsUpdate = await checkAppVersion();
    if (needsUpdate) {
      navigation.navigate("ForceUpdate");
      return;
    }

    // Check for incomplete registration
    const needsCompletion = await checkRegistrationStatus();
    if (needsCompletion) {
      navigation.navigate("CompleteProfile");
      return;
    }
  };
};
```

## Screen Options

```typescript
// Custom header
<Stack.Screen
  name="PostDetail"
  component={PostDetailScreen}
  options={{
    headerShown: true,
    title: 'Post Details',
    headerBackTitle: 'Back',
  }}
/>

// Dynamic header
<Stack.Screen
  name="PostDetail"
  component={PostDetailScreen}
  options={({ route }) => ({
    title: route.params.title || 'Post',
  })}
/>
```

## Best Practices

✅ **Type navigation props** - Use `NavigationProp<AppNavigationProps>`
✅ **Type route params** - Use `RouteProp<AppNavigationProps, 'ScreenName'>`
✅ **Use navigation helpers** - Abstract common navigation patterns
✅ **Handle deep links** - Configure linking for all screens
✅ **Use route guards** - Check auth, onboarding, version
✅ **Keep navigation logic separate** - Not in components

❌ **Don't hardcode screen names** - Use enum or constants
❌ **Don't navigate without types** - Always type navigation/route
❌ **Don't forget to handle back** - Check `canGoBack()`
❌ **Don't mix navigation logic in components** - Use hooks/helpers
