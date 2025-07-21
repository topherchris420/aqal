"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb, ArrowRight } from "lucide-react"

interface AIInsightsProps {
  userProfile: any
}

export default function AIInsights({ userProfile }: AIInsightsProps) {
  // Generate insights based on user profile
  const generateInsights = () => {
    const insights = {
      integrationGaps: [],
      shadowAspects: [],
      alignmentPatterns: [],
      growthRecommendations: [],
    }

    // Analyze quadrant balance
    const quadrantStrengths = Object.entries(userProfile.quadrants).map(([id, quadrant]: [string, any]) => ({
      id,
      strength: quadrant.components.length,
    }))

    const maxStrength = Math.max(...quadrantStrengths.map((q) => q.strength))
    const minStrength = Math.min(...quadrantStrengths.map((q) => q.strength))

    if (maxStrength - minStrength > 2) {
      const weakestQuadrant = quadrantStrengths.find((q) => q.strength === minStrength)
      insights.integrationGaps.push({
        type: "Quadrant Imbalance",
        description: `Your ${weakestQuadrant?.id.replace("_", " ")} quadrant needs more attention for balanced development.`,
        severity: "medium",
      })
    }

    // Analyze developmental lines
    const lineValues = Object.entries(userProfile.developmentalLines) as [string, number][]
    const avgLine = lineValues.reduce((sum, [, val]) => sum + val, 0) / lineValues.length

    lineValues.forEach(([line, value]) => {
      if (value < avgLine - 2) {
        insights.shadowAspects.push({
          type: "Underdeveloped Line",
          description: `Your ${line} development is significantly below your average. This may create blind spots.`,
          line,
          severity: "high",
        })
      }
    })

    // Spiral Dynamics insights
    const spiralInsights = {
      orange: "Focus on integrating green values of community and sustainability with your achievement orientation.",
      green: "Consider developing yellow integral thinking to transcend either/or perspectives.",
      yellow: "Explore turquoise holistic consciousness while maintaining your systemic flexibility.",
      blue: "Work on developing orange strategic thinking while honoring your sense of order.",
      red: "Develop blue purposeful structure while maintaining your power and energy.",
    }

    if (spiralInsights[userProfile.spiralTier as keyof typeof spiralInsights]) {
      insights.growthRecommendations.push({
        type: "Spiral Evolution",
        description: spiralInsights[userProfile.spiralTier as keyof typeof spiralInsights],
        priority: "high",
      })
    }

    // Alignment patterns
    const cognitiveEmotionalGap = Math.abs(
      userProfile.developmentalLines.cognitive - userProfile.developmentalLines.emotional,
    )
    if (cognitiveEmotionalGap > 3) {
      insights.alignmentPatterns.push({
        type: "Cognitive-Emotional Misalignment",
        description:
          "There's a significant gap between your cognitive and emotional development, which may cause internal conflicts.",
        recommendation: "Focus on integrating thinking and feeling through practices like mindfulness or therapy.",
      })
    }

    return insights
  }

  const insights = generateInsights()

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Generated Insights
          </CardTitle>
          <p className="text-gray-600">Personalized analysis of your integral development profile</p>
        </CardHeader>
      </Card>

      {/* Integration Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Integration Gaps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.integrationGaps.length === 0 ? (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Great! Your development appears well-integrated across quadrants. Continue building on this balanced
                foundation.
              </AlertDescription>
            </Alert>
          ) : (
            insights.integrationGaps.map((gap, index) => (
              <Alert key={index} className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-medium">{gap.type}:</span> {gap.description}
                    </div>
                    <Badge variant={gap.severity === "high" ? "destructive" : "secondary"}>{gap.severity}</Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Shadow Aspects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-red-600" />
            Shadow Aspects & Blind Spots
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.shadowAspects.length === 0 ? (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Your developmental lines appear relatively balanced. Keep monitoring for emerging blind spots as you
                grow.
              </AlertDescription>
            </Alert>
          ) : (
            insights.shadowAspects.map((shadow, index) => (
              <Alert key={index} className="border-red-200 bg-red-50">
                <Target className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-medium">{shadow.type}:</span> {shadow.description}
                    </div>
                    <Badge variant="destructive">{shadow.severity}</Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Alignment Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Alignment Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.alignmentPatterns.length === 0 ? (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Your interior/exterior and individual/collective aspects appear well-aligned. This creates a strong
                foundation for growth.
              </AlertDescription>
            </Alert>
          ) : (
            insights.alignmentPatterns.map((pattern, index) => (
              <Alert key={index} className="border-blue-200 bg-blue-50">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div>
                    <span className="font-medium">{pattern.type}:</span> {pattern.description}
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <ArrowRight className="w-3 h-3" />
                      <span className="italic">{pattern.recommendation}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Growth Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-600" />
            Growth Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.growthRecommendations.map((rec, index) => (
            <Alert key={index} className="border-green-200 bg-green-50">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-medium">{rec.type}:</span> {rec.description}
                  </div>
                  <Badge className="bg-green-100 text-green-800">{rec.priority}</Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}

          {/* General Recommendations */}
          <Alert className="border-green-200 bg-green-50">
            <Lightbulb className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div>
                <span className="font-medium">Next Steps:</span> Consider exploring the expansion packs to deepen your
                development in specific areas. Shadow work and contemplative practices are particularly valuable for
                integral growth.
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
