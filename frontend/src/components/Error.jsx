import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/ui-components";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({ error, reset }) {
  const navigate = useNavigate();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-[440px] min-w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive text-red-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </p>
          {error && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground break-words text-center text-red-800">
                Error: {error}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="default"
            onClick={reset}
            className="w-full sm:w-auto flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <div onClick={() => navigate(-1)}>
            <Button variant="outline" className="w-full flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
