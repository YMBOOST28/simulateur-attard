import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  delay?: number;
  color?: "blue" | "green" | "gray";
}

export default function KPICard({ 
  icon: Icon, 
  label, 
  value, 
  subtitle, 
  delay = 0,
  color = "blue" 
}: KPICardProps) {
  const colorClasses = {
    blue: "bg-[#1E6FFF]/10 text-[#1E6FFF]",
    green: "bg-[#1DBF73]/10 text-[#1DBF73]",
    gray: "bg-[#F5F7FA] text-[#0B1F3B]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-6 border-[#0B1F3B]/10 bg-white hover:shadow-lg transition-shadow">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#0B1F3B]/60 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-[#0B1220] mb-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-[#0B1F3B]/50">{subtitle}</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
