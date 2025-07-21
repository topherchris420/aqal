"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Cog, Sparkles, Target, Plus, BarChart3, Menu, UserIcon, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle, MobileThemeToggle } from "@/components/theme-toggle"
import ComponentLibrary from "@/components/component-library"
import QuadrantBuilder from "@/components/quadrant-builder"
import AssessmentWizard from "@/components/assessment-wizard"
import VisualMap from "@/components/visual-map"
import AIInsights from "@/components/ai-insights"
import ExpansionPacks from "@/components/expansion-packs"
import ProgressDashboard from "@/components/progress-dashboard"
import { DragDropContext } from "@hello-pangea/dnd"
import { authService } from "@/lib/auth"
import { storageService } from "@/lib/storage"
import Image from "next/image"

export default function AQALIntegralApp() {
  const [activeTab, setActiveTab] = useState("builder")
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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
  const [userProgress, setUserProgress] = useState({})

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = authService.subscribe((authState) => {
      setUser(authState.user)
      setIsAuthenticated(authState.isAuthenticated)

      if (authState.user) {
        // Load user data from storage
        const userData = storageService.getUserData(authState.user.id)
        if (userData?.profile) {
          setUserProfile(userData.profile)
        }
        if (userData?.progress) {
          setUserProgress(userData.progress)
        }
      }
    })

    return unsubscribe
  }, [])

  // Save user data when profile changes
  useEffect(() => {
    if (user) {
      storageService.saveUserData(user.id, {
        profile: userProfile,
        progress: userProgress,
      })
    }
  }, [user, userProfile, userProgress])

  const handleUpdateProgress = (componentId, progress) => {
    setUserProgress((prev) => ({
      ...prev,
      [componentId]: progress,
    }))
  }

  const initializeProgress = (componentId) => {
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

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const [category, componentId] = draggableId.split("-")

    if (source.droppableId.startsWith("library-") && !destination.droppableId.startsWith("library-")) {
      const allComponents = [
        ...componentCategories[0].components,
        ...componentCategories[1].components,
        ...componentCategories[2].components,
        ...componentCategories[3].components,
      ]

      const component = allComponents.find((c) => c.id === componentId && c.category === category)

      if (component) {
        const newProfile = { ...userProfile }
        const existingComponent = newProfile.quadrants[destination.droppableId].components.find(
          (c) => c.id === component.id && c.category === component.category,
        )

        if (!existingComponent) {
          newProfile.quadrants[destination.droppableId].components.splice(destination.index, 0, component)
          setUserProfile(newProfile)
          initializeProgress(component.id)

          const totalComponents = Object.values(newProfile.quadrants).reduce((sum, q) => sum + q.components.length, 0)
          setCompletionProgress(Math.min(15 + totalComponents * 5, 85))
        }
      }
    } else if (!source.droppableId.startsWith("library-") && !destination.droppableId.startsWith("library-")) {
      const newProfile = { ...userProfile }
      const [movedComponent] = newProfile.quadrants[source.droppableId].components.splice(source.index, 1)
      newProfile.quadrants[destination.droppableId].components.splice(destination.index, 0, movedComponent)
      setUserProfile(newProfile)
    } else if (!source.droppableId.startsWith("library-") && destination.droppableId.startsWith("library-")) {
      // Remove the component from its quadrant and update progress
      const newProfile = { ...userProfile }

      // Remove from quadrant
      newProfile.quadrants[source.droppableId].components.splice(source.index, 1)
      setUserProfile(newProfile)

      // Re-calculate completion progress
      const totalComponents = Object.values(newProfile.quadrants).reduce((sum, q) => sum + q.components.length, 0)
      setCompletionProgress(Math.min(15 + totalComponents * 5, 85))
    }
  }

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

  const allComponents = componentCategories.flatMap((category) => category.components)

  const tabItems = [
    { id: "builder", label: "Builder", icon: Cog },
    { id: "assessment", label: "Assessment", icon: Target },
    { id: "map", label: "Map", icon: Brain },
    { id: "insights", label: "Insights", icon: Sparkles },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "expansion", label: "Expansion", icon: Plus },
  ]

  const handleSignOut = async () => {
    await authService.signOut()
    setUserProfile({
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
    setUserProgress({})
    setCompletionProgress(15)
  }

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full animate-ripple">
          <Avatar className="h-10 w-10 elevation-1">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback className="bg-gradient-primary text-white">{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 elevation-3" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user?.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const MobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden bg-transparent animate-ripple">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 elevation-4">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="relative">
            <Image src="/logo.png" alt="AQAL Logo" width={40} height={40} className="rounded-lg elevation-1" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-primary rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="font-medium text-lg">AQAL Studio</h2>
            <p className="text-sm text-muted-foreground">Integral Development</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-6 animate-slide-up">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-gradient-primary text-white text-sm">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {tabItems.map((item, index) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start transition-smooth animate-ripple ${
                activeTab === item.id ? "elevation-1" : ""
              }`}
              onClick={() => setActiveTab(item.id)}
              style={{ animationDelay: `${index * 50}ms` }}
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md elevation-3 animate-scale-in">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Image src="/logo.png" alt="AQAL Logo" width={64} height={64} className="rounded-xl elevation-2" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-medium text-gradient-primary">AQAL Studio</h1>
              <p className="text-muted-foreground">Integral Development Platform</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full animate-ripple elevation-1" onClick={() => authService.signInAsGuest()}>
              Continue as Guest
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Experience the full platform without any setup required</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="container-google">
          {/* Modern Header */}
          <header className="py-6 lg:py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="AQAL Integral Development Studio"
                    width={48}
                    height={48}
                    className="rounded-xl elevation-2 transition-smooth hover:scale-105"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary rounded-full animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl lg:text-4xl font-medium text-gradient-primary">AQAL Studio</h1>
                  <p className="text-sm lg:text-lg text-muted-foreground hidden lg:block">
                    Build your integral development profile
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
                {user && <UserMenu />}
                <MobileNavigation />
              </div>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 animate-slide-up">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:w-48">
                  <Progress value={completionProgress} className="h-2 transition-smooth" />
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap font-medium">
                  {completionProgress}% Complete
                </span>
              </div>
              <Badge variant="outline" className="bg-card elevation-1 animate-ripple">
                <Sparkles className="w-3 h-3 mr-1" />
                {completionProgress < 30 ? "Beginner" : completionProgress < 70 ? "Intermediate" : "Advanced"} Tier
              </Badge>
            </div>
          </header>

          {/* Main Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden md:grid w-full grid-cols-6 mb-8 bg-card elevation-1 p-1">
              {tabItems.map((item, index) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex items-center gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-smooth animate-ripple elevation-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Mobile Tab Indicator */}
            <div className="md:hidden mb-6 animate-slide-up">
              <Card className="elevation-2">
                <CardContent className="flex items-center gap-3 p-4">
                  {(() => {
                    const currentTab = tabItems.find((item) => item.id === activeTab)
                    if (currentTab) {
                      return (
                        <>
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <currentTab.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium">{currentTab.label}</span>
                            <p className="text-sm text-muted-foreground">
                              {activeTab === "builder" && "Drag and drop components"}
                              {activeTab === "assessment" && "Complete your evaluation"}
                              {activeTab === "map" && "Visualize your development"}
                              {activeTab === "insights" && "AI-powered analysis"}
                              {activeTab === "progress" && "Track your growth"}
                              {activeTab === "expansion" && "Explore learning modules"}
                            </p>
                          </div>
                        </>
                      )
                    }
                    return null
                  })()}
                </CardContent>
              </Card>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              <TabsContent value="builder" className="space-y-6">
                <Card className="border-border bg-card elevation-2">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Cog className="w-5 h-5" />
                      Component Builder
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Drag and drop developmental components to build your integral profile
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
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

              <TabsContent value="assessment" className="space-y-6">
                <AssessmentWizard
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                  setCompletionProgress={setCompletionProgress}
                />
              </TabsContent>

              <TabsContent value="map" className="space-y-6">
                <VisualMap userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <AIInsights userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <ProgressDashboard
                  userProgress={userProgress}
                  onUpdateProgress={handleUpdateProgress}
                  components={allComponents}
                />
              </TabsContent>

              <TabsContent value="expansion" className="space-y-6">
                <ExpansionPacks userProfile={userProfile} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DragDropContext>
  )
}
