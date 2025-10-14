"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<any>(null)

  // Fetch event details
  useEffect(() => {
    async function fetchEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("eventid", eventId)
        .single()
      if (!error) setEvent(data)
    }
    fetchEvent()
  }, [eventId])

  const handleJoinAsIndividual = async () => {
    if (!user || !eventId) return
    setLoading(true)

    const { data: eventData, error: fetchError } = await supabase
      .from("events")
      .select("joined_by_individuals")
      .eq("eventid", eventId)
      .single()

    if (fetchError) {
      console.error(fetchError)
      setLoading(false)
      return
    }

    const updatedList = Array.isArray(eventData.joined_by_individuals)
      ? [...new Set([...eventData.joined_by_individuals, user.id])]
      : [user.id]

    const { error: updateError } = await supabase
      .from("events")
      .update({ joined_by_individuals: updatedList })
      .eq("eventid", eventId)

    if (updateError) console.error(updateError)

    setLoading(false)
    navigate("/events")
  }

  const handleJoinAsTeam = () => {
    navigate(`/teamregister/${eventId}`)
  }

  if (!event)
    return <p className="p-6 text-gray-500">Loading event details...</p>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Register for {event.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            disabled={loading}
            onClick={handleJoinAsIndividual}
            className="w-full"
          >
            {loading ? "Registering..." : "Join as Individual"}
          </Button>

          <Button
            variant="outline"
            onClick={handleJoinAsTeam}
            className="w-full"
          >
            Join as Team
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/events")}
            className="w-full text-gray-500 mt-2"
          >
            Back to Events
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
