import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/site-logo.jpg"
                alt="Quickcrank Delivery"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="text-zinc-400">
              Let Quickcrank Delivery run your errands while you chill. Fast, reliable, and affordable delivery service.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-zinc-400 hover:text-orange-500 transition-colors">
                  Order Now
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-zinc-400 hover:text-orange-500 transition-colors">
                  Track Delivery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-orange-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-zinc-400 hover:text-orange-500 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-zinc-400">Supermarket Runs</li>
              <li className="text-zinc-400">Pharmacy Pickups</li>
              <li className="text-zinc-400">Food Delivery</li>
              <li className="text-zinc-400">Small Chops</li>
              <li className="text-zinc-400">Late-night Cravings</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-zinc-400">07079923576</p>
                  <p className="text-zinc-400">07069252884</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-zinc-400">WhatsApp: 08161398241</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                <p className="text-zinc-400">Orchid Elenganza Estate and surrounding areas</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Quickcrank Delivery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
