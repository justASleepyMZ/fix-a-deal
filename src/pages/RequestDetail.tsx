import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockRequests } from "@/data/mockData";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Clock, DollarSign, ArrowLeft, Star, MessageSquare, User,
  Trash2, Pencil, Ban, HardHat, Send, XCircle, CheckCircle2, ShieldCheck, AlertTriangle, Building2, Plus
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useState } from "react";
import { toast } from "sonner";

const mockOffers = [
  { id: "1", workerName: "Sergey K.", rating: 4.8, reviews: 42, price: 12000, message: "I can fix this quickly. Have 10+ years experience with kitchen plumbing.", avatar: "S" },
  { id: "2", workerName: "Dmitry A.", rating: 4.5, reviews: 28, price: 14500, message: "Available tomorrow. Will bring all necessary parts.", avatar: "D" },
  { id: "3", workerName: "Aidar B.", rating: 4.9, reviews: 67, price: 13000, message: "Certified plumber. Can also check your other fixtures at no extra charge.", avatar: "A" },
];

const RequestDetail = () => {
  const { id } = useParams();
  const request = mockRequests.find((r) => r.id === id) || mockRequests[0];
  const { role } = useRole();

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");

  const handleSubmitOffer = () => {
    if (!offerPrice) {
      toast.error("Please enter your proposed price");
      return;
    }
    toast.success(`Offer of $${offerPrice} submitted successfully!`);
    setShowOfferForm(false);
    setOfferPrice("");
    setOfferMessage("");
  };

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
            {request.imageUrl && (
              <div className="overflow-hidden rounded-xl">
                <img src={request.imageUrl} alt={request.title} className="h-64 w-full object-cover md:h-80" />
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">{request.category}</Badge>
                <Badge variant="status">{request.status}</Badge>
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold md:text-3xl">{request.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{request.city}, {request.district}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{request.createdAt}</span>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">{request.description}</p>
            </div>

            {/* ===== ROLE-SPECIFIC: Admin actions bar ===== */}
            {role === "admin" && (
              <Card className="border-destructive/30 bg-destructive/5 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-semibold">Admin Actions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Request editing form coming soon!")}>
                      <Pencil className="h-3.5 w-3.5" /> Edit Request
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => toast.success("Request deleted (demo)")}>
                      <Trash2 className="h-3.5 w-3.5" /> Delete Request
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("User has been suspended (demo)")}>
                      <Ban className="h-3.5 w-3.5" /> Suspend Author
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.info("Content flagged for review (demo)")}>
                      <AlertTriangle className="h-3.5 w-3.5" /> Flag Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ===== ROLE-SPECIFIC: Customer actions bar ===== */}
            {(role === "user" || role === "company") && (
              <Card className="border-primary/30 bg-accent shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {role === "company" ? <Building2 className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-primary" />}
                    <span className="text-sm font-semibold">{role === "company" ? "Company" : "Your"} Request Actions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Edit form coming soon!")}>
                      <Pencil className="h-3.5 w-3.5" /> Edit Request
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => toast.success("Request cancelled (demo)")}>
                      <XCircle className="h-3.5 w-3.5" /> Cancel Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ===== Worker/Company: Submit Offer Form ===== */}
            {(role === "worker" || role === "company") && showOfferForm && (
              <Card className="border-secondary/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HardHat className="h-5 w-5" /> Submit Your Offer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="offer-price">Your Proposed Price ($)</Label>
                    <Input
                      id="offer-price"
                      type="number"
                      placeholder="e.g. 12000"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="offer-message">Message to Customer</Label>
                    <Textarea
                      id="offer-message"
                      placeholder="Describe your experience, availability, and why you're the right person for this job..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="hero" className="gap-1.5" onClick={handleSubmitOffer}>
                      <Send className="h-4 w-4" /> Submit Offer
                    </Button>
                    <Button variant="ghost" onClick={() => setShowOfferForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Offers */}
            <div>
              <h2 className="font-display text-xl font-bold">Offers ({mockOffers.length})</h2>
              <div className="mt-4 space-y-3">
                {mockOffers.map((offer) => (
                  <Card key={offer.id} className="shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground">
                            {offer.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{offer.workerName}</span>
                              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-secondary text-secondary" />
                                {offer.rating} ({offer.reviews})
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{offer.message}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-display text-lg font-bold">${offer.price.toLocaleString()}</div>
                          <div className="mt-1 flex gap-1.5">
                            {/* Customer can accept offers */}
                            {(role === "user" || role === "company") && (
                              <Button size="sm" variant="hero" className="gap-1" onClick={() => toast.success(`Accepted offer from ${offer.workerName} (demo)`)}>
                                <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                              </Button>
                            )}
                            {/* Admin can remove offers */}
                            {role === "admin" && (
                              <Button size="sm" variant="destructive" className="gap-1" onClick={() => toast.success(`Offer removed (demo)`)}>
                                <Trash2 className="h-3.5 w-3.5" /> Remove
                              </Button>
                            )}
                            {/* Everyone can message */}
                            {role && (
                              <Button size="sm" variant="ghost" onClick={() => toast.info("Chat coming soon!")}>
                                <MessageSquare className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            {/* No role: prompt */}
                            {!role && (
                              <Button size="sm" variant="outline" onClick={() => toast.info("Select a role via Quick Access to interact")}>
                                Accept
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 font-display text-3xl font-bold">
                  <DollarSign className="h-6 w-6" />
                  {request.price.toLocaleString()}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Initial customer price</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Posted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Anonymous User</p>
                    <p className="text-xs text-muted-foreground">Contact after assignment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar role-specific CTA */}
            {(role === "worker" || role === "company") && !showOfferForm && (
              <Button variant="hero" className="w-full gap-2" onClick={() => setShowOfferForm(true)}>
                {role === "company" ? <Building2 className="h-4 w-4" /> : <HardHat className="h-4 w-4" />} Submit My Offer
              </Button>
            )}

            {(role === "user" || role === "company") && (
              <Button variant="outline" className="w-full gap-2" onClick={() => toast.info("Chat coming soon!")}>
                <MessageSquare className="h-4 w-4" /> Message Workers
              </Button>
            )}

            {role === "admin" && (
              <Button variant="destructive" className="w-full gap-2" onClick={() => toast.success("Request deleted (demo)")}>
                <Trash2 className="h-4 w-4" /> Delete Request
              </Button>
            )}

            {!role && (
              <Button variant="hero" className="w-full gap-2" onClick={() => toast.info("Select a role via Quick Access to make an offer")}>
                <MessageSquare className="h-4 w-4" /> Make an Offer
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RequestDetail;
