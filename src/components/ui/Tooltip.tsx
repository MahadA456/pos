"use client"

import { useState } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 border-t-4 border-x-transparent border-x-4',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 border-b-4 border-x-transparent border-x-4',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 border-l-4 border-y-transparent border-y-4',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 border-r-4 border-y-transparent border-y-4'
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 max-w-xs whitespace-nowrap shadow-lg">
            {content}
          </div>
          <div className={`absolute ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  )
}

interface HelpButtonProps {
  content: string
  title?: string
}

export function HelpButton({ content, title = "Help" }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
        title={title}
      >
        ?
      </button>
      {isOpen && (
        <div className="absolute top-6 right-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{title}</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-700">{content}</p>
        </div>
      )}
    </div>
  )
}
