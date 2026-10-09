import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Dawn</h1>
          <p className="text-muted-foreground">Next.js + TypeScript + shadcn/ui</p>
        </div>

        <Alert>
          <AlertTitle>Setup Complete!</AlertTitle>
          <AlertDescription>
            Next.js with shadcn/ui has been successfully configured.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Components Demo</CardTitle>
              <CardDescription>Interactive shadcn/ui components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Input Field</label>
                <Input placeholder="Type something..." />
              </div>
              <div className="flex gap-2">
                <Button>Primary Button</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                All components are ready to use!
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
              <CardDescription>Dawn's foundation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ Next.js (App Router)</li>
                <li>✓ TypeScript</li>
                <li>✓ Tailwind CSS</li>
                <li>✓ shadcn/ui components</li>
                <li>✓ Radix UI primitives</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
