"use client"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

type Event = {
  eventid: string
  name: string
  description: string
  date: string
  location: string
  joined_by_individuals?: string[]
  joined_by_team?: string[]
}

type Student = {
  userid: string
  name: string
  collegeid: string
}

type Team = {
  teamid: string
  name: string
}

type College = {
  collegeid: string
  name: string
}

export default function ViewEventPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [individuals, setIndividuals] = useState<{ name: string; college: string }[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch event
        const { data: eventData, error: eventError } = await supabase
          .from<Event>("events")
          .select("*")
          .eq("eventid", eventId)
          .single()
        if (eventError) throw eventError

        // Fetch colleges (needed only for individuals)
        const { data: collegesData } = await supabase.from<College>("colleges").select("*")
        const collegesMap: Record<string, string> = {}
        collegesData?.forEach((c) => {
          collegesMap[c.collegeid] = c.name
        })

        // Fetch individuals
        let individualList: { name: string; college: string }[] = []
        if (eventData?.joined_by_individuals?.length) {
          const { data: students } = await supabase
            .from<Student>("studentdetails")
            .select("userid,name,collegeid")
            .in("userid", eventData.joined_by_individuals)
          individualList = students?.map((s) => ({
            name: s.name,
            college: collegesMap[s.collegeid] || "Unknown College",
          })) || []
        }

        // Fetch teams
        let teamList: Team[] = []
        if (eventData?.joined_by_team?.length) {
          const { data: teamsData } = await supabase
            .from<Team>("teams")
            .select("teamid,name")
            .in("teamid", eventData.joined_by_team)
          teamList = teamsData || []
        }

        setEvent(eventData)
        setIndividuals(individualList)
        setTeams(teamList)
      } catch (err) {
        console.error(err)
        setError("Could not fetch event details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventId])

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>
  if (!event) return <p className="p-6 text-gray-500">Event not found.</p>

  return (
    <div className="flex flex-col p-6">
      <Card className="shadow-sm w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">{event.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>{event.description}</p>
          <p className="text-sm text-gray-500">
            📍 {event.location} | 🗓️ {new Date(event.date).toLocaleString()}
          </p>

          {individuals.length > 0 && (
            <div>
              <h3 className="font-semibold mt-4">Individuals Registered</h3>
              <ul className="list-disc list-inside">
                {individuals.map((i) => (
                  <li key={i.name}>
                    {i.name} ({i.college})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {teams.length > 0 && (
            <div>
              <h3 className="font-semibold mt-4">Teams Registered</h3>
              <ul className="list-disc list-inside">
                {teams.map((t) => (
                  <li key={t.teamid}>{t.name}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
