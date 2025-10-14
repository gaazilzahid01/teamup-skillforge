"use client"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TeamRegisterPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Team Registration for Event {eventId}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-gray-600 text-center">
            Team registration form coming soon...
          </p>
          <Button variant="ghost" onClick={() => navigate("/events")}>
            Back to Events
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
