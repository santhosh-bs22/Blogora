import React from 'react'
import MarkdownEditor from '../components/editor/MarkdownEditor'
import { useNavigate } from 'react-router-dom'
import { hybridService } from '../api/hybridService' // Changed from postsApi to hybridService
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

const CreatePostPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleSubmit = async (data: any) => {
    if (!user) return

    try {
      const postData = {
        ...data,
        authorId: user.id,
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio || '',
          role: user.role,
        },
      }

      // Use hybridService to save to local storage
      await hybridService.createHybridPost(postData)
      
      // Invalidate 'hybridPosts' because that's what EnhancedHomePage uses
      await queryClient.invalidateQueries({ queryKey: ['hybridPosts'] })
      await queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
      
      toast.success(
        data.status === 'published' 
          ? 'Post published successfully!' 
          : 'Post saved as draft'
      )
      
      navigate('/') // Navigate to home to see the new post immediately
    } catch (error) {
      toast.error('Failed to save post')
      console.error(error)
    }
  }

  return <MarkdownEditor onSubmit={handleSubmit} />
}

export default CreatePostPage