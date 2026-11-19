import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={22} />
        </div>
      </div>

      <p className="text-3xl font-bold text-slate-800 mt-4">{value}</p>
    </div>
  );
}