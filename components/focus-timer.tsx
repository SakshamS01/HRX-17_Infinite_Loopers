"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, X, Clock, Coffee, Target } from "lucide-react"

interface FocusTimerProps {
  onClose: () => void
}

export function FocusTimer({ onClose }: FocusTimerProps) {
  const [mode, setMode] = useState<"focus" | "break" | "longBreak">("focus")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)

  const durations = {
    focus: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (mode === "focus") {
      setSessions((prev) => prev + 1)
      const newSessions = sessions + 1
      if (newSessions % 4 === 0) {
        setMode("longBreak")
        setTimeLeft(durations.longBreak)
      } else {
        setMode("break")
        setTimeLeft(durations.break)
      }
    } else {
      setMode("focus")
      setTimeLeft(durations.focus)
    }

    // Play notification sound (in real app)
    alert(`${mode === "focus" ? "Focus session" : "Break"} complete!`)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(durations[mode])
  }

  const switchMode = (newMode: "focus" | "break" | "longBreak") => {
    setMode(newMode)
    setTimeLeft(durations[newMode])
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    return ((durations[mode] - timeLeft) / durations[mode]) * 100
  }

  const getModeIcon = (currentMode: string) => {
    switch (currentMode) {
      case "focus":
        return <Target className="h-4 w-4" />
      case "break":
        return <Coffee className="h-4 w-4" />
      case "longBreak":
        return <Coffee className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getModeColor = (currentMode: string) => {
    switch (currentMode) {
      case "focus":
        return "bg-red-100 text-red-800"
      case "break":
        return "bg-green-100 text-green-800"
      case "longBreak":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Focus Timer
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selector */}
          <div className="flex gap-2">
            <Button
              variant={mode === "focus" ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode("focus")}
              className="flex-1"
            >
              <Target className="h-4 w-4 mr-1" />
              Focus
            </Button>
            <Button
              variant={mode === "break" ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode("break")}
              className="flex-1"
            >
              <Coffee className="h-4 w-4 mr-1" />
              Break
            </Button>
            <Button
              variant={mode === "longBreak" ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode("longBreak")}
              className="flex-1"
            >
              <Coffee className="h-4 w-4 mr-1" />
              Long Break
            </Button>
          </div>

          {/* Current Mode Badge */}
          <div className="text-center">
            <Badge className={getModeColor(mode)} variant="secondary">
              {getModeIcon(mode)}
              <span className="ml-1 capitalize">{mode === "longBreak" ? "Long Break" : mode}</span>
            </Badge>
          </div>

          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-gray-900 mb-4">{formatTime(timeLeft)}</div>
            <Progress value={getProgress()} className="h-2 mb-4" />
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <Button onClick={toggleTimer} size="lg">
              {isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Session Counter */}
          <div className="text-center">
            <div className="text-sm text-gray-600">
              Sessions completed: <span className="font-semibold">{sessions}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {sessions > 0 && `Next long break in ${4 - (sessions % 4)} sessions`}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">{mode === "focus" ? "Focus Tips:" : "Break Tips:"}</h4>
            <p className="text-sm text-blue-800">
              {mode === "focus"
                ? "Eliminate distractions, stay hydrated, and focus on one task at a time."
                : "Step away from your screen, stretch, take deep breaths, or grab a healthy snack."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
