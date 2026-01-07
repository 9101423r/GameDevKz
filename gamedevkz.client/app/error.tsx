'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedButton from '@/components/animated-button'
import { ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl mb-4">Упссс... Что то пошло не так</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Мы приносим свои извинения за неудобства. Пожалуйста, попробуйте снова или вернитесь на главную страницу.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <AnimatedButton
            onClick={reset}
            href='/'
            variant="outline"
            icon={<ArrowLeft size={16} />}
          >
            Ещё раз
          </AnimatedButton>
          <AnimatedButton
            href="/"
            variant="outline"
            icon={<ArrowLeft size={16} />}
          >
            На главную
          </AnimatedButton>
        </div>
      </motion.div>
    </div>
  )
} 