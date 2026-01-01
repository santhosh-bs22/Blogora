import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Filter, TrendingUp, Clock, BookOpen, 
  Sparkles, Users, Rocket, Zap, 
  Flame, User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import BlogCard from '../components/blog/BlogCard'
import { useQuery } from '@tanstack/react-query'
import { hybridService } from '../api/hybridService'
import { BlogPost } from '../api/types' // Import the type to ensure type safety

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const EnhancedHomePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [trendingPosts, setTrendingPosts] = useState<any[]>([])

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['hybridPosts'],
    queryFn: () => hybridService.getHybridPosts(),
  })

  useEffect(() => {
    if (posts.length > 0) {
      const trending = [...posts]
        .filter(post => post && post.views && post.likes)
        .sort((a, b) => (b.views * 2 + b.likes) - (a.views * 2 + a.likes))
        .slice(0, 5)
      setTrendingPosts(trending)
    }
  }, [posts])

  const categories = [
    { id: 'all', label: 'All', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'React', label: 'React', icon: <Zap className="h-4 w-4" /> },
    { id: 'TypeScript', label: 'TypeScript', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'JavaScript', label: 'JavaScript', icon: <Rocket className="h-4 w-4" /> },
    { id: 'Tailwind', label: 'Tailwind', icon: <Flame className="h-4 w-4" /> },
    { id: 'Backend', label: 'Backend', icon: <TrendingUp className="h-4 w-4" /> },
  ]

  const filteredPosts = posts.filter(post => {
    if (!post) return false
    const matchesSearch = searchQuery === '' || 
      (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.tags && post.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesCategory = selectedCategory === 'all' || (post.category && post.category === selectedCategory)
    return matchesSearch && matchesCategory
  })

  // FIXED: Properly constructs the BlogPost object with all required fields
  const getPostData = (post: any): BlogPost => ({
    id: post?.id || 'unknown',
    title: post?.title || 'Untitled',
    excerpt: post?.excerpt || 'No description available',
    
    // Missing fields added here:
    content: post?.content || '', 
    authorId: post?.authorId || post?.author?.id || 'unknown',
    updatedAt: post?.updatedAt || new Date().toISOString(),
    bookmarks: post?.bookmarks || 0,

    category: post?.category || 'General',
    author: {
      id: post?.author?.id || 'unknown',
      name: post?.author?.name || 'Unknown Author',
      avatar: post?.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous`,
      // Ensure Author interface requirements are met:
      bio: post?.author?.bio || 'No bio available',
      role: post?.author?.role || 'Member'
    },
    featuredImage: post?.featuredImage || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop`,
    publishedAt: post?.publishedAt || new Date().toISOString(),
    views: post?.views || 0,
    likes: post?.likes || 0,
    tags: post?.tags || [],
    readTime: post?.readTime || 5,
    status: post?.status || 'published',
    isFeatured: post?.isFeatured || false
  })

  return (
      <div className="min-h-screen bg-background">
      {/* Dynamic Hero Section with Animation */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-tr from-primary/20 via-background to-secondary/10">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-6 py-1 px-4 text-sm animate-bounce">
              <Sparkles className="mr-2 h-4 w-4"/> New: AI-Powered Writing
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none"
          >
            WRITE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 animate-gradient bg-300% italic underline decoration-wavy">SMARTER.</span><br/>
            READ BETTER.
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10"
          >
            The next generation blog platform where human creativity meets artificial intelligence.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="h-14 px-8 rounded-full shadow-lg hover:shadow-primary/20 transition-all hover:scale-105 active:scale-95" 
              onClick={() => navigate('/create-post')}
            >
              <Rocket className="mr-2 h-5 w-5"/> Start Writing with AI
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Search & Filter - Slide Up Animation */}
      <motion.section 
        className="container mx-auto px-4 py-8 -mt-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="backdrop-blur-xl bg-background/80 border-1 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Search articles, tags, or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-2 focus-visible:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                      className="gap-2 transition-all active:scale-95"
                    >
                      {cat.icon}
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>    

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="recent" className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="recent" className="gap-2">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="popular" className="gap-2">
                <Users className="h-4 w-4" />
                Popular
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{filteredPosts.length} articles found</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="recent" className="space-y-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.div key={i} variants={itemVariants}>
                      <Card className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-48 bg-muted rounded-lg mb-4" />
                          <div className="h-4 bg-muted rounded mb-2" />
                          <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                          <div className="h-4 bg-muted rounded mb-4 w-1/2" />
                          <div className="h-8 bg-muted rounded" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => {
                    const safePost = getPostData(post)
                    return (
                      <motion.div key={safePost.id} variants={itemVariants}>
                        <BlogCard post={safePost} />
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="trending">
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {trendingPosts.map((post, index) => {
                  const safePost = getPostData(post)
                  return (
                    <motion.div key={safePost.id} variants={itemVariants}>
                      <Card className="group hover:shadow-xl transition-all duration-300 h-full">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-1/3 relative overflow-hidden">
                            <img
                              src={safePost.featuredImage}
                              alt={safePost.title}
                              className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80'
                              }}
                            />
                            <Badge className="absolute top-3 left-3 bg-primary/90">
                              #{index + 1} Trending
                            </Badge>
                          </div>
                          <div className="md:w-2/3 p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Avatar className="h-6 w-6 ring-2 ring-primary/10">
                                  <AvatarImage src={safePost.author.avatar} />
                                  <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{safePost.author.name}</span>
                              </div>
                              <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {safePost.title}
                              </h3>
                              <p className="text-muted-foreground line-clamp-2 mb-4">
                                {safePost.excerpt}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                              <Badge variant="secondary">{safePost.category}</Badge>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  {safePost.views.toLocaleString()}
                                </span>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => navigate(`/blog/${safePost.id}`)}
                                  className="group/btn"
                                >
                                  Read <span className="inline-block transition-transform group-hover/btn:translate-x-1">→</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="popular">
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                  {/* Logic for popular posts identical to recent, wrapped in variants */}
                  {posts
                    .filter(post => post && post.likes !== undefined)
                    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                    .slice(0, 9)
                    .map((post) => {
                      const safePost = getPostData(post)
                      return (
                        <motion.div key={safePost.id} variants={itemVariants}>
                            <BlogCard post={safePost} />
                        </motion.div>
                      )
                    })
                  }
                </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </section>
    </div>
  )
}

export default EnhancedHomePage