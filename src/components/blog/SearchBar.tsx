import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../ui/Input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative flex items-center justify-end">
      <motion.div
        initial={{ width: 40 }}
        animate={{ width: isFocused || value ? 300 : 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative overflow-hidden"
      >
         <motion.div 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
            onClick={() => {
                const input = document.getElementById('search-input');
                if (input) input.focus();
            }}
         >
            <Search className={`h-4 w-4 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
         </motion.div>

         <Input
            id="search-input"
            type="search"
            placeholder={isFocused ? placeholder : ""}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`pl-10 pr-8 bg-background transition-colors ${!isFocused && !value ? 'cursor-pointer border-transparent hover:bg-muted' : ''}`}
          />
          
          <AnimatePresence>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </motion.button>
            )}
          </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default SearchBar