// src/components/Registration.tsx
"use client"
import { useParams, useNavigate } from "react-router-dom"
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
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleIndividualJoin = async () => {
    if (!user) return
    setLoading(true)

    const { error } = await supabase
      .from("events")
      .update({
        joined_by_individuals: supabase.raw(
          "array_append(joined_by_individuals, ?)",
          [user.id]
        ),
      })
      .eq("eventid", eventId)

    setLoading(false)
    if (error) {
      console.error(error)
      alert("Failed to join event")
    } else {
      navigate("/events") // go back to events page
    }
  }

  const handleTeamJoin = () => {
    navigate(`/teamregister/${eventId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Register for Event
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={handleIndividualJoin}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Registering..." : "Join as Individual"}
          </Button>
          <Button
            onClick={handleTeamJoin}
            className="w-full"
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
