# Screens Pattern

## Purpose

Screens are the **primary view components** that:

- Represent a full-screen view in the app
- Orchestrate UI and business logic via hooks
- Compose smaller components
- Handle navigation

## Rules

✅ **DO** use hooks for all logic
✅ **DO** compose smaller components
✅ **DO** keep screens focused on orchestration
✅ **DO** extract logic to helpers/hooks
✅ **DO** use screen-specific folders

❌ **DO NOT** put business logic in screens
❌ **DO NOT** make API calls directly
❌ **DO NOT** use inline styles
❌ **DO NOT** create huge monolithic screens

## File Organization

```
src/screens/
└── screen-name/              # kebab-case folder
    ├── index.tsx             # Main screen component
    ├── styles.ts             # Styled-components
    ├── components/           # Screen-specific components
    │   └── component-name/
    │       ├── index.tsx
    │       └── styles.ts
    ├── hooks/                # Screen-specific hooks
    │   └── use-screen-data.hook.ts
    ├── helpers/              # Screen-specific pure functions
    │   └── calculation.helper.ts
    ├── constants/            # Screen-specific constants
    │   └── config.constants.ts
    └── types/                # Screen-specific types
        └── screen.types.ts
```

## Screen Structure

```typescript
// src/screens/home/index.tsx
import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNavigationProps } from '@routes/types';
import { useHomeData } from './hooks/use-home-data.hook';
import { HomeHeader } from './components/home-header';
import { PostList } from './components/post-list';
import { Container, Content } from './styles';

export const HomeScreen: React.FC = () => {
  const navigation: NavigationProp<AppNavigationProps> = useNavigation();
  const { posts, loading, error, refetch } = useHomeData();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={refetch} />;
  }

  return (
    <Container>
      <HomeHeader />
      <Content>
        <PostList posts={posts} onPostPress={(id) => navigation.navigate('PostDetail', { id })} />
      </Content>
    </Container>
  );
};
```

## Screen-Specific Hook

```typescript
// src/screens/home/hooks/use-home-data.hook.ts
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@services/posts.service";
import { QueryTypes } from "@enums/query-type.enum";

export const useHomeData = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTypes.Posts],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    posts: data || [],
    loading: isLoading,
    error,
    refetch,
  };
};
```

## Screen-Specific Component

```typescript
// src/screens/home/components/home-header/index.tsx
import React from 'react';
import { Container, Title, Subtitle } from './styles';

interface HomeHeaderProps {
  userName?: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ userName }) => {
  return (
    <Container>
      <Title>Welcome, {userName}</Title>
      <Subtitle>Here are your latest updates</Subtitle>
    </Container>
  );
};
```

## Screen Styles

```typescript
// src/screens/home/styles.ts
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  showsVerticalScrollIndicator: false,
})``;
```

## Navigation

### Navigate to Screen

```typescript
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppNavigationProps } from "@routes/types";

const navigation: NavigationProp<AppNavigationProps> = useNavigation();

// Navigate to screen
navigation.navigate("Home");

// Navigate with params
navigation.navigate("PostDetail", { id: postId });

// Go back
navigation.goBack();

// Replace (no back button)
navigation.replace("Home");
```

### Access Route Params

```typescript
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppNavigationProps } from "@routes/types";

type PostDetailRouteProp = RouteProp<AppNavigationProps, "PostDetail">;

const route = useRoute<PostDetailRouteProp>();
const { id } = route.params;
```

## Screen Naming

- **Folder**: kebab-case (`home`, `post-detail`, `user-profile`)
- **File**: Always `index.tsx`
- **Component**: PascalCase + Screen suffix (`HomeScreen`, `PostDetailScreen`)

## When to Extract to Subfolder

Extract to `components/`, `hooks/`, `helpers/` when:

✅ Logic/Component is used multiple times in the screen
✅ Component is complex (>50 lines)
✅ Logic is reusable
✅ Improves readability

Keep in main `index.tsx` when:

❌ One-time use
❌ Simple (< 20 lines)
❌ Tightly coupled to screen

## Loading and Error States

```typescript
export const HomeScreen: React.FC = () => {
  const { posts, loading, error, refetch } = useHomeData();

  // Loading state
  if (loading) {
    return (
      <Container>
        <ActivityIndicator size="large" color="blue" />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <ErrorMessage message={error.message} />
        <RetryButton onPress={refetch} />
      </Container>
    );
  }

  // Success state
  return <Content>{/* Render content */}</Content>;
};
```

## Keyboard Handling

```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

export const LoginScreen: React.FC = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Container>{/* Content */}</Container>
    </KeyboardAvoidingView>
  );
};
```

## Screen Examples

### List Screen

```typescript
import React from 'react';
import { FlatList } from 'react-native';
import { useGetPosts } from '@hooks/use-get-posts.hook';
import { PostItem } from './components/post-item';
import { Container } from './styles';

export const PostsScreen: React.FC = () => {
  const { posts, loading, refetch } = useGetPosts();

  return (
    <Container>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostItem post={item} />}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        refreshing={loading}
        contentContainerStyle={{ padding: 16 }}
      />
    </Container>
  );
};
```

### Form Screen

```typescript
import React, { useState } from 'react';
import { useCreatePost } from '@hooks/use-create-post.hook';
import { Container, Input, Button } from './styles';

export const CreatePostScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { mutate, isLoading } = useCreatePost();

  const handleSubmit = () => {
    mutate({ title, content });
  };

  return (
    <Container>
      <Input value={title} onChangeText={setTitle} placeholder="Title" />
      <Input value={content} onChangeText={setContent} placeholder="Content" multiline />
      <Button onPress={handleSubmit} disabled={isLoading}>
        Submit
      </Button>
    </Container>
  );
};
```

## Best Practices

✅ **One screen = one responsibility**
✅ **Extract logic to hooks**
✅ **Extract pure functions to helpers**
✅ **Use small, focused components**
✅ **Handle loading, error, and success states**
✅ **Type navigation props**
✅ **Use styled-components for styles**
✅ **Keep screens under 200 lines**

❌ **Don't inline business logic**
❌ **Don't make screens too large**
❌ **Don't use inline styles**
❌ **Don't skip loading/error states**
❌ **Don't mix UI and logic**
