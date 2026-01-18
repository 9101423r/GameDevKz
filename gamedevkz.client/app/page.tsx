"use client"

import { ArrowRight } from "lucide-react"
import FeaturedCollections from "@/components/featured-collections"
import AnimatedButton from "@/components/animated-button"
import { motion } from "framer-motion"
import HeroSlider from "@/components/hero-slider"
import Image from "next/image"
import { HeroGalleryScroll } from "@/components/hero-gallery-scroll"
import { LayoutGridDemo } from "@/components/layout-image-grid"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Spacer for header */}
      <div className="header-height"></div>

      {/* Hero Section with Slider */}
      <HeroGalleryScroll /> 

      {/* Hero Section with Slider 
      <HeroSlider />*/}

      {/* Introduction */}
      <section id="introduction" className="mt-32 mb-20 sm:py-0 py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl mb-6">Игры это Искусство. А Искусство это Любовь.</h2>
            <p className="text-primary-secondary mb-6">
              Cообщество, где разработчики, художники, дизайнеры и геймеры собираются вместе, чтобы находить поддержку, получать фидбек и воплощать свои идеи в жизнь!
            </p>
            <p className="text-primary-secondary mb-8">
              Наша мечта — сделать так, чтобы каждый разработчик мог найти друзей с общими интересами, первых фанатов своего проекта и даже внешние инвестиции! 
            </p>
            <AnimatedButton href="/about" variant="outline" icon={<ArrowRight size={16} />}>
              Что ещё?
            </AnimatedButton>
          </motion.div>
          <motion.div
            className="relative h-[500px] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Image
              src="/HeroImages/gamesislove.webp?height=1000&width=800"
              alt="Photographer at work"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Dynamic Frame Section 
      <DynamicFrame />*/}

      {/* Layout Grid Section */}
      <LayoutGridDemo />

       {/* Call to Action */}
      <section className="z-10 min-w-[90%] justify-self-center mr-4 ml-4 py-20 lg:my-20 sm:mt-0 sm:mb-20 px-4 md:px-8 px-2 rounded-3xl border-[1px] border-border">
        <motion.div
          className="max-w-7xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-primary text-3xl md:text-4xl mb-6">Заинтересован?</h2>
          <p className="text-primary max-w-2xl mx-auto mb-8">
            Наш клуб - это открытое для мира пространство. Для вступления в клуб достаточно прийти и поучаствовать в любом нашем мероприятии, и мы добавим тебя в наш закрытый чатик.
            <br />
            А для потенциального партнёрства можешь связаться с нами
          </p>
          <AnimatedButton href="/contact" variant="primary" icon={<ArrowRight size={18} />}>
            Связь - связь
          </AnimatedButton>
        </motion.div>
      </section>

      {/* Featured Collections */}
      <section className="lg:mt-32 mb-32 px-4 md:px-8 z-10 mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-primary text-3xl md:text-4xl mb-4">Последние события</h2>
            <p className="text-primary max-w-2xl mx-auto">
              Здесь ты можешь найти прошедшие и грядущие ивенты нашего клуба
            </p>
          </motion.div>
          <FeaturedCollections />
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <AnimatedButton href="/showcase" variant="primary" icon={<ArrowRight size={18} />}>
              Больше
            </AnimatedButton>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
