import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Clock, DollarSign, ArrowLeft, MessageSquare, User,
  HardHat, Send, CheckCircle2, Building2, Loader2
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OfferChat from "@/components/OfferChat";

interface ServiceRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  city: string | null;
  district: string | null;
  address: string | null;
  budget: number | null;
  status: string;
  photos: string[];
  created_at: string;
}

interface Offer {
  id: string;
  worker_id: string;
  price: number;
  message: string | null;
  status: string;
  created_at: string;
  worker_name?: string;
}

const RequestDetail = () => {
  const { id } = useParams();
  const { effectiveRole } = useRole();
  const { user } = useAuth();

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [chatOfferId, setChatOfferId] = useState<string | null>(null);
  const [chatOtherName, setChatOtherName] = useState("User");

  useEffect(() => {
    if (!id) return;

    const fetchRequest = async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }
      setRequest(data as ServiceRequest);

      // Fetch offers if user is the request owner or has made an offer
      if (user) {
        const { data: offersData } = await supabase
          .from("offers")
          .select("*")
          .eq("request_id", id)
          .order("created_at", { ascending: true });

        if (offersData) {
          // Fetch worker display names
          const workerIds = offersData.map((o) => o.worker_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, display_name")
            .in("user_id", workerIds);

          const profileMap: Record<string, string> = {};
          profiles?.forEach((p) => {
            profileMap[p.user_id] = p.display_name || "Worker";
          });

          setOffers(
            offersData.map((o) => ({
              ...o,
              price: Number(o.price),
              worker_name: profileMap[o.worker_id] || "Worker",
            }))
          );
        }
      }

      setLoading(false);
    };

    fetchRequest();
  }, [id, user]);

  const handleSubmitOffer = async () => {
    if (!user || !id) return;
    if (!offerPrice) {
      toast.error("Please enter your proposed price");
      return;
    }

    setSubmittingOffer(true);
    const { data, error } = await supabase
      .from("offers")
      .insert({
        request_id: id,
        worker_id: user.id,
        price: parseFloat(offerPrice),
        message: offerMessage.trim() || null,
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Offer submitted!");
      setOffers((prev) => [...prev, { ...data, price: Number(data.price), worker_name: "You" }]);
      setShowOfferForm(false);
      setOfferPrice("");
      setOfferMessage("");
      // Auto-open chat
      setChatOfferId(data.id);
      setChatOtherName("Request Owner");
    }
    setSubmittingOffer(false);
  };

  const openChat = (offer: Offer) => {
    setChatOfferId(offer.id);
    const isOwner = request?.user_id === user?.id;
    setChatOtherName(isOwner ? (offer.worker_name || "Worker") : "Request Owner");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Navbar />
        <div className="container flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Request not found</h1>
          <Link to="/requests"><Button variant="ghost" className="mt-4">Back to Requests</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.id === request.user_id;
  const canMakeOffer = user && (effectiveRole === "worker" || effectiveRole === "company") && !isOwner;
  const alreadyOffered = offers.some((o) => o.worker_id === user?.id);

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navbar />

      <div className="container py-8">
        <Link to="/requests">
          <Button variant="ghost" size="sm" className="mb-4 gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Requests
          </Button>
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {request.photos && request.photos.length > 0 && (
              <div className="overflow-hidden rounded-xl">
                <img src={request.photos[0]} alt={request.title} className="h-64 w-full object-cover md:h-80" />
              </div>
            )}
            {request.photos && request.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {request.photos.slice(1).map((p, i) => (
                  <img key={i} src={p} alt="" className="h-20 w-20 rounded-lg object-cover border" />
                ))}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">{request.category}</Badge>
                <Badge variant="status">{request.status}</Badge>
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold md:text-3xl">{request.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {(request.city || request.district) && (
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{[request.city, request.district].filter(Boolean).join(", ")}</span>
                )}
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{new Date(request.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">{request.description}</p>
              {request.address && (
                <p className="mt-2 text-sm text-muted-foreground"><MapPin className="inline h-3.5 w-3.5 mr-1" />Address: {request.address}</p>
              )}
            </div>

            {/* Offer form */}
            {canMakeOffer && !alreadyOffered && showOfferForm && (
              <Card className="border-secondary/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HardHat className="h-5 w-5" /> Submit Your Offer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="offer-price">Your Proposed Price (₸)</Label>
                    <Input id="offer-price" type="number" placeholder="e.g. 12000" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="offer-message">Message to Customer</Label>
                    <Textarea id="offer-message" placeholder="Describe your experience and availability..." value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} className="mt-1" rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="hero" className="gap-1.5" onClick={handleSubmitOffer} disabled={submittingOffer}>
                      {submittingOffer ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit Offer
                    </Button>
                    <Button variant="ghost" onClick={() => setShowOfferForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Offers list */}
            {user && (isOwner || offers.length > 0) && (
              <div>
                <h2 className="font-display text-xl font-bold">Offers ({offers.length})</h2>
                <div className="mt-4 space-y-3">
                  {offers.map((offer) => (
                    <Card key={offer.id} className="shadow-card">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground">
                              {(offer.worker_name || "W")[0]}
                            </div>
                            <div>
                              <span className="font-semibold">{offer.worker_name}</span>
                              {offer.message && <p className="mt-1 text-sm text-muted-foreground">{offer.message}</p>}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-display text-lg font-bold">₸{offer.price.toLocaleString()}</div>
                            <div className="mt-1 flex gap-1.5">
                              {isOwner && offer.status === "pending" && (
                                <Button size="sm" variant="hero" className="gap-1" onClick={async () => {
                                  await supabase.from("offers").update({ status: "accepted" }).eq("id", offer.id);
                                  setOffers((prev) => prev.map((o) => o.id === offer.id ? { ...o, status: "accepted" } : o));
                                  toast.success("Offer accepted!");
                                }}>
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                                </Button>
                              )}
                              {offer.status === "accepted" && (
                                <Badge variant="status" className="bg-primary/10 text-primary">Accepted</Badge>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => openChat(offer)}>
                                <MessageSquare className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-lg">Budget</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 font-display text-3xl font-bold">
                  <DollarSign className="h-6 w-6" />
                  {request.budget ? Number(request.budget).toLocaleString() : "Negotiable"}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Initial customer price</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-lg">Posted By</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{isOwner ? "You" : "Customer"}</p>
                    <p className="text-xs text-muted-foreground">Contact after assignment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {canMakeOffer && !alreadyOffered && !showOfferForm && (
              <Button variant="hero" className="w-full gap-2" onClick={() => setShowOfferForm(true)}>
                <HardHat className="h-4 w-4" /> Make an Offer
              </Button>
            )}

            {canMakeOffer && alreadyOffered && (
              <Button variant="outline" className="w-full gap-2" disabled>
                <CheckCircle2 className="h-4 w-4" /> Offer Submitted
              </Button>
            )}

            {!user && (
              <Link to="/login">
                <Button variant="hero" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" /> Log in to Make an Offer
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Chat Dialog */}
      <Dialog open={!!chatOfferId} onOpenChange={(open) => !open && setChatOfferId(null)}>
        <DialogContent className="p-0 max-w-md">
          <DialogHeader className="sr-only">
            <DialogTitle>Chat</DialogTitle>
          </DialogHeader>
          {chatOfferId && <OfferChat offerId={chatOfferId} otherUserName={chatOtherName} />}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default RequestDetail;
