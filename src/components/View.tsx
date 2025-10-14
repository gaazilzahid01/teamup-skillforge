"use client"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  skills: string[]
  joined_by_individuals?: string[]
  joined_by_team?: string[]
}

type Student = {
  userid: string
  name: string
  collegeid: string
}

type College = {
  collegeid: string
  name: string
}

type Team = {
  teamid: string
  name: string
  event_id: string
}

export default function ViewEventPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [individuals, setIndividuals] = useState<{ name: string; college: string }[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [collegesMap, setCollegesMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch event
        const { data: eventsData, error: eventError } = await supabase
          .from<Event>("events")
          .select("*")
          .eq("eventid", eventId)
          .single()

        if (eventError) throw eventError
        setEvent(eventsData)

        // Fetch colleges
        const { data: collegesData } = await supabase
          .from<College>("colleges")
          .select("*")
        const map: Record<string, string> = {}
        collegesData?.forEach((c) => {
          map[c.collegeid] = c.name
        })
        setCollegesMap(map)

        // Fetch individual names
        let individualList: { name: string; college: string }[] = []
        if (eventsData?.joined_by_individuals?.length) {
          const { data: students } = await supabase
            .from<Student>("studentdetails")
            .select("userid,name,collegeid")
            .in("userid", eventsData.joined_by_individuals)

          individualList = students?.map((s) => ({
            name: s.name,
            college: collegesMap[s.collegeid] || "Unknown College",
          })) || []
        }
        setIndividuals(individualList)

        // Fetch teams
        let teamList: Team[] = []
        if (eventsData?.joined_by_team?.length) {
          const { data: teamsData } = await supabase
            .from<Team>("teams")
            .select("teamid,name,event_id")
            .in("teamid", eventsData.joined_by_team)
          teamList = teamsData || []
        }
        setTeams(teamList)

      } catch (err) {
        console.error(err)
        setError("Could not fetch event details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventId, collegesMap])

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="text-red-500 p-6">{error}</p>
  if (!event) return <p className="p-6">Event not found</p>

  return (
    <div className="flex flex-col p-6 h-full">
      <Card className="shadow-sm w-full h-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-2">{event.description}</p>
          <p className="mb-2">📍 Location: {event.location}</p>
          <p className="mb-2">🗓️ Date: {new Date(event.date).toLocaleString()}</p>
          {event.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
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

          <ScrollArea className="h-[50vh] pr-4">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Registered Individuals</h3>
                {individuals.length === 0 ? (
                  <p className="text-gray-500">No individuals registered yet</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {individuals.map((i) => (
                      <li key={i.name}>{i.name} ({i.college})</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Registered Teams</h3>
                {teams.length === 0 ? (
                  <p className="text-gray-500">No teams registered yet</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {teams.map((t) => (
                      <li key={t.teamid}>{t.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
