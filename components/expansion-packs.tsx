"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Eye, Compass, Mountain, Waves, Star, Lock, CheckCircle, Plus } from "lucide-react"

interface ExpansionPacksProps {
  userProfile: any
}

const expansionPacks = [
  {
    id: "shadow-work",
    title: "Shadow Work Integration",
    description: "Explore and integrate your unconscious aspects for wholeness",
    icon: Eye,
    color: "bg-gray-100 border-gray-300",
    difficulty: "Intermediate",
    duration: "4-6 weeks",
    unlocked: true,
    modules: [
      "Shadow Identification Exercises",
      "Projection Reclaiming",
      "Dream Work Integration",
      "Somatic Shadow Release",
    ],
    benefits: [
      "Increased self-awareness",
      "Reduced projection",
      "Enhanced emotional regulation",
      "Greater authenticity",
    ],
  },
  {
    id: "contemplative-tools",
    title: "Contemplative Practices",
    description: "Deepen your spiritual development through meditation and inquiry",
    icon: Mountain,
    color: "bg-purple-100 border-purple-300",
    difficulty: "Beginner",
    duration: "6-8 weeks",
    unlocked: true,
    modules: [
      "Mindfulness Meditation",
      "Self-Inquiry Practices",
      "Loving-Kindness Cultivation",
      "Witness Consciousness Development",
    ],
    benefits: ["Enhanced presence", "Deeper self-understanding", "Emotional stability", "Spiritual insight"],
  },
  {
    id: "philosophical-expansion",
    title: "Philosophical Frameworks",
    description: "Explore diverse wisdom traditions and philosophical perspectives",
    icon: Brain,
    color: "bg-blue-100 border-blue-300",
    difficulty: "Advanced",
    duration: "8-10 weeks",
    unlocked: false,
    prerequisite: "Complete Shadow Work Integration",
    modules: [
      "Eastern Philosophy Integration",
      "Western Philosophical Traditions",
      "Indigenous Wisdom Ways",
      "Postmodern Perspectives",
    ],
    benefits: ["Expanded worldview", "Critical thinking skills", "Cultural sensitivity", "Intellectual humility"],
  },
  {
    id: "spiritual-states",
    title: "States of Consciousness",
    description: "Explore and stabilize higher states of consciousness",
    icon: Star,
    color: "bg-yellow-100 border-yellow-300",
    difficulty: "Advanced",
    duration: "10-12 weeks",
    unlocked: false,
    prerequisite: "Complete Contemplative Practices",
    modules: [
      "Altered State Exploration",
      "Psychedelic Integration",
      "Mystical Experience Processing",
      "State-Stage Integration",
    ],
    benefits: ["Expanded consciousness", "Spiritual awakening", "Enhanced creativity", "Transcendent perspective"],
  },
  {
    id: "somatic-integration",
    title: "Embodied Development",
    description: "Integrate development through body awareness and movement",
    icon: Waves,
    color: "bg-green-100 border-green-300",
    difficulty: "Intermediate",
    duration: "6-8 weeks",
    unlocked: true,
    modules: [
      "Body Awareness Practices",
      "Emotional Release Techniques",
      "Movement Meditation",
      "Trauma-Informed Integration",
    ],
    benefits: ["Body-mind integration", "Emotional regulation", "Stress reduction", "Grounded presence"],
  },
  {
    id: "collective-intelligence",
    title: "Collective Intelligence",
    description: "Develop skills for group wisdom and collective consciousness",
    icon: Compass,
    color: "bg-orange-100 border-orange-300",
    difficulty: "Advanced",
    duration: "8-10 weeks",
    unlocked: false,
    prerequisite: "Complete 2 other packs",
    modules: [
      "Group Facilitation Skills",
      "Collective Sensing",
      "Dialogue and Deep Listening",
      "Systems Thinking Application",
    ],
    benefits: ["Leadership skills", "Group harmony", "Systems awareness", "Collective wisdom"],
  },
]

export default function ExpansionPacks({ userProfile }: ExpansionPacksProps) {
  const getRecommendedPacks = () => {
    const recommendations = []

    // Based on developmental lines
    if (userProfile.developmentalLines.emotional < 6) {
      recommendations.push("shadow-work")
    }
    if (userProfile.developmentalLines.spiritual < 7) {
      recommendations.push("contemplative-tools")
    }
    if (userProfile.developmentalLines.kinesthetic < 6) {
      recommendations.push("somatic-integration")
    }

    return recommendations
  }

  const recommendedPacks = getRecommendedPacks()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-600" />
            Expansion Packs
          </CardTitle>
          <p className="text-gray-600">Modular development programs to advance your integral growth</p>
        </CardHeader>
      </Card>

      {/* Recommended Section */}
      {recommendedPacks.length > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-lg text-purple-800">Recommended for You</CardTitle>
            <p className="text-purple-700">Based on your current development profile</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expansionPacks
                .filter((pack) => recommendedPacks.includes(pack.id))
                .map((pack) => (
                  <div key={pack.id} className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <pack.icon className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">{pack.title}</span>
                      <Badge className="bg-purple-100 text-purple-800">Recommended</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{pack.description}</p>
                    <Button size="sm" className="w-full">
                      Start Pack
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Expansion Packs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expansionPacks.map((pack) => (
          <Card key={pack.id} className={`${pack.color} relative`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <pack.icon className="w-6 h-6" />
                  <div>
                    <CardTitle className="text-lg">{pack.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{pack.description}</p>
                  </div>
                </div>
                {pack.unlocked ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Badge variant="outline">{pack.difficulty}</Badge>
                <Badge variant="outline">{pack.duration}</Badge>
              </div>

              {!pack.unlocked && pack.prerequisite && (
                <div className="text-xs text-gray-600 mt-2">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Requires: {pack.prerequisite}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Modules */}
              <div>
                <h4 className="font-medium text-sm mb-2">Modules Included:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {pack.modules.map((module, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      {module}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-medium text-sm mb-2">Key Benefits:</h4>
                <div className="flex flex-wrap gap-1">
                  {pack.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full mt-4"
                disabled={!pack.unlocked}
                variant={pack.unlocked ? "default" : "secondary"}
              >
                {pack.unlocked ? "Start Pack" : "Locked"}
              </Button>

              {/* Progress for started packs */}
              {pack.unlocked && Math.random() > 0.7 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>2/4 modules</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Pack Builder */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="text-center py-12">
          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Create Custom Pack</h3>
          <p className="text-gray-600 mb-4">Design your own development program based on your specific needs</p>
          <Button variant="outline">Build Custom Pack</Button>
        </CardContent>
      </Card>
    </div>
  )
}
