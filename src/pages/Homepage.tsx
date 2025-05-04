import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scissors, ShieldCheck, Shirt, Ruler, PenTool, MoveRight, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Homepage = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Future integration: Send form data to backend
    alert("Thank you for your message! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Navigation */}
      <nav className="px-6 py-5 md:px-12 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Scissors className="h-8 w-8 text-silai-500" />
          <span className="text-2xl font-bold text-white">Silai Sahayak</span>
        </div>
        <div>
          <Button 
            className="bg-silai-600 hover:bg-silai-700 text-white"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Professional <span className="text-silai-500">Tailoring</span> Services
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
              Expert tailoring, alterations, and custom clothing for all your needs. 
              Perfect fit, guaranteed.
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-silai-600 hover:bg-silai-700 text-white rounded-md px-8"
                onClick={handleLogin}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end animate-scale-in">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-silai-700/30 to-silai-500/30 rounded-full flex items-center justify-center">
                <Scissors className="w-28 h-28 md:w-36 md:h-36 text-silai-400" />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-center py-3 px-6 rounded-full border border-silai-700/50 shadow-lg">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-silai-400 h-5 w-5" />
                  <span className="font-medium text-sm">Premium Quality: Craftsmanship you can trust</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Us</h2>
            <div className="w-24 h-1 bg-silai-500 mx-auto"></div>
          </div>
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <p className="text-gray-300">
              At Silai Sahayak, we blend traditional craftsmanship with modern technology to deliver exceptional tailoring services. Our team of skilled artisans brings decades of experience and passion for precision to every garment.
            </p>
            <p className="text-gray-300">
              Founded with a vision to revolutionize the tailoring industry, we prioritize quality, attention to detail, and customer satisfaction above all else. Our mission is to help tailors manage their business efficiently while delivering impeccable service to their customers.
            </p>
            <div className="pt-4">
              <div className="inline-flex items-center text-silai-400 font-medium">
                Learn more about our journey <MoveRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-silai-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-gray-800 rounded-xl p-6 transition-all hover:transform hover:scale-105 hover:shadow-xl border border-gray-700">
              <div className="w-14 h-14 rounded-lg bg-silai-900 flex items-center justify-center mb-4">
                <Shirt className="text-silai-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Tailoring</h3>
              <p className="text-gray-400">Expert craftsmanship for custom-made garments that perfectly fit your unique measurements and style preferences.</p>
            </div>
            
            {/* Service 2 */}
            <div className="bg-gray-800 rounded-xl p-6 transition-all hover:transform hover:scale-105 hover:shadow-xl border border-gray-700">
              <div className="w-14 h-14 rounded-lg bg-silai-900 flex items-center justify-center mb-4">
                <Ruler className="text-silai-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Alterations</h3>
              <p className="text-gray-400">Professional garment alterations to ensure your clothing fits perfectly and enhances your appearance.</p>
            </div>
            
            {/* Service 3 */}
            <div className="bg-gray-800 rounded-xl p-6 transition-all hover:transform hover:scale-105 hover:shadow-xl border border-gray-700">
              <div className="w-14 h-14 rounded-lg bg-silai-900 flex items-center justify-center mb-4">
                <PenTool className="text-silai-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Design Consultation</h3>
              <p className="text-gray-400">Expert advice on fabric selection, style options, and design elements to create your perfect garment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Testimonials</h2>
            <div className="w-24 h-1 bg-silai-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-tangerine-500">★</span>
                ))}
              </div>
              <p className="text-gray-300 italic mb-6">"The quality of work is exceptional. My wedding suit fit perfectly and the attention to detail was impressive. Highly recommended!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-silai-700 flex items-center justify-center mr-3">
                  <span className="font-medium text-silai-300">RP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Rahul Patel</h4>
                  <p className="text-sm text-gray-400">Mumbai</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-tangerine-500">★</span>
                ))}
              </div>
              <p className="text-gray-300 italic mb-6">"They completely transformed my outdated dress into something modern and beautiful. The service was quick and the staff was very friendly."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-silai-700 flex items-center justify-center mr-3">
                  <span className="font-medium text-silai-300">AM</span>
                </div>
                <div>
                  <h4 className="font-semibold">Ananya Mehta</h4>
                  <p className="text-sm text-gray-400">Delhi</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-tangerine-500">★</span>
                ))}
              </div>
              <p className="text-gray-300 italic mb-6">"I've been a customer for years and the consistency in quality is remarkable. They understand exactly what I need every time."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-silai-700 flex items-center justify-center mr-3">
                  <span className="font-medium text-silai-300">SK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Suresh Kumar</h4>
                  <p className="text-sm text-gray-400">Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 px-6 md:px-12" id="contact">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
            <div className="w-24 h-1 bg-silai-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold mb-4">Get In Touch</h3>
              <p className="text-gray-300">Have questions about our services or want to schedule an appointment? Contact us today and our team will be happy to assist you.</p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-silai-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-gray-300">+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-silai-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-300">info@silaisahayak.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-silai-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-gray-300">123 Fashion Street, Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleFormChange}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleFormChange}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleFormChange}
                      className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button type="submit" className="w-full bg-silai-600 hover:bg-silai-700 text-white">
                      Send Message
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6 md:px-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scissors className="h-6 w-6 text-silai-500" />
                <span className="text-xl font-bold text-white">Silai Sahayak</span>
              </div>
              <p className="text-gray-400 mb-4">Transforming the tailoring industry through innovation and excellence.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-silai-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-silai-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-silai-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-silai-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Custom Tailoring</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Alterations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Design Consultation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Fabric Selection</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Silai Sahayak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
