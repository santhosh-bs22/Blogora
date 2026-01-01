import React, { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, Share2, Heart } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import CommentsSection from './CommentsSection'
import { useQuery } from '@tanstack/react-query'
import { hybridService } from '../../api/hybridService'

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const ref = useRef(null)

  // #3 Reading Progress Bar Logic
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Parallax effects
  const { scrollYProgress: heroScroll } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  const y = useTransform(heroScroll, [0, 1], ["0%", "50%"])
  const opacity = useTransform(heroScroll, [0, 0.5], [1, 0])

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => hybridService.getPost(id || ''),
    enabled: !!id
  })

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )

  if (!post) return <div className="container py-20 text-center">Post not found</div>

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* #3 Progress Bar Visualization */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* #8 Parallax Hero Section (Image Reveal) */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center" ref={ref}>
        <motion.div 
          style={{ y, opacity }} 
          className="absolute inset-0 z-0"
        >
          <img 
            src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310159-a5169ca92f5d'} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </motion.div>

        <div className="container relative z-10 px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <Link to="/">
              <Button variant="ghost" className="text-white/80 hover:text-white mb-6 hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
            
            <Badge className="mb-4 bg-primary/80 hover:bg-primary text-white border-none">
              {post.category}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback>{post.author?.name?.[0]}</AvatarFallback>
                </Avatar>
                <span>{post.author?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Container */}
      <div className="container px-4 -mt-20 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto bg-card rounded-xl shadow-2xl border p-8 md:p-12"
        >
          <div className="flex justify-between items-center mb-8 border-b pb-6">
            <div className="flex gap-2">
               {post.tags.map((tag: string) => (
                 <Badge key={tag} variant="secondary">#{tag}</Badge>
               ))}
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="rounded-full hover:text-red-500 hover:border-red-200">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full hover:text-blue-500 hover:border-blue-200">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* #8 Image Scroll Reveal inside content */}
            <motion.div
               initial={{ opacity: 0, filter: 'blur(10px)' }}
               whileInView={{ opacity: 1, filter: 'blur(0px)' }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
            >
               <div dangerouslySetInnerHTML={{ __html: post.content }} /> 
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto mt-12">
          <CommentsSection postId={id || ''} />
        </div>
      </div>
    </div>
  )
}

export default BlogDetail