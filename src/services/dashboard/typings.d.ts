declare namespace DashBoard {
  type PlatformInfo = {
    id: string;
    ip: string;
    status: string;
    cpuCores: number;
    cpuDescription?: string;
    memory: number;
    memoryDescription?: string;
    storage: number;
    storageDescription?: string;
    bandWidth: number;
    bandWidthDescription?: string;
  };

  type HardwareInfo = {
    cpuUsage: number;
    memoryUsage: number;
    bandWidthIn: number;
    bandWidthOut: number;
    diskRead: number;
    diskWrite: number;
  }
}
