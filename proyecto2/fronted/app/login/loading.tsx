import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function LoginLoading() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-full" />

          <div className="flex justify-center mt-4">
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <Skeleton className="h-4 w-32 bg-background" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Skeleton className="h-4 w-32" />
        </CardFooter>
      </Card>
    </div>
  )
}
