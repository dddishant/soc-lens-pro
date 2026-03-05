import { useState } from "react";
import { Eye, Copy, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAnalysis, DEMO_DATA, Alert } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const severityColors: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
};

const AlertsPage = () => {
  const { data: rawData } = useAnalysis();
  const data = rawData || DEMO_DATA;
  const [selected, setSelected] = useState<Alert | null>(null);
  const { toast } = useToast();

  const copyJson = () => {
    if (!selected) return;
    navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
    toast({ title: "Copied", description: "Alert JSON copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-6">Security Alerts</h1>

          <Card className="glass-card border-border/30">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Severity</TableHead>
                    <TableHead className="text-muted-foreground">Rule ID</TableHead>
                    <TableHead className="text-muted-foreground">IP Address</TableHead>
                    <TableHead className="text-muted-foreground">Time Window</TableHead>
                    <TableHead className="text-muted-foreground">Count</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.alerts.map((alert, i) => (
                    <TableRow key={i} className="border-border/20 hover:bg-secondary/30">
                      <TableCell>
                        <Badge variant="outline" className={severityColors[alert.severity]}>
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground font-mono text-sm">{alert.rule_id}</TableCell>
                      <TableCell className="text-primary font-mono text-sm">{alert.ip}</TableCell>
                      <TableCell className="text-foreground/70 text-sm">{alert.time_window}</TableCell>
                      <TableCell className="text-foreground font-mono">{alert.count}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelected(alert)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Evidence Drawer */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg bg-card border-border/50 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-foreground flex items-center gap-2">
              Investigation: {selected?.rule_id}
              {selected && (
                <Badge variant="outline" className={severityColors[selected.severity]}>
                  {selected.severity}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          {selected?.explain && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Rule Condition</h3>
                <p className="text-foreground/80 text-sm glass-card rounded-lg p-3">{selected.explain.condition}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Observed</h3>
                <p className="text-foreground/80 text-sm glass-card rounded-lg p-3">{selected.explain.observed}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Matched Examples</h3>
                <div className="space-y-2">
                  {selected.explain.matched_examples.map((ex, i) => (
                    <div key={i} className="glass-card rounded-lg p-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{ex.timestamp}</span>
                        <span className="text-primary font-mono">{ex.ip}</span>
                        <span className="font-mono">{ex.status}</span>
                      </div>
                      <p className="text-foreground/70 text-xs font-mono">{ex.path}</p>
                      {ex.raw && <p className="text-muted-foreground text-xs font-mono mt-1 break-all">{ex.raw}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={copyJson} variant="outline" className="w-full border-border/50 hover:border-primary/30">
                <Copy className="h-4 w-4 mr-2" /> Copy Alert JSON
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AlertsPage;
