import { jsonPlaceholderApi, type JsonPost, type JsonComment, type JsonUser } from './jsonplaceholder'
import { apiClient } from './client'
import type { BlogPost, Comment, Author } from './types'

export const hybridService = {
  // ... existing code ...

  async getHybridPosts(): Promise<BlogPost[]> {
    try {
      // Get posts from both sources
      const [localPosts, jsonPosts] = await Promise.allSettled([
        apiClient.get<BlogPost[]>('posts.json'),
        jsonPlaceholderApi.getPosts(),
      ])

      const posts: BlogPost[] = []

      // 1. FETCH FROM LOCAL STORAGE (New Code)
      // This ensures posts you created are displayed
      const savedPosts = JSON.parse(localStorage.getItem('user-posts') || '[]')
      posts.push(...savedPosts)

      // 2. Add local JSON file posts
      if (localPosts.status === 'fulfilled') {
        posts.push(...localPosts.value)
      }

      // 3. Convert and add JSONPlaceholder posts
      if (jsonPosts.status === 'fulfilled') {
        const jsonUsers = await jsonPlaceholderApi.getUsers()
        
        const convertedPosts = jsonPosts.value.slice(0, 10).map(jsonPost => {
          const user = jsonUsers.find(u => u.id === jsonPost.userId) || jsonUsers[0]
          
          return {
            id: `json-${jsonPost.id}`,
            title: jsonPost.title,
            content: jsonPost.body,
            excerpt: jsonPost.body.substring(0, 150) + '...',
            authorId: `json-user-${user.id}`,
            author: {
              id: `json-user-${user.id}`,
              name: user.name,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
              bio: `${user.company.catchPhrase}. ${user.company.bs}`,
              role: 'Author',
              social: {
                website: user.website,
              }
            },
            category: ['General', 'Technology', 'Programming'][jsonPost.userId % 3],
            tags: ['jsonplaceholder', 'api', 'demo', 'data'],
            publishedAt: new Date(2024, 0, jsonPost.id).toISOString(),
            updatedAt: new Date(2024, 0, jsonPost.id).toISOString(),
            readTime: Math.ceil(jsonPost.body.length / 1000),
            likes: Math.floor(Math.random() * 1000),
            bookmarks: Math.floor(Math.random() * 100),
            views: Math.floor(Math.random() * 10000),
            status: 'published' as const,
          } satisfies BlogPost
        })

        posts.push(...convertedPosts)
      }

      // Sort by date (Newest first)
      return posts.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    } catch (error) {
      console.error('Error fetching hybrid posts:', error)
      return []
    }
  },

  async getPost(id: string): Promise<BlogPost | undefined> {
    const posts = await this.getHybridPosts();
    return posts.find(p => p.id === id);
  },

  async getHybridComments(postId: string): Promise<Comment[]> {
    try {
      const [localComments, jsonComments] = await Promise.allSettled([
        apiClient.get<Comment[]>('comments.json'),
        postId.startsWith('json-') 
          ? jsonPlaceholderApi.getComments(parseInt(postId.replace('json-', '')))
          : Promise.resolve([]),
      ])

      const comments: Comment[] = []

      // Fetch from Local Storage
      const storageComments = JSON.parse(localStorage.getItem('user-comments') || '[]') as Comment[]
      const userComments = storageComments.filter(c => c.postId === postId)
      comments.push(...userComments)

      // Add local comments
      if (localComments.status === 'fulfilled') {
        const filteredLocal = localComments.value.filter(c => 
          c.postId === postId || c.postId === postId.replace('json-', '')
        )
        comments.push(...filteredLocal)
      }

      // Add JSONPlaceholder comments
      if (jsonComments.status === 'fulfilled') {
        const convertedComments = jsonComments.value.slice(0, 5).map(jsonComment => ({
          id: `json-comment-${jsonComment.id}`,
          postId,
          author: jsonComment.name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${jsonComment.email}`,
          content: jsonComment.body,
          createdAt: new Date(2024, 0, jsonComment.id).toISOString(),
          likes: Math.floor(Math.random() * 50),
          isVerified: Math.random() > 0.5,
        } satisfies Comment))

        comments.push(...convertedComments)
      }

      return comments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } catch (error) {
      console.error('Error fetching hybrid comments:', error)
      return []
    }
  },

  async createHybridComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
    }

    const savedComments = JSON.parse(localStorage.getItem('user-comments') || '[]')
    savedComments.push(newComment)
    localStorage.setItem('user-comments', JSON.stringify(savedComments))

    return newComment
  },

  // This ensures the post is saved to localStorage
  async createHybridPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      bookmarks: 0
    }

    const savedPosts = JSON.parse(localStorage.getItem('user-posts') || '[]')
    savedPosts.push(newPost)
    localStorage.setItem('user-posts', JSON.stringify(savedPosts))

    return newPost
  },

  async getUserPosts(userId: string): Promise<BlogPost[]> {
    const allPosts = await this.getHybridPosts()
    return allPosts.filter(post => post.authorId === userId)
  },
}