import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ServiceCard from "@/components/service-card"

export default function Home() {
  const services = [
    {
      title: "Supermarket Runs",
      description: "Get your groceries delivered to your doorstep",
      icon: "shopping-cart",
    },
    {
      title: "Pharmacy Pickups",
      description: "We'll pick up your medications for you",
      icon: "pill",
    },
    {
      title: "Food Delivery",
      description: "Satisfy your cravings without leaving home",
      icon: "utensils",
    },
    {
      title: "Small Chops",
      description: "Perfect for your small gatherings and events",
      icon: "cake",
    },
    {
      title: "Late-night Cravings",
      description: "We deliver even when it's late",
      icon: "moon",
    },
    {
      title: "Custom Errands",
      description: "Tell us what you need, we'll handle it",
      icon: "package",
    },
  ]

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 z-10">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Too tired to go out? <span className="text-orange-500">We Got You!</span>
            </h1>
            <p className="text-xl md:text-2xl">Let Quickcrank Delivery run your errands while you chill</p>
            <div className="bg-zinc-800 p-4 rounded-lg inline-block">
              <p className="text-orange-400 font-medium">We&apos;re your plug for:</p>
              <ul className="grid grid-cols-2 gap-2 mt-2">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Supermarket runs
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Pharmacy pickups
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Small chops cravings
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Late-night cravings
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold transition-transform hover:scale-105"
              >
                <Link href="/order">
                  Order Now <ShoppingBag className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold transition-transform hover:scale-105"
              >
                <Link href="/track">
                  Track Delivery <Truck className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <div className="relative h-[500px] w-[350px]">
              <Image
                src="/images/hero-section-image.jpg"
                alt="Quickcrank Delivery Rider"
                width={350}
                height={500}
                className="object-cover rounded-lg"
                priority
              />
              <div className="absolute bottom-4 right-4 bg-black p-2 rounded-lg">
                <p className="text-orange-500 font-bold text-sm">WE MOVE FAST</p>
                <p className="text-white text-xs">And Charge Small-Small</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-zinc-900 to-transparent"></div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-zinc-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our <span className="text-orange-500">Services</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} title={service.title} description={service.description} icon={service.icon} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
              <Link href="/order">
                Start Your Order <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Discounts Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get discounts for bulk purchases from partner shops!</h2>
          <p className="text-xl mb-8">We&apos;ve partnered with local businesses to bring you the best deals</p>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Partner logos would go here */}
            <div className="bg-white p-4 rounded-lg w-32 h-32 flex items-center justify-center">
              <span className="text-black font-bold">Partner 1</span>
            </div>
            <div className="bg-white p-4 rounded-lg w-32 h-32 flex items-center justify-center">
              <span className="text-black font-bold">Partner 2</span>
            </div>
            <div className="bg-white p-4 rounded-lg w-32 h-32 flex items-center justify-center">
              <span className="text-black font-bold">Partner 3</span>
            </div>
            <div className="bg-white p-4 rounded-lg w-32 h-32 flex items-center justify-center">
              <span className="text-black font-bold">Partner 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Affordable <span className="text-orange-500">Pricing</span>
          </h2>
          <p className="text-xl mb-12">Fast, reliable delivery starting from as low as ₦1,000</p>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="border border-zinc-200 rounded-lg p-6 flex-1 max-w-md mx-auto md:mx-0 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">Standard Delivery</h3>
              <p className="text-4xl font-bold text-orange-500 mb-6">₦1,000</p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Within Orchid Elenganza Estate
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Delivery within 60 minutes
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Small to medium packages
                </li>
              </ul>
              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold">
                <Link href="/order">Order Now</Link>
              </Button>
            </div>
            <div className="border border-zinc-200 rounded-lg p-6 flex-1 max-w-md mx-auto md:mx-0 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">Custom Delivery</h3>
              <p className="text-4xl font-bold text-orange-500 mb-6">Contact Us</p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Outside service area
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Bulk orders
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500 rounded-sm"></span>
                  Special handling requirements
                </li>
              </ul>
              <Button
                asChild
                variant="outline"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to place your order?</h2>
          <p className="text-xl mb-8">Let us handle your deliveries while you relax</p>
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
            <Link href="/order">
              Order Now <ShoppingBag className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
