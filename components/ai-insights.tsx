"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Target,
  BookOpen,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Star,
  Clock,
  Users,
  Zap,
} from "lucide-react"
import { aiEngine } from "@/lib/ai-engine"
import { storageService } from "@/lib/storage"
import { authService } from "@/lib/auth"

interface AIInsightsProps {
  userProfile: any
}

export default function AIInsights({ userProfile }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadCachedInsights()
  }, [])

  const loadCachedInsights = () => {
    const user = authService.getCurrentUser()
    if (user) {
      const userData = storageService.getUserData(user.id)
      if (userData?.insights) {
        setInsights(userData.insights)
      }
    }
  }

  const generateInsights = async () => {
    setIsGenerating(true)

    try {
      const newInsights = await aiEngine.generateInsights(userProfile)
      setInsights(newInsights)

      // Save insights to storage
      const user = authService.getCurrentUser()
      if (user) {
        storageService.saveUserData(user.id, { insights: newInsights })
      }
    } catch (error) {
      console.error("Failed to generate insights:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const InsightCard = ({
    title,
    description,
    confidence,
    priority,
    category,
    actionable = false,
  }: {
    title: string
    description: string
    confidence: number
    priority: "high" | "medium" | "low"
    category: string
    actionable?: boolean
  }) => (
    <Card className="elevation-1 hover:elevation-2 transition-smooth animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                priority === "high"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : priority === "medium"
                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
              }`}
            >
              <Lightbulb className="w-3 h-3" />
            </div>
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3" />
            {Math.round(confidence * 100)}%
          </div>
        </div>

        <h4 className="font-medium mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>

        {actionable && (
          <Button size="sm" variant="outline" className="w-full animate-ripple bg-transparent">
            Take Action
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  )

  const DevelopmentPath = ({ path }: { path: any }) => (
    <Card className="elevation-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-4 h-4" />
            {path.title}
          </CardTitle>
          <Badge
            variant={path.timeframe === "short" ? "default" : path.timeframe === "medium" ? "secondary" : "outline"}
          >
            {path.timeframe === "short" ? "1-3 months" : path.timeframe === "medium" ? "3-6 months" : "6+ months"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{path.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{path.progress}%</span>
          </div>
          <Progress value={path.progress} className="h-2" />
        </div>

        <div className="space-y-2">
          <h5 className="font-medium text-sm">Next Steps:</h5>
          <ul className="space-y-1">
            {path.nextSteps.map((step: string, index: number) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>

        <Button className="w-full animate-ripple" size="sm">
          Start Development Path
        </Button>
      </CardContent>
    </Card>
  )

  if (!insights) {
    return (
      <Card className="elevation-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Insights
          </CardTitle>
          <p className="text-muted-foreground">
            Get personalized insights and recommendations based on your integral profile
          </p>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Ready for AI Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate personalized insights based on your current profile and development goals
              </p>
              <Button onClick={generateInsights} disabled={isGenerating} className="animate-ripple elevation-1">
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Insights
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="elevation-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Insights
              </CardTitle>
              <p className="text-muted-foreground">Personalized analysis of your integral development</p>
            </div>
            <Button
              variant="outline"
              onClick={generateInsights}
              disabled={isGenerating}
              className="animate-ripple bg-transparent"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-card elevation-1">
          <TabsTrigger value="overview" className="animate-ripple">
            <TrendingUp className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="animate-ripple">
            <Lightbulb className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="paths" className="animate-ripple">
            <Target className="w-4 h-4 mr-2" />
            Paths
          </TabsTrigger>
          <TabsTrigger value="resources" className="animate-ripple">
            <BookOpen className="w-4 h-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="elevation-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Development Score</p>
                    <p className="text-2xl font-bold">{insights.overallScore}/100</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="elevation-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Goals</p>
                    <p className="text-2xl font-bold">{insights.activeGoals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="elevation-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Areas</p>
                    <p className="text-2xl font-bold">{insights.growthAreas}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="elevation-1">
            <CardHeader>
              <CardTitle className="text-lg">Development Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{insights.summary}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {insights.recommendations.map((insight: any, index: number) => (
              <InsightCard
                key={index}
                title={insight.title}
                description={insight.description}
                confidence={insight.confidence}
                priority={insight.priority}
                category={insight.category}
                actionable={insight.actionable}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {insights.developmentPaths.map((path: any, index: number) => (
              <DevelopmentPath key={index} path={path} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.resources.map((resource: any, index: number) => (
              <Card key={index} className="elevation-1 hover:elevation-2 transition-smooth">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <BookOpen className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {resource.duration}
                        <Users className="w-3 h-3 ml-2" />
                        {resource.difficulty}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3 animate-ripple bg-transparent">
                    Access Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
