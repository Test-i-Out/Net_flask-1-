import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Activity,
} from "lucide-react";
import { QueryResultsResponse, FireMonRule } from "@shared/firemon";

export default function DeviceResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const deviceId = parseInt(searchParams.get("deviceId") || "0");
  const deviceName = searchParams.get("deviceName") || "";

  const {
    data: resultsData,
    isLoading,
    error,
  } = useQuery<QueryResultsResponse>({
    queryKey: ["query", query, deviceId],
    queryFn: async () => {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, deviceId }),
      });
      if (!response.ok) throw new Error("Failed to execute query");
      return response.json();
    },
    enabled: !!query && !!deviceId,
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "ACCEPT":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DENY":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "DROP":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "ACCEPT":
        return <CheckCircle className="w-3 h-3" />;
      case "DENY":
        return <XCircle className="w-3 h-3" />;
      case "DROP":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Shield className="w-3 h-3" />;
    }
  };

  const getSeverityColor = (severity?: number) => {
    if (!severity) return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    if (severity >= 8) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (severity >= 5)
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  };

  const exportResults = () => {
    if (!resultsData) return;

    const csvContent = [
      [
        "Rule Name",
        "Sources",
        "Destinations",
        "Services",
        "Action",
        "Last Used",
        "Enabled",
        "Redundant",
        "Shadowed",
        "Severity",
      ].join(","),
      ...resultsData.rules.map((rule) =>
        [
          rule.name,
          rule.sources.join("; "),
          rule.destinations.join("; "),
          rule.services.join("; "),
          rule.action,
          rule.lastUsed || "Never",
          rule.enabled ? "Yes" : "No",
          rule.redundant ? "Yes" : "No",
          rule.shadowed ? "Yes" : "No",
          rule.severity || "N/A",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `firemon-results-${deviceName}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing device rules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Analysis Failed</h2>
          <p className="text-muted-foreground mb-4">
            Failed to analyze the device rules
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const rules = resultsData?.rules || [];
  const stats = {
    total: rules.length,
    accept: rules.filter((r) => r.action === "ACCEPT").length,
    deny: rules.filter((r) => r.action === "DENY").length,
    drop: rules.filter((r) => r.action === "DROP").length,
    unused: rules.filter((r) => !r.lastUsed).length,
    redundant: rules.filter((r) => r.redundant).length,
    shadowed: rules.filter((r) => r.shadowed).length,
    highSeverity: rules.filter((r) => r.severity && r.severity >= 8).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Devices
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  Device:{" "}
                  <span className="font-semibold text-foreground">
                    {deviceName}
                  </span>{" "}
                  (ID: {deviceId})
                </p>
                <p className="text-muted-foreground">
                  Query:{" "}
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {query}
                  </span>
                </p>
              </div>
            </div>

            <Button
              onClick={exportResults}
              disabled={!rules.length}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Rules</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {stats.accept}
            </div>
            <div className="text-sm text-muted-foreground">Accept</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.deny}</div>
            <div className="text-sm text-muted-foreground">Deny</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {stats.drop}
            </div>
            <div className="text-sm text-muted-foreground">Drop</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.unused}
            </div>
            <div className="text-sm text-muted-foreground">Unused</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {stats.redundant}
            </div>
            <div className="text-sm text-muted-foreground">Redundant</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {stats.shadowed}
            </div>
            <div className="text-sm text-muted-foreground">Shadowed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.highSeverity}
            </div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </Card>
        </div>

        {/* Rules Table */}
        {rules.length > 0 ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Rule Name</th>
                    <th className="text-left p-4 font-semibold">Sources</th>
                    <th className="text-left p-4 font-semibold">
                      Destinations
                    </th>
                    <th className="text-left p-4 font-semibold">Services</th>
                    <th className="text-left p-4 font-semibold">Action</th>
                    <th className="text-left p-4 font-semibold">Last Used</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    {rules.some((r) => r.severity) && (
                      <th className="text-left p-4 font-semibold">Severity</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule, index) => (
                    <tr
                      key={rule.id}
                      className={index % 2 === 0 ? "bg-muted/20" : ""}
                    >
                      <td className="p-4 font-mono text-sm">{rule.name}</td>
                      <td className="p-4 text-sm">{rule.sources.join(", ")}</td>
                      <td className="p-4 text-sm">
                        {rule.destinations.join(", ")}
                      </td>
                      <td className="p-4 text-sm">
                        {rule.services.join(", ")}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`gap-1 ${getActionColor(rule.action)}`}
                        >
                          {getActionIcon(rule.action)}
                          {rule.action}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">
                        {rule.lastUsed ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {new Date(rule.lastUsed).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {!rule.enabled && (
                            <Badge
                              variant="outline"
                              className="bg-gray-500/10 text-gray-500 border-gray-500/20 text-xs"
                            >
                              Disabled
                            </Badge>
                          )}
                          {rule.redundant && (
                            <Badge
                              variant="outline"
                              className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs"
                            >
                              Redundant
                            </Badge>
                          )}
                          {rule.shadowed && (
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs"
                            >
                              Shadowed
                            </Badge>
                          )}
                        </div>
                      </td>
                      {rules.some((r) => r.severity) && (
                        <td className="p-4">
                          {rule.severity && (
                            <Badge
                              variant="outline"
                              className={getSeverityColor(rule.severity)}
                            >
                              {rule.severity}
                            </Badge>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-16 text-center">
            <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Rules Found</h3>
            <p className="text-muted-foreground">
              The query didn't return any rules for this device. Try a different
              query or device.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
