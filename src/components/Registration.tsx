// src/components/Registration.tsx
"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function RegistrationPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)

  const joinAsIndividual = async () => {
    if (!user) return
    setLoading(true)

    // Fetch current event
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("joined_by_individuals")
      .eq("eventid", eventId)
      .single()

    if (fetchError) {
      console.error(fetchError)
      alert("Error fetching event")
      setLoading(false)
      return
    }

    // Check if already joined
    const currentIndividuals = (event as any)?.joined_by_individuals || []
    if (currentIndividuals.includes(user.id)) {
      alert("You have already joined this event")
      setLoading(false)
      return
    }

    // Add user to the array
    const { error } = await supabase
      .from("events")
      .update({
        joined_by_individuals: [...currentIndividuals, user.id],
      })
      .eq("eventid", eventId)

    setLoading(false)

    if (error) {
      console.error(error)
      alert("Error joining as individual")
    } else {
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
