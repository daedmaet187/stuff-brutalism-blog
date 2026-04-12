"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const items = [
  { title: "Posts", url: "/dashboard" },
  { title: "Create Post", url: "/dashboard/posts/new" },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r-4 border-black bg-white">
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-8 bg-primary border-b-4 border-black mb-4">
             <h1 className="font-black text-4xl text-white uppercase transform -rotate-2">STUFF</h1>
             <p className="font-bold text-white uppercase tracking-widest text-xs mt-1">Admin Panel</p>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<a href={item.url} />} className="hover:bg-accent border-2 border-transparent hover:border-black hover:shadow-brutal font-black uppercase text-sm py-6 transition-all hover:-translate-y-1">
                      <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="/" />} className="hover:bg-destructive hover:text-white border-2 border-transparent hover:border-black font-black uppercase text-sm py-6 transition-all mt-8">
                      <span>← Back to Site</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
