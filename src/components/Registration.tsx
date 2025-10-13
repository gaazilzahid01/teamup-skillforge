"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function RegistrationPage() {
  const { eventId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventName, setEventName] = useState("")

  useEffect(() => {
    if (!eventId || !user) return

    async function fetchEvent() {
      setLoading(true)
      const { data, error } = await supabase
        .from("events")
        .select("name, joined_by_individuals")
        .eq("eventid", eventId)
        .single()

      if (error) {
        console.error(error)
        setError("Could not fetch event")
      } else {
        setEventName(data.name)
      }

      setLoading(false)
    }

    fetchEvent()
  }, [eventId, user])

  const handleJoinIndividual = async () => {
    if (!user || !eventId) return
    setLoading(true)

    // Fetch current participants first to handle null array
    const { data: eventData, error: fetchError } = await supabase
      .from("events")
      .select("joined_by_individuals")
      .eq("eventid", eventId)
      .single()

    if (fetchError) {
      console.error(fetchError)
      setError("Could not register for event")
      setLoading(false)
      return
    }

    let participants: string[] = eventData.joined_by_individuals || []

    // Prevent duplicate registration
    if (!participants.includes(user.id)) {
      participants.push(user.id)
    }

    const { error: updateError } = await supabase
      .from("events")
      .update({ joined_by_individuals: participants })
      .eq("eventid", eventId)

    if (updateError) {
      console.error(updateError)
      setError("Could not register for event")
      setLoading(false)
      return
    }

    setLoading(false)
    // Navigate back to events page
    navigate("/events")
  }

  if (!user) return <p className="p-6">Please log in to register.</p>
  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-3xl font-semibold mb-4">Register for {eventName}</h1>
      <div className="flex flex-col gap-4">
        <Button onClick={handleJoinIndividual}>Join as Individual</Button>
        {/* Future: Join as Team */}
      </div>
    </div>
  )
}
