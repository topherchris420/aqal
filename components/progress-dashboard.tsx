"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Award, Calendar, Target, BarChart3, Star } from "lucide-react"

interface ProgressDashboardProps {
  userProgress: Record<string, any>
  onUpdateProgress: (componentId: string, progress: any) => void
  components: any[]
}

export default function ProgressDashboard({ userProgress, onUpdateProgress, components }: ProgressDashboardProps) {
  const getOverallStats = () => {
    const trackedComponents = Object.keys(userProgress)
    const totalLevel = trackedComponents.reduce((sum, id) => sum + (userProgress[id]?.currentLevel || 0), 0)
    const avgLevel = trackedComponents.length > 0 ? totalLevel / trackedComponents.length : 0
    const totalMilestones = trackedComponents.reduce(
      (sum, id) => sum + (userProgress[id]?.milestones?.filter((m: any) => m.achieved).length || 0),
      0,
    )

    return {
      trackedComponents: trackedComponents.length,
      averageLevel: avgLevel,
      totalMilestones,
      totalEntries: trackedComponents.reduce((sum, id) => sum + (userProgress[id]?.entries?.length || 0), 0),
    }
  }

  const getTopPerformingComponents = () => {
    return Object.entries(userProgress)
      .map(([id, progress]: [string, any]) => ({
        id,
        name: components.find((c) => c.id === id)?.name || id,
        level: progress.currentLevel,
        category: components.find((c) => c.id === id)?.category || "unknown",
      }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 5)
  }

  const getRecentActivity = () => {
    const allEntries = Object.entries(userProgress).flatMap(([componentId, progress]: [string, any]) =>
      (progress.entries || []).map((entry: any) => ({
        ...entry,
        componentId,
        componentName: components.find((c) => c.id === componentId)?.name || componentId,
      })),
    )

    return allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }

  const stats = getOverallStats()
  const topComponents = getTopPerformingComponents()
  const recentActivity = getRecentActivity()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Components</span>
              <span className="sm:hidden">Tracked</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.trackedComponents}</div>
            <p className="text-xs text-gray-600">Active tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Average</span>
              <span className="sm:hidden">Avg</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.averageLevel.toFixed(1)}</div>
            <Progress value={stats.averageLevel * 10} className="h-1 sm:h-2 mt-1 sm:mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalMilestones}</div>
            <p className="text-xs text-gray-600">Achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Entries</span>
              <span className="sm:hidden">Total</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.totalEntries}</div>
            <p className="text-xs text-gray-600">Progress logs</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Components */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
            Top Performing Components
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          {topComponents.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {topComponents.map((component, index) => (
                <div key={component.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm sm:text-base truncate">{component.name}</h4>
                      <Badge variant="outline" className="text-xs capitalize mt-1">
                        {component.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm sm:text-lg font-bold text-blue-600">Level {component.level}</div>
                    <Progress value={component.level * 10} className="w-16 sm:w-20 h-1 sm:h-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Star className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No components tracked yet</p>
              <p className="text-xs sm:text-sm">Start tracking components to see your top performers!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          {recentActivity.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <h4 className="font-medium text-xs sm:text-sm truncate">{entry.componentName}</h4>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          Level {entry.level}
                        </Badge>
                        <span className="text-xs text-gray-500 hidden sm:inline">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {entry.reflection && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{entry.reflection}</p>
                    )}
                    <span className="text-xs text-gray-500 sm:hidden">{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No recent activity</p>
              <p className="text-xs sm:text-sm">Add progress entries to see your recent activity!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
