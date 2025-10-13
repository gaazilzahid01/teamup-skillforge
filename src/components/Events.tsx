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
  joined_by_individuals: string[]
}

type Student = {
  skills: string[]
  collegeid: string
  city: string
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [filter, setFilter] = useState<"all" | "nearMe" | "matchingSkills" | "yetToBegin">("all")
  const navigate = useNavigate()
  const { user } = useAuth()

  // Fetch student details
  useEffect(() => {
    if (!user) return

    async function fetchStudent() {
      try {
        const { data, error } = await supabase
          .from("studentdetails")
          .select("skills, collegeid")
          .eq("userid", user.id)
          .single()
        if (error) throw error

        const { data: collegeData, error: collegeError } = await supabase
          .from("colleges")
          .select("city")
          .eq("collegeid", data.collegeid)
          .single()
        if (collegeError) throw collegeError

        setStudent({ ...data, city: collegeData.city })
      } catch (err) {
        console.error("Error fetching student details:", err)
      }
    }

    fetchStudent()
  }, [user])

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("events")
        .select(
          "eventid, name, description, date, location, skills, joined_by_individuals"
        )
        .order("date", { ascending: true })

      if (error) {
        console.error("Could not connect to database:", error)
        setError("Could not connect to the database")
      } else {
        setEvents(data || [])
      }

      setLoading(false)
    }

    fetchEvents()
  }, [])

  const handleJoin = (eventId: string) => {
    navigate(`/registration/${eventId}`)
  }

  if (!user) return <p className="p-6">Please log in to see events.</p>
  if (loading) return <p className="p-6">Loading events...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>

  // Apply filters
  const filteredEvents = events.filter(event => {
    if (!student) return true

    switch (filter) {
      case "nearMe":
        return event.location === student.city
      case "matchingSkills":
        if (!event.skills || event.skills.length === 0) return false
        const matchedSkills = event.skills.filter(skill => student.skills.includes(skill))
        return matchedSkills.length / event.skills.length >= 0.6
      case "yetToBegin":
        return new Date(event.date) > new Date()
      default:
        return true
    }
  })

  return (
    <div className="flex flex-col p-6 h-full">
      <Card className="shadow-sm w-full h-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Events</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "nearMe" ? "default" : "outline"} onClick={() => setFilter("nearMe")}>
              Near Me
            </Button>
            <Button variant={filter === "matchingSkills" ? "default" : "outline"} onClick={() => setFilter("matchingSkills")}>
              Matching My Skills
            </Button>
            <Button variant={filter === "yetToBegin" ? "default" : "outline"} onClick={() => setFilter("yetToBegin")}>
              Yet to Begin
            </Button>
          </div>

          {filteredEvents.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="flex flex-col gap-4">
                {filteredEvents.map(event => {
                  const registered = event.joined_by_individuals?.includes(user.id)
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
                          onClick={() => handleJoin(event.eventid)}
                          className="w-full md:w-auto mt-2 md:mt-0"
                          disabled={registered}
                        >
                          {registered ? "Registered" : "Join"}
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
