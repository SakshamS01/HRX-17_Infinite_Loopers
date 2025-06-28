"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Coffee, Trophy, RefreshCw, Lightbulb, Target, Clock, Gamepad2, Heart, Zap } from "lucide-react"

interface ActivityRecommendationsProps {
  emotion: string
}

export function ActivityRecommendations({ emotion }: ActivityRecommendationsProps) {
  const getActivitiesForEmotion = (emotion: string) => {
    const baseActivities = [
      {
        id: "revision",
        title: "Quick Revision",
        description: "Review key concepts from your recent lessons",
        icon: RefreshCw,
        duration: "10-15 min",
        points: 50,
        type: "study",
      },
      {
        id: "break",
        title: "Take a Break",
        description: "Stretch, hydrate, and refresh your mind",
        icon: Coffee,
        duration: "5-10 min",
        points: 25,
        type: "wellness",
      },
      {
        id: "celebrate",
        title: "Celebrate Progress",
        description: "Acknowledge your achievements and milestones",
        icon: Trophy,
        duration: "2-5 min",
        points: 75,
        type: "motivation",
      },
    ]

    const emotionSpecificActivities: { [key: string]: any[] } = {
      happy: [
        {
          id: "challenge",
          title: "Take on a Challenge",
          description: "Try a more advanced topic while you're motivated",
          icon: Target,
          duration: "20-30 min",
          points: 100,
          type: "challenge",
        },
        {
          id: "practice",
          title: "Hands-on Practice",
          description: "Build something with what you've learned",
          icon: Lightbulb,
          duration: "30-45 min",
          points: 150,
          type: "practice",
        },
      ],
      focused: [
        {
          id: "deep-dive",
          title: "Deep Dive Session",
          description: "Explore complex topics in detail",
          icon: BookOpen,
          duration: "45-60 min",
          points: 200,
          type: "study",
        },
        {
          id: "pomodoro",
          title: "Pomodoro Session",
          description: "Structured learning with timed intervals",
          icon: Clock,
          duration: "25 min",
          points: 100,
          type: "focus",
        },
      ],
      confused: [
        {
          id: "basics",
          title: "Review Basics",
          description: "Go back to fundamental concepts",
          icon: RefreshCw,
          duration: "15-20 min",
          points: 75,
          type: "review",
        },
        {
          id: "different-approach",
          title: "Try Different Approach",
          description: "Learn the same concept through different methods",
          icon: Lightbulb,
          duration: "20-30 min",
          points: 100,
          type: "alternative",
        },
      ],
      bored: [
        {
          id: "gamified",
          title: "Gamified Learning",
          description: "Learn through interactive games and quizzes",
          icon: Gamepad2,
          duration: "15-25 min",
          points: 125,
          type: "game",
        },
        {
          id: "energizer",
          title: "Quick Energizer",
          description: "Short, engaging activities to boost motivation",
          icon: Zap,
          duration: "5-10 min",
          points: 50,
          type: "energizer",
        },
      ],
      excited: [
        {
          id: "project",
          title: "Start a Project",
          description: "Channel your energy into building something",
          icon: Lightbulb,
          duration: "60+ min",
          points: 250,
          type: "project",
        },
        {
          id: "explore",
          title: "Explore New Topics",
          description: "Discover related subjects that interest you",
          icon: Target,
          duration: "30-45 min",
          points: 150,
          type: "exploration",
        },
      ],
      tired: [
        {
          id: "light-review",
          title: "Light Review",
          description: "Easy review of familiar concepts",
          icon: BookOpen,
          duration: "10-15 min",
          points: 50,
          type: "light",
        },
        {
          id: "mindfulness",
          title: "Mindful Break",
          description: "Meditation or breathing exercises",
          icon: Heart,
          duration: "5-10 min",
          points: 25,
          type: "wellness",
        },
      ],
    }

    return [...baseActivities, ...(emotionSpecificActivities[emotion] || [])]
  }

  const activities = getActivitiesForEmotion(emotion)

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      study: "bg-blue-100 text-blue-800",
      wellness: "bg-green-100 text-green-800",
      motivation: "bg-yellow-100 text-yellow-800",
      challenge: "bg-red-100 text-red-800",
      practice: "bg-purple-100 text-purple-800",
      focus: "bg-indigo-100 text-indigo-800",
      review: "bg-orange-100 text-orange-800",
      alternative: "bg-pink-100 text-pink-800",
      game: "bg-cyan-100 text-cyan-800",
      energizer: "bg-lime-100 text-lime-800",
      project: "bg-violet-100 text-violet-800",
      exploration: "bg-teal-100 text-teal-800",
      light: "bg-gray-100 text-gray-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Recommended Activities
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on your current mood: <span className="capitalize font-medium">{emotion}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <Card key={activity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <IconComponent className="h-5 w-5 mr-2 text-purple-600" />
                      <h3 className="font-semibold">{activity.title}</h3>
                    </div>
                    <Badge className={getTypeColor(activity.type)} variant="secondary">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.duration}
                    </div>
                    <div className="flex items-center text-xs text-purple-600">
                      <Trophy className="h-3 w-3 mr-1" />
                      {activity.points} pts
                    </div>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Start Activity
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
