"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useShutterSound } from "./sound-effects"

type EventItem = {
  id: number
  name: string
  description: string
  location: string
  coverImageUrl: string | null
  eventStartDate: string
  tags: string[]
  photoUrls: string[]
}

export default function FeaturedCollections() {
  const [events, setEvents] = useState<EventItem[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { playShutterSound } = useShutterSound()

  useEffect(() => {
    const controller = new AbortController()

    async function fetchEvents() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("https://akira-gamedev.online/api/Events", { signal: controller.signal })
        if (!res.ok) {
          throw new Error(`Ошибка ${res.status}: ${res.statusText}`)
        }

        const data = (await res.json()) as EventItem[]
        setEvents(data)
      } catch (err: any) {
        if (err.name === "AbortError") return
        setError(err?.message ?? "Произошла ошибка при загрузке событий")
        setEvents(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
    return () => controller.abort()
  }, [])

  const formatDate = (iso?: string) => {
    if (!iso) return ""
    try {
      return new Intl.DateTimeFormat("ru-RU", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Almaty",
      }).format(new Date(iso))
    } catch {
      return iso
    }
  }

  if (loading) {
    // простой skeleton вариант
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-full animate-pulse">
            <div className="h-80 w-full bg-gray-200 rounded-lg" />
            <div className="h-6 bg-gray-200 rounded mt-4 w-3/4" />
            <div className="h-4 bg-gray-200 rounded mt-2 w-5/6" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Не удалось загрузить события: {error}</div>
  }

  if (!events || events.length === 0) {
    return <div>Событий пока нет.</div>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Link
            href={`/events/${event.id}`}
            className="group block h-full"
            onClick={playShutterSound}
          >
            <div className="relative h-full overflow-hidden bg-black rounded-lg shadow-md">
              {/* Image container with overlay */}
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={event.coverImageUrl || "/placeholder.svg?height=600&width=800"}
                  alt={event.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
              </div>

              {/* Content positioned at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl text-white mb-1 group-hover:text-white/90 transition-colors">
                  {event.name}
                </h3>

                <div className="text-sm text-white/60 mb-2">
                  {formatDate(event.eventStartDate)} • {event.location}
                </div>

                <p className="text-white/80 mb-4 line-clamp-2 text-sm group-hover:text-white/90 transition-colors">
                  {event.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs bg-white/20 text-white backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-white opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                  />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
