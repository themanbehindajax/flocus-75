
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
  Coffee,
  MousePointer,
  Palette,
  Layers
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Smart Task Management",
      description: "Organize your tasks with intelligent priority systems and project tracking that adapts to your workflow.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      title: "Pomodoro Timer",
      description: "Built-in focus sessions with customizable work and break intervals to maximize your productivity.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Calendar Integration",
      description: "Seamlessly sync with your calendar for unified time management across all your devices.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Track your productivity with detailed insights, streak counters, and performance metrics.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Stay motivated with points, streaks, and productivity milestones that celebrate your progress.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Capture thoughts instantly with 2-minute quick tasks and smart shortcuts for rapid productivity.",
      gradient: "from-indigo-500 to-purple-500"
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
    { number: "50K+", label: "Active Users", icon: Users, color: "from-blue-500 to-cyan-500" },
    { number: "2M+", label: "Tasks Completed", icon: CheckCircle, color: "from-green-500 to-emerald-500" },
    { number: "98%", label: "User Satisfaction", icon: Heart, color: "from-pink-500 to-rose-500" },
    { number: "40%", label: "Productivity Increase", icon: TrendingUp, color: "from-purple-500 to-indigo-500" }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Enhanced Background with mesh gradient and particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 animate-morph"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-particle" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-particle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-particle" style={{ animationDelay: '2s' }}></div>
        
        {/* Enhanced decorative elements */}
        <div className="absolute -top-32 -right-32 w-128 h-128 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -left-48 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 blur-3xl animate-breathe"></div>
        <div className="absolute -bottom-48 right-1/4 w-128 h-128 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.015] mix-blend-overlay"></div>
      </div>

      {/* Enhanced Header with glass morphism */}
      <header className="relative z-10 px-4 py-6">
        <nav className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl px-6 py-4 shadow-lg">
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-11 h-11 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-neon transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold font-outfit bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Flocus
                </span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-6"
              >
                <Button 
                  variant="ghost"
                  className="font-medium font-outfit hover:bg-white/50 transition-all duration-300"
                >
                  Features
                </Button>
                <Button 
                  variant="ghost"
                  className="font-medium font-outfit hover:bg-white/50 transition-all duration-300"
                >
                  Pricing
                </Button>
                <Button 
                  onClick={() => navigate("/login")}
                  className="font-medium font-outfit bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-neon transition-all duration-300 group"
                >
                  <MousePointer className="w-4 h-4 mr-2 group-hover:animate-magnetic" />
                  Get Started
                </Button>
              </motion.div>
            </div>
          </div>
        </nav>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative z-10 px-4 py-32">
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
              className="inline-flex items-center backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 rounded-full px-8 py-4 mb-12 shadow-lg hover:shadow-electric transition-all duration-300 group"
            >
              <Sparkles className="w-5 h-5 text-blue-600 mr-3 group-hover:animate-spin transition-all duration-300" />
              <span className="text-sm font-medium font-outfit text-blue-700">Trusted by 50,000+ professionals worldwide</span>
            </motion.div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold font-outfit mb-12 leading-[0.9] tracking-tight">
              Focus on what
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] relative">
                matters most
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-xl -z-10 animate-pulse"></div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 mb-16 max-w-5xl mx-auto leading-relaxed font-outfit font-light">
              Transform your productivity with intelligent task management, 
              Pomodoro timers, and achievement tracking. Built for ambitious people who want to achieve 
              <span className="text-blue-600 font-medium"> extraordinary results</span>.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20"
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/login")}
                className="text-xl px-12 py-8 rounded-2xl font-outfit font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-neon-lg transition-all duration-300 group transform hover:scale-105"
              >
                <Play className="mr-4 w-6 h-6 group-hover:scale-110 transition-transform" />
                Start Your Journey
                <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="text-xl px-12 py-8 rounded-2xl font-outfit font-semibold backdrop-blur-xl bg-white/60 border-2 border-white/30 hover:bg-white/80 transition-all duration-300 group"
              >
                <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-8 text-base text-slate-500 mb-20 font-outfit"
            >
              <div className="flex items-center space-x-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">4.9/5 rating</span>
              </div>
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <span className="font-medium">Free 14-day trial</span>
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <span className="font-medium">No credit card required</span>
            </motion.div>
          </motion.div>

          {/* Enhanced App Preview with advanced glass morphism */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-4xl blur-3xl"></div>
            <div className="relative backdrop-blur-2xl bg-white/30 border border-white/20 rounded-4xl p-12 shadow-2xl">
              <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl p-10 border border-white/30 shadow-xl">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-bold font-outfit bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Today's Focus Session</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-neon"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {["Review project proposal", "Team standup meeting", "Complete design mockups", "Client presentation prep"].map((task, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center space-x-5 p-5 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl hover:from-blue-50/60 hover:to-purple-50/40 transition-all duration-300 border border-white/20 group"
                      >
                        <CheckCircle className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="flex-1 font-outfit font-medium text-slate-700">{task}</span>
                        <span className="text-sm text-slate-500 font-mono bg-slate-100/80 px-3 py-1 rounded-full">25 min</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-56 h-56 rounded-full border-8 border-slate-200/50"></div>
                      <div className="absolute inset-0 w-56 h-56 rounded-full border-8 border-blue-500 border-t-transparent animate-spin shadow-neon"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold font-mono text-slate-800 mb-2">24:35</div>
                          <div className="text-base text-slate-600 font-outfit font-medium">Focus Session</div>
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

      {/* Enhanced Stats Section */}
      <section className="relative z-10 px-4 py-24">
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
                <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-electric`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-bold font-outfit bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-outfit font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-10 px-4 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-6xl md:text-7xl font-bold font-outfit mb-8 tracking-tight">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto font-outfit font-light leading-relaxed">
              Powerful features designed to help you stay focused, organized, and motivated on your journey to extraordinary productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full backdrop-blur-xl bg-white/60 border border-white/30 hover:bg-white/80 transition-all duration-500 hover:-translate-y-3 rounded-3xl shadow-xl hover:shadow-2xl">
                  <CardHeader className="pb-4">
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 shadow-2xl`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-4 font-outfit font-bold text-slate-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed font-outfit text-lg">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="relative z-10 px-4 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-6xl md:text-7xl font-bold font-outfit mb-8 tracking-tight">
              Why choose
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Flocus?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-8 group"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${benefit.gradient} rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 shadow-2xl`}>
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-6 font-outfit text-slate-800">{benefit.title}</h3>
                  <p className="text-slate-600 text-xl leading-relaxed font-outfit">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="relative z-10 px-4 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-6xl md:text-7xl font-bold font-outfit mb-8 tracking-tight">
              Loved by
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> thousands</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-outfit font-light">
              Join a community of high-achievers who have transformed their productivity with Flocus.
            </p>
          </motion.div>

          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full backdrop-blur-xl bg-white/60 border border-white/30 hover:bg-white/80 transition-all duration-300 rounded-3xl shadow-xl hover:shadow-2xl">
                      <CardHeader>
                        <div className="flex mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-slate-600 italic leading-relaxed text-lg font-outfit">"{testimonial.content}"</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-5">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover shadow-lg"
                          />
                          <div>
                            <div className="font-bold text-lg font-outfit text-slate-800">{testimonial.name}</div>
                            <div className="text-base text-slate-600 font-outfit">{testimonial.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="backdrop-blur-xl bg-white/60 border border-white/30 hover:bg-white/80" />
            <CarouselNext className="backdrop-blur-xl bg-white/60 border border-white/30 hover:bg-white/80" />
          </Carousel>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="relative z-10 px-4 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-6xl md:text-7xl font-bold font-outfit mb-8 tracking-tight">
              Simple
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> pricing</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-outfit font-light">
              Choose the plan that fits your productivity goals. Start free, upgrade when you're ready.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
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
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-base font-outfit font-semibold shadow-xl">
                    Most Popular
                  </div>
                )}
                <Card className={`h-full backdrop-blur-xl bg-white/60 border-2 transition-all duration-300 hover:bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl ${plan.popular ? 'border-blue-300/50 shadow-electric' : 'border-white/30'}`}>
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl mb-6 font-outfit font-bold text-slate-800">{plan.name}</CardTitle>
                    <div className="mb-8">
                      <span className="text-6xl font-bold font-outfit text-slate-800">{plan.price}</span>
                      <span className="text-slate-600 text-xl font-outfit">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-5 mb-10">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-4">
                          <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                          <span className="font-outfit text-lg text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full py-4 text-lg font-outfit font-semibold rounded-2xl transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-neon' : 'border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50'}`}
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
      <section className="relative z-10 px-4 py-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-2xl bg-gradient-to-br from-white/60 to-white/40 border border-white/30 p-20 rounded-4xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-4xl"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-200/30 rounded-full px-8 py-4 mb-12 shadow-lg">
                <Award className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-base font-medium font-outfit text-blue-700">Join 50,000+ productive professionals</span>
              </div>
              
              <h2 className="text-6xl md:text-7xl font-bold font-outfit mb-12 tracking-tight">
                Ready to transform your
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"> productivity?</span>
              </h2>
              
              <p className="text-2xl text-slate-600 mb-16 max-w-4xl mx-auto leading-relaxed font-outfit font-light">
                Join thousands of users who have already revolutionized their workflow with Flocus. 
                Start your journey to extraordinary productivity today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/login")}
                  className="text-xl px-16 py-8 rounded-2xl font-outfit font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-neon-lg transition-all duration-300 group transform hover:scale-105"
                >
                  <Coffee className="mr-4 w-6 h-6" />
                  Start Your Journey
                  <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="text-base text-slate-500 font-outfit">
                  Free 14-day trial • No credit card required
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 px-4 py-24 border-t border-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="text-4xl font-bold font-outfit bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Flocus
                </span>
              </div>
              <p className="text-slate-600 mb-8 max-w-md text-lg font-outfit leading-relaxed">
                Transform your productivity with intelligent task management, focus sessions, and achievement tracking.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="rounded-full backdrop-blur-xl bg-white/60 border border-white/30 hover:bg-white/80">
                  <Code className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full backdrop-blur-xl bg-white/60 border border-white/30 hover:bg-white/80">
                  <Globe className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full backdrop-blur-xl bg-white/60 border border-white/30 hover:bg-white/80">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-xl font-outfit text-slate-800">Product</h3>
              <div className="space-y-4 text-slate-600 font-outfit">
                <div className="hover:text-blue-600 transition-colors cursor-pointer">Features</div>
                <div className="hover:text-blue-600 transition-colors cursor-pointer">Pricing</div>
                <div className="hover:text-blue-600 transition-colors cursor-pointer">Integrations</div>
                <div className="hover:text-blue-600 transition-colors cursor-pointer">API</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-xl font-outfit text-slate-800">Company</h3>
              <div className="space-y-4 text-slate-600 font-outfit">
                <div className="hover:text-blue-600 transition-colors cursor-pointer">About</div>
                <div className="hover:text-blue-600 transition-colors cursor-pointer">Blog</div>
                <div className="hover:text-blue-600 transition-colors cursor-pointer">Careers</div>
                <div className="hover:text-blue-600 transition-colors cursor-pointer">Contact</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-slate-600 font-outfit text-lg">
              © 2024 Flocus. Built with ❤️ for productivity enthusiasts worldwide.
            </p>
          </div>
        </div>
      </footer>

      {/* Enhanced scroll indicator */}
      <motion.div
        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-full p-3 shadow-lg">
          <ChevronDown className="w-8 h-8 text-blue-600 animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
