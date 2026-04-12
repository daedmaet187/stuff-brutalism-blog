import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 bg-background relative border-l-4 border-black overflow-x-hidden min-h-screen">
        <div className="absolute top-4 left-4 z-50">
           <SidebarTrigger className="bg-primary text-white border-2 border-black p-2 shadow-brutal hover:-translate-y-1 hover:shadow-brutal-hover active:translate-y-1 active:shadow-none transition-all" />
        </div>
        <div className="p-8 mt-12 md:mt-0 font-sans">
           {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
