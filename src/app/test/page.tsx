"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Import events page component directly
import EventsPageContent from "@/app/cms/events/page";

export default function TestPage() {
  const [showEventsPage, setShowEventsPage] = useState(false);

  if (showEventsPage) {
    return <EventsPageContent />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Page - Bypass Auth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => setShowEventsPage(true)}>
              Show Events Page (No Auth)
            </Button>
            <Button onClick={() => window.location.href = '/cms/events'}>
              Go to /cms/events
            </Button>
            <Button onClick={() => window.location.href = '/cmscopy/events'}>
              Go to /cmscopy/events
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p>This page bypasses authentication to test the events page directly.</p>
            <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}