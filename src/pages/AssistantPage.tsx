import { useState } from "react";
import { Send, FileText, Shield, AlertTriangle, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAnalysis, DEMO_DATA } from "@/context/AnalysisContext";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  narrative: `## Incident Narrative

**Timeline**: March 1, 2025 02:00 - 15:00 UTC

At approximately 02:00 UTC, SOC Lens detected a sustained brute-force attack targeting SSH services from IP 192.168.1.105. Over 847 failed login attempts were recorded within a 15-minute window, triggering the BRUTE_FORCE_SSH rule.

Concurrently, at 08:00 UTC, a port scanning campaign was initiated from 172.16.0.88, probing 1,024 distinct ports over 30 minutes.

The most concerning activity occurred at 14:30 UTC when IP 10.0.0.42 launched SQL injection and XSS attacks against web application endpoints, suggesting an advanced persistent threat actor with web exploitation capabilities.

**Recommendation**: Immediately block IPs 192.168.1.105, 10.0.0.42, and 172.16.0.88. Conduct forensic analysis on affected systems.`,

  summary: `## Executive Summary

**Risk Level**: HIGH | **Total Alerts**: 6 | **Critical**: 2

### Key Findings
- **Brute Force Campaign**: 847 SSH login attempts from single source
- **Web Application Attacks**: SQL injection and XSS from 10.0.0.42
- **Reconnaissance Activity**: Port scan covering 1,024 ports
- **Rate Limiting Triggered**: API abuse from 203.0.113.50
- **Tor Exit Node Access**: Administrative page access attempts

### Impact Assessment
Two critical threats require immediate attention. The combination of SSH brute force and web application attacks suggests a coordinated campaign.

### Recommended Actions
1. Block identified malicious IPs at firewall level
2. Rotate SSH credentials on affected systems
3. Deploy WAF rules for SQL injection patterns
4. Review administrative access controls`,
};

const AssistantPage = () => {
  const { data: rawData } = useAnalysis();
  const data = rawData || DEMO_DATA;
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, I'm your SOC assistant. I've analyzed the uploaded logs and I'm ready to help with your investigation. You can ask me questions or use the quick actions below." },
  ]);
  const [input, setInput] = useState("");

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage("user", input);
    setInput("");
    setTimeout(() => {
      addMessage("assistant", "Based on my analysis of the log data, I can see patterns consistent with a multi-stage attack. The initial reconnaissance phase involved port scanning, followed by targeted exploitation attempts. I recommend focusing your investigation on the correlation between the SSH brute force and web application attack vectors.");
    }, 800);
  };

  const handleNarrative = () => {
    addMessage("user", "Generate Incident Narrative");
    setTimeout(() => addMessage("assistant", MOCK_RESPONSES.narrative), 600);
  };

  const handleSummary = () => {
    addMessage("user", "Generate Executive Summary");
    setTimeout(() => addMessage("assistant", MOCK_RESPONSES.summary), 600);
  };

  const topRules = data.analytics.alerts_by_rule.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="glass-card border-border/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" /> Incident Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-3">{data.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Risk Score</span>
                    <Badge variant="outline" className={`${data.risk === "High" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-primary/20 text-primary border-primary/30"}`}>
                      {data.risk}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card border-border/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400" /> Top Triggered Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {topRules.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80 font-mono text-xs">{r.rule}</span>
                      <span className="text-primary font-mono">{r.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <div className="space-y-2">
              <Button onClick={handleNarrative} variant="outline" className="w-full border-border/50 hover:border-primary/30 justify-start gap-2">
                <FileText className="h-4 w-4" /> Generate Incident Narrative
              </Button>
              <Button onClick={handleSummary} variant="outline" className="w-full border-border/50 hover:border-primary/30 justify-start gap-2">
                <FileText className="h-4 w-4" /> Generate Executive Summary
              </Button>
            </div>
          </div>

          {/* Chat panel */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card border-border/30 flex flex-col h-[calc(100vh-12rem)]">
                <CardHeader className="pb-3 border-b border-border/30">
                  <CardTitle className="text-base text-foreground flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" /> AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? "bg-primary/10 text-foreground"
                          : "bg-secondary/50 text-foreground/80"
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                      {msg.role === "user" && (
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </CardContent>
                <div className="p-4 border-t border-border/30">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about the incident..."
                      className="bg-secondary/50 border-border/50 h-10"
                    />
                    <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
