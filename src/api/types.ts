export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  authorId: string
  author: Author
  category: string
  tags: string[]
  publishedAt: string
  updatedAt: string
  readTime: number
  likes: number
  bookmarks: number
  views: number
  featuredImage?: string
  isFeatured?: boolean
  status: 'draft' | 'published'
}

export interface Author {
  id: string
  name: string
  avatar: string
  bio: string
  role: string
  social?: {
    twitter?: string
    github?: string
    website?: string
    linkedin?: string
  }
}

export interface Comment {
  id: string
  postId: string
  parentId?: string | null // Added this field for replies
  author: string
  avatar: string
  content: string
  createdAt: string
  likes: number
  isVerified?: boolean
}

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}