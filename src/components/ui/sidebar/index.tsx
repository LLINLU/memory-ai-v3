
import * as React from "react"
import { Button } from "@/components/ui/button"
import { PanelLeft, PanelRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/use-sidebar"

export * from "./sidebar-base"
export * from "./sidebar-main"
export * from "./sidebar-menu"
export * from "./sidebar-structure"

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button> & { side?: "left" | "right" }
>(({ className, onClick, side = "left", ...props }, ref) => {
  const { toggleSidebar, state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {side === "left" ? 
        (isCollapsed ? <PanelRight /> : <PanelLeft />) : 
        (isCollapsed ? <PanelLeft /> : <PanelRight />)
      }
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"
