"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

interface DragFeedbackProps {
  draggedComponent?: any
  targetQuadrant?: string
  isValidDrop?: boolean
}

export default function DragFeedback({ draggedComponent, targetQuadrant, isValidDrop }: DragFeedbackProps) {
  if (!draggedComponent) return null

  const getQuadrantName = (quadrantId: string) => {
    const names = {
      individual_interior: "Individual Interior (I)",
      individual_exterior: "Individual Exterior (It)",
      collective_interior: "Collective Interior (We)",
      collective_exterior: "Collective Exterior (Its)",
    }
    return names[quadrantId as keyof typeof names] || quadrantId
  }

  const getRelevanceScore = (component: any, quadrant: string) => {
    // Logic to determine how relevant a component is to a quadrant
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
      relevanceMap[component.category as keyof typeof relevanceMap]?.[quadrant as keyof typeof relevanceMap.ego] || 50
    )
  }

  if (!targetQuadrant) {
    return (
      <Card className="fixed top-4 right-4 p-4 bg-blue-50 border-blue-200 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <div>
            <p className="font-medium text-sm">Dragging: {draggedComponent.name}</p>
            <p className="text-xs text-gray-600">Drop in a quadrant to add</p>
          </div>
        </div>
      </Card>
    )
  }

  const relevance = getRelevanceScore(draggedComponent, targetQuadrant)
  const isHighRelevance = relevance >= 80
  const isMediumRelevance = relevance >= 60

  return (
    <Card className="fixed top-4 right-4 p-4 bg-white border shadow-lg z-50 min-w-[280px]">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {isValidDrop ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <div>
            <p className="font-medium text-sm">{draggedComponent.name}</p>
            <p className="text-xs text-gray-600">→ {getQuadrantName(targetQuadrant)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Relevance:</span>
            <Badge
              variant={isHighRelevance ? "default" : isMediumRelevance ? "secondary" : "outline"}
              className="text-xs"
            >
              {relevance}%
            </Badge>
          </div>

          {isHighRelevance && (
            <p className="text-xs text-green-700 bg-green-50 p-2 rounded">
              Excellent fit! This component aligns well with this quadrant.
            </p>
          )}

          {isMediumRelevance && !isHighRelevance && (
            <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
              Good fit. Consider how this component manifests in this quadrant.
            </p>
          )}

          {!isMediumRelevance && (
            <p className="text-xs text-orange-700 bg-orange-50 p-2 rounded">
              Interesting choice. Explore the connections between this component and quadrant.
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
