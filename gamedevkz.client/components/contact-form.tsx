"use client"

import type { FormEvent } from "react"
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ContactFormProps {
  className?: string
}

export function ContactForm({ className }: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setFormErrors([])
    setFieldErrors({})

    try {
      const formElement = event.currentTarget
      const formData = new FormData(formElement)

      // <- Замените access_key на ваш ключ Web3Forms
      formData.append("access_key", "2102b566-abc6-49c8-b6f9-5e4a38484d99")

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSucceeded(true)
        formElement.reset()
      } else {
        const errors: string[] = []
        const fErrors: Record<string, string> = {}

        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          data.errors.forEach((err: any) => {
            if (err?.field) {
              fErrors[err.field] = err.message || "Invalid value"
            } else if (err?.message) {
              errors.push(err.message)
            }
          })
        } else if (data?.message) {
          errors.push(data.message)
        } else {
          errors.push("Ошибка при отправке формы. Попробуйте позже.")
        }

        setFieldErrors(fErrors)
        setFormErrors(errors)
      }
    } catch (e) {
      setFormErrors(["Сетевая ошибка: не удалось отправить форму."])
    } finally {
      setSubmitting(false)
    }
  }

  if (succeeded) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
        Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      {formErrors && formErrors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {formErrors.map((error, idx) => (
            <p key={idx}>{error}</p>
          ))}
        </div>
      )}
      <div>
        <input type="hidden" name="subject" value="Контакт с сайта АКИРЫ"></input>
        <label htmlFor="name" className="block text-sm font-medium text-primary">
          Имя
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-[1px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-primary">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {/* Поле для отображения ошибки валидации поля email */}
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
        )}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-primary">
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-[1px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {/* Поле для отображения ошибки валидации поля message */}
        {fieldErrors.message && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
        )}
      </div>
      <div>
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white dark:text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            submitting && 'cursor-not-allowed opacity-50'
          )}
        >
          {submitting ? 'Отправка...' : 'Отправить сообщение'}
        </button>
      </div>
    </form>
  )
}
