// src/components/Registration.tsx
"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function RegistrationPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch the logged-in user's ID from StudentDetails
  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase
        .from("studentdetails")
        .select("userid")
        .single() // assumes one row per logged-in user
      if (error) {
        console.error(error)
        setError("Could not fetch user data")
      } else if (data) {
        setUserId(data.userid)
      }
    }
    fetchUser()
  }, [])

  const joinAsIndividual = async () => {
    if (!userId) return
    setLoading(true)
    const { error } = await supabase
      .from("events")
      .update({
        joined_by_individuals: supabase.raw(`array_append(joined_by_individuals, '${userId}')`)
      })
      .eq("eventid", eventId)

    if (error) {
      console.error(error)
      setError("Could not update event")
    } else {
      navigate("/dashboard") // redirect after joining
    }
    setLoading(false)
  }

  const joinAsTeam = () => {
    alert("Team registration not implemented yet")
  }

  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <div className="flex flex-col p-6 gap-4">
      <h1 className="text-3xl font-semibold">Join Event</h1>
      <p>Do you want to join as an individual or as a team?</p>
      <div className="flex gap-4 mt-4">
        <Button onClick={joinAsIndividual} disabled={loading}>
          Join as Individual
        </Button>
        <Button onClick={joinAsTeam} disabled={loading}>
          Join as Team
        </Button>
      </div>
    </div>
  )
}
