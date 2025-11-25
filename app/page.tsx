"use client"

import { Navigation } from "@/components/layout/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Zap, Map, Heart, Users, Leaf } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-secondary/20 border border-secondary/50">
            <p className="text-sm font-medium text-secondary">Transform Waste Into Wealth</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
            Turn Your Waste Into <span className="text-primary">Energy</span>
          </h1>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            WasteWise helps Indian households reduce waste, save money, and create a sustainable future. Calculate your
            biogas potential, get AI-powered nudges, and connect with your community.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage waste efficiently and sustainably
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Waste Calculator",
              description: "Calculate biogas production, energy savings, and environmental impact instantly",
            },
            {
              icon: Map,
              title: "Smart Maps",
              description: "Find community digesters, compost pits, and waste pickup routes near you",
            },
            {
              icon: Heart,
              title: "AI Coach",
              description: "Get personalized waste reduction tips from our intelligent coaching system",
            },
            {
              icon: Users,
              title: "Food Donation",
              description: "Connect event food surplus with verified NGOs instantly",
            },
            {
              icon: Leaf,
              title: "Habit Nudges",
              description: "Receive contextual reminders to build sustainable waste habits",
            },
            {
              icon: Users,
              title: "Community Hub",
              description: "Join other households making a difference in waste management",
            },
          ].map((feature, i) => (
            <Card key={i} className="p-6 border border-border hover:border-primary/50 transition-colors group">
              <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20 bg-primary/5 -mx-4 px-4 rounded-xl my-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Tonnes of Waste Daily", value: "62M" },
            { label: "Users Worldwide", value: "10K+" },
            { label: "Waste Diverted", value: "500T" },
            { label: "NGOs Connected", value: "25+" },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of households converting waste into wealth, one day at a time.
          </p>
          <Link href="/calculator">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/calculator" className="hover:text-primary">
                    Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/maps" className="hover:text-primary">
                    Maps
                  </Link>
                </li>
                <li>
                  <Link href="/coach" className="hover:text-primary">
                    AI Coach
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Forums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Events
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Impact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 WasteWise. Transforming waste into wealth for a sustainable future.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
