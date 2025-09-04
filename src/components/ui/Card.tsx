import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${paddingClasses[padding]} ${hover ? 'hover:shadow-md transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  icon?: string
  actions?: React.ReactNode
}

export function CardHeader({ title, subtitle, icon, actions }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        {icon && <span className="text-2xl mr-3">{icon}</span>}
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatCard({ title, value, icon, color = 'blue', trend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600', 
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  }

  const valueColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600', 
    red: 'text-red-600'
  }

  return (
    <Card hover>
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${valueColorClasses[color]}`}>{value}</p>
          {trend && (
            <p className={`text-xs font-medium mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗️' : '↘️'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
