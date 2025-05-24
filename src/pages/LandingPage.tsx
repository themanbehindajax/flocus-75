
import { Button } from "@/components/ui/button";
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
  Trophy
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Smart Task Management",
      description: "Organize your tasks with intelligent priority systems and project tracking."
    },
    {
      icon: Clock,
      title: "Pomodoro Timer",
      description: "Built-in focus sessions with customizable work and break intervals."
    },
    {
      icon: Calendar,
      title: "Calendar Integration",
      description: "Seamlessly sync with your calendar for unified time management."
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Track your productivity with detailed insights and streak counters."
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Stay motivated with points, streaks, and productivity milestones."
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Capture thoughts instantly with 2-minute quick tasks and smart shortcuts."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content: "Flocus transformed how I manage my daily tasks. The Pomodoro integration is game-changing!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Engineer",
      content: "Finally, a productivity app that doesn't get in my way. Clean, intuitive, and powerful.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Designer",
      content: "The achievement system keeps me motivated. I've increased my productivity by 40%!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-satoshi bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
              Flocus
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button 
              onClick={() => navigate("/login")}
              variant="outline"
              className="font-medium"
            >
              Sign In
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold font-satoshi mb-6 leading-tight">
              Focus on what
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-600 to-primary-700 bg-clip-text text-transparent">
                matters most
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your productivity with intelligent task management, 
              Pomodoro timers, and achievement tracking. Built for ambitious people.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/login")}
                className="text-lg px-8 py-6 rounded-xl group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>Trusted by 10,000+ users</span>
              </div>
            </motion.div>
          </motion.div>

          {/* App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="glass-effect rounded-2xl p-8 shadow-2xl">
              <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Today's Focus</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Review project proposal", "Team standup meeting", "Complete design mockups"].map((task, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-satoshi mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you stay focused, organized, and motivated.
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
                className="glass-effect p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-satoshi mb-6">
              Loved by
              <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent"> thousands</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-effect p-6 rounded-xl"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-12 rounded-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-satoshi mb-6">
              Ready to transform your
              <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent"> productivity?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already revolutionized their workflow with Flocus.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="text-lg px-8 py-6 rounded-xl group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 border-t border-border/40">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold font-satoshi bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
              Flocus
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Flocus. Built with ❤️ for productivity enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
