"use client"

import Link from "next/link"
import { Instagram, Linkedin } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { motion } from "framer-motion"
import Logo from "./logo"
import useDisableRightClick from './useDisableRightClick'; // Adjust the import path as necessary

export default function Footer() {
  useDisableRightClick(); // Apply the hook to disable right-click on images

  return (
    <motion.footer
      className="bg-background border-t border-border py-12 px-4 md:px-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            {/* <Logo /> */}
            <Link href="/" className="font-press-start-2p text-2xl font-bold inline-block text-foreground">
              <img className="h-[3vh]" src={"/Logo/akira_logo.png"}></img>
            </Link>
          </div>
          <p className="text-muted-foreground max-w-md mb-6 max-w-xs">
            Профессиональное сообщество игровых разработчиков в Алматы
          </p>
          <div className="flex space-x-4 items-center">
            <motion.a
              href="https://instagram.com/akira_gamedev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </motion.a>


              <motion.a
                href="https://t.me/akira_almaty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <TelegramIcon size={24} color="" />
                <span className="sr-only">Telegram</span>
            </motion.a>
            <motion.a
                href="https://www.linkedin.com/company/akira-gamedev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={20} />
                <span className="sr-only">Linkedin</span>
            </motion.a> 

          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="section-title text-2xl mb-4">Главная</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/showcase" className="text-muted-foreground hover:text-primary transition-colors">
                События
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                О нас
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Контакты
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="section-title text-2xl mb-4">Контакты</h3>
          <ul className="space-y-2 text-muted-foreground">
            <h4 className="text-primary">Email</h4>
            <a href="mailto:vladimir@thehub.su"><li>vladimir@thehub.su</li></a> 
            <h4 className="text-primary">Координаты</h4>
            <li>43.2380° N, 76.8829° E</li>
          </ul>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border">
        <motion.p
          className="text-center text-muted-foreground text-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          © {new Date().getFullYear()} All rights reserved. 
        </motion.p>
      </div>
    </motion.footer>
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
