"use client";

import {
  Home,
  Building2,
  Tractor,
  Users,
  Store,
  PlugZap,
  Unplug,
  PowerOff,
  Sun,
  Wind,
  BatteryCharging,
  Plus,
  Refrigerator,
  Snowflake,
  CookingPot,
  Microwave,
  Utensils,
  WashingMachine,
  AirVent,
  Flame,
  Thermometer,
  Droplets,
  Tv,
  Monitor,
  Lightbulb,
  Car,
  Waves,
  PiggyBank,
  ShieldCheck,
  Leaf,
  TrendingUp,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

/**
 * Explicit icon registry. Questionnaire option catalogs store icon names as
 * strings (so they stay data-only); this maps those names to lucide
 * components. Keeping it explicit means only the icons we actually use are
 * bundled, and unknown names degrade gracefully to a help icon.
 */
const registry: Record<string, LucideIcon> = {
  Home,
  Building2,
  Tractor,
  Users,
  Store,
  PlugZap,
  Unplug,
  PowerOff,
  Sun,
  Wind,
  BatteryCharging,
  Plus,
  Refrigerator,
  Snowflake,
  CookingPot,
  Microwave,
  Utensils,
  WashingMachine,
  AirVent,
  Flame,
  Thermometer,
  Droplets,
  Tv,
  Monitor,
  Lightbulb,
  Car,
  Waves,
  PiggyBank,
  ShieldCheck,
  Leaf,
  TrendingUp,
};

export function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 2,
}: {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = registry[name] ?? HelpCircle;
  return <Cmp size={size} className={className} strokeWidth={strokeWidth} />;
}
