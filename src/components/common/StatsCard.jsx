import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  trend, 
  trendDirection,
  color = "blue",
  delay = 0 
}) {
  const colorVariants = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      light: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400"
    },
    green: {
      bg: "from-green-500 to-green-600", 
      light: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400"
    },
    yellow: {
      bg: "from-yellow-500 to-yellow-600",
      light: "bg-yellow-50 dark:bg-yellow-900/20", 
      text: "text-yellow-600 dark:text-yellow-400"
    },
    red: {
      bg: "from-red-500 to-red-600",
      light: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400"
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      light: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400"
    }
  };

  const currentColor = colorVariants[color] || colorVariants.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="relative overflow-hidden shadow-lg border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-br ${currentColor.bg} rounded-full opacity-10 dark:opacity-20`} />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${currentColor.light}`}>
            <Icon className={`h-5 w-5 ${currentColor.text}`} />
          </div>
        </CardHeader>
        
        <CardContent className="z-10 relative">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            
            {subtitle && (
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                {subtitle}
              </p>
            )}
            
            {trend && (
              <div className="flex items-center space-x-1">
                {trendDirection === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : trendDirection === 'down' ? (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                ) : null}
                <Badge 
                  variant="secondary"
                  className={`text-xs ${
                    trendDirection === 'up' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : trendDirection === 'down'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {trend}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}