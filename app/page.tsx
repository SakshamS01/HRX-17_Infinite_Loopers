import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Heart, Timer, Gamepad2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">LearnMate AI</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI-powered learning companion that adapts to your emotions, pace, and learning style. Transform boring
            video lessons into engaging, personalized experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Emotion Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered webcam emotion detection that adapts content based on your mood and engagement level.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Gamepad2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Gamified Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn points, maintain streaks, complete quests, and climb leaderboards while learning.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Timer className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Focus & Timer Modes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Pomodoro timers, focus sessions, and distraction-free learning environments.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
