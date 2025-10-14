"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"

type Event = {
  eventid: string
  name: string
  description: string
  date: string
  location: string
  skills: string[]
  joined_by_individuals?: string[] // uuid array
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Fetch events from Supabase
  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from<Event>("events")
        .select("*")
        .order("date", { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error("Could not connect to database:", err)
      setError("Could not connect to the database")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Handle join click
  const handleJoin = async (eventId: string) => {
    if (!user) return alert("You must be logged in")
    try {
      // Add user ID to joined_by_individuals column
      const event = events.find((e) => e.eventid === eventId)
      if (!event) return

      const updatedArray = Array.isArray(event.joined_by_individuals)
        ? [...event.joined_by_individuals, user.id]
        : [user.id]

      const { error } = await supabase
        .from("events")
        .update({ joined_by_individuals: updatedArray })
        .eq("eventid", eventId)

      if (error) throw error

      // Update local state so button changes immediately
      setEvents((prev) =>
        prev.map((e) =>
          e.eventid === eventId
            ? { ...e, joined_by_individuals: updatedArray }
            : e
        )
      )
    } catch (err) {
      console.error(err)
      alert("Failed to join event")
    }
  }

  if (error) return <p className="text-red-500 p-6">{error}</p>

  return (
    <div className="flex flex-col p-6 h-full">
      <Card className="shadow-sm w-full h-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="flex flex-col gap-4">
                {events.map((event) => {
                  const isRegistered = event.joined_by_individuals?.includes(user?.id || "")
                  return (
                    <Card key={event.eventid} className="p-4 shadow-sm">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <div>
                          <h2 className="text-xl font-semibold">{event.name}</h2>
                          <p className="text-gray-600 text-sm">{event.description}</p>
                          <p className="text-sm mt-1">
                            📍 <span className="font-medium">{event.location}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            🗓️ {new Date(event.date).toLocaleString()}
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
                        </div>
                        <Button
                          onClick={() =>
                            isRegistered
                              ? navigate(`/view/${event.eventid}`)
                              : handleJoin(event.eventid)
                          }
                          className="w-full md:w-auto mt-2 md:mt-0"
                        >
                          {isRegistered ? "View" : "Join"}
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
