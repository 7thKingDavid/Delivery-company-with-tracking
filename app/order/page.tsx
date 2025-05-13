"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ShoppingCart, Send, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample product suggestions for autocomplete
const productSuggestions = [
  "Milk",
  "Bread",
  "Eggs",
  "Rice",
  "Beans",
  "Tomatoes",
  "Potatoes",
  "Onions",
  "Chicken",
  "Fish",
  "Beef",
  "Paracetamol",
  "Vitamin C",
  "Bandages",
  "Antiseptic",
  "Jollof Rice",
  "Fried Rice",
  "Chicken Wings",
  "Pizza",
  "Burger",
  "Ice Cream",
  "Chocolate",
  "Soft Drinks",
  "Water",
]

type CartItem = {
  id: string
  name: string
  price: string
  quantity: number
  category: string
  description: string
}

type CustomerInfo = {
  name: string
  phone: string
  address: string
}

export default function OrderPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [currentItem, setCurrentItem] = useState({
    name: "",
    price: "",
    quantity: 1,
    category: "Supermarket",
    description: "",
  })
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState(1000)
  const [isOrchidRoad, setIsOrchidRoad] = useState(true)

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = productSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchTerm])

  // Check if address is within Orchid Road
  useEffect(() => {
    if (customerInfo.address) {
      const isWithinOrchid = customerInfo.address.toLowerCase().includes("orchid")
      setIsOrchidRoad(isWithinOrchid)
      setDeliveryFee(isWithinOrchid ? 1000 : 0) // Set to 0 for non-Orchid addresses as it will be determined later
    }
  }, [customerInfo.address])

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setCurrentItem({ ...currentItem, name: suggestion })
    setSearchTerm(suggestion)
    setShowSuggestions(false)
  }

  // Add item to cart
  const addToCart = () => {
    // Use the search term if currentItem.name is empty
    const productName = currentItem.name.trim() || searchTerm.trim()

    if (!productName) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      })
      return
    }

    const newItem: CartItem = {
      id: Date.now().toString(),
      name: productName,
      price: currentItem.price || "Ask Customer Service",
      quantity: currentItem.quantity,
      category: currentItem.category,
      description: currentItem.description,
    }

    setCart([...cart, newItem])
    setCurrentItem({
      name: "",
      price: "",
      quantity: 1,
      category: "Supermarket",
      description: "",
    })
    setSearchTerm("")

    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your cart`,
    })
  }

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    })
  }

  // Calculate subtotal price
  const calculateSubtotal = () => {
    let total = 0
    cart.forEach((item) => {
      if (item.price !== "Ask Customer Service") {
        total += Number.parseFloat(item.price) * item.quantity
      }
    })
    return total
  }

  // Calculate total price including delivery fee
  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    return isOrchidRoad ? subtotal + deliveryFee : subtotal
  }

  // Validate customer info
  const validateCustomerInfo = () => {
    if (!customerInfo.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name",
        variant: "destructive",
      })
      return false
    }
    if (!customerInfo.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return false
    }
    if (!customerInfo.address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your delivery address",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  // Submit order to WhatsApp
  const submitOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before submitting",
        variant: "destructive",
      })
      return
    }

    if (!validateCustomerInfo()) {
      return
    }

    setIsSubmitting(true)

    // Generate a unique order ID
    const orderId = "ORD" + Date.now().toString().slice(-6)

    // Generate a tracking code
    const trackingCode = "QCD" + Math.floor(10000 + Math.random() * 90000)

    // Format the order message
    let message = `Hello Quickcrank Delivery, I would like to place an order:\n\n`
    message += `Name: ${customerInfo.name}\n`
    message += `Phone: ${customerInfo.phone}\n`
    message += `Address: ${customerInfo.address}\n\n`
    message += `Items:\n`

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - ${item.price} (${item.category})\n`
      if (item.description) {
        message += `   Description: ${item.description}\n`
      }
    })

    message += `\nSubtotal: ₦${calculateSubtotal().toFixed(2)}`

    if (isOrchidRoad) {
      message += `\nDelivery Fee: ₦${deliveryFee.toFixed(2)}`
      message += `\nTotal: ₦${calculateTotal().toFixed(2)}`
    } else {
      message += `\nDelivery Fee: To be determined`
      message += `\nTotal: To be determined (excluding delivery fee)`
    }

    message += `\n\nTracking Code: ${trackingCode}`

    // Save order to localStorage for admin dashboard and tracking
    const orderData = {
      id: orderId,
      trackingCode,
      customer: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        description: item.description,
      })),
      subtotal: calculateSubtotal(),
      deliveryFee: isOrchidRoad ? deliveryFee : "To be determined",
      total: isOrchidRoad ? calculateTotal() : "To be determined",
      status: "submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      // Get existing orders or initialize empty array
      const existingOrders = JSON.parse(localStorage.getItem("quickcrankOrders") || "[]")

      // Add new order
      localStorage.setItem("quickcrankOrders", JSON.stringify([...existingOrders, orderData]))
    } catch (error) {
      console.error("Error saving order to localStorage:", error)
    }

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/2348161398241?text=${encodedMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    setIsSubmitting(false)

    // Show success message
    toast({
      title: "Order Submitted",
      description: `Your order has been sent to WhatsApp. Your tracking code is ${trackingCode}`,
    })

    // Clear the cart and customer info after successful submission
    setCart([])
    setCustomerInfo({
      name: "",
      phone: "",
      address: "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Place Your Order</h1>
        <p className="text-zinc-600 mb-8">Search for items, add them to your cart, and submit your order</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Please provide your delivery details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Your phone number"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Your delivery address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  />
                </div>

                {customerInfo.address && !isOrchidRoad && (
                  <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Delivery Fee Notice</AlertTitle>
                    <AlertDescription>
                      Your address appears to be outside Orchid Road. The delivery fee will be higher than our standard
                      rate of ₦1,000. The exact fee will be confirmed via WhatsApp after you submit your order.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search & Add Items</CardTitle>
                <CardDescription>Search for products or type your own</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Label htmlFor="search">Product Name</Label>
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search for products or type your own..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentItem({ ...currentItem, name: e.target.value })
                    }}
                    className="w-full"
                  />
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-zinc-100 cursor-pointer"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (Optional)</Label>
                    <Input
                      id="price"
                      type="text"
                      placeholder="Enter price or leave blank"
                      value={currentItem.price}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: Number.parseInt(e.target.value) || 1,
                        })
                      }
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={currentItem.category}
                    onValueChange={(value) => setCurrentItem({ ...currentItem, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Supermarket">Supermarket</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Small Chops">Small Chops</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the specific product you want (brand, size, color, etc.)"
                    value={currentItem.description}
                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={addToCart} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Your Cart
                </CardTitle>
                <CardDescription>
                  {cart.length} item{cart.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">Your cart is empty</div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-start border-b pb-3">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-zinc-500">
                            {item.quantity} x {item.price}
                          </div>
                          <Badge variant="outline">{item.category}</Badge>
                          {item.description && (
                            <div className="text-xs text-zinc-600 mt-1">
                              <span className="font-medium">Description:</span> {item.description}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <>
                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₦{calculateSubtotal().toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee:</span>
                        <span>{isOrchidRoad ? `₦${deliveryFee.toFixed(2)}` : "To be determined"}</span>
                      </div>

                      <div className="flex justify-between font-medium text-base">
                        <span>Total:</span>
                        <span>{isOrchidRoad ? `₦${calculateTotal().toFixed(2)}` : "To be determined"}</span>
                      </div>

                      <div className="text-xs text-zinc-500">
                        *Excluding items with &quot;Ask Customer Service&quot; price
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={submitOrder}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Submit via WhatsApp
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
