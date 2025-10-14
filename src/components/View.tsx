// src/components/View.tsx
"use client"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

type Event = {
  eventid: string
  name: string
  description: string
  date: string
  location: string
  skills: string[]
  joined_by_individuals: string[]
}

type Team = {
  name: string
  members: string[]
}

export default function ViewEventPage() {
  const { eventId } = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true)

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("eventid", eventId)
        .single()

      if (eventError) {
        console.error(eventError)
      } else {
        setEvent(eventData)
      }

      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .eq("event_id", eventId)

      if (teamsError) {
        console.error(teamsError)
      } else {
        setTeams(teamsData || [])
      }

      setLoading(false)
    }

    fetchEvent()
  }, [eventId])

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>
  if (!event) return <p className="p-6 text-red-500">Event not found</p>

  return (
    <div className="flex flex-col p-6 h-full">
      <Card className="shadow-sm w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{event.description}</p>
          <p className="mt-2 text-sm">
            📍 Location: <span className="font-medium">{event.location}</span>
          </p>
          <p className="text-sm text-gray-500">
            🗓️ Date: {new Date(event.date).toLocaleString()}
          </p>

          {event.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {event.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <h2 className="mt-6 text-xl font-semibold">Teams</h2>
          <ScrollArea className="max-h-40 mt-2">
            <ul className="flex flex-col gap-2">
              {teams.map((team, i) => (
                <li key={i}>
                  <strong>{team.name}</strong> – {team.members.length} members
                </li>
              ))}
            </ul>
          </ScrollArea>

          <h2 className="mt-6 text-xl font-semibold">Individuals</h2>
          <ScrollArea className="max-h-40 mt-2">
            <ul className="flex flex-col gap-2">
              {event.joined_by_individuals?.map((uid) => (
                <li key={uid}>{uid}</li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
