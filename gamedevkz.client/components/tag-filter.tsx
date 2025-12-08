"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function TagFilters() {
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const currentTag = searchParams?.get("tag") || ""
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    async function fetchTags() {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:5266/api/Events")
        if (!res.ok) throw new Error(`Ошибка ${res.status}`)
        const data = await res.json()
        if (!mounted) return
        // собрать уникальные теги
        const unique = new Set<string>()
        for (const ev of data) {
          if (Array.isArray(ev.tags)) {
            ev.tags.forEach((t: string) => unique.add(t))
          }
        }
        setTags(Array.from(unique).sort((a, b) => a.localeCompare(b)))
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message ?? "Не удалось загрузить теги")
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }
    fetchTags()
    return () => {
      mounted = false
    }
  }, [])

  const setTag = (tag?: string) => {
    // формируем новые search params (сохраняем q если есть)
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (!tag) {
      params.delete("tag")
    } else {
      params.set("tag", tag)
    }

    // обновляем URL без полной перезагрузки
    const base = window.location.pathname
    const query = params.toString()
    router.push(`${base}${query ? `?${query}` : ""}`)
  }

  if (loading) {
    return <div className="flex gap-2"><div className="h-8 w-20 bg-gray-200 rounded animate-pulse" /></div>
  }

  if (error) {
    return <div className="text-red-500">Ошибка тегов</div>
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => setTag(undefined)}
        className={`px-3 py-1 rounded-full text-sm border ${
          !currentTag ? "bg-white text-black" : "bg-transparent text-white/90 border-white/30"
        }`}
      >
        Все
      </button>

      {tags.map((tag) => {
        const active = currentTag && currentTag.toLowerCase() === tag.toLowerCase()
        return (
          <button
            key={tag}
            onClick={() => setTag(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              active ? "bg-white text-black" : "bg-transparent text-white/90 border border-white/20"
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
