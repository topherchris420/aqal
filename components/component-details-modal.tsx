"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Info,
  BookOpen,
  Target,
  Lightbulb,
  Users,
  Brain,
  Heart,
  Compass,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  BarChart3,
} from "lucide-react"
import ProgressTracker from "@/components/progress-tracker"

interface ComponentDetailsModalProps {
  component: any
  categoryInfo: any
  children: React.ReactNode
  userProgress?: any
  onUpdateProgress?: (componentId: string, progress: any) => void
}

export default function ComponentDetailsModal({
  component,
  categoryInfo,
  children,
  userProgress,
  onUpdateProgress,
}: ComponentDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getDetailedInfo = (component: any) => {
    const detailsMap = {
      // Ego Development Stages
      opportunist: {
        overview:
          "The Opportunist stage represents early adult ego development characterized by self-protection and opportunistic behavior. Individuals at this stage are primarily focused on immediate needs and avoiding trouble.",
        characteristics: [
          "Self-protective and defensive",
          "Opportunistic in relationships",
          "Blames others for problems",
          "Short-term thinking",
          "Manipulative tendencies",
        ],
        developmentTasks: [
          "Develop basic trust in relationships",
          "Learn to take responsibility for actions",
          "Build impulse control",
          "Recognize impact on others",
        ],
        practices: [
          "Mindfulness meditation to increase self-awareness",
          "Journaling to track patterns of behavior",
          "Therapy to address underlying fears",
          "Building supportive relationships",
        ],
        quadrantManifestations: {
          individual_interior: "Self-protective thoughts, fear-based beliefs, opportunistic mindset",
          individual_exterior: "Defensive behaviors, manipulation, blame-shifting actions",
          collective_interior: "Distrust in relationships, us-vs-them mentality",
          collective_exterior: "Avoidance of accountability systems, exploitation of loopholes",
        },
        nextStage: "Diplomat - Learning to conform and seek approval",
        commonChallenges: [
          "Difficulty trusting others",
          "Tendency to blame external circumstances",
          "Resistance to feedback",
          "Short-term focus",
        ],
      },
      achiever: {
        overview:
          "The Achiever stage represents a goal-oriented, effectiveness-focused approach to life. This is often considered the 'default' adult stage in modern society, emphasizing success, competence, and results.",
        characteristics: [
          "Goal-oriented and results-focused",
          "Values efficiency and effectiveness",
          "Competitive and ambitious",
          "Rational and logical thinking",
          "Success-oriented identity",
        ],
        developmentTasks: [
          "Balance achievement with relationships",
          "Develop emotional intelligence",
          "Question success metrics",
          "Integrate multiple perspectives",
        ],
        practices: [
          "360-degree feedback to gain perspective",
          "Emotional intelligence training",
          "Values clarification exercises",
          "Mindfulness to reduce achievement addiction",
        ],
        quadrantManifestations: {
          individual_interior: "Goal-focused thinking, success-oriented identity, rational analysis",
          individual_exterior: "Achievement behaviors, competitive actions, results-driven performance",
          collective_interior: "Meritocratic values, team effectiveness focus",
          collective_exterior: "Performance management systems, competitive organizational structures",
        },
        nextStage: "Individualist - Developing authenticity and self-awareness",
        commonChallenges: [
          "Work-life balance issues",
          "Difficulty with emotions",
          "Over-identification with success",
          "Impatience with 'inefficiency'",
        ],
      },
      // Spiral Dynamics
      orange: {
        overview:
          "Orange represents the Achievement/Strategic level of Spiral Dynamics, focused on success, progress, and material advancement. This worldview emphasizes competition, innovation, and rational thinking.",
        characteristics: [
          "Achievement and success oriented",
          "Rational and scientific thinking",
          "Competitive and individualistic",
          "Progress and innovation focused",
          "Material prosperity valued",
        ],
        developmentTasks: [
          "Integrate emotional and relational aspects",
          "Develop environmental consciousness",
          "Balance individual success with collective good",
          "Question materialistic values",
        ],
        practices: [
          "Sustainability practices to develop Green values",
          "Emotional intelligence development",
          "Community service and giving back",
          "Meditation to transcend ego-driven achievement",
        ],
        quadrantManifestations: {
          individual_interior: "Strategic thinking, achievement motivation, rational worldview",
          individual_exterior: "Competitive behaviors, goal-directed actions, performance focus",
          collective_interior: "Meritocratic culture, success-oriented values",
          collective_exterior: "Capitalist systems, competitive markets, technological innovation",
        },
        nextStage: "Green - Developing community consciousness and egalitarian values",
        commonChallenges: [
          "Environmental blindness",
          "Relationship difficulties",
          "Burnout from over-achievement",
          "Difficulty with emotions",
        ],
      },
      // Lines of Development
      emotional: {
        overview:
          "The Emotional line of development involves the capacity to recognize, understand, and skillfully work with emotions - both your own and others'. This includes emotional regulation, empathy, and interpersonal skills.",
        characteristics: [
          "Emotional self-awareness",
          "Empathy and compassion",
          "Emotional regulation skills",
          "Interpersonal effectiveness",
          "Emotional resilience",
        ],
        developmentTasks: [
          "Develop emotional vocabulary",
          "Practice emotional regulation",
          "Cultivate empathy and compassion",
          "Learn healthy expression of emotions",
        ],
        practices: [
          "Mindfulness meditation for emotional awareness",
          "Loving-kindness meditation for compassion",
          "Emotional Freedom Technique (EFT)",
          "Therapy or counseling for emotional processing",
        ],
        quadrantManifestations: {
          individual_interior: "Emotional awareness, feeling states, emotional beliefs",
          individual_exterior: "Emotional expressions, empathetic behaviors, emotional regulation",
          collective_interior: "Emotional culture, shared feelings, group emotional intelligence",
          collective_exterior: "Emotional support systems, counseling services, emotional education",
        },
        assessmentQuestions: [
          "How well do you recognize your emotions as they arise?",
          "Can you regulate your emotions effectively under stress?",
          "Do you empathize easily with others' emotional states?",
          "How do you handle conflict in relationships?",
        ],
        commonChallenges: [
          "Emotional overwhelm",
          "Difficulty expressing emotions",
          "Taking on others' emotions",
          "Emotional reactivity",
        ],
      },
      // States of Consciousness
      meditative: {
        overview:
          "Meditative states represent altered states of consciousness achieved through contemplative practices. These states can provide profound insights, peace, and expanded awareness beyond ordinary waking consciousness.",
        characteristics: [
          "Expanded awareness",
          "Inner peace and stillness",
          "Transcendent experiences",
          "Non-dual awareness",
          "Spiritual insights",
        ],
        developmentTasks: [
          "Establish regular meditation practice",
          "Learn different meditation techniques",
          "Integrate insights into daily life",
          "Develop witness consciousness",
        ],
        practices: [
          "Mindfulness meditation",
          "Concentration practices (samatha)",
          "Insight meditation (vipassana)",
          "Contemplative prayer or inquiry",
        ],
        quadrantManifestations: {
          individual_interior: "Meditative awareness, transcendent experiences, spiritual insights",
          individual_exterior: "Meditation postures, breathing practices, contemplative behaviors",
          collective_interior: "Spiritual community, shared contemplative culture",
          collective_exterior: "Meditation centers, retreat facilities, contemplative institutions",
        },
        accessMethods: [
          "Daily meditation practice",
          "Meditation retreats",
          "Breathwork practices",
          "Contemplative reading and study",
        ],
        commonChallenges: [
          "Spiritual bypassing",
          "Difficulty integrating insights",
          "Attachment to special states",
          "Neglecting relative reality",
        ],
      },
    }

    return (
      detailsMap[component.id] || {
        overview: `${component.name} represents an important aspect of integral development. This component offers unique insights and growth opportunities within the ${categoryInfo.title.toLowerCase()} framework.`,
        characteristics: ["Developing...", "Growing...", "Evolving..."],
        developmentTasks: ["Explore this component", "Practice integration", "Seek guidance"],
        practices: ["Meditation", "Reflection", "Study", "Practice"],
        quadrantManifestations: {
          individual_interior: "Internal aspects and subjective experiences",
          individual_exterior: "Behavioral manifestations and actions",
          collective_interior: "Cultural and relational dimensions",
          collective_exterior: "Systems and structural elements",
        },
        commonChallenges: ["Integration", "Understanding", "Application"],
      }
    )
  }

  const getQuadrantRelevanceScore = (quadrant: string) => {
    return component.quadrantRelevance?.[quadrant] || 50
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-orange-600 bg-orange-100"
  }

  const details = getDetailedInfo(component)

  return (
    <Dialog open={isOpen} onValueChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <categoryInfo.icon className="w-6 h-6 text-blue-600" />
              <div>
                <DialogTitle className="text-xl">{component.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={categoryInfo.color}>
                    {categoryInfo.title}
                  </Badge>
                  <Badge
                    variant={
                      component.difficulty === "beginner"
                        ? "secondary"
                        : component.difficulty === "intermediate"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {component.difficulty}
                  </Badge>
                  {userProgress && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Level {userProgress.currentLevel || 0}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {userProgress && onUpdateProgress && (
              <ProgressTracker
                component={component}
                categoryInfo={categoryInfo}
                userProgress={userProgress}
                onUpdateProgress={onUpdateProgress}
              />
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="development" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Development
            </TabsTrigger>
            <TabsTrigger value="quadrants" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Quadrants
            </TabsTrigger>
            <TabsTrigger value="guidance" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Guidance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {userProgress && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <BarChart3 className="w-5 h-5" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">{userProgress.currentLevel || 0}/10</div>
                      <p className="text-sm text-blue-700">Current Level</p>
                      <Progress value={(userProgress.currentLevel || 0) * 10} className="h-2 mt-2" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {userProgress.milestones?.filter((m: any) => m.achieved).length || 0}
                      </div>
                      <p className="text-sm text-blue-700">Milestones Achieved</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">{userProgress.entries?.length || 0}</div>
                      <p className="text-sm text-blue-700">Progress Entries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  What is {component.name}?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{details.overview}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Key Characteristics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {details.characteristics.map((characteristic, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{characteristic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {component.keywords && component.keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Related Concepts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {component.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Development Tab */}
          <TabsContent value="development" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Development Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.developmentTasks.map((task, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Recommended Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.practices.map((practice, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-sm">{practice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {details.nextStage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Next Development Stage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800">{details.nextStage}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Quadrants Tab */}
          <TabsContent value="quadrants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5" />
                  Quadrant Manifestations
                </CardTitle>
                <p className="text-sm text-gray-600">How this component appears in each quadrant</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(details.quadrantManifestations).map(([quadrant, manifestation]) => {
                    const score = getQuadrantRelevanceScore(quadrant)
                    const quadrantNames = {
                      individual_interior: { name: "Individual Interior (I)", icon: Brain, desc: "Subjective" },
                      individual_exterior: { name: "Individual Exterior (It)", icon: Users, desc: "Objective" },
                      collective_interior: { name: "Collective Interior (We)", icon: Heart, desc: "Intersubjective" },
                      collective_exterior: { name: "Collective Exterior (Its)", icon: Compass, desc: "Interobjective" },
                    }
                    const quadrantInfo = quadrantNames[quadrant]

                    return (
                      <Card key={quadrant} className="relative">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <quadrantInfo.icon className="w-4 h-4" />
                              <div>
                                <h4 className="font-medium text-sm">{quadrantInfo.name}</h4>
                                <p className="text-xs text-gray-500">{quadrantInfo.desc}</p>
                              </div>
                            </div>
                            <Badge className={`text-xs ${getRelevanceColor(score)}`}>{score}%</Badge>
                          </div>
                          <Progress value={score} className="h-2" />
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-700">{manifestation}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guidance Tab */}
          <TabsContent value="guidance" className="space-y-6">
            {details.assessmentQuestions && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Self-Assessment Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {details.assessmentQuestions.map((question, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">{question}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Common Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {details.commonChallenges.map((challenge, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                      <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="text-sm text-orange-800">{challenge}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {details.accessMethods && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    How to Access This State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {details.accessMethods.map((method, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{method}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Star className="w-5 h-5" />
                  Integration Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700">
                  Remember that development is not linear. You may experience this component differently at various
                  times. Focus on integration rather than perfection, and be patient with your growth process.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
