import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="app-shell flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-primary/15 text-center shadow-2xl shadow-primary/10">
        <CardContent className="p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Compass className="h-6 w-6" /></span>
          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-primary">404</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">This page is elsewhere.</h1>
          <p className="mt-3 text-muted-foreground">The page you requested is unavailable or may have moved.</p>
          <Button asChild className="mt-7 rounded-xl"><a href="/">Return home <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
