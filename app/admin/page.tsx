"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2, CheckCircle, Truck, Package, Search, FileText, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock orders data as fallback
const initialOrders = [
  {
    id: "ORD001",
    trackingCode: "QCD12345",
    customer: "John Doe",
    phone: "08012345678",
    address: "123 Orchid Road, Lekki",
    items: [
      { name: "Milk", price: "1500", quantity: 1, category: "Supermarket", description: "" },
      { name: "Bread", price: "1200", quantity: 2, category: "Supermarket", description: "" },
      { name: "Eggs", price: "2000", quantity: 1, category: "Supermarket", description: "One crate" },
    ],
    subtotal: 5900,
    deliveryFee: 1000,
    total: 6900,
    status: "preparing",
    createdAt: "2023-05-12T10:30:00",
    updatedAt: "2023-05-12T10:35:00",
  },
  {
    id: "ORD002",
    trackingCode: "QCD67890",
    customer: "Jane Smith",
    phone: "08087654321",
    address: "456 Palm Avenue",
    items: [
      { name: "Paracetamol", price: "1500", quantity: 2, category: "Pharmacy", description: "Emzor brand" },
      { name: "Bandages", price: "2000", quantity: 1, category: "Pharmacy", description: "" },
    ],
    subtotal: 5000,
    deliveryFee: "To be determined",
    total: "To be determined",
    status: "transit",
    createdAt: "2023-05-12T09:15:00",
    updatedAt: "2023-05-12T09:45:00",
  },
  {
    id: "ORD003",
    trackingCode: "QCD24680",
    customer: "Bob Johnson",
    phone: "08023456789",
    address: "789 Orchid Road, Lekki",
    items: [
      { name: "Pizza", price: "5500", quantity: 1, category: "Food", description: "Pepperoni, large" },
      { name: "Soft Drinks", price: "2000", quantity: 2, category: "Food", description: "Coca-Cola" },
    ],
    subtotal: 9500,
    deliveryFee: 1000,
    total: 10500,
    status: "delivered",
    createdAt: "2023-05-11T18:20:00",
    updatedAt: "2023-05-11T19:00:00",
  },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newTrackingCode, setNewTrackingCode] = useState("")
  const [showTrackingDialog, setShowTrackingDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  // Check if admin is already logged in
  useEffect(() => {
    const adminSession = sessionStorage.getItem("quickcrankAdminSession")
    if (adminSession === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // Load orders from localStorage on component mount
  useEffect(() => {
    loadOrders()
  }, [])

  // Function to load orders from localStorage
  const loadOrders = () => {
    try {
      const storedOrders = localStorage.getItem("quickcrankOrders")

      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders)

        // Only use initialOrders if there are no stored orders
        if (parsedOrders && parsedOrders.length > 0) {
          setOrders(parsedOrders)
        } else {
          setOrders(initialOrders)
          // Save initial orders to localStorage if none exist
          localStorage.setItem("quickcrankOrders", JSON.stringify(initialOrders))
        }
      } else {
        setOrders(initialOrders)
        // Save initial orders to localStorage if none exist
        localStorage.setItem("quickcrankOrders", JSON.stringify(initialOrders))
      }
    } catch (error) {
      console.error("Error loading orders:", error)
      setOrders(initialOrders)
      // Save initial orders to localStorage if there was an error
      localStorage.setItem("quickcrankOrders", JSON.stringify(initialOrders))
    }
  }

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.phone && order.phone.includes(searchTerm)) ||
          (order.address && order.address.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

  // Handle login
  const handleLogin = () => {
    // Clear any previous error
    setLoginError("")

    // Check if password is correct - using Today@2025 as the password
    if (password === "Today@2025") {
      setIsAuthenticated(true)
      // Save admin session to sessionStorage to persist across page refreshes
      sessionStorage.setItem("quickcrankAdminSession", "true")

      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      })
    } else {
      setLoginError("Incorrect password. Please try again.")
      toast({
        title: "Login Failed",
        description: "Incorrect password",
        variant: "destructive",
      })
    }
  }

  // Handle password reset
  const handleResetPassword = () => {
    setIsResetting(true)

    // Simulate sending reset email
    setTimeout(() => {
      setIsResetting(false)
      setShowResetDialog(false)

      toast({
        title: "Reset Email Sent",
        description: `Password reset instructions have been sent to ${resetEmail}`,
      })
    }, 2000)
  }

  // Update order status
  const updateOrderStatus = (newStatus: string) => {
    if (!selectedOrder) return

    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : order,
      )

      setOrders(updatedOrders)
      setSelectedOrder({ ...selectedOrder, status: newStatus, updatedAt: new Date().toISOString() })
      setIsUpdating(false)

      // Update localStorage
      localStorage.setItem("quickcrankOrders", JSON.stringify(updatedOrders))

      toast({
        title: "Status Updated",
        description: `Order ${selectedOrder.id} is now ${newStatus}`,
      })
    }, 1000)
  }

  // Generate tracking code
  const generateTrackingCode = () => {
    const code = "QCD" + Math.floor(10000 + Math.random() * 90000)
    setNewTrackingCode(code)
  }

  // Assign tracking code
  const assignTrackingCode = () => {
    if (!selectedOrder || !newTrackingCode) return

    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id ? { ...order, trackingCode: newTrackingCode } : order,
    )

    setOrders(updatedOrders)
    setSelectedOrder({ ...selectedOrder, trackingCode: newTrackingCode })
    setShowTrackingDialog(false)

    // Update localStorage
    localStorage.setItem("quickcrankOrders", JSON.stringify(updatedOrders))

    toast({
      title: "Tracking Code Assigned",
      description: `Code ${newTrackingCode} assigned to order ${selectedOrder.id}`,
    })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline" className="bg-zinc-100 text-zinc-800 border-zinc-300">
            <FileText className="mr-1 h-3 w-3" /> Submitted
          </Badge>
        )
      case "preparing":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
            <Package className="mr-1 h-3 w-3" /> Preparing
          </Badge>
        )
      case "transit":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <Truck className="mr-1 h-3 w-3" /> In Transit
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="mr-1 h-3 w-3" /> Delivered
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Format items for display
  const formatItems = (items: any[]) => {
    if (!items || !items.length) return ""

    // If items is an array of strings
    if (typeof items[0] === "string") {
      return items.length > 2 ? `${items.slice(0, 2).join(", ")}...` : items.join(", ")
    }

    // If items is an array of objects
    const itemNames = items.map((item) => item.name)
    return itemNames.length > 2 ? `${itemNames.slice(0, 2).join(", ")}...` : itemNames.join(", ")
  }

  // Format price for display
  const formatPrice = (price: any) => {
    if (typeof price === "number") {
      return `₦${price.toLocaleString()}`
    }
    return price
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your password to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loginError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Login
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => setShowResetDialog(true)}>
              Forgot password?
            </Button>
          </CardFooter>
        </Card>

        {/* Password Reset Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your email address and we'll send you instructions to reset your password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={!resetEmail || isResetting}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-zinc-600 mb-8">Manage orders, track deliveries, and update status</p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search by order ID, tracking code, customer, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Tracking Code</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-zinc-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.trackingCode}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={order.address}>
                        {order.address}
                      </TableCell>
                      <TableCell
                        className="max-w-[150px] truncate"
                        title={Array.isArray(order.items) ? formatItems(order.items) : ""}
                      >
                        {Array.isArray(order.items) ? formatItems(order.items) : ""}
                      </TableCell>
                      <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderDialog(true)
                          }}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>Order ID: {selectedOrder.id}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Customer</p>
                    <p className="text-sm text-zinc-600">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-zinc-600">{selectedOrder.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-zinc-600">{selectedOrder.address}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Tracking Code</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-zinc-600">{selectedOrder.trackingCode}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        generateTrackingCode()
                        setShowTrackingDialog(true)
                      }}
                    >
                      Reassign
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Items</p>
                  <ul className="text-sm text-zinc-600 list-disc pl-5 mt-1 space-y-2">
                    {Array.isArray(selectedOrder.items) &&
                      selectedOrder.items.map((item: any, index: number) => (
                        <li key={index}>
                          {typeof item === "string" ? (
                            item
                          ) : (
                            <div>
                              <div>
                                <span className="font-medium">{item.name}</span> x{item.quantity} -{" "}
                                {item.price !== "Ask Customer Service" ? `₦${item.price}` : item.price}
                              </div>
                              {item.description && (
                                <div className="text-xs text-zinc-500 mt-0.5">Description: {item.description}</div>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <p className="font-medium">Subtotal</p>
                    <p className="text-zinc-600">{formatPrice(selectedOrder.subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="font-medium">Delivery Fee</p>
                    <p className="text-zinc-600">{formatPrice(selectedOrder.deliveryFee)}</p>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <p>Total</p>
                    <p>{formatPrice(selectedOrder.total)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Current Status</p>
                  <p className="text-sm">{getStatusBadge(selectedOrder.status)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Update Status</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={selectedOrder.status === "submitted" ? "default" : "outline"}
                      className={selectedOrder.status === "submitted" ? "bg-zinc-500 hover:bg-zinc-600 text-white" : ""}
                      onClick={() => updateOrderStatus("submitted")}
                      disabled={isUpdating}
                    >
                      <FileText className="mr-1 h-4 w-4" /> Submitted
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedOrder.status === "preparing" ? "default" : "outline"}
                      className={
                        selectedOrder.status === "preparing" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""
                      }
                      onClick={() => updateOrderStatus("preparing")}
                      disabled={isUpdating}
                    >
                      <Package className="mr-1 h-4 w-4" /> Preparing
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedOrder.status === "transit" ? "default" : "outline"}
                      className={selectedOrder.status === "transit" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
                      onClick={() => updateOrderStatus("transit")}
                      disabled={isUpdating}
                    >
                      <Truck className="mr-1 h-4 w-4" /> In Transit
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedOrder.status === "delivered" ? "default" : "outline"}
                      className={
                        selectedOrder.status === "delivered" ? "bg-green-500 hover:bg-green-600 text-white" : ""
                      }
                      onClick={() => updateOrderStatus("delivered")}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" /> Delivered
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tracking Code Dialog */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign Tracking Code</DialogTitle>
            <DialogDescription>Assign a new tracking code to this order</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium">New Tracking Code</p>
              <div className="flex items-center gap-2 mt-2">
                <Input value={newTrackingCode} onChange={(e) => setNewTrackingCode(e.target.value)} />
                <Button variant="outline" size="icon" onClick={generateTrackingCode}>
                  <Loader2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTrackingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={assignTrackingCode}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
