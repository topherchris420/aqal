"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, User, Users, Cog, TrendingUp, Target } from "lucide-react"

interface VisualMapProps {
  userProfile: any
}

const quadrantIcons = {
  individual_interior: Brain,
  individual_exterior: User,
  collective_interior: Users,
  collective_exterior: Cog,
}

const quadrantColors = {
  individual_interior: "bg-blue-100 border-blue-300 text-blue-800",
  individual_exterior: "bg-green-100 border-green-300 text-green-800",
  collective_interior: "bg-purple-100 border-purple-300 text-purple-800",
  collective_exterior: "bg-orange-100 border-orange-300 text-orange-800",
}

const spiralColors = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  turquoise: "bg-teal-500",
}

export default function VisualMap({ userProfile }: VisualMapProps) {
  const getQuadrantStrength = (quadrantId: string) => {
    const components = userProfile.quadrants[quadrantId].components.length
    return Math.min((components / 5) * 100, 100)
  }

  const getOverallDevelopment = () => {
    const lineValues = Object.values(userProfile.developmentalLines) as number[]
    return lineValues.reduce((sum, val) => sum + val, 0) / lineValues.length
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overall Development Summary */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            Your Integral Development Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                {getOverallDevelopment().toFixed(1)}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Overall Development</p>
              <Progress value={getOverallDevelopment() * 10} className="h-2" />
            </div>
            <div className="text-center">
              <Badge className={`${spiralColors[userProfile.spiralTier]} text-white mb-2 text-xs sm:text-sm`}>
                {userProfile.spiralTier.toUpperCase()}
              </Badge>
              <p className="text-xs sm:text-sm text-gray-600">Current Spiral Tier</p>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-semibold capitalize mb-2">{userProfile.egoStage}</div>
              <p className="text-xs sm:text-sm text-gray-600">Ego Development Stage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quadrant Visualization */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Quadrant Development Map</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600">Your focus and development across the four quadrants</p>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 aspect-square max-w-2xl mx-auto">
            {Object.entries(userProfile.quadrants).map(([quadrantId, quadrant]: [string, any]) => {
              const Icon = quadrantIcons[quadrantId as keyof typeof quadrantIcons]
              const strength = getQuadrantStrength(quadrantId)

              return (
                <div
                  key={quadrantId}
                  className={`p-3 sm:p-6 rounded-lg border-2 ${quadrantColors[quadrantId as keyof typeof quadrantColors]} relative overflow-hidden`}
                >
                  <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                    <Icon className="w-3 h-3 sm:w-5 sm:h-5" />
                    <span className="font-medium text-xs sm:text-sm capitalize">
                      {quadrantId
                        .replace("_", " ")
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .join("")}
                    </span>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-lg sm:text-2xl font-bold">{quadrant.components.length}</div>
                    <p className="text-xs">Components</p>
                    <Progress value={strength} className="h-1 sm:h-2" />
                  </div>

                  {/* Background pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 50%, currentColor ${strength}%, transparent ${strength}%)`,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Developmental Lines Radar */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            Developmental Lines Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(userProfile.developmentalLines).map(([lineId, value]: [string, any]) => (
              <div key={lineId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize text-xs sm:text-sm truncate">{lineId}</span>
                  <Badge variant="outline" className="text-xs">
                    {value}/10
                  </Badge>
                </div>
                <Progress value={value * 10} className="h-2 sm:h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Insights */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Integration Patterns</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 text-xs sm:text-sm">Strongest Quadrant</h4>
              <p className="text-xs sm:text-sm text-blue-700">
                {Object.entries(userProfile.quadrants)
                  .sort(([, a]: [string, any], [, b]: [string, any]) => b.components.length - a.components.length)[0][0]
                  .replace("_", " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 text-xs sm:text-sm">Highest Development Line</h4>
              <p className="text-xs sm:text-sm text-green-700 capitalize">
                {
                  Object.entries(userProfile.developmentalLines).sort(
                    ([, a]: [string, any], [, b]: [string, any]) => b - a,
                  )[0][0]
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
