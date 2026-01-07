"use client"

import Image from "next/image"
import { Mail, MapPin, Phone, Instagram, Twitter, Facebook, Youtube, Linkedin, Github } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { motion } from "framer-motion"
import FeaturedCollections from "@/components/featured-collections"
import AnimatedButton from "@/components/animated-button"
import { ArrowRight } from "lucide-react"


export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Spacer for header
      <div className="header-height"></div> */}

       {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <Image
          src="/Contact/contact.jpg?height=800&width=1920"
          alt="Contact"
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
          <h1 className="text-4xl md:text-5xl text-white mb-4">Связь</h1>
          <p className="text-white/90 text-lg max-w-2xl">На случай если понадобиться коснуться</p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-16 mt-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl mb-6">Будем на связи</h1>
            <p className="text-primary/60 mb-8 max-w-md">
              Мы всегда открыты для новых знакомств и сотрудничества. Независимо от того, есть ли у вас вопрос, предложение или просто хотите поздороваться, мы будем рады услышать вас!
            </p>

            <motion.div
              className="space-y-6 mb-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3,
                  },
                },
              }}
            >
              {[
                {
                  icon: <Mail className="text-primary mt-1" size={20} />,
                  title: "Email",
                  content: "vladimir@thehub.su",
                },
                {
                  icon: <MapPin className="text-primary mt-1" size={20} />,
                  title: "Координаты",
                  content: "43.2380° N, 76.8829° E",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  className="flex items-start gap-4"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  {item.icon}
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-primary/60">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-xl mb-4">Соц. сети</h3>
              <div className="flex flex-wrap gap-1">
                {[
                  { icon: <Instagram size={26} />, label: "Instagram", href: "https://instagram.com/akira_gamedev" },
                  { icon: <TelegramIcon size={26} />, label: "Telegram", href: "https://t.me/akira_almaty" },
                  { icon: <Linkedin size={20} />, label: "Linkedin", href: "https://www.linkedin.com/company/akira-gamedev" },
                ].map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-primary-secondary rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                    {/* <span className="text-primary-foreground dark:text-primary-foreground">{item.label}</span> */}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-primary dark:bg-primary-foreground p-8 rounded-2xl shadow-sm border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl mb-6">Связаться с нами</h2>
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="min-w-[90%] justify-self-center mr-4 ml-4 py-20 my-20 px-4 md:px-8 rounded-3xl border-[1px] border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Часто задаваемые вопросы
          </motion.h2>

          <div className="space-y-8">
            {[
              {
                question: "Как стать участником АКИРЫ?",
                answer:
                  "Стать участником нашего клуба может любой человек, достаточно поучаствовать в наших мероприятиях после чего мы добавим тебя в наш закрытый чатик.",
              },
              {
                question: "Участие в клубе платное?",
                answer:
                  "Нет, мы не берём клубных взносов или подписок, но некоторые наше мероприятия могут быть платными для оплаты аренды площадки.",
              },
              {
                question: "Вы обучаете игровой разработке?",
                answer:
                  "Нет, мы не занимаемся обучением и не проводим курсов, но вывсегда можете найти ментора, спросить совета и поучаствовать в образовательных вокршопах нашего клуба.",
              },
       
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-medium text-xl mb-2">{item.question}</h3>
                <p className="text-primary/60">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* Featured Collections */}
      <section className="mt-20 mb-20 py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Последние события</h2>
            <p className="text-primary max-w-2xl mx-auto">
              Здесь ты можешь найти прошедние и грядующие ивенты нашего клуба
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

const TelegramIcon = ({ size = 24, color = '#0088CC' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={color}
    role="img"
  >
    <title>Telegram icon</title>
    {/* Paste the SVG path data here */}
    <path xmlns="http://www.w3.org/2000/svg" d="M41.4193 7.30899C41.4193 7.30899 45.3046 5.79399 44.9808 9.47328C44.8729 10.9883 43.9016 16.2908 43.1461 22.0262L40.5559 39.0159C40.5559 39.0159 40.3401 41.5048 38.3974 41.9377C36.4547 42.3705 33.5408 40.4227 33.0011 39.9898C32.5694 39.6652 24.9068 34.7955 22.2086 32.4148C21.4531 31.7655 20.5897 30.4669 22.3165 28.9519L33.6487 18.1305C34.9438 16.8319 36.2389 13.8019 30.8426 17.4812L15.7331 27.7616C15.7331 27.7616 14.0063 28.8437 10.7686 27.8698L3.75342 25.7055C3.75342 25.7055 1.16321 24.0823 5.58815 22.459C16.3807 17.3729 29.6555 12.1786 41.4193 7.30899Z" fill="#000000"/>
  </svg>
);
