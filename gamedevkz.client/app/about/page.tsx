"use client"

import Image from "next/image"
import { ArrowRight, Camera, Globe, Award, Users } from "lucide-react"
import { motion } from "framer-motion"
import AnimatedButton from "@/components/animated-button"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <Image
          src="/about/about.jpg?height=800&width=1920"
          alt="About"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          className="absolute inset-0 flex flex-col justify-center items-center text-center p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl text-white mb-4">О нас</h1>
          <p className="text-white/90 text-lg max-w-2xl">Кто мы, что мы, как мы </p>
        </motion.div>
      </section>
      <div className="header-height"></div>

      {/* Bio Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative h-[600px] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src="/about/first_photo.jpg?height=1200&width=800"
              alt="First Photo"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl mb-6">О нас</h2>
            <p className="text-primary mb-4">
              Алматинский Клуб Игровых Разработчиков АКИРА - это профессиональное сообщество, объединяющее разработчиков игр, художников, дизайнеров, композиторов, тестироващиков и геймеров в Алматы. Наша миссия - создать платформу для обмена знаниями, опытом и поддержкой среди тех, кто увлечен созданием игр.
            </p>
            <p className="text-primary mb-4">
              Наш независимый, некоммерческий клуб был основан 14 февраля 2023, после проведения международного казахстанского геймджема <a href="https://mythical.gamejam.su" target="_blank" className="underline">mythical.gamejam</a>, как место для продолжения общения и сотрудничества между участниками. С тех пор мы организовали множество мероприятий, включая встречи, воркшопы, лекции и демо-дни, чтобы помочь нашим членам развиваться профессионально и лично.
            </p>
            <p className="text-primary mb-6">
              
            </p>
           
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Наши ценности
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Люди",
                description:
                  "Мы верим, что основа любой индустрии — это люди. Мы стремимся создавать сообщество, где каждый чувствует себя ценным и поддерживаемым.",
              },
              {
                title: "Поддержка",
                description:
                  "Мы здесь, чтобы помогать друг другу расти и развиваться. Независимо от уровня опыта, каждый член нашего клуба может найти поддержку и наставничество.",
              },
              {
                title: "Развитие",
                description:
                  "Мы стремимся к постоянному обучению и совершенствованию. Через наши мероприятия и ресурсы мы помогаем нашим членам развивать свои навыки и знания в области игровой разработки.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="text-primary dark:text-primary-secondary bg-primary-secondary dark:bg-primary p-8 rounded-2xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="text-primary-secondary dark:text-primary-foreground text-xl mb-4">{item.title}</h3>
                <p className="text-primary-secondary dark:text-primary-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          My Journey
        </motion.h2>
        <div className="space-y-12">
          {[
            {
              year: "2013",
              title: "First Exhibition",
              description:
                "Hosted my first photography exhibition in New York, featuring landscapes from across North America.",
            },
            {
              year: "2015",
              title: "National Geographic Feature",
              description:
                "My series on indigenous communities was featured in National Geographic, marking a significant milestone in my career.",
            },
            {
              year: "2018",
              title: "Photography Book",
              description:
                'Published my first photography book, "Perspectives," showcasing a decade of travel photography.',
            },
            {
              year: "2020",
              title: "Photography Workshops",
              description:
                "Began offering photography workshops and mentoring programs to share knowledge and techniques with aspiring photographers.",
            },
            {
              year: "Present",
              title: "Ongoing Projects",
              description:
                "Currently working on long-term documentary projects focused on environmental conservation and cultural preservation.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.year}
              className="flex flex-col md:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="md:w-1/4">
                <h3 className="text-xl">{item.year}</h3>
              </div>
              <div className="md:w-3/4">
                <h4 className="font-medium text-2xl mb-2">{item.title}</h4>
                <p className="text-primary">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="min-w-[90%] justify-self-center mr-4 ml-4 py-20 my-20 px-4 md:px-8 rounded-3xl border-[1px] border-border">
        <motion.div
          className="max-w-7xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-primary text-3xl md:text-4xl mb-6">Поговорим?</h2>
          <p className="text-primary max-w-2xl mx-auto mb-8">
            Мы всегда открыты для новых знакомств и сотрудничества. Независимо от того, есть ли у вас вопрос, предложение или просто хотите поздороваться, мы будем рады услышать вас!
          </p>
          <AnimatedButton href="/contact" variant="primary" icon={<ArrowRight size={18} />}>
            Связь
          </AnimatedButton>
        </motion.div>
      </section>
    </div>
  )
}
