"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  BookOpen,
  Users,
  Briefcase,
  Heart,
  Brain,
  Sparkles,
  Clock,
  Star,
  Play,
  Download,
  CheckCircle,
} from "lucide-react"
import { storageService } from "@/lib/storage"
import { authService } from "@/lib/auth"

interface ExpansionPacksProps {
  userProfile: any
}

export default function ExpansionPacks({ userProfile }: ExpansionPacksProps) {
  const [activeTab, setActiveTab] = useState("available")
  const [installedPacks, setInstalledPacks] = useState<string[]>([])

  const expansionPacks = [
    {
      id: "leadership",
      title: "Leadership Development",
      description: "Advanced leadership skills through integral theory",
      category: "Professional",
      icon: Users,
      difficulty: "Intermediate",
      duration: "6-8 weeks",
      modules: 12,
      rating: 4.8,
      price: "Free",
      features: [
        "Integral Leadership Assessment",
        "Team Development Tools",
        "Conflict Resolution Framework",
        "Vision & Strategy Planning",
      ],
      preview: "Learn to lead with awareness across all four quadrants of experience",
    },
    {
      id: "relationships",
      title: "Conscious Relationships",
      description: "Deepen intimacy and connection through integral awareness",
      category: "Personal",
      icon: Heart,
      difficulty: "Beginner",
      duration: "4-6 weeks",
      modules: 8,
      rating: 4.9,
      price: "Free",
      features: ["Relationship Mapping", "Communication Patterns", "Conflict Transformation", "Intimacy Development"],
      preview: "Transform your relationships through integral understanding",
    },
    {
      id: "business",
      title: "Integral Business",
      description: "Apply integral principles to business and entrepreneurship",
      category: "Professional",
      icon: Briefcase,
      difficulty: "Advanced",
      duration: "8-10 weeks",
      modules: 16,
      rating: 4.7,
      price: "Free",
      features: ["Business Model Canvas", "Stakeholder Analysis", "Cultural Assessment", "Systems Thinking Tools"],
      preview: "Build businesses that serve all stakeholders and levels of development",
    },
    {
      id: "creativity",
      title: "Creative Expression",
      description: "Unlock creativity through integral development",
      category: "Personal",
      icon: Sparkles,
      difficulty: "Beginner",
      duration: "3-4 weeks",
      modules: 6,
      rating: 4.6,
      price: "Free",
      features: ["Creative Process Mapping", "Inspiration Techniques", "Block Dissolution", "Expression Channels"],
      preview: "Express your authentic self through various creative mediums",
    },
    {
      id: "learning",
      title: "Accelerated Learning",
      description: "Learn faster and more effectively using integral methods",
      category: "Educational",
      icon: Brain,
      difficulty: "Intermediate",
      duration: "5-6 weeks",
      modules: 10,
      rating: 4.8,
      price: "Free",
      features: ["Learning Style Assessment", "Memory Techniques", "Comprehension Strategies", "Knowledge Integration"],
      preview: "Master any subject using integral learning principles",
    },
    {
      id: "wellness",
      title: "Integral Wellness",
      description: "Holistic health across body, mind, and spirit",
      category: "Health",
      icon: Heart,
      difficulty: "Beginner",
      duration: "6-8 weeks",
      modules: 14,
      rating: 4.9,
      price: "Free",
      features: ["Wellness Assessment", "Nutrition Planning", "Exercise Integration", "Stress Management"],
      preview: "Achieve optimal health through integral wellness practices",
    },
  ]

  const handleInstallPack = (packId: string) => {
    const user = authService.getCurrentUser()
    if (user) {
      const newInstalledPacks = [...installedPacks, packId]
      setInstalledPacks(newInstalledPacks)

      // Save to storage
      storageService.saveUserData(user.id, {
        installedPacks: newInstalledPacks,
      })
    }
  }

  const PackCard = ({ pack, isInstalled = false }: { pack: any; isInstalled?: boolean }) => (
    <Card className="elevation-1 hover:elevation-2 transition-smooth animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <pack.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{pack.title}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {pack.category}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-3 h-3 fill-current text-yellow-500" />
              {pack.rating}
            </div>
            <Badge variant="secondary" className="mt-1">
              {pack.price}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{pack.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {pack.duration}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {pack.modules} modules
          </div>
          <Badge variant="outline" className="text-xs">
            {pack.difficulty}
          </Badge>
        </div>

        <div className="space-y-2">
          <h5 className="font-medium text-sm">What you'll learn:</h5>
          <ul className="space-y-1">
            {pack.features.slice(0, 3).map((feature: string, index: number) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                {feature}
              </li>
            ))}
            {pack.features.length > 3 && (
              <li className="text-sm text-muted-foreground">+{pack.features.length - 3} more features</li>
            )}
          </ul>
        </div>

        <div className="pt-2 border-t">
          {isInstalled ? (
            <div className="flex gap-2">
              <Button className="flex-1 animate-ripple" size="sm">
                <Play className="w-3 h-3 mr-2" />
                Continue
              </Button>
              <Button variant="outline" size="sm" className="animate-ripple bg-transparent">
                <BookOpen className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                className="flex-1 animate-ripple elevation-1"
                size="sm"
                onClick={() => handleInstallPack(pack.id)}
              >
                <Download className="w-3 h-3 mr-2" />
                Install Pack
              </Button>
              <Button variant="outline" size="sm" className="animate-ripple bg-transparent">
                Preview
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const CategoryFilter = ({ categories }: { categories: string[] }) => (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button variant="outline" size="sm" className="animate-ripple bg-transparent">
        All Categories
      </Button>
      {categories.map((category) => (
        <Button key={category} variant="ghost" size="sm" className="animate-ripple">
          {category}
        </Button>
      ))}
    </div>
  )

  const categories = [...new Set(expansionPacks.map((pack) => pack.category))]

  return (
    <div className="space-y-6">
      <Card className="elevation-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Expansion Packs
          </CardTitle>
          <p className="text-muted-foreground">Specialized learning modules to deepen your integral development</p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-card elevation-1">
          <TabsTrigger value="available" className="animate-ripple">
            <BookOpen className="w-4 h-4 mr-2" />
            Available
          </TabsTrigger>
          <TabsTrigger value="installed" className="animate-ripple">
            <Download className="w-4 h-4 mr-2" />
            Installed ({installedPacks.length})
          </TabsTrigger>
          <TabsTrigger value="featured" className="animate-ripple">
            <Star className="w-4 h-4 mr-2" />
            Featured
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <CategoryFilter categories={categories} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expansionPacks
              .filter((pack) => !installedPacks.includes(pack.id))
              .map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="space-y-6">
          {installedPacks.length === 0 ? (
            <Card className="elevation-1">
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Download className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">No Packs Installed</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Install expansion packs to access specialized learning modules
                    </p>
                    <Button onClick={() => setActiveTab("available")} className="animate-ripple">
                      Browse Available Packs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {expansionPacks
                .filter((pack) => installedPacks.includes(pack.id))
                .map((pack) => (
                  <PackCard key={pack.id} pack={pack} isInstalled={true} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expansionPacks
              .filter((pack) => pack.rating >= 4.8)
              .map((pack) => (
                <PackCard key={pack.id} pack={pack} isInstalled={installedPacks.includes(pack.id)} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
