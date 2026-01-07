// components/event-content.tsx
"use client"

import React, { useEffect, useState, useRef, useMemo } from "react"
import Image from "next/image"
import { PhotoGallery } from "@/components/photo-gallery"
import TagList from "@/components/tag-list"
import { motion } from "framer-motion"
import FeaturedCollections from "@/components/featured-collections"
import AnimatedButton from "@/components/animated-button"
import { ArrowRight } from "lucide-react"

export type EventItem = {
  id: number
  name: string
  description: string
  location?: string
  locationUrl?: string
  coverImageUrl?: string | null
  eventStartDate?: string | null
  tags?: string[]
  photoUrls?: string[]
}

interface Props {
  event: EventItem
}

export default function EventContent({ event }: Props) {
  // --- registration modal state ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const modalRef = useRef<HTMLDivElement | null>(null)
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  // localStorage keys (per-field and per-event registration flag)
  const PREFIX = "participant_"
  const KEY_FULL = `${PREFIX}fullName`
  const KEY_EMAIL = `${PREFIX}email`
  const KEY_PHONE = `${PREFIX}phone`
  const KEY_REGISTERED = (id: number | string) => `${PREFIX}registered_${id}`

  // format date
  const formatDate = (iso?: string | null) => {
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

  // determine if event already started (compare timestamps)
  const isPastEvent = (() => {
    if (!event.eventStartDate) return false
    const eventTs = new Date(event.eventStartDate).getTime()
    const now = Date.now()
    return eventTs <= now
  })()

  // load saved user info & registration status from localStorage
  useEffect(() => {
    try {
      const savedFull = localStorage.getItem(KEY_FULL)
      const savedEmail = localStorage.getItem(KEY_EMAIL)
      const savedPhone = localStorage.getItem(KEY_PHONE)
      if (savedFull) setFullName(savedFull)
      if (savedEmail) setEmail(savedEmail)
      if (savedPhone) setPhone(savedPhone)

      if (event && event.id != null) {
        const reg = localStorage.getItem(KEY_REGISTERED(event.id))
        if (reg === "true") setSubmitted(true)
      }
    } catch (err) {
      // ignore localStorage errors (e.g. SSR or private mode)
      console.warn("LocalStorage load error:", err)
    }
  }, [event?.id])

  // open modal & focus first input
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50)
      // prevent background scroll
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isModalOpen])

  // basic email validator
  const isValidEmail = (e: string) =>
    // simple regex
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

  // submit handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSubmitError(null)

    // validation
    if (!fullName.trim()) {
      setSubmitError("Пожалуйста, укажите имя.")
      firstInputRef.current?.focus()
      return
    }
    if (!email.trim() || !isValidEmail(email)) {
      setSubmitError("Пожалуйста, укажите корректный email.")
      return
    }

    if (!event?.id) {
      setSubmitError("Неизвестное событие.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        eventId: event.id,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      }

      const res = await fetch("https://akira-gamedev.online/api/RequestParticipiant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Ошибка сервера: ${res.status}`)
      }

      // success -> persist user info and registration flag
      try {
        localStorage.setItem(KEY_FULL, fullName.trim())
        localStorage.setItem(KEY_EMAIL, email.trim())
        localStorage.setItem(KEY_PHONE, phone.trim())
        localStorage.setItem(KEY_REGISTERED(event.id), "true")
      } catch (err) {
        console.warn("LocalStorage save error:", err)
      }

      setSubmitted(true)
      // show success message
    } catch (err: any) {
      console.error("Registration error:", err)
      setSubmitError(err?.message || "Ошибка при отправке. Попробуйте позже.")
    } finally {
      setSubmitting(false)
    }
  }

  // close modal helper
  const closeModal = () => {
    setIsModalOpen(false)
    setSubmitError(null)
  }

  // keyboard ESC to close modal
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") closeModal()
    }
    if (isModalOpen) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isModalOpen])

  const sanitizeHtml = (dirtyHtml: string) => {
    if (!dirtyHtml) return ""

    // Создаём документ и парсим HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(dirtyHtml, "text/html")

    const allowedTags = new Set([
      "a",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "span",
      "div",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
      "hr"
    ])

    const allowedAttrs = new Set([
      "href",
      "src",
      "alt",
      "title",
      "target",
      "rel",
      "class",
      "id",
      "width",
      "height",
      "role",
      "aria-hidden",
      "aria-label"
    ])

    const isUriSafe = (uri: string) => {
      if (!uri) return true
      const trimmed = uri.trim().toLowerCase()
      // разрешаем relative, http, https, mailto, tel, data:image (для небольших изображений)
      if (trimmed.startsWith("javascript:")) return false
      return true
    }

    const walk = (node: Node) => {
      // Работаем с копией списка дочерних узлов (live list может меняться)
      const children = Array.from(node.childNodes)
      for (const child of children) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement
          const tag = el.tagName.toLowerCase()

          if (!allowedTags.has(tag)) {
            // Если тег не разрешён — распакуем его содержимое (удалим сам тег, оставим детей)
            const parent = el.parentNode
            if (parent) {
              while (el.firstChild) {
                parent.insertBefore(el.firstChild, el)
              }
              parent.removeChild(el)
              // после удаления, продолжим обход от родителя (уже вставленные дети будут обработаны в следующей итерации)
              walk(parent)
              continue
            } else {
              // нет родителя — просто удаляем
              el.remove()
              continue
            }
          }

          // Очищаем атрибуты — оставляем только белый список
          const attrs = Array.from(el.attributes)
          for (const attr of attrs) {
            const name = attr.name.toLowerCase()
            const value = attr.value

            if (!allowedAttrs.has(name)) {
              el.removeAttribute(attr.name)
              continue
            }

            // Проверка безопасности для href/src
            if ((name === "href" || name === "src") && !isUriSafe(value)) {
              el.removeAttribute(attr.name)
              continue
            }

            // Для ссылок target=_blank — ставим безопасный rel
            if (tag === "a" && name === "target") {
              // оставляем target, но обеспечим rel
              const rel = el.getAttribute("rel") || ""
              const relParts = rel.split(/\s+/).filter(Boolean)
              if (!relParts.includes("noopener")) relParts.push("noopener")
              if (!relParts.includes("noreferrer")) relParts.push("noreferrer")
              el.setAttribute("rel", relParts.join(" "))
            }
          }
        }

        // рекурсивно обработать детей
        walk(child)
      }
    }

    walk(doc.body)

    return doc.body.innerHTML
  }

  // подготовим безопасный HTML (memoize для производительности)
  const sanitizedDescription = useMemo(() => sanitizeHtml(event.description ?? ""), [event.description])


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <Image
          src={event.coverImageUrl || "/Morocco/morocco-8.webp?height=800&width=1920"}
          alt={event.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          className="absolute inset-0 flex flex-col justify-center items-center text-center p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl text-white mb-4">{event.name}</h1>
          <div className="text-white/80 mb-2">
            {formatDate(event.eventStartDate)} {event.location ? ` • ${event.location}` : ""}
          </div>
          <TagList tags={event.tags ?? []} variant="light" />
        </motion.div>
      </section>

      {/* Event Info */}
      <motion.section
        className="py-12 px-4 md:px-8 max-w-5xl mx-auto mb-10 mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="prose max-w-none dark:prose-invert">
          <div
            className="text-lg text-primary leading-relaxed"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>

        {/* Место/адрес */}
        {event.location && (
          <div className="mt-6 text-lg text-gray-800 ">
            <strong>Место:</strong> <a className="underline" target="_blank"  href={event.locationUrl}>{event.location}</a>
          </div>
        )}

        {/* Дата/время */}
        {event.eventStartDate && (
          <div className="mt-2 text-lg text-gray-800">
            <strong>Когда:</strong> {formatDate(event.eventStartDate)}
          </div>
        )}

        {/* Registration action */}
        <div className="mt-6">
          {submitted ? (
            <div className="rounded-md bg-green-700/90 text-white px-4 py-3 inline-block">
              Спасибо за регистрацию! Подтверждение вашего участие придёт на указанный Email адрес.
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isPastEvent}
                className={`inline-flex items-center gap-3 px-5 py-3 rounded-md font-medium transition ${
                  isPastEvent
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-white text-black hover:opacity-90"
                }`}
                aria-disabled={isPastEvent}
                title={isPastEvent ? "Событие уже прошло — регистрация закрыта" : "Зарегистрироваться на событие"}
              >
                Зарегистрироваться
              </button>
              {isPastEvent && (
                <div className="mt-2 text-sm text-gray-400">Регистрация недоступна — событие уже прошло.</div>
              )}
            </>
          )}
        </div>
      </motion.section>

      {/* Photo Gallery */}
      {/* <section className="py-8 px-4 md:px-8 max-w-[90%] mx-auto mb-20">
        <PhotoGallery photos={event.photoUrls ?? []} />
      </section> */}

      {/* ---------- Modal markup ---------- */}
      {isModalOpen && !submitted && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeModal}
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="relative max-w-xl w-full bg-white rounded-lg shadow-xl z-10 overflow-auto"
            style={{ maxHeight: "90vh" }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Регистрация на событие</h3>
                  <div className="text-sm text-gray-600">{event.name}</div>
                </div>
                <button
                  onClick={closeModal}
                  aria-label="Закрыть"
                  className="text-gray-500 hover:text-gray-700 ml-4"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Полное имя</label>
                  <input
                    ref={firstInputRef}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2"
                    placeholder="Иван Иванов"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2"
                    placeholder="name@example.com"
                    required
                    type="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Телефон</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2"
                    placeholder="+7 (777) 123-45-67"
                    type="tel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Сообщение (необязательно)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2"
                    rows={4}
                    placeholder="Хочу выступить с докладом..."
                  />
                </div>

                {submitError && (
                  <div className="text-sm text-red-600">{submitError}</div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
                      submitting ? "bg-gray-300 text-gray-700" : "bg-black text-white hover:opacity-90"
                    }`}
                  >
                    {submitting ? "Отправка..." : "Отправить заявку"}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-sm text-gray-600 hover:underline"
                    disabled={submitting}
                  >
                    Отмена
                  </button>
                </div>
              </form>

              <div className="mt-4 text-xs text-gray-500">
                Нажимая «Отправить», вы соглашаетесь на обработку данных для связи по этому мероприятию.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
