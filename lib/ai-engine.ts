interface InsightData {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  confidence: number
  recommendations: string[]
  category: "integration" | "shadow" | "alignment" | "growth" | "cosmological"
  quadrantRelevance: Record<string, number>
}

interface DevelopmentPlan {
  shortTerm: string[]
  mediumTerm: string[]
  longTerm: string[]
  focusAreas: string[]
  estimatedTimeframe: string
}

class AIEngine {
  private static instance: AIEngine
  private knowledgeBase: Map<string, any> = new Map()

  static getInstance(): AIEngine {
    if (!AIEngine.instance) {
      AIEngine.instance = new AIEngine()
    }
    return AIEngine.instance
  }

  private constructor() {
    this.initializeKnowledgeBase()
  }

  private initializeKnowledgeBase() {
    // Integral theory knowledge base
    this.knowledgeBase.set("egoStages", {
      opportunist: { level: 1, description: "Self-protective, opportunistic", challenges: ["Trust", "Vulnerability"] },
      diplomat: { level: 2, description: "Conformist, seeks approval", challenges: ["Independence", "Authenticity"] },
      expert: {
        level: 3,
        description: "Perfectionist, technical competence",
        challenges: ["Flexibility", "Collaboration"],
      },
      achiever: {
        level: 4,
        description: "Goal-oriented, effectiveness",
        challenges: ["Work-life balance", "Relationships"],
      },
      individualist: { level: 5, description: "Self-aware, authentic", challenges: ["Commitment", "Structure"] },
      strategist: {
        level: 6,
        description: "Systems thinking, principled",
        challenges: ["Patience", "Micro-management"],
      },
      alchemist: {
        level: 7,
        description: "Transformational, integral",
        challenges: ["Grounding", "Practical application"],
      },
    })

    this.knowledgeBase.set("spiralDynamics", {
      beige: { tier: 1, focus: "Survival", values: ["Safety", "Basic needs"] },
      purple: { tier: 1, focus: "Tribal", values: ["Belonging", "Tradition"] },
      red: { tier: 1, focus: "Power", values: ["Dominance", "Respect"] },
      blue: { tier: 1, focus: "Order", values: ["Rules", "Hierarchy"] },
      orange: { tier: 1, focus: "Achievement", values: ["Success", "Progress"] },
      green: { tier: 1, focus: "Community", values: ["Equality", "Harmony"] },
      yellow: { tier: 2, focus: "Integral", values: ["Flexibility", "Systems"] },
      turquoise: { tier: 2, focus: "Holistic", values: ["Global", "Spiritual"] },
    })

    this.knowledgeBase.set("developmentLines", {
      cognitive: {
        description: "Thinking and reasoning abilities",
        practices: ["Reading", "Problem-solving", "Analysis"],
      },
      emotional: {
        description: "Emotional intelligence and regulation",
        practices: ["Mindfulness", "Therapy", "Journaling"],
      },
      moral: { description: "Ethical reasoning and values", practices: ["Ethics study", "Service", "Reflection"] },
      spiritual: {
        description: "Meaning-making and transcendence",
        practices: ["Meditation", "Prayer", "Contemplation"],
      },
      interpersonal: {
        description: "Relationship and social skills",
        practices: ["Communication", "Empathy", "Listening"],
      },
      kinesthetic: { description: "Body awareness and physical skills", practices: ["Exercise", "Dance", "Yoga"] },
      aesthetic: { description: "Appreciation of beauty and creativity", practices: ["Art", "Music", "Nature"] },
    })

    // Cosmological perspectives knowledge base
    this.knowledgeBase.set("cosmologicalPerspectives", {
      multiverseModels: {
        "finite-finite": {
          name: "Finite Amount of Finite Universes",
          description: "Limited number of bounded universes",
          implications: ["Knowable reality", "Bounded possibilities", "Potential uniqueness"],
          practices: ["Contemplation of limits", "Appreciation of uniqueness", "Finite perspective meditation"],
        },
        "infinite-finite": {
          name: "Infinite Amount of Finite Universes",
          description: "Unlimited number of bounded universes",
          implications: ["Statistical inevitability", "Infinite copies", "Unbounded reality"],
          practices: ["Scale contemplation", "Identity exploration", "Probability meditation"],
        },
        "finite-infinite": {
          name: "Finite Amount of Infinite Universes",
          description: "Limited number of unbounded universes",
          implications: ["Grandeur within constraints", "Strong fine-tuning solution", "Enumerable infinities"],
          practices: ["Paradox contemplation", "Infinite-finite meditation", "Landscape visualization"],
        },
        "infinite-infinite": {
          name: "Infinite Amount of Infinite Universes",
          description: "Unlimited number of unbounded universes",
          implications: ["Ultimate fine-tuning solution", "Complete loss of uniqueness", "Everything possible"],
          practices: ["Ego dissolution", "Ultimate perspective taking", "Infinite consciousness meditation"],
        },
      },
      consciousnessImplications: {
        observerEffect: "Consciousness as fundamental to reality structure",
        anthropicPrinciple: "Universe fine-tuned for conscious observers",
        boltzmannBrains: "Random conscious observers in infinite space",
        informationTheory: "Reality as information processing",
      },
    })
  }

  async generateInsights(userProfile: any): Promise<any> {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const insights = this.generatePersonalizedInsights(userProfile)
    const developmentPlan = this.generateDevelopmentPlan(userProfile)

    // Calculate overall development score
    const lineValues = Object.values(userProfile.developmentalLines) as number[]
    const avgLine = lineValues.reduce((sum, val) => sum + val, 0) / lineValues.length
    const overallScore = Math.round(avgLine * 10)

    // Count active goals and growth areas
    const highPriorityInsights = insights.filter((i) => i.severity === "high" || i.severity === "critical")
    const activeGoals = developmentPlan.shortTerm.length + developmentPlan.mediumTerm.length
    const growthAreas = highPriorityInsights.length

    // Generate summary
    const summary = this.generateDevelopmentSummary(userProfile, insights)

    // Generate development paths
    const developmentPaths = this.generateDevelopmentPaths(userProfile, insights)

    // Generate resources
    const resources = this.generateRecommendedResources(userProfile, insights)

    return {
      overallScore,
      activeGoals,
      growthAreas,
      summary,
      recommendations: insights,
      developmentPaths,
      resources,
      generatedAt: new Date().toISOString(),
    }
  }

  generatePersonalizedInsights(userProfile: any): InsightData[] {
    const insights: InsightData[] = []

    // Analyze quadrant balance
    const quadrantAnalysis = this.analyzeQuadrantBalance(userProfile)
    if (quadrantAnalysis) {
      insights.push(quadrantAnalysis)
    }

    // Analyze developmental lines
    const lineAnalysis = this.analyzeDevelopmentalLines(userProfile)
    insights.push(...lineAnalysis)

    // Analyze spiral dynamics progression
    const spiralAnalysis = this.analyzeSpiralProgression(userProfile)
    if (spiralAnalysis) {
      insights.push(spiralAnalysis)
    }

    // Analyze ego development
    const egoAnalysis = this.analyzeEgoStage(userProfile)
    if (egoAnalysis) {
      insights.push(egoAnalysis)
    }

    // Analyze cosmological readiness
    const cosmologicalAnalysis = this.analyzeCosmologicalReadiness(userProfile)
    if (cosmologicalAnalysis) {
      insights.push(cosmologicalAnalysis)
    }

    return insights.sort((a, b) => b.confidence - a.confidence)
  }

  private analyzeCosmologicalReadiness(userProfile: any): InsightData | null {
    const cognitiveLevel = userProfile.developmentalLines.cognitive
    const spiritualLevel = userProfile.developmentalLines.spiritual
    const spiralTier = userProfile.spiralTier

    // Check if user is ready for cosmological perspectives
    if (cognitiveLevel >= 7 && spiritualLevel >= 6 && ["yellow", "turquoise"].includes(spiralTier)) {
      return {
        id: "cosmological-readiness",
        title: "Ready for Cosmological Perspectives",
        description:
          "Your cognitive and spiritual development suggests readiness to explore multiverse theories and their implications for consciousness and identity.",
        severity: "low",
        confidence: 0.8,
        category: "cosmological",
        recommendations: [
          "Explore the Cosmological Perspectives expansion pack",
          "Study multiverse theories and their philosophical implications",
          "Practice perspective-taking across cosmic scales",
          "Integrate cosmological insights with personal development",
        ],
        quadrantRelevance: {
          individual_interior: 90,
          individual_exterior: 40,
          collective_interior: 70,
          collective_exterior: 80,
        },
      }
    } else if (cognitiveLevel >= 6 && spiritualLevel >= 5) {
      return {
        id: "cosmological-preparation",
        title: "Preparing for Cosmological Perspectives",
        description:
          "Continue developing your cognitive and spiritual lines to fully engage with advanced cosmological concepts.",
        severity: "medium",
        confidence: 0.7,
        category: "growth",
        recommendations: [
          "Strengthen cognitive development through complex problem-solving",
          "Deepen spiritual practice and contemplation",
          "Study philosophy of science and consciousness",
          "Practice holding paradox and uncertainty",
        ],
        quadrantRelevance: {
          individual_interior: 85,
          individual_exterior: 30,
          collective_interior: 60,
          collective_exterior: 70,
        },
      }
    }

    return null
  }

  private analyzeQuadrantBalance(userProfile: any): InsightData | null {
    const quadrantStrengths = Object.entries(userProfile.quadrants).map(([id, quadrant]: [string, any]) => ({
      id,
      strength: quadrant.components.length,
    }))

    const maxStrength = Math.max(...quadrantStrengths.map((q) => q.strength))
    const minStrength = Math.min(...quadrantStrengths.map((q) => q.strength))
    const imbalance = maxStrength - minStrength

    if (imbalance > 2) {
      const weakestQuadrant = quadrantStrengths.find((q) => q.strength === minStrength)
      const strongestQuadrant = quadrantStrengths.find((q) => q.strength === maxStrength)

      return {
        id: "quadrant-imbalance",
        title: "Quadrant Development Imbalance",
        description: `Your ${strongestQuadrant?.id.replace("_", " ")} quadrant is significantly more developed than your ${weakestQuadrant?.id.replace("_", " ")} quadrant.`,
        severity: imbalance > 4 ? "high" : "medium",
        confidence: 0.85,
        category: "integration",
        recommendations: [
          `Focus on developing your ${weakestQuadrant?.id.replace("_", " ")} quadrant`,
          "Practice exercises that integrate multiple quadrants",
          "Seek feedback from others about blind spots",
          "Consider working with a coach or mentor",
        ],
        quadrantRelevance: {
          [weakestQuadrant?.id || ""]: 90,
          [strongestQuadrant?.id || ""]: 70,
        },
      }
    }

    return null
  }

  private analyzeDevelopmentalLines(userProfile: any): InsightData[] {
    const insights: InsightData[] = []
    const lineValues = Object.entries(userProfile.developmentalLines) as [string, number][]
    const avgLine = lineValues.reduce((sum, [, val]) => sum + val, 0) / lineValues.length

    lineValues.forEach(([line, value]) => {
      if (value < avgLine - 2) {
        const lineInfo = this.knowledgeBase.get("developmentLines")[line]

        insights.push({
          id: `line-${line}`,
          title: `Underdeveloped ${line.charAt(0).toUpperCase() + line.slice(1)} Line`,
          description: `Your ${line} development (${value}/10) is significantly below your average (${avgLine.toFixed(1)}). This may create blind spots in ${lineInfo?.description.toLowerCase()}.`,
          severity: value < avgLine - 3 ? "high" : "medium",
          confidence: 0.8,
          category: "shadow",
          recommendations: [
            `Practice ${lineInfo?.practices.join(", ").toLowerCase()}`,
            `Seek learning opportunities in ${line} development`,
            "Work with a specialist in this area",
            "Join groups focused on this development line",
          ],
          quadrantRelevance: this.getLineQuadrantRelevance(line),
        })
      }
    })

    return insights
  }

  private analyzeSpiralProgression(userProfile: any): InsightData | null {
    const spiralInfo = this.knowledgeBase.get("spiralDynamics")[userProfile.spiralTier]

    if (!spiralInfo) return null

    const recommendations = {
      beige: ["Focus on basic safety and security", "Establish stable routines", "Build support networks"],
      purple: [
        "Explore your cultural roots",
        "Participate in community rituals",
        "Honor traditions while staying open",
      ],
      red: ["Channel power constructively", "Develop self-discipline", "Learn conflict resolution"],
      blue: ["Question rigid rules when appropriate", "Develop flexibility", "Balance order with creativity"],
      orange: [
        "Integrate green values of community",
        "Consider environmental impact",
        "Balance achievement with relationships",
      ],
      green: ["Develop yellow integral thinking", "Transcend either/or perspectives", "Embrace healthy hierarchies"],
      yellow: [
        "Explore turquoise holistic consciousness",
        "Maintain systemic flexibility",
        "Integrate spiritual practices",
      ],
      turquoise: [
        "Ground insights in practical action",
        "Maintain connection to all levels",
        "Serve global consciousness",
      ],
    }

    return {
      id: "spiral-evolution",
      title: `${userProfile.spiralTier.charAt(0).toUpperCase() + userProfile.spiralTier.slice(1)} Spiral Development`,
      description: `You're operating from the ${userProfile.spiralTier} level, focused on ${spiralInfo.focus.toLowerCase()}. Consider evolving to the next level while integrating current strengths.`,
      severity: "low",
      confidence: 0.75,
      category: "growth",
      recommendations: recommendations[userProfile.spiralTier as keyof typeof recommendations] || [
        "Continue your development journey",
      ],
      quadrantRelevance: {
        individual_interior: 80,
        individual_exterior: 60,
        collective_interior: 85,
        collective_exterior: 70,
      },
    }
  }

  private analyzeEgoStage(userProfile: any): InsightData | null {
    const egoInfo = this.knowledgeBase.get("egoStages")[userProfile.egoStage]

    if (!egoInfo) return null

    return {
      id: "ego-development",
      title: `${userProfile.egoStage.charAt(0).toUpperCase() + userProfile.egoStage.slice(1)} Ego Stage Development`,
      description: `At the ${userProfile.egoStage} stage, you excel at ${egoInfo.description.toLowerCase()}. Focus on addressing common challenges at this level.`,
      severity: "low",
      confidence: 0.7,
      category: "growth",
      recommendations: [
        `Work on ${egoInfo.challenges.join(" and ").toLowerCase()}`,
        "Seek feedback from trusted advisors",
        "Practice self-reflection and mindfulness",
        "Consider working with a developmental coach",
      ],
      quadrantRelevance: {
        individual_interior: 95,
        individual_exterior: 70,
        collective_interior: 60,
        collective_exterior: 40,
      },
    }
  }

  private getLineQuadrantRelevance(line: string): Record<string, number> {
    const relevanceMap: Record<string, Record<string, number>> = {
      cognitive: { individual_interior: 90, individual_exterior: 70, collective_interior: 60, collective_exterior: 80 },
      emotional: { individual_interior: 95, individual_exterior: 60, collective_interior: 80, collective_exterior: 50 },
      moral: { individual_interior: 85, individual_exterior: 60, collective_interior: 90, collective_exterior: 75 },
      spiritual: { individual_interior: 95, individual_exterior: 50, collective_interior: 70, collective_exterior: 40 },
      interpersonal: {
        individual_interior: 70,
        individual_exterior: 80,
        collective_interior: 95,
        collective_exterior: 70,
      },
      kinesthetic: {
        individual_interior: 60,
        individual_exterior: 95,
        collective_interior: 50,
        collective_exterior: 60,
      },
      aesthetic: { individual_interior: 85, individual_exterior: 70, collective_interior: 75, collective_exterior: 60 },
    }

    return (
      relevanceMap[line] || {
        individual_interior: 50,
        individual_exterior: 50,
        collective_interior: 50,
        collective_exterior: 50,
      }
    )
  }

  generateDevelopmentPlan(userProfile: any): DevelopmentPlan {
    const insights = this.generatePersonalizedInsights(userProfile)
    const highPriorityInsights = insights.filter((i) => i.severity === "high" || i.severity === "critical")
    const mediumPriorityInsights = insights.filter((i) => i.severity === "medium")

    return {
      shortTerm: [
        ...highPriorityInsights.slice(0, 2).flatMap((i) => i.recommendations.slice(0, 2)),
        "Establish daily mindfulness practice",
        "Begin regular self-reflection journaling",
      ],
      mediumTerm: [
        ...mediumPriorityInsights.slice(0, 2).flatMap((i) => i.recommendations.slice(0, 2)),
        "Join a development-focused community",
        "Seek mentorship or coaching",
        "Explore shadow work practices",
      ],
      longTerm: [
        "Integrate multiple development lines",
        "Develop teaching or mentoring capabilities",
        "Contribute to collective development",
        "Explore advanced contemplative practices",
        "Consider leadership roles in your field",
      ],
      focusAreas: insights.slice(0, 3).map((i) => i.category),
      estimatedTimeframe: "12-18 months for significant progress",
    }
  }

  private generateDevelopmentSummary(userProfile: any, insights: InsightData[]): string {
    const lineValues = Object.values(userProfile.developmentalLines) as number[]
    const avgLine = lineValues.reduce((sum, val) => sum + val, 0) / lineValues.length
    const strongestLine = Object.entries(userProfile.developmentalLines).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
    const highPriorityCount = insights.filter((i) => i.severity === "high" || i.severity === "critical").length

    return `Your integral development shows an average level of ${avgLine.toFixed(1)}/10 across all lines, with particular strength in ${strongestLine} development. You're operating from the ${userProfile.spiralTier} spiral level and ${userProfile.egoStage} ego stage. ${highPriorityCount > 0 ? `There are ${highPriorityCount} high-priority areas for focused development.` : "Your development appears well-balanced with opportunities for continued growth."} Your profile suggests readiness for ${userProfile.developmentalLines.cognitive >= 7 ? "advanced" : "intermediate"} integral practices and ${userProfile.developmentalLines.spiritual >= 7 ? "deep contemplative work" : "foundational spiritual development"}.`
  }

  private generateDevelopmentPaths(userProfile: any, insights: InsightData[]): any[] {
    const paths = []

    // Shadow work path
    if (insights.some((i) => i.category === "shadow")) {
      paths.push({
        title: "Shadow Integration Path",
        description: "Work with unconscious aspects for greater wholeness",
        timeframe: "medium",
        progress: 25,
        nextSteps: [
          "Begin daily shadow journaling",
          "Practice projection identification",
          "Explore dream work techniques",
        ],
      })
    }

    // Cognitive development path
    if (userProfile.developmentalLines.cognitive < 7) {
      paths.push({
        title: "Cognitive Enhancement Path",
        description: "Develop critical thinking and complex reasoning abilities",
        timeframe: "long",
        progress: Math.round(userProfile.developmentalLines.cognitive * 10),
        nextSteps: [
          "Engage with complex philosophical texts",
          "Practice systems thinking exercises",
          "Join intellectual discussion groups",
        ],
      })
    }

    // Spiritual development path
    if (userProfile.developmentalLines.spiritual < 8) {
      paths.push({
        title: "Spiritual Deepening Path",
        description: "Explore meaning, transcendence, and contemplative practices",
        timeframe: "long",
        progress: Math.round(userProfile.developmentalLines.spiritual * 10),
        nextSteps: [
          "Establish regular meditation practice",
          "Study wisdom traditions",
          "Engage in contemplative inquiry",
        ],
      })
    }

    // Cosmological perspectives path (for advanced users)
    if (userProfile.developmentalLines.cognitive >= 7 && userProfile.developmentalLines.spiritual >= 6) {
      paths.push({
        title: "Cosmological Integration Path",
        description: "Explore multiverse theories and their implications for consciousness",
        timeframe: "long",
        progress: 0,
        nextSteps: [
          "Study multiverse models and their implications",
          "Practice perspective-taking across scales",
          "Integrate cosmological insights with personal development",
        ],
      })
    }

    return paths.slice(0, 4) // Limit to 4 paths
  }

  private generateRecommendedResources(userProfile: any, insights: InsightData[]): any[] {
    const resources = []

    // Books and readings
    resources.push({
      title: "Integral Theory Foundations",
      description: "Core texts on AQAL framework and integral development",
      duration: "4-6 weeks",
      difficulty: "Intermediate",
      type: "reading",
    })

    // Practices
    if (insights.some((i) => i.category === "shadow")) {
      resources.push({
        title: "Shadow Work Practices",
        description: "Guided exercises for shadow integration",
        duration: "2-3 weeks",
        difficulty: "Intermediate",
        type: "practice",
      })
    }

    // Advanced resources for high-level users
    if (userProfile.developmentalLines.cognitive >= 7) {
      resources.push({
        title: "Multiverse Theories Study",
        description: "Comprehensive analysis of cosmological models",
        duration: "8-12 weeks",
        difficulty: "Advanced",
        type: "study",
      })
    }

    // Meditation resources
    if (userProfile.developmentalLines.spiritual < 8) {
      resources.push({
        title: "Contemplative Practices Guide",
        description: "Progressive meditation and inquiry techniques",
        duration: "6-8 weeks",
        difficulty: "Beginner",
        type: "practice",
      })
    }

    return resources.slice(0, 6) // Limit to 6 resources
  }

  getRecommendedExpansionPacks(userProfile: any): string[] {
    const insights = this.generatePersonalizedInsights(userProfile)
    const recommendations: string[] = []

    // Based on insights
    insights.forEach((insight) => {
      switch (insight.category) {
        case "shadow":
          if (!recommendations.includes("shadow-work")) {
            recommendations.push("shadow-work")
          }
          break
        case "integration":
          if (!recommendations.includes("somatic-integration")) {
            recommendations.push("somatic-integration")
          }
          break
        case "growth":
          if (userProfile.developmentalLines.spiritual < 7 && !recommendations.includes("contemplative-tools")) {
            recommendations.push("contemplative-tools")
          }
          break
        case "cosmological":
          if (!recommendations.includes("cosmological-perspectives")) {
            recommendations.push("cosmological-perspectives")
          }
          break
      }
    })

    // Based on developmental lines
    if (userProfile.developmentalLines.cognitive > 7 && !recommendations.includes("philosophical-expansion")) {
      recommendations.push("philosophical-expansion")
    }

    if (
      userProfile.developmentalLines.cognitive >= 7 &&
      userProfile.developmentalLines.spiritual >= 6 &&
      !recommendations.includes("cosmological-perspectives")
    ) {
      recommendations.push("cosmological-perspectives")
    }

    if (userProfile.developmentalLines.interpersonal > 7 && !recommendations.includes("collective-intelligence")) {
      recommendations.push("collective-intelligence")
    }

    return recommendations.slice(0, 3) // Limit to top 3 recommendations
  }
}

export const aiEngine = AIEngine.getInstance()

// Export functions for backward compatibility
export function generatePersonalizedInsights(userProfile: any) {
  return aiEngine.generatePersonalizedInsights(userProfile)
}

export function generateDevelopmentPlan(userProfile: any) {
  return aiEngine.generateDevelopmentPlan(userProfile)
}

export function getRecommendedExpansionPacks(userProfile: any) {
  return aiEngine.getRecommendedExpansionPacks(userProfile)
}
