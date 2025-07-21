"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Users, Brain, Cog, Plus, X, GripVertical } from "lucide-react"
import { Droppable, Draggable } from "@hello-pangea/dnd"

interface QuadrantBuilderProps {
  userProfile: any
  setUserProfile: (profile: any) => void
  setCompletionProgress: (progress: number) => void
}

const quadrants = [
  {
    id: "individual_interior",
    title: "Individual Interior",
    shortTitle: "I",
    subtitle: "Subjective, Personal",
    description: "Thoughts, feelings, beliefs, values, consciousness",
    icon: Brain,
    color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200",
    examples: ["Self-awareness", "Emotions", "Beliefs", "Values", "Intentions"],
  },
  {
    id: "individual_exterior",
    title: "Individual Exterior",
    shortTitle: "It",
    subtitle: "Objective, Behavioral",
    description: "Behaviors, actions, brain states, physical body",
    icon: User,
    color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800 dark:text-green-200",
    examples: ["Behaviors", "Skills", "Physical health", "Brain activity", "Actions"],
  },
  {
    id: "collective_interior",
    title: "Collective Interior",
    shortTitle: "We",
    subtitle: "Intersubjective, Cultural",
    description: "Shared meanings, culture, relationships, communication",
    icon: Users,
    color:
      "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/50 dark:border-purple-800 dark:text-purple-200",
    examples: ["Culture", "Relationships", "Shared values", "Communication", "Worldviews"],
  },
  {
    id: "collective_exterior",
    title: "Collective Exterior",
    shortTitle: "Its",
    subtitle: "Interobjective, Systems",
    description: "Social systems, institutions, technology, environment",
    icon: Cog,
    color:
      "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-200",
    examples: ["Organizations", "Technology", "Systems", "Environment", "Infrastructure"],
  },
]

export default function QuadrantBuilder({ userProfile, setUserProfile, setCompletionProgress }: QuadrantBuilderProps) {
  const removeComponentFromQuadrant = (quadrantId: string, componentIndex: number) => {
    const newProfile = { ...userProfile }
    newProfile.quadrants[quadrantId].components.splice(componentIndex, 1)
    setUserProfile(newProfile)

    // Update completion progress
    const totalComponents = Object.values(newProfile.quadrants).reduce(
      (sum: number, q: any) => sum + q.components.length,
      0,
    )
    setCompletionProgress(Math.min(15 + totalComponents * 5, 85))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      {quadrants.map((quadrant) => (
        <Card
          key={quadrant.id}
          className={`${quadrant.color} min-h-[250px] sm:min-h-[300px] border transition-colors duration-200`}
        >
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
              <quadrant.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline truncate">{quadrant.title}</span>
                  <span className="sm:hidden font-bold">({quadrant.shortTitle})</span>
                  <Badge variant="outline" className="text-xs hidden lg:inline-flex bg-background/50">
                    {quadrant.shortTitle}
                  </Badge>
                </div>
              </div>
            </CardTitle>
            <div className="space-y-1 sm:space-y-2">
              <Badge variant="outline" className="text-xs bg-background/50">
                {quadrant.subtitle}
              </Badge>
              <p className="text-xs sm:text-sm opacity-80 line-clamp-2">{quadrant.description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            {/* Drop Zone */}
            <Droppable droppableId={quadrant.id} type="COMPONENT">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[100px] sm:min-h-[120px] border-2 border-dashed rounded-lg p-2 sm:p-4 transition-all ${
                    snapshot.isDraggingOver
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-muted-foreground/30 bg-background/50"
                  }`}
                >
                  {userProfile.quadrants[quadrant.id].components.length === 0 && !snapshot.isDraggingOver ? (
                    <div className="text-center text-muted-foreground py-4 sm:py-8">
                      <Plus className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">Drop components here</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userProfile.quadrants[quadrant.id].components.map((component: any, index: number) => (
                        <Draggable
                          key={`${quadrant.id}-${component.id}-${index}`}
                          draggableId={`${quadrant.id}-${component.id}-${index}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center justify-between p-2 sm:p-3 bg-card rounded border transition-all ${
                                snapshot.isDragging ? "shadow-lg rotate-1 scale-105 border-primary" : "hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div {...provided.dragHandleProps} className="touch-manipulation">
                                  <GripVertical className="w-3 h-3 text-muted-foreground cursor-move" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-xs sm:text-sm font-medium truncate block">
                                    {component.name}
                                  </span>
                                  <Badge variant="secondary" className="text-xs mt-1 hidden sm:inline-flex">
                                    {component.category}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeComponentFromQuadrant(quadrant.id, index)}
                                className="hover:bg-destructive/10 hover:text-destructive h-6 w-6 p-0 touch-manipulation"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}

                  {snapshot.isDraggingOver && (
                    <div className="text-center text-primary py-2 sm:py-4">
                      <Plus className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1" />
                      <p className="text-xs sm:text-sm font-medium">Drop here to add component</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>

            {/* Examples */}
            <div className="hidden sm:block">
              <p className="text-xs font-medium opacity-80 mb-2">Examples:</p>
              <div className="flex flex-wrap gap-1">
                {quadrant.examples.slice(0, 3).map((example) => (
                  <Badge key={example} variant="secondary" className="text-xs bg-background/50">
                    {example}
                  </Badge>
                ))}
                {quadrant.examples.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-background/50">
                    +{quadrant.examples.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
