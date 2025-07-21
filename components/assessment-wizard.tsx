"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Target, Brain, Heart, Users } from "lucide-react"

interface AssessmentWizardProps {
  userProfile: any
  setUserProfile: (profile: any) => void
  setCompletionProgress: (progress: number) => void
}

const assessmentSteps = [
  {
    id: "quadrant-reflection",
    title: "Quadrant Self-Reflection",
    description: "Reflect on your current development in each quadrant",
    icon: Target,
  },
  {
    id: "developmental-lines",
    title: "Developmental Lines Assessment",
    description: "Rate your development across key lines",
    icon: Brain,
  },
  {
    id: "spiral-dynamics",
    title: "Spiral Dynamics Identification",
    description: "Identify your current spiral tier",
    icon: Users,
  },
  {
    id: "ego-development",
    title: "Ego Development Stage",
    description: "Assess your ego development level",
    icon: Heart,
  },
]

const developmentalLines = [
  { id: "cognitive", name: "Cognitive", description: "Thinking, reasoning, problem-solving" },
  { id: "emotional", name: "Emotional", description: "Emotional intelligence and regulation" },
  { id: "moral", name: "Moral", description: "Ethics, values, and moral reasoning" },
  { id: "spiritual", name: "Spiritual", description: "Meaning-making and transcendence" },
  { id: "interpersonal", name: "Interpersonal", description: "Relationships and social skills" },
  { id: "kinesthetic", name: "Kinesthetic", description: "Body awareness and physical development" },
]

const spiralTiers = [
  { id: "red", name: "Red - Power", description: "Impulsive, egocentric, power-focused" },
  { id: "blue", name: "Blue - Order", description: "Rule-oriented, hierarchical, purposeful" },
  { id: "orange", name: "Orange - Achievement", description: "Strategic, materialistic, competitive" },
  { id: "green", name: "Green - Community", description: "Egalitarian, consensus-seeking, caring" },
  { id: "yellow", name: "Yellow - Integral", description: "Systemic, flexible, integrative" },
  { id: "turquoise", name: "Turquoise - Holistic", description: "Holistic, global, spiritual" },
]

const egoStages = [
  { id: "opportunist", name: "Opportunist", description: "Self-protective, opportunistic" },
  { id: "diplomat", name: "Diplomat", description: "Conformist, seeks approval and belonging" },
  { id: "expert", name: "Expert", description: "Perfectionist, values technical competence" },
  { id: "achiever", name: "Achiever", description: "Goal-oriented, focused on effectiveness" },
  { id: "individualist", name: "Individualist", description: "Self-aware, values authenticity" },
  { id: "strategist", name: "Strategist", description: "Systems thinking, principled" },
]

export default function AssessmentWizard({
  userProfile,
  setUserProfile,
  setCompletionProgress,
}: AssessmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState({
    quadrantReflections: {},
    lineRatings: userProfile.developmentalLines,
    spiralTier: userProfile.spiralTier,
    egoStage: userProfile.egoStage,
  })

  const updateResponse = (key: string, value: any) => {
    setResponses((prev) => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (currentStep < assessmentSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete assessment
      const newProfile = {
        ...userProfile,
        developmentalLines: responses.lineRatings,
        spiralTier: responses.spiralTier,
        egoStage: responses.egoStage,
      }
      setUserProfile(newProfile)
      setCompletionProgress(90)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    const step = assessmentSteps[currentStep]

    switch (step.id) {
      case "quadrant-reflection":
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Reflect on your current development and focus in each quadrant. Consider where you spend most of your
              attention and energy.
            </p>
            {["individual_interior", "individual_exterior", "collective_interior", "collective_exterior"].map(
              (quadrant) => (
                <div key={quadrant} className="space-y-3">
                  <Label className="text-base font-medium capitalize">{quadrant.replace("_", " ")} Quadrant</Label>
                  <Textarea
                    placeholder="Reflect on your development in this quadrant..."
                    value={responses.quadrantReflections[quadrant] || ""}
                    onChange={(e) =>
                      updateResponse("quadrantReflections", {
                        ...responses.quadrantReflections,
                        [quadrant]: e.target.value,
                      })
                    }
                  />
                </div>
              ),
            )}
          </div>
        )

      case "developmental-lines":
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Rate your current development level in each line from 1 (beginner) to 10 (highly developed).
            </p>
            {developmentalLines.map((line) => (
              <div key={line.id} className="space-y-3">
                <div>
                  <Label className="text-base font-medium">{line.name}</Label>
                  <p className="text-sm text-gray-600">{line.description}</p>
                </div>
                <div className="px-3">
                  <Slider
                    value={[responses.lineRatings[line.id] || 5]}
                    onValueChange={(value) =>
                      updateResponse("lineRatings", {
                        ...responses.lineRatings,
                        [line.id]: value[0],
                      })
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Beginner (1)</span>
                    <span className="font-medium">{responses.lineRatings[line.id] || 5}</span>
                    <span>Highly Developed (10)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case "spiral-dynamics":
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Select the Spiral Dynamics tier that best represents your current worldview and values.
            </p>
            <RadioGroup value={responses.spiralTier} onValueChange={(value) => updateResponse("spiralTier", value)}>
              {spiralTiers.map((tier) => (
                <div key={tier.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value={tier.id} id={tier.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={tier.id} className="text-base font-medium cursor-pointer">
                      {tier.name}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "ego-development":
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Select the ego development stage that best describes your current level of self-awareness and complexity.
            </p>
            <RadioGroup value={responses.egoStage} onValueChange={(value) => updateResponse("egoStage", value)}>
              {egoStages.map((stage) => (
                <div key={stage.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value={stage.id} id={stage.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={stage.id} className="text-base font-medium cursor-pointer">
                      {stage.name}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      default:
        return null
    }
  }

  const currentStepData = assessmentSteps[currentStep]

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <currentStepData.icon className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>{currentStepData.title}</CardTitle>
              <p className="text-gray-600">{currentStepData.description}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {assessmentSteps.length}
          </div>
        </div>
        <Progress value={((currentStep + 1) / assessmentSteps.length) * 100} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStepContent()}

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={nextStep}>
            {currentStep === assessmentSteps.length - 1 ? "Complete Assessment" : "Next"}
            {currentStep < assessmentSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
