import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Pill, Utensils, Cake, Moon, Package } from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  icon: string
}

export default function ServiceCard({ title, description, icon }: ServiceCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "shopping-cart":
        return <ShoppingCart className="h-10 w-10 text-orange-500" />
      case "pill":
        return <Pill className="h-10 w-10 text-orange-500" />
      case "utensils":
        return <Utensils className="h-10 w-10 text-orange-500" />
      case "cake":
        return <Cake className="h-10 w-10 text-orange-500" />
      case "moon":
        return <Moon className="h-10 w-10 text-orange-500" />
      case "package":
        return <Package className="h-10 w-10 text-orange-500" />
      default:
        return <Package className="h-10 w-10 text-orange-500" />
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-orange-200 group">
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">{getIcon()}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-zinc-600">{description}</p>
      </CardContent>
    </Card>
  )
}
