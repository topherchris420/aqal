"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, SortAsc, SortDesc, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Sparkles, Target, Layers, GripVertical } from "lucide-react"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import ComponentDetailsModal from "@/components/component-details-modal"

const componentCategories = [
  {
    title: "Ego Development Stages",
    icon: Brain,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
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
    icon: Layers,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
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
    icon: Target,
    color: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
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
    icon: Sparkles,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300",
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

export default function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [showFilters, setShowFilters] = useState(false)

  // Enhanced component data with additional metadata
  const enhancedComponentCategories = componentCategories.map((category) => ({
    ...category,
    components: category.components.map((component) => ({
      ...component,
      difficulty: getDifficultyLevel(component.category, component.id),
      keywords: getKeywords(component),
      quadrantRelevance: getQuadrantRelevance(component),
    })),
  }))

  // Filter and search logic
  const filteredAndSortedComponents = useMemo(() => {
    let allComponents = enhancedComponentCategories.flatMap((category) =>
      category.components.map((component) => ({
        ...component,
        categoryTitle: category.title,
        categoryIcon: category.icon,
        categoryColor: category.color,
      })),
    )

    // Apply search filter
    if (searchTerm) {
      allComponents = allComponents.filter(
        (component) =>
          component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      allComponents = allComponents.filter((component) => component.category === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "all") {
      allComponents = allComponents.filter((component) => component.difficulty === selectedDifficulty)
    }

    // Apply sorting
    allComponents.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "difficulty":
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          break
        case "category":
          comparison = a.categoryTitle.localeCompare(b.categoryTitle)
          break
        case "relevance":
          const aRelevance = Math.max(...Object.values(a.quadrantRelevance))
          const bRelevance = Math.max(...Object.values(b.quadrantRelevance))
          comparison = bRelevance - aRelevance
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return allComponents
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, sortOrder, enhancedComponentCategories])

  // Group filtered components back by category for display
  const groupedFilteredComponents = useMemo(() => {
    const grouped = enhancedComponentCategories
      .map((category) => ({
        ...category,
        components: filteredAndSortedComponents.filter(
          (component) => component.category === category.components[0]?.category,
        ),
      }))
      .filter((category) => category.components.length > 0)

    return grouped
  }, [filteredAndSortedComponents, enhancedComponentCategories])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSortBy("name")
    setSortOrder("asc")
  }

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all" || sortBy !== "name"

  return (
    <Card className="h-full border-border bg-card">
      <CardHeader className="space-y-3 sm:space-y-4 p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Component Library</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">{filteredAndSortedComponents.length} components</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`text-xs sm:text-sm ${showFilters ? "bg-primary/10 border-primary/20" : ""}`}
          >
            <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3 sm:w-4 sm:h-4" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:pl-10 pr-8 sm:pr-10 text-xs sm:text-sm h-8 sm:h-10 bg-background"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Mobile-Optimized Filters Panel */}
        {showFilters && (
          <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-muted/50 rounded-lg border">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="ego">Ego Development</SelectItem>
                    <SelectItem value="spiral">Spiral Dynamics</SelectItem>
                    <SelectItem value="lines">Development Lines</SelectItem>
                    <SelectItem value="states">Consciousness States</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-xs sm:text-sm font-medium">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="relevance">Relevance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Order</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="w-full h-8 sm:h-10"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <SortDesc className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {filteredAndSortedComponents.length} results
                </span>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs sm:text-sm">
                  <X className="w-3 h-3 mr-1" />
                  Clear all
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && !showFilters && (
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                Search: "{searchTerm.length > 10 ? searchTerm.substring(0, 10) + "..." : searchTerm}"
                <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="ml-1 h-3 w-3 p-0">
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {selectedCategory}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="ml-1 h-3 w-3 p-0"
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] px-2 sm:px-4">
          {groupedFilteredComponents.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Search className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-lg font-medium mb-2">No components found</p>
              <p className="text-xs sm:text-sm">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4 bg-transparent text-xs sm:text-sm"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {groupedFilteredComponents.map((category, categoryIndex) => (
                <div key={category.title} className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <category.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <h3 className="font-medium text-xs sm:text-sm truncate">{category.title}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {category.components.length}
                    </Badge>
                  </div>
                  <Droppable droppableId={`library-${categoryIndex}`} type="COMPONENT">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-2 min-h-[50px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? "bg-primary/10 border-2 border-primary/20 border-dashed" : ""
                        }`}
                      >
                        {category.components.map((component, index) => (
                          <Draggable
                            key={component.id}
                            draggableId={`${component.category}-${component.id}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-2 sm:p-3 bg-card border rounded-lg transition-all ${
                                  snapshot.isDragging
                                    ? "shadow-lg rotate-2 scale-105 border-primary"
                                    : "hover:border-muted-foreground/30"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div {...provided.dragHandleProps} className="touch-manipulation">
                                      <GripVertical className="w-3 h-3 text-muted-foreground cursor-move" />
                                    </div>
                                    <ComponentDetailsModal component={component} categoryInfo={category}>
                                      <button className="font-medium text-xs sm:text-sm hover:text-primary transition-colors text-left truncate">
                                        {component.name}
                                      </button>
                                    </ComponentDetailsModal>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Badge
                                      variant="outline"
                                      className={`${category.color} text-xs hidden sm:inline-flex`}
                                    >
                                      {category.title.split(" ")[0]}
                                    </Badge>
                                    <Badge
                                      variant={
                                        component.difficulty === "beginner"
                                          ? "secondary"
                                          : component.difficulty === "intermediate"
                                            ? "default"
                                            : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {component.difficulty.charAt(0).toUpperCase()}
                                    </Badge>
                                    <ComponentDetailsModal component={component} categoryInfo={category}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-primary/10 touch-manipulation"
                                      >
                                        <Info className="w-3 h-3" />
                                      </Button>
                                    </ComponentDetailsModal>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground ml-5 mb-2 line-clamp-2">
                                  {component.description}
                                </p>

                                {/* Keywords - Hidden on mobile */}
                                {component.keywords.length > 0 && (
                                  <div className="hidden sm:flex flex-wrap gap-1 ml-5">
                                    {component.keywords.slice(0, 2).map((keyword, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Helper functions
function getDifficultyLevel(category: string, id: string): "beginner" | "intermediate" | "advanced" {
  const difficultyMap = {
    ego: {
      opportunist: "beginner",
      diplomat: "beginner",
      expert: "intermediate",
      achiever: "intermediate",
      individualist: "advanced",
      strategist: "advanced",
      alchemist: "advanced",
    },
    spiral: {
      beige: "beginner",
      purple: "beginner",
      red: "beginner",
      blue: "intermediate",
      orange: "intermediate",
      green: "intermediate",
      yellow: "advanced",
      turquoise: "advanced",
    },
    lines: {
      cognitive: "beginner",
      emotional: "intermediate",
      moral: "intermediate",
      spiritual: "advanced",
      interpersonal: "beginner",
      kinesthetic: "beginner",
      aesthetic: "intermediate",
    },
    states: {
      waking: "beginner",
      dreaming: "intermediate",
      "deep-sleep": "intermediate",
      meditative: "advanced",
      peak: "advanced",
      flow: "intermediate",
    },
  }

  return difficultyMap[category]?.[id] || "intermediate"
}

function getKeywords(component: any): string[] {
  const keywordMap = {
    // Ego Development
    opportunist: ["survival", "self-protection", "reactive"],
    diplomat: ["conformity", "approval", "belonging"],
    expert: ["perfection", "competence", "expertise"],
    achiever: ["goals", "success", "effectiveness"],
    individualist: ["authenticity", "self-awareness", "uniqueness"],
    strategist: ["systems", "principles", "integration"],
    alchemist: ["transformation", "paradox", "integral"],

    // Spiral Dynamics
    beige: ["survival", "instinct", "basic needs"],
    purple: ["tribal", "magical", "ritual"],
    red: ["power", "dominance", "impulsive"],
    blue: ["order", "rules", "hierarchy"],
    orange: ["achievement", "competition", "progress"],
    green: ["community", "equality", "consensus"],
    yellow: ["systems", "flexibility", "integral"],
    turquoise: ["holistic", "global", "spiritual"],

    // Lines
    cognitive: ["thinking", "reasoning", "logic"],
    emotional: ["feelings", "empathy", "regulation"],
    moral: ["ethics", "values", "justice"],
    spiritual: ["meaning", "transcendence", "sacred"],
    interpersonal: ["relationships", "social", "communication"],
    kinesthetic: ["body", "movement", "physical"],
    aesthetic: ["beauty", "creativity", "art"],

    // States
    waking: ["consciousness", "awareness", "alert"],
    dreaming: ["subconscious", "symbols", "imagery"],
    "deep-sleep": ["formless", "rest", "unconscious"],
    meditative: ["contemplation", "mindfulness", "presence"],
    peak: ["transcendent", "mystical", "unity"],
    flow: ["optimal", "performance", "absorption"],
  }

  return keywordMap[component.id] || []
}

function getQuadrantRelevance(component: any): Record<string, number> {
  const relevanceMap = {
    ego: {
      individual_interior: 90,
      individual_exterior: 70,
      collective_interior: 60,
      collective_exterior: 40,
    },
    spiral: {
      individual_interior: 80,
      individual_exterior: 60,
      collective_interior: 85,
      collective_exterior: 75,
    },
    lines: {
      individual_interior: 85,
      individual_exterior: 80,
      collective_interior: 75,
      collective_exterior: 70,
    },
    states: {
      individual_interior: 95,
      individual_exterior: 60,
      collective_interior: 50,
      collective_exterior: 30,
    },
  }

  return (
    relevanceMap[component.category] || {
      individual_interior: 50,
      individual_exterior: 50,
      collective_interior: 50,
      collective_exterior: 50,
    }
  )
}
