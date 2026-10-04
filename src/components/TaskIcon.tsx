import React from 'react';
import {
  Sun,
  Sparkles,
  FolderCheck,
  GraduationCap,
  Coffee,
  Dumbbell,
  Droplets,
  Utensils,
  Wind,
  BookOpen,
  Smile,
  Smartphone,
  Compass,
  UtensilsCrossed,
  BedDouble,
  FileText,
  Code,
  Users,
  MessageSquare,
  CheckSquare,
  HeartHandshake,
  Bookmark,
  CalendarDays,
  MoonStar,
  Lamp,
  Moon,
  Clock,
  Check,
  Heart,
} from 'lucide-react';

interface TaskIconProps {
  name: string;
  className?: string;
  size?: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sun,
  Sparkles,
  FolderCheck,
  GraduationCap,
  Coffee,
  Dumbbell,
  Droplets,
  Utensils,
  Wind,
  BookOpen,
  Smile,
  Smartphone,
  Compass,
  UtensilsCrossed,
  BedDouble,
  FileText,
  Code,
  Users,
  MessageSquare,
  CheckSquare,
  HeartHandshake,
  Bookmark,
  CalendarDays,
  MoonStar,
  Lamp,
  Moon,
  Clock,
  Check,
  Heart,
};

export const TaskIcon: React.FC<TaskIconProps> = ({ name, className = 'w-4 h-4', size = 18 }) => {
  const IconComponent = ICON_MAP[name] || Clock;
  return <IconComponent className={className} size={size} strokeWidth={1.75} />;
};
