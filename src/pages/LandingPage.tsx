
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Clock, 
  Target, 
  CheckCircle, 
  Zap, 
  Users, 
  ArrowRight,
  Star,
  Calendar,
  BarChart3,
  Trophy,
  Sparkles,
  Shield,
  Smartphone,
  Globe,
  TrendingUp,
  Award,
  Play,
  ChevronDown,
  Lightbulb,
  Heart,
  Code,
  Coffee
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Smart Task Management",
      description: "Organize your tasks with intelligent priority systems and project tracking that adapts to your workflow."
    },
    {
      icon: Clock,
      title: "Pomodoro Timer",
      description: "Built-in focus sessions with customizable work and break intervals to maximize your productivity."
    },
    {
      icon: Calendar,
      title: "Calendar Integration",
      description: "Seamlessly sync with your calendar for unified time management across all your devices."
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Track your productivity with detailed insights, streak counters, and performance metrics."
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Stay motivated with points, streaks, and productivity milestones that celebrate your progress."
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Capture thoughts instantly with 2-minute quick tasks and smart shortcuts for rapid productivity."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechCorp",
      content: "Flocus transformed how I manage my daily tasks. The Pomodoro integration is absolutely game-changing!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Engineer",
      content: "Finally, a productivity app that doesn't get in my way. Clean, intuitive, and incredibly powerful.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Emily Watson",
      role: "UX Designer",
      content: "The achievement system keeps me motivated every day. I've increased my productivity by 40%!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "David Kim",
      role: "Startup Founder",
      content: "Flocus helped me scale my productivity as my company grew. It's essential for ambitious entrepreneurs.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Lisa Thompson",
      role: "Marketing Director",
      content: "The calendar integration is seamless. I finally have one place for all my productivity needs.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "2M+", label: "Tasks Completed", icon: CheckCircle },
    { number: "98%", label: "User Satisfaction", icon: Heart },
    { number: "40%", label: "Productivity Increase", icon: TrendingUp }
  ];

  const benefits = [
    {
      icon: Lightbulb,
      title: "Focus Like Never Before",
      description: "Experience deep work sessions with our scientifically-backed Pomodoro technique integration.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is encrypted and secure. We never sell your information or compromise your privacy.",
      gradient: "from-green-400 to-blue-500"
    },
    {
      icon: Smartphone,
      title: "Works Everywhere",
      description: "Access your tasks on any device. Seamless sync across web, mobile, and desktop applications.",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join thousands of productive individuals from around the world achieving their goals.",
      gradient: "from-blue-400 to-cyan-500"
    }
  ];

  const pricing = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["Up to 50 tasks", "Basic Pomodoro timer", "Progress tracking", "Mobile app access"],
      popular: false
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      features: ["Unlimited tasks", "Advanced analytics", "Calendar integration", "Priority support", "Custom themes"],
      popular: true
    },
    {
      name: "Team",
      price: "$19",
      period: "per user/month",
      features: ["Everything in Pro", "Team collaboration", "Admin dashboard", "Advanced reporting", "24/7 support"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-primary/15 to-purple-500/15 blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 right-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-conic from-primary/5 via-transparent to-primary/5 blur-3xl animate-spin" style={{ animationDuration: '60s' }}></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 px-4 py-6 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold font-satoshi bg-gradient-to-r from-primary via-primary-600 to-purple-600 bg-clip-text text-transparent">
              Flocus
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Button 
              variant="ghost"
              className="font-medium"
            >
              Features
            </Button>
            <Button 
              variant="ghost"
              className="font-medium"
            >
              Pricing
            </Button>
            <Button 
              onClick={() => navigate("/login")}
              className="font-medium shadow-lg"
            >
              Get Started
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-primary/20"
            >
              <Sparkles className="w-5 h-5 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Trusted by 50,000+ professionals worldwide</span>
            </motion.div>

            <h1 className="text-7xl md:text-8xl font-bold font-satoshi mb-8 leading-tight">
              Focus on what
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-600 to-purple-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                matters most
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your productivity with intelligent task management, 
              Pomodoro timers, and achievement tracking. Built for ambitious people who want to achieve extraordinary results.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/login")}
                className="text-lg px-10 py-7 rounded-2xl group shadow-2xl hover:shadow-primary/25"
              >
                <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Your Journey
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="text-lg px-10 py-7 rounded-2xl backdrop-blur-sm"
              >
                Watch Demo
                <Play className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mb-16"
            >
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>4.9/5 rating</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span>Free 14-day trial</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span>No credit card required</span>
            </motion.div>
          </motion.div>

          {/* Enhanced App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative glass-effect rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-2xl p-8 border border-border/50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-semibold">Today's Focus Session</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {["Review project proposal", "Team standup meeting", "Complete design mockups", "Client presentation prep"].map((task, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl hover:from-primary/10 hover:to-primary/5 transition-all duration-300"
                      >
                        <CheckCircle className="w-6 h-6 text-primary" />
                        <span className="flex-1">{task}</span>
                        <span className="text-sm text-muted-foreground">25 min</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full border-8 border-primary/20"></div>
                      <div className="absolute inset-0 w-48 h-48 rounded-full border-8 border-primary border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold">24:35</div>
                          <div className="text-sm text-muted-foreground">Focus Session</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold font-satoshi bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-satoshi mb-8">
              Everything you need to
              <span className="bg-gradient-to-r from-primary via-primary-600 to-purple-600 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed to help you stay focused, organized, and motivated on your journey to extraordinary productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full glass-effect hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-primary/20">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-satoshi mb-8">
              Why choose
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Flocus?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-6 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-satoshi mb-8">
              Loved by
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> thousands</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join a community of high-achievers who have transformed their productivity with Flocus.
            </p>
          </motion.div>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full glass-effect hover:shadow-xl transition-all duration-300 border-primary/20">
                      <CardHeader>
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic leading-relaxed">"{testimonial.content}"</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-satoshi mb-8">
              Simple
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> pricing</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your productivity goals. Start free, upgrade when you're ready.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <Card className={`h-full glass-effect border-2 transition-all duration-300 hover:shadow-2xl ${plan.popular ? 'border-primary/50 shadow-primary/20' : 'border-primary/20'}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl mb-4">{plan.name}</CardTitle>
                    <div className="mb-6">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => navigate("/login")}
                    >
                      {plan.name === "Free" ? "Get Started" : "Start Free Trial"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-16 rounded-3xl border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
                <Award className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium text-primary">Join 50,000+ productive professionals</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold font-satoshi mb-8">
                Ready to transform your
                <span className="bg-gradient-to-r from-primary via-primary-600 to-purple-600 bg-clip-text text-transparent"> productivity?</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of users who have already revolutionized their workflow with Flocus. 
                Start your journey to extraordinary productivity today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/login")}
                  className="text-lg px-12 py-7 rounded-2xl group shadow-2xl hover:shadow-primary/25"
                >
                  <Coffee className="mr-3 w-5 h-5" />
                  Start Your Journey
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Free 14-day trial • No credit card required
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 px-4 py-16 border-t border-border/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold font-satoshi bg-gradient-to-r from-primary via-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Flocus
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Transform your productivity with intelligent task management, focus sessions, and achievement tracking.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Code className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Globe className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-3 text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>Integrations</div>
                <div>API</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-3 text-muted-foreground">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 Flocus. Built with ❤️ for productivity enthusiasts worldwide.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
      </motion.div>
    </div>
  );
};

export default LandingPage;
