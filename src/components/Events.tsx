// src/components/Events.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function EventsPage() {
  return (
    <div className="flex flex-col p-6 h-full">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Events</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content will go here later */}
        </CardContent>
      </Card>
    </div>
  )
}
