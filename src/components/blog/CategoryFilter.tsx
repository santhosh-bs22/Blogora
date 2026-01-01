import React from 'react'
import { Badge } from '../ui/Badge'
import { motion } from 'framer-motion'

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'React', label: 'React' },
  { id: 'TypeScript', label: 'TypeScript' },
  { id: 'Tailwind', label: 'Tailwind CSS' },
  { id: 'JavaScript', label: 'JavaScript' },
  { id: 'Web Development', label: 'Web Dev' },
]

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className="focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          <Badge
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-1.5 text-sm transition-colors duration-300"
          >
            {category.label}
          </Badge>
        </motion.button>
      ))}
    </div>
  )
}

export default CategoryFilter