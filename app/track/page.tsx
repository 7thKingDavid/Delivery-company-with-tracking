"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, CheckCircle, Truck, Package, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function TrackPage() {
  const [trackingCode, setTrackingCode] = useState("")
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")

  // Track order
  const trackOrder = () => {
    if (!trackingCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get orders from localStorage
      const orders = JSON.parse(localStorage.getItem("quickcrankOrders") || "[]")

      // Find order with matching tracking code
      const order = orders.find((order: any) => order.trackingCode === trackingCode)

      // Simulate API call delay
      setTimeout(() => {
        if (order) {
          setTrackingResult(order)
          toast({
            title: "Order Found",
            description: `Your order is ${order.status}`,
          })
        } else {
          // Check mock data as fallback
          const mockResult = getMockTrackingData(trackingCode)

          if (mockResult) {
            setTrackingResult(mockResult)
            toast({
              title: "Order Found",
              description: `Your order is ${mockResult.status}`,
            })
          } else {
            toast({
              title: "Not Found",
              description: "No order found with this tracking code",
              variant: "destructive",
            })
            setTrackingResult(null)
          }
        }

        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error retrieving orders:", error)

      // Fallback to mock data
      const mockResult = getMockTrackingData(trackingCode)

      if (mockResult) {
        setTrackingResult(mockResult)
        toast({
          title: "Order Found",
          description: `Your order is ${mockResult.status}`,
        })
      } else {
        toast({
          title: "Not Found",
          description: "No order found with this tracking code",
          variant: "destructive",
        })
        setTrackingResult(null)
      }

      setIsLoading(false)
    }
  }

  // Generate tracking code
  const generateTrackingCode = () => {
    // Generate a random code
    const code = "QCD" + Math.floor(10000 + Math.random() * 90000)
    setGeneratedCode(code)
    setShowPaymentDialog(true)
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <FileText className="h-8 w-8 text-zinc-500" />
      case "preparing":
        return <Package className="h-8 w-8 text-orange-500" />
      case "transit":
        return <Truck className="h-8 w-8 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      default:
        return <FileText className="h-8 w-8 text-zinc-500" />
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "Order Submitted"
      case "preparing":
        return "Preparing"
      case "transit":
        return "In Transit"
      case "delivered":
        return "Delivered"
      default:
        return "Order Submitted"
    }
  }

  // Get progress width based on status
  const getProgressWidth = (status: string) => {
    switch (status) {
      case "submitted":
        return "w-1/4"
      case "preparing":
        return "w-2/4"
      case "transit":
        return "w-3/4"
      case "delivered":
        return "w-full"
      default:
        return "w-1/4"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Track Your Delivery</h1>
        <p className="text-zinc-600 mb-8">Enter your tracking code to check the status of your delivery</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Track Existing Order</CardTitle>
              <CardDescription>Enter your tracking code to check your order status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tracking-code">Tracking Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tracking-code"
                      placeholder="e.g. QCD12345"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                    />
                    <Button
                      onClick={trackOrder}
                      disabled={isLoading}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
                    </Button>
                  </div>
                </div>

                {trackingResult && (
                  <div className="mt-6 border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Order Status: {getStatusText(trackingResult.status)}</h3>
                      {getStatusIcon(trackingResult.status)}
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Customer:</span> {trackingResult.customer}
                      </div>
                      {trackingResult.address && (
                        <div>
                          <span className="font-medium">Address:</span> {trackingResult.address}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Items:</span>{" "}
                        {Array.isArray(trackingResult.items)
                          ? trackingResult.items.map((item: any) => item.name || item).join(", ")
                          : trackingResult.items?.join(", ")}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(trackingResult.createdAt).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>{" "}
                        {new Date(trackingResult.updatedAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div className="text-xs font-semibold text-orange-500">Order Progress</div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="h-2 bg-zinc-200 rounded-full">
                              <div
                                className={`h-2 rounded-full bg-orange-500 ${getProgressWidth(trackingResult.status)}`}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className={"font-bold text-orange-500"}>Submitted</span>
                          <span
                            className={
                              trackingResult.status === "preparing" ||
                              trackingResult.status === "transit" ||
                              trackingResult.status === "delivered"
                                ? "font-bold text-orange-500"
                                : ""
                            }
                          >
                            Preparing
                          </span>
                          <span
                            className={
                              trackingResult.status === "transit" || trackingResult.status === "delivered"
                                ? "font-bold text-orange-500"
                                : ""
                            }
                          >
                            In Transit
                          </span>
                          <span className={trackingResult.status === "delivered" ? "font-bold text-orange-500" : ""}>
                            Delivered
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generate Tracking Code</CardTitle>
              <CardDescription>Generate a tracking code after making payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  If you&apos;ve placed an order and made payment, generate your tracking code by clicking the button
                  below.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={generateTrackingCode} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                I&apos;ve Paid - Generate Code
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Confirmed</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <div>Thank you for your payment! Your tracking code has been generated.</div>
                <div className="bg-zinc-100 p-4 rounded-md text-center">
                  <div className="text-sm text-zinc-500">Your tracking code is:</div>
                  <div className="text-2xl font-bold text-orange-500">{generatedCode}</div>
                </div>
                <div className="text-sm">
                  Please save this code to track your delivery status. You can use it in the tracking form on this page.
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setTrackingCode(generatedCode)
                setShowPaymentDialog(false)
              }}
            >
              OK, Got It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}

// Mock tracking data for demo purposes (fallback if localStorage is empty)
function getMockTrackingData(code: string) {
  const mockTrackingData: Record<string, any> = {
    QCD12345: {
      status: "preparing",
      customer: "John Doe",
      address: "123 Orchid Road, Lekki",
      items: ["Milk", "Bread", "Eggs"],
      createdAt: "2023-05-12T10:30:00",
      updatedAt: "2023-05-12T10:35:00",
    },
    QCD67890: {
      status: "transit",
      customer: "Jane Smith",
      address: "456 Palm Avenue",
      items: ["Paracetamol", "Bandages"],
      createdAt: "2023-05-12T09:15:00",
      updatedAt: "2023-05-12T09:45:00",
    },
    QCD24680: {
      status: "delivered",
      customer: "Bob Johnson",
      address: "789 Orchid Road, Lekki",
      items: ["Pizza", "Soft Drinks"],
      createdAt: "2023-05-11T18:20:00",
      updatedAt: "2023-05-11T19:00:00",
    },
  }

  return mockTrackingData[code]
}
