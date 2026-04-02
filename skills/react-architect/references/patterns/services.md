# Services Pattern

## Purpose

Services handle **API communication and data transformation**:

- HTTP requests to backend
- Response transformation
- Error handling
- Request configuration

## Rules

✅ **DO** centralize API calls in services
✅ **DO** transform responses to app models
✅ **DO** handle errors properly
✅ **DO** use TypeScript for type safety
✅ **DO** keep services focused

❌ **DO NOT** put business logic in services
❌ **DO NOT** use React hooks
❌ **DO NOT** handle UI concerns
❌ **DO NOT** manage state directly

## File Organization

```
src/app/services/
└── posts.service.ts
```

**Naming**: `entity-name.service.ts` (singular, kebab-case)

## Service Structure

```typescript
// posts.service.ts
import { api } from "@configuration/api.configuration";
import { Post, CreatePostData } from "@entities/post";

const POSTS_BASE_URL = "/api/v2/posts";

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await api.get<{ data: Post[] }>(POSTS_BASE_URL);
  return response.data.data;
};

export const fetchPostById = async (id: string): Promise<Post> => {
  const response = await api.get<{ data: Post }>(`${POSTS_BASE_URL}/${id}`);
  return response.data.data;
};

export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await api.post<{ data: Post }>(POSTS_BASE_URL, data);
  return response.data.data;
};

export const updatePost = async (
  id: string,
  data: Partial<CreatePostData>,
): Promise<Post> => {
  const response = await api.put<{ data: Post }>(
    `${POSTS_BASE_URL}/${id}`,
    data,
  );
  return response.data.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`${POSTS_BASE_URL}/${id}`);
};
```

## API Configuration

```typescript
// @configuration/api.configuration.ts
import axios, { AxiosInstance } from "axios";
import { getAuthToken } from "@helpers/auth.helper";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (add auth token)
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (logout, redirect to login)
    }
    return Promise.reject(error);
  },
);
```

## Error Handling

```typescript
// services/posts.service.ts
import { ApiError } from "@entities/error";

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get<{ data: Post[] }>(POSTS_BASE_URL);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data?.message || "Failed to fetch posts",
        error.response?.status || 500,
      );
    }
    throw error;
  }
};
```

## Request with Query Params

```typescript
export const searchPosts = async (
  query: string,
  page: number = 1,
): Promise<Post[]> => {
  const response = await api.get<{ data: Post[] }>(POSTS_BASE_URL, {
    params: {
      q: query,
      page,
      per_page: 20,
    },
  });
  return response.data.data;
};
```

## Request with FormData

```typescript
export const uploadAvatar = async (
  userId: string,
  file: File,
): Promise<string> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.post<{ data: { url: string } }>(
    `/api/v2/users/${userId}/avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data.url;
};
```

## Response Transformation

```typescript
// Transform API response to app model
interface ApiPost {
  id: string;
  title: string;
  created_at: string; // API returns ISO string
}

interface Post {
  id: string;
  title: string;
  createdAt: Date; // App uses Date object
}

const transformPost = (apiPost: ApiPost): Post => ({
  id: apiPost.id,
  title: apiPost.title,
  createdAt: new Date(apiPost.created_at),
});

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await api.get<{ data: ApiPost[] }>(POSTS_BASE_URL);
  return response.data.data.map(transformPost);
};
```

## Best Practices

✅ **One service per entity** - `posts.service.ts`, `users.service.ts`
✅ **Export individual functions** - Not a class
✅ **Transform responses** - Convert API models to app models
✅ **Handle errors** - Try/catch with meaningful errors
✅ **Use constants for URLs** - No hardcoded strings
✅ **Type everything** - Request and response types

❌ **Don't use classes** - Export functions directly
❌ **Don't handle business logic** - Only API communication
❌ **Don't use React hooks** - Pure functions only
❌ **Don't manage state** - Return data, let hooks/contexts handle state

## Usage with React Query

```typescript
// In a hook
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@services/posts.service";
import { QueryTypes } from "@enums/query-type.enum";

export const useGetPosts = () => {
  return useQuery({
    queryKey: [QueryTypes.Posts],
    queryFn: fetchPosts,
  });
};
```
