import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, Search, BarChart3, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAnalysis, DEMO_DATA } from "@/context/AnalysisContext";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setData, setIsDemo } = useAnalysis();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/upload");
  };

  const handleDemo = () => {
    setData(DEMO_DATA);
    setIsDemo(true);
    navigate("/dashboard");
  };

  const features = [
    { icon: Zap, text: "Detect suspicious activity instantly" },
    { icon: Search, text: "Investigate logs with AI assistance" },
    { icon: BarChart3, text: "Visualize attack patterns" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-primary glow-text" />
            <h1 className="text-5xl font-extrabold text-foreground tracking-tight">
              SOC <span className="text-primary glow-text">Lens</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-12 max-w-md">
            AI-assisted log analysis & incident detection
          </p>
          <div className="space-y-6">
            {features.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-foreground/80 text-lg">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8 border border-border/50">
            <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">SOC Lens</span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Sign in to your security dashboard</p>

            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="analyst@soclens.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/30 h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/30 h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:shadow-[0_0_20px_hsl(185_100%_62%/0.3)]"
              >
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleDemo}
              className="w-full h-11 border-border/50 text-foreground hover:bg-secondary hover:border-primary/30 transition-all duration-200"
            >
              Continue with Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
