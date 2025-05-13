"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingBag, Truck } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    { name: "Home", path: "/" },
    { name: "Order", path: "/order" },
    { name: "Track", path: "/track" },
    { name: "Contact", path: "/contact" },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#2a2a2a] text-white supports-[backdrop-filter]:bg-[#2a2a2a]/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Toggle Menu" className="text-white hover:bg-[#3a3a3a]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-[#2a2a2a] text-white">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`text-lg font-medium transition-colors hover:text-orange-500 ${
                      isActive(route.path) ? "text-orange-500" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Link href="/order" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingBag className="mr-2 h-4 w-4" /> Order Now
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    <Link href="/track" onClick={() => setIsMenuOpen(false)}>
                      <Truck className="mr-2 h-4 w-4" /> Track Delivery
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-auto relative">
              <Image
                src="/images/site-logo.jpg"
                alt="Quickcrank Delivery"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                isActive(route.path) ? "text-orange-500" : ""
              }`}
            >
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          >
            <Link href="/track">
              <Truck className="mr-2 h-4 w-4" /> Track
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
            <Link href="/order">
              <ShoppingBag className="mr-2 h-4 w-4" /> Order
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
