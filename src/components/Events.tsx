// src/pages/events.tsx

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Event = {
  id: number
  title: string
  description: string
  date: string
  location: string
  joined?: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Frontend Hackathon",
      description: "Collaborate with other devs and build something cool in 24 hours.",
      date: "October 20, 2025",
      location: "Online",
    },
    {
      id: 2,
      title: "AI Innovation Meetup",
      description: "Meet industry experts discussing AI ethics and practical applications.",
      date: "November 2, 2025",
      location: "Bangalore, India",
    },
    {
      id: 3,
      title: "SkillForge Developer Summit",
      description: "Annual gathering for TeamUp developers — workshops, networking, and more.",
      date: "December 15, 2025",
      location: "Remote + On-site",
    },
  ])

  const handleJoin = (id: number) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, joined: !e.joined } : e
      )
    )
  }

  return (
    <div className="flex flex-col p-6 h-full">
      <h1 className="text-3xl font-semibold mb-4">Upcoming Events</h1>
      <ScrollArea className="h-[70vh] rounded-md border p-4">
        <div className="spac
