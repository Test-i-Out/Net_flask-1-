import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Zap, BarChart3 } from "lucide-react";

export default function Index() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/devices?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const predefinedQueries = [
    "Show all firewall rules where source, destination, and service are set to 'Any' and the action is 'ACCEPT'",
    "List all enabled firewall rules that haven't been used in the last 90 days or were never used",
    "Find rules that failed the PCI-DSS v4 assessment with severity 8 or higher",
    "Identify rules marked as redundant or shadowed in the firewall policy",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                FireMon Security Intelligence
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block">Analyze</span>
              <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Firewall Rules
              </span>
              <span className="block">Intelligently</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Query your FireMon environment with natural language. Find
              security gaps, unused rules, and compliance violations across all
              your devices.
            </p>

            {/* Search Interface */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="Describe what you want to find..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-12 pr-4 py-4 text-lg border-0 bg-transparent focus-visible:ring-2 focus-visible:ring-primary/50"
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={!query.trim()}
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90"
                    >
                      Analyze
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Predefined Queries */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold mb-6 text-muted-foreground">
                Try these common queries:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predefinedQueries.map((predefinedQuery, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(predefinedQuery)}
                    className="text-left p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {predefinedQuery}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Query hundreds of devices and thousands of rules in seconds
            </p>
          </div>

          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Security Focused</h3>
            <p className="text-muted-foreground">
              Identify vulnerabilities and compliance issues automatically
            </p>
          </div>

          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
            <p className="text-muted-foreground">
              Comprehensive reports and insights for better decision making
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
