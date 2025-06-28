"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Plus } from "lucide-react"

export function VideoPlayer() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [currentVideo, setCurrentVideo] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const handleAddVideo = () => {
    const videoId = extractVideoId(youtubeUrl)
    if (videoId) {
      setCurrentVideo(videoId)
      setYoutubeUrl("")
    } else {
      alert("Please enter a valid YouTube URL")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Player</CardTitle>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="youtube-url" className="sr-only">
              YouTube URL
            </Label>
            <Input
              id="youtube-url"
              placeholder="Paste YouTube URL here..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleAddVideo}>
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
          {currentVideo ? (
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo}?enablejsapi=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Add a YouTube video to start learning</p>
                <p className="text-sm opacity-75 mt-2">Paste a YouTube URL above and click "Add Video"</p>
              </div>
            </div>
          )}
        </div>

        {currentVideo && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Learning Insights</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Watch Time:</span>
                <div className="font-medium">12:34 / 25:67</div>
              </div>
              <div>
                <span className="text-gray-600">Engagement:</span>
                <div className="font-medium text-green-600">High</div>
              </div>
              <div>
                <span className="text-gray-600">Mood:</span>
                <div className="font-medium">Focused 😊</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
