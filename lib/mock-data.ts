export const mockExpansionPacks = [
  {
    id: 'shadow-work',
    progress: 35,
    modules: [
      {
        title: 'Shadow Identification',
        description: 'Learn to recognize your shadow aspects through guided exercises',
        completed: true,
        content: {
          exercises: [
            'Daily shadow journaling',
            'Projection identification practice',
            'Trigger analysis worksheet'
          ],
          practices: [
            '3-2-1 Shadow Process',
            'Dream work integration',
            'Body awareness meditation'
          ]
        }
      },
      {
        title: 'Projection Reclaiming',
        description: 'Understand and reclaim your projections onto others',
        completed: true,
        content: {
          exercises: [
            'Projection mapping exercise',
            'Dialogue with projections',
            'Integration ritual practice'
          ],
          practices: [
            'Active imagination',
            'Gestalt empty chair technique',
            'Mindful communication'
          ]
        }
      },
      {
        title: 'Dream Work Integration',
        description: 'Use dreams as a gateway to shadow material',
        completed: false,
        content: {
          exercises: [
            'Dream journal setup',
            'Symbol interpretation guide',
            'Lucid dreaming techniques'
          ],
          practices: [
            'Dream incubation',
            'Active imagination with dream figures',
            'Dream re-entry meditation'
          ]
        }
      },
      {
        title: 'Somatic Shadow Release',
        description: 'Release shadow material held in the body',
        completed: false,
        content: {
          exercises: [
            'Body scanning for tension',
            'Emotional release techniques',
            'Breathwork practices'
          ],
          practices: [
            'Somatic experiencing',
            'Tension and trauma release',
            'Embodied presence meditation'
          ]
        }
      }
    ]
  },
  {
    id: 'contemplative-tools',
    progress: 60,
    modules: [
      {
        title: 'Mindfulness Foundation',
        description: 'Establish a solid mindfulness practice',
        completed: true,
        content: {
          exercises: [
            'Breath awareness meditation',
            'Body scan practice',
            'Walking meditation'
          ],
          practices: [
            'Daily sitting practice',
            'Mindful daily activities',
            'Loving-kindness meditation'
          ]
        }
      },
      {
        title: 'Self-Inquiry Practices',
        description: 'Develop skills in contemplative inquiry',
        completed: true,
        content: {
          exercises: [
            'Who am I? inquiry',
            'Witness consciousness practice',
            'Non-dual awareness exercises'
          ],
          practices: [
            'Contemplative reading',
            'Inquiry meditation',
            'Presence practices'
          ]
        }
      },
      {
        title: 'Advanced Contemplation',
        description: 'Deepen your contemplative understanding',
        completed: false,
        content: {
          exercises: [
            'Koan practice',
            'Paradox contemplation',
            'Emptiness meditation'
          ],
          practices: [
            'Silent retreats',
            'Advanced inquiry methods',
            'Mystical reading'
          ]
        }
      }
    ]
  }
]

export const mockUserProfiles = [
  {
    id: '1',
    name: 'Advanced Practitioner',
    spiralTier: 'yellow',
    egoStage: 'strategist',
    developmentalLines: {
      cognitive: 8,
      emotional: 7,
      moral: 8,
      spiritual: 9,
      interpersonal: 7,
      kinesthetic: 6,
      aesthetic: 7
    },
    quadrants: {
      individual_interior: {
        components: [
          { id: 'strategist', name: 'Strategist', category: 'ego' },
          { id: 'spiritual', name: 'Spiritual', category: 'lines' },
          { id: 'meditative', name: 'Meditative', category: 'states' }
        ]
      },
      individual_exterior: {
        components: [
          { id: 'kinesthetic', name: 'Kinesthetic', category: 'lines' },
          { id: 'flow', name: 'Flow State', category: 'states' }
        ]
      },
      collective_interior: {
        components: [
          { id: 'yellow', name: 'Yellow - Integral', category: 'spiral' },
          { id: 'interpersonal', name: 'Interpersonal', category: 'lines' }
        ]
      },
      collective_exterior: {
        components: [
          { id: 'cognitive', name: 'Cognitive', category: 'lines' }
        ]
      }
    }
  },
  {
    id: '2',
    name: 'Developing User',
    spiralTier: 'green',
    egoStage: 'achiever',
    developmentalLines: {
      cognitive: 6,
      emotional: 5,
      moral: 6,
      spiritual: 4,
      interpersonal: 7,
      kinesthetic: 5,
      aesthetic: 5
    },
    quadrants: {
      individual_interior: {
        components: [
          { id: 'achiever', name: 'Achiever', category: 'ego' },
          { id: 'emotional', name: 'Emotional', category: 'lines' }
        ]
      },
      individual_exterior: {
        components: [
          { id: 'kinesthetic', name: 'Kinesthetic', category: 'lines' }
        ]
      },
      collective_interior: {
        components: [
          { id: 'green', name: 'Green - Community', category: 'spiral' },
          { id: 'interpersonal', name: 'Interpersonal', category: 'lines' }
        ]
      },
      collective_exterior: {
        components: []
      }
    }
  }
]

export const mockAnalytics = {
  userEngagement: {
    dailyActiveUsers: 1247,
    weeklyActiveUsers: 5832,
    monthlyActiveUsers: 18456,
    averageSessionDuration: '24m 32s',
    bounceRate: 0.23,
    retentionRate: 0.78
  },
  featureUsage: {
    componentBuilder: 0.89,
    assessment: 0.67,
    visualMap: 0.54,
    aiInsights: 0.72,
    progressTracking: 0.61,
    expansionPacks: 0.43
  },
  performanceMetrics: {
    averageLoadTime: 1.2,
    coreWebVitals: {
      lcp: 1.8,
      fid: 45,
      cls: 0.08
    },
    errorRate: 0.002,
    uptime: 0.9998
  },
  userSatisfaction: {
    nps: 72,
    csat: 4.6,
    completionRate: 0.84,
    supportTickets: 23
  }
}

export const mockAssessmentQuestions = [
  {
    id: 'ego-1',
    category: 'ego',
    question: 'How do you typically approach conflict in relationships?',
    options: [
      { value: 'opportunist', text: 'I try to win at all costs and protect myself' },
      { value: 'diplomat', text: 'I avoid conflict and try to keep everyone happy' },
      { value: 'expert', text: 'I focus on being right and proving my expertise' },
      { value: 'achiever', text: 'I look for win-win solutions that achieve goals' },
      { value: 'individualist', text: 'I express my authentic feelings and seek understanding' },
      { value: 'strategist', text: 'I consider multiple perspectives and long-term implications' },
      { value: 'alchemist', text: 'I hold paradox and help transform the situation' }
    ]
  },
  {
    id: 'spiral-1',
    category: 'spiral',
    question: 'What motivates you most in your work and life?',
    options: [
      { value: 'beige', text: 'Basic survival and meeting immediate needs' },
      { value: 'purple', text: 'Belonging to my tribe and honoring traditions' },
      { value: 'red', text: 'Power, respect, and being in control' },
      { value: 'blue', text: 'Order, rules, and doing what\'s right' },
      { value: 'orange', text: 'Achievement, success, and progress' },
      { value: 'green', text: 'Harmony, equality, and community well-being' },
      { value: 'yellow', text: 'Understanding systems and flexible solutions' },
      { value: 'turquoise', text: 'Global consciousness and holistic integration' }
    ]
  },
  {
    id: 'lines-1',
    category: 'lines',
    question: 'Which area do you feel most developed in?',
    options: [
      { value: 'cognitive', text: 'Thinking, reasoning, and problem-solving' },
      { value: 'emotional', text: 'Understanding and managing emotions' },
      { value: 'moral', text: 'Ethics, values, and moral reasoning' },
      { value: 'spiritual', text: 'Meaning, purpose, and transcendence' },
      { value: 'interpersonal', text: 'Relationships and social skills' },
      { value: 'kinesthetic', text: 'Body awareness and physical skills' },
      { value: 'aesthetic', text: 'Appreciation of beauty and creativity' }
    ]
  }
]
