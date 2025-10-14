// src/components/Registration.tsx
"use client"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
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
  const navigate = useNavigate()
  const location = useLocation()
  const onJoin = location.state?.onJoin // callback to refresh EventsPage
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)

  const joinAsIndividual = async () => {
    if (!user) return
    setLoading(true)

    const { data, error } = await supabase
      .from("events")
      .update({
        joined_by_individuals: supabase.raw(
          "array_append(COALESCE(joined_by_individuals, '{}'), ?)",
          [user.id]
        ),
      })
      .eq("eventid", eventId)
      .select()
      .single()

    setLoading(false)

    if (error) {
      console.error(error)
      alert("Error joining as individual")
    } else {
      // Refresh events in parent page
      onJoin?.()
      // Navigate back to events page
      navigate("/events")
    }
  }

  const joinAsTeam = () => {
    navigate(`/teamregister/${eventId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Join Event
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={joinAsIndividual}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Registering..." : "Join as Individual"}
          </Button>

          <Button
            onClick={joinAsTeam}
            className="w-full"
            variant="secondary"
          >
            Join as Team
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full text-gray-500"
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
