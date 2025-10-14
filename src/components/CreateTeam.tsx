"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function CreateTeamPage() {
  const { eventId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [teamName, setTeamName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!user || !teamName.trim()) return
    setLoading(true)

    const { error } = await supabase.from("teams").insert([
      {
        team_name: teamName,
        created_by: user.id,
        event_id: eventId,
        members: [user.id],
      },
    ])

    setLoading(false)
    if (error) {
      console.error(error)
      alert("Error creating team")
    } else {
      alert("Team created successfully!")
      navigate("/events")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Create a Team
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Team"}
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
