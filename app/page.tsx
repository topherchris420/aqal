"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Cog, Sparkles, Target, Plus, BarChart3, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle, MobileThemeToggle } from "@/components/theme-toggle"
import ComponentLibrary from "@/components/component-library"
import QuadrantBuilder from "@/components/quadrant-builder"
import AssessmentWizard from "@/components/assessment-wizard"
import VisualMap from "@/components/visual-map"
import AIInsights from "@/components/ai-insights"
import ExpansionPacks from "@/components/expansion-packs"
import ProgressDashboard from "@/components/progress-dashboard"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import Image from "next/image"

export default function AQALIntegralApp() {
  const [activeTab, setActiveTab] = useState("builder")
  const [userProfile, setUserProfile] = useState({
    quadrants: {
      individual_interior: { components: [], rating: 0 },
      individual_exterior: { components: [], rating: 0 },
      collective_interior: { components: [], rating: 0 },
      collective_exterior: { components: [], rating: 0 },
    },
    developmentalLines: {
      cognitive: 0,
      emotional: 0,
      moral: 0,
      spiritual: 0,
      interpersonal: 0,
      kinesthetic: 0,
    },
    spiralTier: "orange",
    egoStage: "achiever",
    stateExperiences: [],
  })

  const [completionProgress, setCompletionProgress] = useState(15)

  // Progress tracking state
  const [userProgress, setUserProgress] = useState<Record<string, any>>({})

  const handleUpdateProgress = (componentId: string, progress: any) => {
    setUserProgress((prev) => ({
      ...prev,
      [componentId]: progress,
    }))
  }

  // Initialize progress for new components
  const initializeProgress = (componentId: string) => {
    if (!userProgress[componentId]) {
      const newProgress = {
        componentId,
        currentLevel: 1,
        entries: [],
        milestones: [],
        totalPracticeHours: 0,
        startDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }
      handleUpdateProgress(componentId, newProgress)
      return newProgress
    }
    return userProgress[componentId]
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If dropped outside a droppable area
    if (!destination) {
      return
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Parse the draggable ID to get component info
    const [category, componentId] = draggableId.split("-")

    // If dragging from library to quadrant
    if (source.droppableId.startsWith("library-") && !destination.droppableId.startsWith("library-")) {
      // Find the component data
      const allComponents = [
        ...componentCategories[0].components,
        ...componentCategories[1].components,
        ...componentCategories[2].components,
        ...componentCategories[3].components,
      ]

      const component = allComponents.find((c) => c.id === componentId && c.category === category)

      if (component) {
        const newProfile = { ...userProfile }

        // Check if component already exists in this quadrant
        const existingComponent = newProfile.quadrants[destination.droppableId].components.find(
          (c: any) => c.id === component.id && c.category === component.category,
        )

        if (!existingComponent) {
          // Add component to destination quadrant
          newProfile.quadrants[destination.droppableId].components.splice(destination.index, 0, component)
          setUserProfile(newProfile)

          // Initialize progress tracking for new component
          initializeProgress(component.id)

          // Update completion progress
          const totalComponents = Object.values(newProfile.quadrants).reduce(
            (sum: number, q: any) => sum + q.components.length,
            0,
          )
          setCompletionProgress(Math.min(15 + totalComponents * 5, 85))
        }
      }
    }

    // If dragging between quadrants
    else if (!source.droppableId.startsWith("library-") && !destination.droppableId.startsWith("library-")) {
      const newProfile = { ...userProfile }

      // Remove from source
      const [movedComponent] = newProfile.quadrants[source.droppableId].components.splice(source.index, 1)

      // Add to destination
      newProfile.quadrants[destination.droppableId].components.splice(destination.index, 0, movedComponent)

      setUserProfile(newProfile)
    }

    // If dragging from quadrant back to library (remove component)
    else if (!source.droppableId.startsWith("library-") && destination.droppableId.startsWith("library-")) {
      const newProfile = { ...userProfile }

      // Remove from quadrant
      newProfile.quadrants[source.droppableId].components.splice(source.index, 1)
      setUserProfile(newProfile)

      // Update completion progress
      const totalComponents = Object.values(newProfile.quadrants).reduce(
        (sum: number, q: any) => sum + q.components.length,
        0,
      )
      setCompletionProgress(Math.min(15 + totalComponents * 5, 85))
    }
  }

  // Add component categories data
  const componentCategories = [
    {
      title: "Ego Development Stages",
      components: [
        { id: "opportunist", name: "Opportunist", description: "Self-protective, opportunistic", category: "ego" },
        { id: "diplomat", name: "Diplomat", description: "Conformist, seeks approval", category: "ego" },
        { id: "expert", name: "Expert", description: "Perfectionist, technical competence", category: "ego" },
        { id: "achiever", name: "Achiever", description: "Goal-oriented, effectiveness", category: "ego" },
        { id: "individualist", name: "Individualist", description: "Self-aware, authentic", category: "ego" },
        { id: "strategist", name: "Strategist", description: "Systems thinking, principled", category: "ego" },
        { id: "alchemist", name: "Alchemist", description: "Transformational, integral", category: "ego" },
      ],
    },
    {
      title: "Spiral Dynamics Tiers",
      components: [
        { id: "beige", name: "Beige - Survival", description: "Basic survival instincts", category: "spiral" },
        { id: "purple", name: "Purple - Tribal", description: "Magical, tribal bonds", category: "spiral" },
        { id: "red", name: "Red - Power", description: "Impulsive, power-driven", category: "spiral" },
        { id: "blue", name: "Blue - Order", description: "Purposeful, hierarchical", category: "spiral" },
        { id: "orange", name: "Orange - Achievement", description: "Strategic, materialistic", category: "spiral" },
        { id: "green", name: "Green - Community", description: "Egalitarian, consensus", category: "spiral" },
        { id: "yellow", name: "Yellow - Integral", description: "Systemic, flexible", category: "spiral" },
        { id: "turquoise", name: "Turquoise - Holistic", description: "Holistic, global", category: "spiral" },
      ],
    },
    {
      title: "Lines of Development",
      components: [
        { id: "cognitive", name: "Cognitive", description: "Thinking, reasoning, logic", category: "lines" },
        { id: "emotional", name: "Emotional", description: "Feeling, emotional intelligence", category: "lines" },
        { id: "moral", name: "Moral", description: "Ethics, values, principles", category: "lines" },
        { id: "spiritual", name: "Spiritual", description: "Meaning, transcendence", category: "lines" },
        { id: "interpersonal", name: "Interpersonal", description: "Relationships, social skills", category: "lines" },
        { id: "kinesthetic", name: "Kinesthetic", description: "Body awareness, physical", category: "lines" },
        { id: "aesthetic", name: "Aesthetic", description: "Beauty, creativity, art", category: "lines" },
      ],
    },
    {
      title: "States of Consciousness",
      components: [
        { id: "waking", name: "Waking", description: "Normal conscious awareness", category: "states" },
        { id: "dreaming", name: "Dreaming", description: "Dream state consciousness", category: "states" },
        { id: "deep-sleep", name: "Deep Sleep", description: "Formless awareness", category: "states" },
        { id: "meditative", name: "Meditative", description: "Contemplative states", category: "states" },
        { id: "peak", name: "Peak Experience", description: "Transcendent moments", category: "states" },
        { id: "flow", name: "Flow State", description: "Optimal performance", category: "states" },
      ],
    },
  ]

  // Get all components for progress dashboard
  const allComponents = componentCategories.flatMap((category) => category.components)

  const tabItems = [
    { id: "builder", label: "Builder", icon: Cog },
    { id: "assessment", label: "Assessment", icon: Target },
    { id: "map", label: "Map", icon: Brain },
    { id: "insights", label: "Insights", icon: Sparkles },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "expansion", label: "Expansion", icon: Plus },
  ]

  const MobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden bg-transparent">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/logo.png" alt="AQAL Logo" width={40} height={40} className="rounded-lg" />
          <div>
            <h2 className="font-bold text-lg">AQAL Studio</h2>
            <p className="text-sm text-muted-foreground">Integral Development</p>
          </div>
        </div>
        <div className="space-y-2 mb-6">
          {tabItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <MobileThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          {/* Mobile-Optimized Header */}
          <div className="py-4 sm:py-6 lg:py-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="AQAL Integral Development Studio"
                  width={48}
                  height={48}
                  className="rounded-lg shadow-sm dark:shadow-slate-700"
                />
                <div className="hidden sm:block">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    AQAL Integral Studio
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground hidden lg:block">
                    Build your personal developmental profile using the integral framework
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
                <MobileNavigation />
              </div>
            </div>

            {/* Mobile-friendly progress section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Progress value={completionProgress} className="flex-1 sm:w-32" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {completionProgress}% Complete
                </span>
              </div>
              <Badge variant="outline" className="bg-card text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                Beginner Tier
              </Badge>
            </div>
          </div>

          {/* Main Navigation - Desktop */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden md:grid w-full grid-cols-6 mb-6 bg-card">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Mobile Tab Indicator */}
            <div className="md:hidden mb-4">
              <div className="flex items-center gap-2 p-3 bg-card rounded-lg shadow-sm border">
                {(() => {
                  const currentTab = tabItems.find((item) => item.id === activeTab)
                  if (currentTab) {
                    return (
                      <>
                        <currentTab.icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{currentTab.label}</span>
                      </>
                    )
                  }
                  return null
                })()}
              </div>
            </div>

            {/* Modular Component Builder */}
            <TabsContent value="builder" className="space-y-4 sm:space-y-6">
              <Card className="border-border bg-card">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Cog className="w-4 h-4 sm:w-5 sm:h-5" />
                    Component Builder
                  </CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Drag and drop developmental components to build your integral profile
                  </p>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
                    <div className="lg:col-span-1 order-2 lg:order-1">
                      <ComponentLibrary />
                    </div>
                    <div className="lg:col-span-3 order-1 lg:order-2">
                      <QuadrantBuilder
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        setCompletionProgress={setCompletionProgress}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Guided Self-Assembly */}
            <TabsContent value="assessment" className="space-y-4 sm:space-y-6">
              <AssessmentWizard
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                setCompletionProgress={setCompletionProgress}
              />
            </TabsContent>

            {/* Visual System Map */}
            <TabsContent value="map" className="space-y-4 sm:space-y-6">
              <VisualMap userProfile={userProfile} />
            </TabsContent>

            {/* Dynamic Feedback Engine */}
            <TabsContent value="insights" className="space-y-4 sm:space-y-6">
              <AIInsights userProfile={userProfile} />
            </TabsContent>

            {/* Progress Tracking */}
            <TabsContent value="progress" className="space-y-4 sm:space-y-6">
              <ProgressDashboard
                userProgress={userProgress}
                onUpdateProgress={handleUpdateProgress}
                components={allComponents}
              />
            </TabsContent>

            {/* Reflection and Expansion Modules */}
            <TabsContent value="expansion" className="space-y-4 sm:space-y-6">
              <ExpansionPacks userProfile={userProfile} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DragDropContext>
  )
}
