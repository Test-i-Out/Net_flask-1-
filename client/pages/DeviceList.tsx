import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  ArrowLeft,
  Server,
  Wifi,
  WifiOff,
  Settings,
  ChevronRight,
  Filter,
} from "lucide-react";
import { DevicesResponse, FireMonDevice } from "@shared/firemon";

export default function DeviceList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const {
    data: devicesData,
    isLoading,
    error,
  } = useQuery<DevicesResponse>({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await fetch("/api/devices");
      if (!response.ok) throw new Error("Failed to fetch devices");
      return response.json();
    },
  });

  const filteredDevices =
    devicesData?.devices.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.domain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || device.status === selectedStatus;
      return matchesSearch && matchesStatus;
    }) || [];

  const handleDeviceClick = (device: FireMonDevice) => {
    navigate(
      `/results?query=${encodeURIComponent(query)}&deviceId=${device.id}&deviceName=${encodeURIComponent(device.name)}`,
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="w-4 h-4 text-green-500" />;
      case "offline":
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case "maintenance":
        return <Settings className="w-4 h-4 text-yellow-500" />;
      default:
        return <Server className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "offline":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading devices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load devices</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Select Device</h1>
            <p className="text-muted-foreground">
              Choose a device to analyze with query:{" "}
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                {query}
              </span>
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Filter devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-muted-foreground">
            Showing {filteredDevices.length} of {devicesData?.total || 0}{" "}
            devices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDevices.map((device) => (
            <Card
              key={device.id}
              className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-primary/50 group"
              onClick={() => handleDeviceClick(device)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(device.status)}
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {device.name}
                  </h3>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{device.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Domain</span>
                  <span className="font-medium">{device.domain}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Rules</span>
                  <span className="font-medium">
                    {device.rulesCount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={getStatusColor(device.status)}
                >
                  {device.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ID: {device.id}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-16">
            <Server className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No devices found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search filters or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
