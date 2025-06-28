"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Users } from "lucide-react"

export function Leaderboard() {
  const leaderboardData = [
    {
      rank: 1,
      name: "Alex Chen",
      points: 3250,
      streak: 12,
      avatar: "/placeholder.svg?height=32&width=32",
      badge: "🏆",
    },
    {
      rank: 2,
      name: "Sarah Johnson",
      points: 2890,
      streak: 8,
      avatar: "/placeholder.svg?height=32&width=32",
      badge: "🥈",
    },
    {
      rank: 3,
      name: "Mike Rodriguez",
      points: 2650,
      streak: 15,
      avatar: "/placeholder.svg?height=32&width=32",
      badge: "🥉",
    },
    {
      rank: 4,
      name: "You",
      points: 2450,
      streak: 7,
      avatar: "/placeholder.svg?height=32&width=32",
      badge: "",
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: "Emma Wilson",
      points: 2200,
      streak: 5,
      avatar: "/placeholder.svg?height=32&width=32",
      badge: "",
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-orange-500" />
      default:
        return <span className="text-sm font-medium text-gray-500">#{rank}</span>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center justify-between p-3 rounded-lg ${
              user.isCurrentUser ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6">{getRankIcon(user.rank)}</div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${user.isCurrentUser ? "text-purple-700" : ""}`}>
                    {user.name}
                  </span>
                  {user.badge && <span className="ml-1">{user.badge}</span>}
                </div>
                <div className="text-xs text-gray-500">{user.streak} day streak</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-semibold ${user.isCurrentUser ? "text-purple-700" : ""}`}>
                {user.points.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t">
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              Weekly Challenge: Top 3 get bonus XP!
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
