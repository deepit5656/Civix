import React, { useState, useCallback } from "react";
import {
  Github,
  Heart,
  Send,
  CheckCircle,
  Twitter,
  Linkedin,
  Youtube,
  ShieldCheck,
  Info,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import logoF from "../assets/logo1.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/HarshS16/Civix", icon: Github },
    { name: "Twitter", href: "https://twitter.com/civix", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/company/civix", icon: Linkedin },
    { name: "YouTube", href: "https://youtube.com/c/civix", icon: Youtube },
  ];

  const handleNewsletterSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!email.trim()) return;

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubscribed(true);
        setEmail("");
        setTimeout(() => setIsSubscribed(false), 4000);
      }, 800);
    },
    [email]
  );

  return (
    <footer id="footer" className="w-full bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-12 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <img src={logoF} alt="Civix Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">CIVIX</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering communities with smart civic engagement. Report issues, participate in public voting, and connect directly with local governance.
            </p>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-200"
                    aria-label={`Visit our ${social.name} page`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Mission</Link></li>
              <li><Link to="/voting-system" className="hover:text-emerald-400 transition-colors">Voting System</Link></li>
              <li><Link to="/user-map" className="hover:text-emerald-400 transition-colors">Issue Heatmap</Link></li>
              <li><Link to="/civic-education" className="hover:text-emerald-400 transition-colors">Civic Rights</Link></li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources & Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/feedback" className="hover:text-emerald-400 transition-colors">Submit Feedback</Link></li>
              <li><Link to="/contributors" className="hover:text-emerald-400 transition-colors">Our Contributors</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Civic Updates</h4>
            <p className="text-xs text-slate-400">Subscribe for local governance notifications and resolution reports.</p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  {isSubmitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                </button>
              </div>
              {isSubscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Subscribed successfully!
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} Civix Platform. Built for transparent community governance.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for better cities</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
