"use client"

import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type HeaderAction = {
  key: string
  icon?: ReactNode
  label?: string
  onClick?: () => void
  variant?: ButtonProps["variant"]
  className?: string
  ariaLabel?: string
  component?: ReactNode
}

interface AppHeaderProps {
  title?: string
  subtitle?: string
  onBack?: () => void
  actions?: HeaderAction[]
  className?: string
  leadingContent?: ReactNode
}

export function AppHeader({
  title = "K-Docent",
  subtitle,
  onBack,
  actions = [],
  className,
  leadingContent,
}: AppHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between p-4", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
        )}

        {leadingContent}

        <div className="min-w-0">
          <h1 className="font-app-title font-bold text-xl text-gray-800 truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions.map(({ key, icon, label, onClick, variant = "ghost", className: actionClassName, ariaLabel, component }) => (
            component ? (
              <div key={key}>{component}</div>
            ) : (
              <Button
                key={key}
                variant={variant}
                size={label ? "default" : "sm"}
                className={cn(
                  label
                    ? "flex items-center gap-2 rounded-full"
                    : "p-2 rounded-full",
                  actionClassName,
                )}
                onClick={onClick}
                aria-label={ariaLabel ?? label ?? "header-action"}
              >
                {icon}
                {label && <span className="text-sm font-medium">{label}</span>}
              </Button>
            )
          ))}
        </div>
      )}
    </div>
  )
}

export type { HeaderAction }
