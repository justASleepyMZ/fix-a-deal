import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceRequestCard from "@/components/ServiceRequestCard";
import { categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, HardHat, ShieldCheck, Building2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import type { ServiceRequestData } from "@/components/ServiceRequestCard";
import { toast } from "sonner";

const Requests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { effectiveRole } = useRole();
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequestData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const mapped: ServiceRequestData[] = (data || []).map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        city: r.city || "",
        district: r.district || "",
        price: Number(r.budget) || 0,
        status: r.status.charAt(0).toUpperCase() + r.status.slice(1).replace("_", " "),
        createdAt: new Date(r.created_at).toLocaleDateString(),
        offersCount: 0,
        imageUrl: r.photos && r.photos.length > 0 ? r.photos[0] : undefined,
      }));
      setRequests(mapped);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const filtered = requests.filter((r) => {
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
            {(effectiveRole === "user" || effectiveRole === "company") && user && (
              <Link to="/requests/new">
                <Button variant="hero">
                  <Plus className="mr-1.5 h-4 w-4" /> Post a Request
                </Button>
              </Link>
            )}

            {effectiveRole === "worker" && (
              <Button variant="outline" className="pointer-events-none gap-1.5">
                <HardHat className="h-4 w-4" /> Browse &amp; submit offers below
              </Button>
            )}

            {effectiveRole === "admin" && (
              <Button variant="outline" className="pointer-events-none gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Moderation mode active
              </Button>
            )}

            {!effectiveRole && (
              <Link to="/login">
                <Button variant="hero">
                  <Plus className="mr-1.5 h-4 w-4" /> Post a Request
                </Button>
              </Link>
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((req) => (
              <ServiceRequestCard key={req.id} request={req} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
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
