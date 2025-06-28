"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"

interface EmotionDetectionProps {
  onClose: () => void
  onEmotionDetected: (emotion: string) => void
}

export function EmotionDetection({ onClose, onEmotionDetected }: EmotionDetectionProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedEmotion, setDetectedEmotion] = useState("")
  const [confidence, setConfidence] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const emotions = ["happy", "focused", "confused", "bored", "excited", "tired"]

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const simulateEmotionDetection = () => {
    setIsDetecting(true)

    // Simulate AI processing
    setTimeout(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      const randomConfidence = Math.floor(Math.random() * 30) + 70 // 70-100%

      setDetectedEmotion(randomEmotion)
      setConfidence(randomConfidence)
      setIsDetecting(false)

      onEmotionDetected(randomEmotion)
    }, 3000)
  }

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      happy: "😊",
      focused: "🎯",
      confused: "😕",
      bored: "😴",
      excited: "🤩",
      tired: "😪",
    }
    return emojiMap[emotion] || "😐"
  }

  const getRecommendation = (emotion: string) => {
    const recommendations: { [key: string]: string } = {
      happy: "Great mood for learning! Continue with your current lesson.",
      focused: "Perfect focus! This is ideal for tackling challenging topics.",
      confused: "Take a break or try a different explanation of the concept.",
      bored: "Time for a more engaging activity or a quick energizing break!",
      excited: "Channel that energy into hands-on practice exercises!",
      tired: "Consider taking a rest or switching to lighter review material.",
    }
    return recommendations[emotion] || "Keep up the great work!"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Emotion Detection
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
          </div>

          {!isDetecting && !detectedEmotion && (
            <Button onClick={simulateEmotionDetection} className="w-full">
              Start Emotion Detection
            </Button>
          )}

          {isDetecting && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Analyzing your emotions...</p>
            </div>
          )}

          {detectedEmotion && !isDetecting && (
            <div className="text-center space-y-3">
              <div className="text-6xl">{getEmotionEmoji(detectedEmotion)}</div>
              <div>
                <h3 className="font-semibold text-lg capitalize">{detectedEmotion}</h3>
                <p className="text-sm text-gray-600">Confidence: {confidence}%</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">{getRecommendation(detectedEmotion)}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={simulateEmotionDetection} variant="outline" className="flex-1 bg-transparent">
                  Detect Again
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Continue Learning
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
