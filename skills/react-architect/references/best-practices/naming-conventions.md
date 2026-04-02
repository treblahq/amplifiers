# Naming Conventions

## General Rules

- **Code**: 100% English
- **UI strings**: Portuguese (user-facing text)
- **Comments**: English for code documentation
- **Commits**: English (conventional commits: `feat:`, `fix:`, `refactor:`)

## Files and Folders

### Folders

**Pattern**: kebab-case

Examples:

- `user-profile/`
- `post-detail/`
- `discover-reels/`
- `life-plan/`

### Files

**Pattern**: `index.tsx` for components/screens, descriptive name for others

Examples:

- `index.tsx` - Component/screen
- `types.ts` - Type definitions
- `constants.ts` - Constants
- `user.service.ts` - Service
- `string.helper.ts` - Helper
- `use-auth.hook.ts` - Hook
- `tab-type.enum.ts` - Enum

## Components

### Component Names

**Pattern**: PascalCase

Examples:

- `UserProfile`
- `PostList`
- `SearchInput`
- `LoadingSpinner`

### Component Files

```
user-profile/
  index.tsx       # Component
  styles.ts       # Styled components
  types.ts        # Props interface
  constants/      # Component-specific constants
```

## Screens

### Screen Names

**Pattern**: PascalCase + "Screen" suffix

Examples:

- `HomeScreen`
- `ProfileScreen`
- `PostDetailScreen`
- `DiscoverReelsScreen`

### Screen Folders

```
home/
  index.tsx           # HomeScreen component
  components/         # Screen-specific components
  hooks/             # Screen-specific hooks
  services/          # Screen-specific services
  helpers/           # Screen-specific helpers
  types/             # Screen-specific types
  views/             # Screen sub-views
```

## Hooks

### Hook Names

**Pattern**: `use` + PascalCase entity (singular)

Examples:

- `useAuth()`
- `useUserProfile()`
- `useDiscoverReel()`
- `useReelTracking()`

### Hook Files

**Pattern**: `entity-name.hook.ts` (entity in singular, kebab-case)

Examples:

- `auth.hook.ts` - `useAuth()`
- `user-profile.hook.ts` - `useUserProfile()`
- `discover-reel.hook.ts` - `useDiscoverReel()`
- `reel-tracking.hook.ts` - `useReelTracking()`

## Helpers

### Helper Files

**Pattern**: `purpose.helper.ts` or `entity.helper.ts`

Examples:

- `string.helper.ts`
- `date.helper.ts`
- `phone.helper.ts`
- `navigation.helper.ts`
- `auth.helper.ts`

### Helper Functions

**Pattern**: Descriptive verb or noun

Examples:

```typescript
// string.helper.ts
export const getFirstName = (fullName: string): string => {};
export const formatPhoneNumber = (phone: string): string => {};

// date.helper.ts
export const formatTime = (date: Date): string => {};
export const getGreetingByTime = (): string => {};
```

## Services

### Service Files

**Pattern**: `entity.service.ts`

Examples:

- `user.service.ts`
- `auth.service.ts`
- `post.service.ts`
- `chat.service.ts`

### Service Functions

**Pattern**: CRUD operations or descriptive verbs

Examples:

```typescript
// user.service.ts
export const getUser = (id: string): Promise<User> => {};
export const updateUser = (
  id: string,
  data: UpdateUserData,
): Promise<User> => {};
export const deleteUser = (id: string): Promise<void> => {};
```

## Contexts

### Context Names

**Pattern**: PascalCase + "Context" suffix

Examples:

- `AuthenticationContext`
- `RealmContext`
- `ConfigurationContext`
- `NavigationContext`

### Context Folders

```
authentication/
  index.tsx          # Provider and hooks
  types.ts           # Context types
  helpers/           # Context-specific helpers
```

## Enums

### Enum Files

**Pattern**: `entity-name.enum.ts` (singular, kebab-case)

Examples:

- `tab-type.enum.ts`
- `user-role.enum.ts`
- `post-status.enum.ts`
- `query-type.enum.ts`

### Enum Keys

**Pattern**: PascalCase

Examples:

```typescript
// tab-type.enum.ts
export enum TabTypes {
  Discover = "discover",
  Tracks = "tracks",
}

// query-type.enum.ts
export enum QueryTypes {
  DiscoverReels = "discover-reels",
  UserProfile = "user-profile",
}
```

## Constants

### Constant Files

**Pattern**: `entity.constants.ts` or `purpose.constants.ts`

Examples:

- `storage.constants.ts`
- `api.constants.ts`
- `videos.constants.ts`
- `chips.constants.ts`

### Constant Names

**Pattern**: SCREAMING_SNAKE_CASE for primitives, PascalCase for objects/arrays

Examples:

```typescript
// api.constants.ts
export const API_BASE_URL = "https://api.example.com";
export const API_TIMEOUT = 30000;

// videos.constants.ts
export const MOCK_VIDEOS: ReelVideo[] = [];
export const LAYOUT = {
  HEADER_PADDING: { TOP: 24, HORIZONTAL: 24 },
};
```

## Variables

### Local Variables

**Pattern**: camelCase

Examples:

```typescript
const userName = "John";
const userEmail = "john@example.com";
const isActive = true;
const postCount = 10;
```

### Boolean Variables

**Pattern**: Use `is`, `has`, `can`, `should` prefixes

Examples:

```typescript
const isActive = true;
const hasAccess = false;
const canEdit = true;
const shouldNotify = false;
```

### Collections

**Pattern**: Plural names

Examples:

```typescript
const users = await getUsers();
const posts = await getPosts();
const messages = realm.objects("Message");
```

### Single Items

**Pattern**: Singular names

Examples:

```typescript
const user = await getUser(id);
const post = await getPost(id);
const message = messages.find((m) => m.id === id);
```

## Functions

### Function Names

**Pattern**: Descriptive verbs

Examples:

```typescript
// CRUD operations
const fetchUser = async (id: string): Promise<User> => {};
const createPost = async (data: CreatePostData): Promise<Post> => {};
const updateProfile = async (data: UpdateProfileData): Promise<void> => {};
const deleteComment = async (id: string): Promise<void> => {};

// Boolean functions
const isValidEmail = (email: string): boolean => {};
const hasPermission = (permission: string): boolean => {};
const canEditPost = (post: Post): boolean => {};
const shouldShowNotification = (): boolean => {};

// Event handlers
const handlePress = () => {};
const handleChange = (value: string) => {};
const handleSubmit = () => {};
const handleError = (error: Error) => {};
```

## Types and Interfaces

### Interface Names

**Pattern**: PascalCase + "Props" suffix for component props

Examples:

```typescript
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

interface PostListItemProps {
  post: Post;
  onPress: (id: string) => void;
}
```

### Type Names

**Pattern**: PascalCase

Examples:

```typescript
type UserId = string;
type PostStatus = "draft" | "published" | "archived";
type NavigationParams = {
  userId: string;
  postId?: string;
};
```

## Styled Components

### Component Names

**Pattern**: PascalCase, descriptive

Examples:

```typescript
// styles.ts
export const Container = styled.View``;
export const Title = styled.Text``;
export const Button = styled.TouchableOpacity``;
export const InputField = styled.TextInput``;
export const Avatar = styled.Image``;
```

## Routes

### Route Names

**Pattern**: PascalCase

Examples:

```typescript
// @routes/enums/app-route.enum.ts
export enum AppRoutes {
  Welcome = "Welcome",
  SignIn = "SignIn",
  Home = "Home",
  PostDetail = "PostDetail",
  UserProfile = "UserProfile",
}
```

## Path Aliases

**Always use path aliases** instead of relative imports:

```typescript
// ✅ GOOD
import { User } from "@entities/user";
import { Button } from "@components/button";
import { useAuth } from "@hooks/auth.hook";
import { API_BASE_URL } from "@constants/api.constants";

// ❌ BAD
import { User } from "../../../entities/user";
import { Button } from "../../components/button";
```

## Best Practices Checklist

✅ **Descriptive names** - `getUserProfile()` not `get()`
✅ **Consistent casing** - camelCase variables, PascalCase components
✅ **Boolean prefixes** - `isActive`, `hasAccess`, `canEdit`
✅ **Plural for collections** - `users`, `posts`
✅ **Singular for items** - `user`, `post`
✅ **Verb-first functions** - `fetchUser()`, `createPost()`
✅ **Use path aliases** - `@constants`, `@components`, etc.

❌ **Don't abbreviate** - `getUserProfile()` not `getUsrProf()`
❌ **Don't use generic names** - `getData()`, `process()`, `handle()`
❌ **Don't mix languages** - English code, Portuguese UI strings only
❌ **Don't use single letters** - except loops: `i`, `j`, `k`
❌ **Don't use deep relative imports** - Use path aliases
