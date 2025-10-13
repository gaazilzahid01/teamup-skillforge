"use client"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext" // use your auth context

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function RegistrationPage() {
  const { eventId } = useParams()
  const { user } = useAuth() // get logged-in user from context
  const [registered, setRegistered] = useState(false)
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
        if (data.joined_by_individuals?.includes(user.id)) {
          setRegistered(true)
        }
      }

      setLoading(false)
    }

    fetchEvent()
  }, [eventId, user])

  const handleJoinIndividual = async () => {
    if (!user || !eventId) return

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

    if (error) {
      console.error(error)
      setError("Could not register for event")
    } else {
      setRegistered(true)
    }

    setLoading(false)
  }

  if (!user) return <p className="p-6">Please log in to register.</p>
  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-3xl font-semibold mb-4">Register for {eventName}</h1>
      {registered ? (
        <Button disabled>Registered</Button>
      ) : (
        <div className="flex flex-col gap-4">
          <Button onClick={handleJoinIndividual}>Join as Individual</Button>
        </div>
      )}
    </div>
  )
}
