// app/events/[id]/page.tsx

import { notFound } from "next/navigation"
import EventContent from "@/components/event-content"

interface Props {
  params: Promise<{ id: string }>   // 👈 ВАЖНО: params — это промис!
}

export default async function EventPage({ params }: Props) {
  const { id } = await params        // 👈 Теперь await обязателен

  const res = await fetch(`https://akira.emosdk.tech/api/Events/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    notFound()
  }

  const event = await res.json()

  if (!event) {
    notFound()
  }

  return <EventContent event={event} />
}
