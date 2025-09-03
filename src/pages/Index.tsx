import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Leaf, Shield, Clock, Star, Recycle, Users, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-cleaning.jpg";

const Index = () => {
  const features = [
    {
      icon: <Recycle className="h-8 w-8 text-primary" />,
      title: "Eco-Friendly Solutions",
      description: "100% biodegradable products and sustainable cleaning methods"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Reliable Service",
      description: "On-time arrival and efficient cleaning with real-time tracking"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Trusted Professionals",
      description: "Vetted and trained cleaning experts with insurance coverage"
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Quality Guaranteed",
      description: "100% satisfaction guarantee with quality assurance checks"
    }
  ];

  const services = [
    "Residential Cleaning",
    "Commercial Cleaning", 
    "Waste Management",
    "Deep Cleaning",
    "Garden Cleanup",
    "Office Sanitization"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Go Green with 
                <span className="text-primary block">Eco-Friendly</span>
                Cleaning Services
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Professional, sustainable cleaning solutions for your home and office. 
                Book trusted cleaners who care about the environment as much as you do.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Book Service Now
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-up">
              <img 
                src={heroImage} 
                alt="Professional eco-friendly cleaning service"
                className="rounded-2xl shadow-card w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose GoGreen?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine professional cleaning excellence with environmental responsibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-soft transition-smooth text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive cleaning solutions for every need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-4 bg-card rounded-lg shadow-card"
              >
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="font-medium text-foreground">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Go Green?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of satisfied customers who've made the switch to eco-friendly cleaning
          </p>
          <Link to="/auth?mode=signup">
            <Button variant="secondary" size="lg" className="animate-pulse-green">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">GoGreen</span>
            </div>
            <p className="text-background/70 mb-4">
              Professional eco-friendly cleaning services
            </p>
            <p className="text-sm text-background/50">
              © 2024 GoGreen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
