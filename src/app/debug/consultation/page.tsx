"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ConsultationDebugPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    student_id: "685517d5620ee230f786c866",
    title: "Test Consultation",
    consultation_date: "2025-07-16T17:00:00.000Z",
    consultation_time: "14:30",
    doctor: "Dr. Test",
    notes: "Test consultation notes",
  });

  const testScheduleConsultation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing schedule consultation with data:", formData);

      const response = await fetch(
        "/api/health-examinations/schedule-consultation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Schedule consultation response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule consultation");
      }

      setResult(data);
    } catch (err) {
      console.error("Error testing schedule consultation:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const testGetNotifications = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing get notifications...");

      const response = await fetch("/api/notifications/parent/current");
      const data = await response.json();
      console.log("Get notifications response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to get notifications");
      }

      setResult(data);
    } catch (err) {
      console.error("Error testing get notifications:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const testDebugNotifications = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing debug notifications...");

      const response = await fetch("/api/debug/notifications");
      const data = await response.json();
      console.log("Debug notifications response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to debug notifications");
      }

      setResult(data);
    } catch (err) {
      console.error("Error testing debug notifications:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Consultation Notification Debug</h1>

      <Card>
        <CardHeader>
          <CardTitle>Test Schedule Consultation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Student ID</Label>
              <Input
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({ ...formData, student_id: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="datetime-local"
                value={formData.consultation_date.slice(0, 16)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultation_date: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                value={formData.consultation_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultation_time: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Doctor</Label>
              <Input
                value={formData.doctor}
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>
          <Button onClick={testScheduleConsultation} disabled={loading}>
            {loading ? "Testing..." : "Test Schedule Consultation"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Get Parent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testGetNotifications} disabled={loading}>
            {loading ? "Testing..." : "Test Get Notifications"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Debug All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testDebugNotifications} disabled={loading}>
            {loading ? "Testing..." : "Debug All Notifications"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-red-500">{error}</pre>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
