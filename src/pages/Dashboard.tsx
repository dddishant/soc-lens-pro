import { useState, useMemo } from "react";
import { Activity, Globe, ShieldAlert, AlertTriangle, Search, Code, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAnalysis, DEMO_DATA } from "@/context/AnalysisContext";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#3be7ff", "#8b5cf6", "#f97316", "#ef4444", "#22c55e", "#eab308"];

const riskColors: Record<string, string> = {
  Critical: "text-red-400",
  High: "text-orange-400",
  Medium: "text-yellow-400",
  Low: "text-green-400",
};

const Dashboard = () => {
  const { data: rawData } = useAnalysis();
  const data = rawData || DEMO_DATA;

  const [dateRange, setDateRange] = useState("all");
  const [ipFilter, setIpFilter] = useState("all");
  const [ruleFilter, setRuleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const uniqueIps = useMemo(() => [...new Set(data.events_preview.map(e => e.ip))], [data]);
  const uniqueRules = useMemo(() => [...new Set(data.alerts.map(a => a.rule_id))], [data]);

  const filteredEvents = useMemo(() => {
    return data.events_preview.filter(e => {
      if (ipFilter !== "all" && e.ip !== ipFilter) return false;
      if (searchQuery && !Object.values(e).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false;
      return true;
    });
  }, [data, ipFilter, searchQuery]);

  const pagedEvents = filteredEvents.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredEvents.length / perPage);

  const kpis = [
    { label: "Total Events", value: data.events_preview.length.toLocaleString(), icon: Activity, color: "text-primary" },
    { label: "Unique IPs", value: uniqueIps.length.toString(), icon: Globe, color: "text-purple-400" },
    { label: "Risk Level", value: data.risk, icon: ShieldAlert, color: riskColors[data.risk] || "text-primary" },
    { label: "Alert Count", value: data.alerts.length.toString(), icon: AlertTriangle, color: "text-orange-400" },
  ];

  const tooltipStyle = {
    contentStyle: { background: "hsl(215 25% 10%)", border: "1px solid hsl(215 20% 25%)", borderRadius: "8px", color: "#fff" },
    labelStyle: { color: "hsl(215 15% 55%)" },
  };

  const [jsonOpen, setJsonOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Raw JSON Viewer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl mb-6 overflow-hidden">
          <button
            onClick={() => setJsonOpen(!jsonOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-mono text-primary">
              <Code className="h-4 w-4" />
              <span>Raw JSON Response</span>
            </div>
            {jsonOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {jsonOpen && (
            <div className="relative border-t border-border/30">
              <button
                onClick={handleCopyJson}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <pre className="p-4 text-xs font-mono text-foreground/80 overflow-auto max-h-80 scrollbar-thin">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-4 mb-8">
          <p className="text-muted-foreground text-sm">{data.summary}</p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card border-border/30 hover:border-primary/30 transition-all duration-300">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-secondary/50 border-border/50"><SelectValue placeholder="Date Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ipFilter} onValueChange={(v) => { setIpFilter(v); setPage(1); }}>
            <SelectTrigger className="w-44 bg-secondary/50 border-border/50"><SelectValue placeholder="Filter by IP" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All IPs</SelectItem>
              {uniqueIps.map(ip => <SelectItem key={ip} value={ip}>{ip}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={ruleFilter} onValueChange={setRuleFilter}>
            <SelectTrigger className="w-48 bg-secondary/50 border-border/50"><SelectValue placeholder="Filter by Rule" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rules</SelectItem>
              {uniqueRules.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-card border-border/30">
            <CardHeader><CardTitle className="text-base text-foreground">Traffic Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.analytics.traffic_over_time}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 18%)" />
                  <XAxis dataKey="time" stroke="hsl(215 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215 15% 55%)" fontSize={12} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="monotone" dataKey="count" stroke="#3be7ff" strokeWidth={2} dot={{ fill: "#3be7ff", r: 3 }} activeDot={{ r: 6, fill: "#3be7ff" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/30">
            <CardHeader><CardTitle className="text-base text-foreground">Top IPs</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.analytics.top_ips}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 18%)" />
                  <XAxis dataKey="ip" stroke="hsl(215 15% 55%)" fontSize={10} />
                  <YAxis stroke="hsl(215 15% 55%)" fontSize={12} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#3be7ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/30">
            <CardHeader><CardTitle className="text-base text-foreground">HTTP Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={data.analytics.status_distribution} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} strokeWidth={0}>
                    {data.analytics.status_distribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ color: "hsl(215 15% 55%)", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/30">
            <CardHeader><CardTitle className="text-base text-foreground">Alerts by Rule</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.analytics.alerts_by_rule} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 18%)" />
                  <XAxis type="number" stroke="hsl(215 15% 55%)" fontSize={12} />
                  <YAxis dataKey="rule" type="category" stroke="hsl(215 15% 55%)" fontSize={10} width={120} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <Card className="glass-card border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-foreground">Recent Log Events</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-9 bg-secondary/50 border-border/50 h-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Timestamp</TableHead>
                  <TableHead className="text-muted-foreground">IP</TableHead>
                  <TableHead className="text-muted-foreground">Path / Domain</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedEvents.map((ev, i) => (
                  <TableRow key={i} className="border-border/20 hover:bg-secondary/30">
                    <TableCell className="text-foreground/80 font-mono text-xs">{ev.timestamp}</TableCell>
                    <TableCell className="text-primary font-mono text-sm">{ev.ip}</TableCell>
                    <TableCell className="text-foreground/70 text-sm max-w-xs truncate">{ev.path}</TableCell>
                    <TableCell>
                      <span className={`font-mono text-sm ${Number(ev.status) >= 400 ? "text-red-400" : "text-green-400"}`}>
                        {ev.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border-border/50">Prev</Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="border-border/50">Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
