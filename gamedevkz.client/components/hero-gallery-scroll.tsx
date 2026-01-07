'use client'

import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "@/components/hero-gallery-scroll-animation"
import { Button } from "@/components/ui/button"
import AnimatedButton from "@/components/animated-button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

const IMAGES = [
  "/HeroImages/cover.webp",
  "/HeroImages/cover2.jpg",
  "/HeroImages/cover1.jpg",
  "/HeroImages/cover0.jpeg",
  "/HeroImages/cover.jpg",
]

export function HeroGalleryScroll() {
  return (
    <ContainerScroll className="h-[200vh]">
      <BentoGrid className="sticky left-0 top-0 z-0 h-screen w-full p-4">
        {IMAGES.map((imageUrl, index) => (
          <BentoCell
            key={index}
            className="overflow-hidden rounded-3xl shadow-xl"
          >
            <img
              className="size-full object-cover object-center"
              src={imageUrl}
              alt=""
            />
          </BentoCell>
        ))}
      </BentoGrid>

      <ContainerScale className="relative z-10 text-center">
        <motion.div
          className="itens-center justify-center flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          
        >
          <img src={"/Logo/akira_logo.png"}></img>
        </motion.div>
        <motion.p
          className="my-6 max-w-xl text-primary "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
        Независимое сообщество Людей, которые любят и делают видео-игры
        </motion.p>
        <div className="flex items-center flex-col md:flex-row justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <AnimatedButton href="/showcase" variant="outline" icon={<ArrowRight size={16} />}>
              Мероприятия
            </AnimatedButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AnimatedButton href="/about" variant="outline" icon={<ArrowRight size={16} />}>
              О нас
            </AnimatedButton>
          </motion.div>
        </div>
      </ContainerScale>
    </ContainerScroll>
  )
}
