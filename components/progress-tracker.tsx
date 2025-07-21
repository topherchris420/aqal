"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Clock,
  CheckCircle,
  Circle,
  Star,
  BarChart3,
  Plus,
  Edit,
} from "lucide-react"

interface ProgressEntry {
  id: string
  date: string
  level: number
  reflection: string
  milestone?: string
  practices: string[]
  challenges: string[]
  insights: string[]
}

interface ComponentProgress {
  componentId: string
  currentLevel: number
  entries: ProgressEntry[]
  milestones: Milestone[]
  totalPracticeHours: number
  startDate: string
  lastUpdated: string
}

interface Milestone {
  id: string
  title: string
  description: string
  level: number
  achieved: boolean
  achievedDate?: string
}

interface ProgressTrackerProps {
  component: any
  categoryInfo: any
  userProgress: ComponentProgress
  onUpdateProgress: (componentId: string, progress: ComponentProgress) => void
}

export default function ProgressTracker({
  component,
  categoryInfo,
  userProgress,
  onUpdateProgress,
}: ProgressTrackerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    level: userProgress.currentLevel,
    reflection: "",
    practices: [""],
    challenges: [""],
    insights: [""],
  })

  const getMilestones = (componentId: string): Milestone[] => {
    const milestoneMap = {
      // Ego Development Stages
      opportunist: [
        {
          id: "awareness",
          title: "Self-Awareness Breakthrough",
          description: "Recognize self-protective patterns and their impact",
          level: 3,
          achieved: false,
        },
        {
          id: "responsibility",
          title: "Taking Responsibility",
          description: "Begin taking ownership of actions and outcomes",
          level: 5,
          achieved: false,
        },
        {
          id: "trust",
          title: "Building Trust",
          description: "Develop capacity for genuine relationships",
          level: 7,
          achieved: false,
        },
        {
          id: "integration",
          title: "Pattern Integration",
          description: "Successfully integrate healthier behavioral patterns",
          level: 9,
          achieved: false,
        },
      ],
      achiever: [
        {
          id: "balance",
          title: "Work-Life Balance",
          description: "Achieve sustainable balance between achievement and wellbeing",
          level: 3,
          achieved: false,
        },
        {
          id: "emotional_intelligence",
          title: "Emotional Intelligence",
          description: "Develop emotional awareness and regulation skills",
          level: 5,
          achieved: false,
        },
        {
          id: "values_clarity",
          title: "Values Clarification",
          description: "Question and refine success metrics and values",
          level: 7,
          achieved: false,
        },
        {
          id: "perspective_taking",
          title: "Multiple Perspectives",
          description: "Integrate diverse viewpoints in decision-making",
          level: 9,
          achieved: false,
        },
      ],
      // Lines of Development
      emotional: [
        {
          id: "vocabulary",
          title: "Emotional Vocabulary",
          description: "Develop rich vocabulary for emotional states",
          level: 2,
          achieved: false,
        },
        {
          id: "regulation",
          title: "Emotional Regulation",
          description: "Master basic emotional regulation techniques",
          level: 4,
          achieved: false,
        },
        {
          id: "empathy",
          title: "Empathic Resonance",
          description: "Develop deep empathy and compassion",
          level: 6,
          achieved: false,
        },
        {
          id: "mastery",
          title: "Emotional Mastery",
          description: "Achieve consistent emotional wisdom and stability",
          level: 8,
          achieved: false,
        },
      ],
      // States of Consciousness
      meditative: [
        {
          id: "concentration",
          title: "Basic Concentration",
          description: "Achieve stable concentration for 10+ minutes",
          level: 2,
          achieved: false,
        },
        {
          id: "mindfulness",
          title: "Mindful Awareness",
          description: "Maintain mindfulness throughout daily activities",
          level: 4,
          achieved: false,
        },
        {
          id: "insight",
          title: "Insight Experiences",
          description: "Experience profound insights into the nature of mind",
          level: 6,
          achieved: false,
        },
        {
          id: "stabilization",
          title: "State Stabilization",
          description: "Stabilize meditative states and integrate insights",
          level: 8,
          achieved: false,
        },
      ],
    }

    return (
      milestoneMap[componentId] || [
        {
          id: "basic",
          title: "Basic Understanding",
          description: "Develop foundational understanding",
          level: 3,
          achieved: false,
        },
        {
          id: "practice",
          title: "Active Practice",
          description: "Engage in regular practice and application",
          level: 6,
          achieved: false,
        },
        {
          id: "integration",
          title: "Full Integration",
          description: "Achieve stable integration in daily life",
          level: 9,
          achieved: false,
        },
      ]
    )
  }

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const defaultMilestones = getMilestones(component.id)
    return userProgress.milestones.length > 0 ? userProgress.milestones : defaultMilestones
  })

  const addProgressEntry = () => {
    const entry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      level: newEntry.level,
      reflection: newEntry.reflection,
      practices: newEntry.practices.filter((p) => p.trim() !== ""),
      challenges: newEntry.challenges.filter((c) => c.trim() !== ""),
      insights: newEntry.insights.filter((i) => i.trim() !== ""),
    }

    // Check for milestone achievements
    const updatedMilestones = milestones.map((milestone) => {
      if (!milestone.achieved && newEntry.level >= milestone.level) {
        return {
          ...milestone,
          achieved: true,
          achievedDate: new Date().toISOString(),
        }
      }
      return milestone
    })

    const updatedProgress: ComponentProgress = {
      ...userProgress,
      currentLevel: newEntry.level,
      entries: [entry, ...userProgress.entries],
      milestones: updatedMilestones,
      lastUpdated: new Date().toISOString(),
    }

    setMilestones(updatedMilestones)
    onUpdateProgress(component.id, updatedProgress)

    // Reset form
    setNewEntry({
      level: newEntry.level,
      reflection: "",
      practices: [""],
      challenges: [""],
      insights: [""],
    })
  }

  const getProgressTrend = () => {
    if (userProgress.entries.length < 2) return "stable"
    const recent = userProgress.entries.slice(0, 3)
    const older = userProgress.entries.slice(3, 6)

    const recentAvg = recent.reduce((sum, entry) => sum + entry.level, 0) / recent.length
    const olderAvg = older.length > 0 ? older.reduce((sum, entry) => sum + entry.level, 0) / older.length : recentAvg

    if (recentAvg > olderAvg + 0.5) return "improving"
    if (recentAvg < olderAvg - 0.5) return "declining"
    return "stable"
  }

  const getTrendIcon = () => {
    const trend = getProgressTrend()
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "declining":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
      default:
        return <BarChart3 className="w-4 h-4 text-blue-600" />
    }
  }

  const getNextMilestone = () => {
    return milestones.find((m) => !m.achieved && m.level > userProgress.currentLevel)
  }

  const addArrayItem = (field: "practices" | "challenges" | "insights") => {
    setNewEntry((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const updateArrayItem = (field: "practices" | "challenges" | "insights", index: number, value: string) => {
    setNewEntry((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeArrayItem = (field: "practices" | "challenges" | "insights", index: number) => {
    setNewEntry((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={isOpen} onValueChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <BarChart3 className="w-4 h-4" />
          Track Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <categoryInfo.icon className="w-6 h-6 text-blue-600" />
            <div>
              <span>Progress Tracking: {component.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={categoryInfo.color}>
                  Level {userProgress.currentLevel}/10
                </Badge>
                {getTrendIcon()}
                <span className="text-sm text-gray-600 capitalize">{getProgressTrend()}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="add-entry">Add Entry</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Current Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{userProgress.currentLevel}/10</div>
                  <Progress value={userProgress.currentLevel * 10} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {milestones.filter((m) => m.achieved).length}/{milestones.length}
                  </div>
                  <div className="text-sm text-gray-600">Achieved</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Journey Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {Math.ceil(
                      (new Date().getTime() - new Date(userProgress.startDate).getTime()) / (1000 * 60 * 60 * 24),
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Days</div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Progress Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProgress.entries.length > 0 ? (
                  <div className="space-y-4">
                    <div className="h-32 flex items-end justify-between gap-2">
                      {userProgress.entries
                        .slice(0, 10)
                        .reverse()
                        .map((entry, index) => (
                          <div key={entry.id} className="flex flex-col items-center flex-1">
                            <div
                              className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all hover:bg-blue-600"
                              style={{ height: `${(entry.level / 10) * 100}%` }}
                              title={`Level ${entry.level} on ${new Date(entry.date).toLocaleDateString()}`}
                            />
                            <div className="text-xs text-gray-500 mt-1 rotate-45 origin-left">
                              {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>Level</span>
                      <span>10</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No progress entries yet</p>
                    <p className="text-sm">Add your first entry to start tracking!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Milestone */}
            {getNextMilestone() && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Star className="w-5 h-5" />
                    Next Milestone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-yellow-900">{getNextMilestone()?.title}</h4>
                    <p className="text-sm text-yellow-700">{getNextMilestone()?.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Target Level: {getNextMilestone()?.level}
                      </Badge>
                      <span className="text-sm text-yellow-600">
                        {getNextMilestone()!.level - userProgress.currentLevel} levels to go
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-4">
            {milestones.map((milestone) => (
              <Card key={milestone.id} className={milestone.achieved ? "bg-green-50 border-green-200" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {milestone.achieved ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${milestone.achieved ? "text-green-800" : "text-gray-900"}`}>
                          {milestone.title}
                        </h4>
                        <Badge variant={milestone.achieved ? "default" : "outline"} className="text-xs">
                          Level {milestone.level}
                        </Badge>
                      </div>
                      <p className={`text-sm ${milestone.achieved ? "text-green-700" : "text-gray-600"}`}>
                        {milestone.description}
                      </p>
                      {milestone.achieved && milestone.achievedDate && (
                        <p className="text-xs text-green-600 mt-2">
                          Achieved on {new Date(milestone.achievedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {userProgress.entries.length > 0 ? (
              userProgress.entries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Level {entry.level}</Badge>
                        <span className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>

                    {entry.reflection && (
                      <div className="mb-3">
                        <h5 className="font-medium text-sm mb-1">Reflection</h5>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{entry.reflection}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {entry.practices.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-1 text-blue-700">Practices</h5>
                          <ul className="space-y-1">
                            {entry.practices.map((practice, idx) => (
                              <li key={idx} className="text-blue-600">
                                • {practice}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {entry.challenges.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-1 text-orange-700">Challenges</h5>
                          <ul className="space-y-1">
                            {entry.challenges.map((challenge, idx) => (
                              <li key={idx} className="text-orange-600">
                                • {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {entry.insights.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-1 text-green-700">Insights</h5>
                          <ul className="space-y-1">
                            {entry.insights.map((insight, idx) => (
                              <li key={idx} className="text-green-600">
                                • {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No entries yet</p>
                <p className="text-sm">Start tracking your progress to see your journey unfold!</p>
              </div>
            )}
          </TabsContent>

          {/* Add Entry Tab */}
          <TabsContent value="add-entry" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Progress Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Level Slider */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Current Level Assessment</label>
                  <div className="px-3">
                    <Slider
                      value={[newEntry.level]}
                      onValueChange={(value) => setNewEntry((prev) => ({ ...prev, level: value[0] }))}
                      max={10}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Beginner (1)</span>
                      <span className="font-medium">Level {newEntry.level}</span>
                      <span>Mastery (10)</span>
                    </div>
                  </div>
                </div>

                {/* Reflection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reflection</label>
                  <Textarea
                    placeholder="How do you feel about your current development in this component? What has changed since your last entry?"
                    value={newEntry.reflection}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, reflection: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Practices */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Practices & Activities</label>
                    <Button variant="outline" size="sm" onClick={() => addArrayItem("practices")}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  {newEntry.practices.map((practice, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="What practices have you been doing?"
                        value={practice}
                        onChange={(e) => updateArrayItem("practices", index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      {newEntry.practices.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("practices", index)}
                          className="px-2"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Challenges */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Challenges & Obstacles</label>
                    <Button variant="outline" size="sm" onClick={() => addArrayItem("challenges")}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  {newEntry.challenges.map((challenge, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="What challenges are you facing?"
                        value={challenge}
                        onChange={(e) => updateArrayItem("challenges", index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      {newEntry.challenges.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("challenges", index)}
                          className="px-2"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Insights */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Insights & Breakthroughs</label>
                    <Button variant="outline" size="sm" onClick={() => addArrayItem("insights")}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  {newEntry.insights.map((insight, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="What insights have you gained?"
                        value={insight}
                        onChange={(e) => updateArrayItem("insights", index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      {newEntry.insights.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("insights", index)}
                          className="px-2"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button onClick={addProgressEntry} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Progress Entry
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
