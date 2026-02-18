import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Vocab from "@/pages/Vocab";
import Read from "@/pages/Read";
import Adventure from "@/pages/Adventure";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vocab" component={Vocab} />
      <Route path="/read" component={Read} />
      <Route path="/adventure" component={Adventure} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
