"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { VideoPlayer } from "@/components/video-player"
import { EmotionDetection } from "@/components/emotion-detection"
import { ActivityRecommendations } from "@/components/activity-recommendations"
import { Leaderboard } from "@/components/leaderboard"
import { FocusTimer } from "@/components/focus-timer"
import { Brain, Trophy, Flame, Target, Clock, Camera, BookOpen, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [showEmotionDetection, setShowEmotionDetection] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState("neutral")
  const [showFocusTimer, setShowFocusTimer] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const stats = {
    streak: 7,
    points: 2450,
    level: 12,
    completedLessons: 34,
    totalTime: "24h 30m",
  }

  const recommendedPlaylists = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      thumbnail: "/placeholder.svg?height=120&width=200",
      duration: "2h 45m",
      videos: 12,
      difficulty: "Beginner",
    },
    {
      id: 2,
      title: "React Advanced Patterns",
      thumbnail: "/placeholder.svg?height=120&width=200",
      duration: "4h 20m",
      videos: 18,
      difficulty: "Advanced",
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      thumbnail: "/placeholder.svg?height=120&width=200",
      duration: "6h 15m",
      videos: 25,
      difficulty: "Intermediate",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">LearnMate AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setShowEmotionDetection(true)}>
                <Camera className="h-4 w-4 mr-2" />
                Emotion Check
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowFocusTimer(true)}>
                <Clock className="h-4 w-4 mr-2" />
                Focus Mode
              </Button>
              <div className="text-sm text-gray-600">Welcome back, {user?.name || "Learner"}!</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.streak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.points}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.level}</div>
                  <div className="text-sm text-gray-600">Level</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.completedLessons}</div>
                  <div className="text-sm text-gray-600">Lessons</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalTime}</div>
                  <div className="text-sm text-gray-600">Total Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Video Player */}
            <VideoPlayer />

            {/* Recommended Playlists */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Recommended for You
                </CardTitle>
                <CardDescription>AI-curated playlists based on your learning progress and interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendedPlaylists.map((playlist) => (
                    <Card key={playlist.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{playlist.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>{playlist.videos} videos</span>
                          <span>{playlist.duration}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {playlist.difficulty}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Recommendations */}
            <ActivityRecommendations emotion={currentEmotion} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Goal</span>
                    <span>3/5 lessons</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Focus Time</span>
                    <span>45/60 min</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Leaderboard />

            {/* Current Mood */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl mb-2">😊</div>
                  <div className="text-sm text-gray-600 capitalize">{currentEmotion}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 bg-transparent"
                    onClick={() => setShowEmotionDetection(true)}
                  >
                    Update Mood
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEmotionDetection && (
        <EmotionDetection onClose={() => setShowEmotionDetection(false)} onEmotionDetected={setCurrentEmotion} />
      )}

      {showFocusTimer && <FocusTimer onClose={() => setShowFocusTimer(false)} />}
    </div>
  )
}
