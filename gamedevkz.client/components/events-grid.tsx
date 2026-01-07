"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useSearchParams, usePathname } from "next/navigation"
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
  // slug? если есть, можно добавить: slug?: string
}

export default function EventsGrid() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("q") || ""
  const tagFilter = searchParams?.get("tag") || ""
  const { playShutterSound } = useShutterSound()
  const pathname = usePathname()

  useEffect(() => {
    const controller = new AbortController()

    async function fetchEvents() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("https://akira-gamedev.online/api/Events", { signal: controller.signal })
        if (!res.ok) {
          throw new Error(`Ошибка загрузки: ${res.status}`)
        }
        const data = (await res.json()) as EventItem[]
        // сортируем по дате (новые/ближайшие снизу -> можно изменить)
        data.sort((a, b) => {
          const da = new Date(a.eventStartDate).getTime()
          const db = new Date(b.eventStartDate).getTime()
          return da - db
        })
        setEvents(data)
      } catch (err: any) {
        if (err.name === "AbortError") return
        setError(err?.message ?? "Ошибка при загрузке событий")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
    return () => controller.abort()
  }, [pathname]) // обновляем при смене пути (и query params — push заменит путь)

  // фильтрация локально по q и tag
  const filteredEvents = events.filter((e) => {
    const matchesQuery =
      !searchQuery ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTag =
      !tagFilter || e.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase())
    return matchesQuery && matchesTag
  }).reverse();

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
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
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

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Событий не найдено</h3>
        <p className="text-gray-600 dark:text-gray-400">Попробуйте изменить фильтры или поиск</p>
      </div>
    )
  }

  // Group events into chunks of 7 (1 featured + up to 6 regular)
  const groups: EventItem[][] = []
  for (let i = 0; i < filteredEvents.length; i += 7) {
    groups.push(filteredEvents.slice(i, i + 7))
  }

  return (
    <div className="space-y-16">
      {groups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="space-y-8">
          {group.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="w-full"
            >
              {/* Featured event */}
              <Link
                href={`/events/${group[0].id}`}
                className="group block"
                onClick={playShutterSound}
              >
                <div className="relative overflow-hidden bg-black rounded-lg shadow-lg">
                  <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                    <Image
                      src={group[0].coverImageUrl || "/placeholder.svg?height=1200&width=2000"}
                      alt={group[0].name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-white/30 text-white backdrop-blur-sm">
                        Мероприятия
                      </span>
                      {group[0].tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs bg-white/20 text-white backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-3xl md:text-4xl text-white mb-3 group-hover:text-white/90 transition-colors">
                      {group[0].name}
                    </h3>
                    <div className="text-sm text-white/60 mb-3">
                      {formatDate(group[0].eventStartDate)} • {group[0].location}
                    </div>
                    <p className="text-white/80 mb-6 line-clamp-3 max-w-2xl text-sm md:text-base group-hover:text-white/90 transition-colors">
                      {group[0].description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-white border-b border-white/30 pb-1 group-hover:border-white transition-colors">
                      <span>Подробнее о событии</span>
                      <ArrowRight
                        size={16}
                        className="transform translate-x-0 transition-transform duration-300 group-hover:translate-x-2"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {group.length > 1 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.slice(1).map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Link href={`/events/${event.id}`} className="group block h-full" onClick={playShutterSound}>
                    <div className="relative h-full overflow-hidden bg-black rounded-lg shadow-md">
                      <div className="relative h-80 w-full overflow-hidden">
                        <Image
                          src={event.coverImageUrl || "/placeholder.svg?height=600&width=800"}
                          alt={event.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-2xl text-white mb-2 group-hover:text-white/90 transition-colors">
                          {event.name}
                        </h3>
                        <div className="text-xs text-white/60 mb-2">
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
          )}
        </div>
      ))}
    </div>
  )
}
