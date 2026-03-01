import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceRequestCard from "@/components/ServiceRequestCard";
import { mockRequests, categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, HardHat, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "sonner";

const Requests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { role } = useRole();

  const filtered = mockRequests.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navbar />

      <div className="container py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Service Requests</h1>
            <p className="mt-1 text-muted-foreground">{filtered.length} active requests</p>
          </div>

          <div className="flex gap-2">
            {/* Customer: Post new request */}
            {role === "user" && (
              <Button variant="hero" onClick={() => toast.success("Create Request form coming soon!")}>
                <Plus className="mr-1.5 h-4 w-4" /> Post a Request
              </Button>
            )}

            {/* Worker: indicator */}
            {role === "worker" && (
              <Button variant="outline" className="pointer-events-none gap-1.5">
                <HardHat className="h-4 w-4" /> Browse &amp; submit offers below
              </Button>
            )}

            {/* Admin: moderation hint */}
            {role === "admin" && (
              <Button variant="outline" className="pointer-events-none gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Moderation mode active
              </Button>
            )}

            {/* Not logged in */}
            {!role && (
              <Button variant="hero" onClick={() => toast.info("Select a role via Quick Access or sign up to post requests.")}>
                <Plus className="mr-1.5 h-4 w-4" /> Post a Request
              </Button>
            )}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.slice(0, 6).map((cat) => (
              <Button
                key={cat.name}
                variant={selectedCategory === cat.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
              >
                {cat.icon} {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Listing grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((req) => (
            <ServiceRequestCard key={req.id} request={req} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg font-medium">No requests found</p>
            <p className="mt-1 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Requests;
