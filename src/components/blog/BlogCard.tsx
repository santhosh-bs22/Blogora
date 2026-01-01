import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, User, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatDate } from '../../utils/formatDate'
import type { BlogPost } from '../../api/types'
import { motion } from 'framer-motion'

interface BlogCardProps {
  post: BlogPost
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const safePost = {
    id: post?.id || 'unknown',
    title: post?.title || 'Untitled Post',
    excerpt: post?.excerpt || 'No description available',
    category: post?.category || 'General',
    author: {
      name: post?.author?.name || 'Unknown Author',
      avatar: post?.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous`,
      id: post?.author?.id || 'unknown'
    },
    featuredImage: post?.featuredImage,
    publishedAt: post?.publishedAt || new Date().toISOString(),
    readTime: post?.readTime || 5,
    tags: post?.tags || [],
    likes: post?.likes || 0,
    bookmarks: post?.bookmarks || 0,
    views: post?.views || 0
  }

  return (
    <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full"
    >
        <Card className="group relative flex flex-col h-full border-border/50 overflow-hidden bg-card/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 dark:bg-card/40">
        
        {/* Image Section */}
        {safePost.featuredImage && (
            <div className="relative h-52 overflow-hidden">
                <motion.img
                    src={safePost.featuredImage}
                    alt={safePost.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                
                <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur-md shadow-lg hover:bg-background border-none">
                    {safePost.category}
                </Badge>
            </div>
        )}
        
        <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(safePost.publishedAt)}
                </span>
                <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    {safePost.readTime} min read
                </span>
            </div>
            
            <Link to={`/blog/${safePost.id}`} className="focus:outline-none">
                <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors tracking-tight leading-tight">
                    {safePost.title}
                </h3>
            </Link>
        </CardHeader>
        
        <CardContent className="flex-1 px-5 pb-2">
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {safePost.excerpt}
            </p>
        </CardContent>
        
        <CardFooter className="px-5 pb-5 pt-4 border-t border-border/50 mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full ring-2 ring-background overflow-hidden">
                     <img src={safePost.author.avatar} alt={safePost.author.name} className="h-full w-full object-cover" />
                </div>
                <span className="text-sm font-medium text-foreground/80">{safePost.author.name}</span>
            </div>
            
            <Link to={`/blog/${safePost.id}`}>
                <div className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="h-4 w-4" />
                </div>
            </Link>
        </CardFooter>
        </Card>
    </motion.div>
  )
}

export default BlogCard