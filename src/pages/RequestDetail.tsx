import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRequests } from "@/data/mockData";
import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, DollarSign, ArrowLeft, Star, MessageSquare, User } from "lucide-react";

const mockOffers = [
  { id: "1", workerName: "Sergey K.", rating: 4.8, reviews: 42, price: 12000, message: "I can fix this quickly. Have 10+ years experience with kitchen plumbing.", avatar: "S" },
  { id: "2", workerName: "Dmitry A.", rating: 4.5, reviews: 28, price: 14500, message: "Available tomorrow. Will bring all necessary parts.", avatar: "D" },
  { id: "3", workerName: "Aidar B.", rating: 4.9, reviews: 67, price: 13000, message: "Certified plumber. Can also check your other fixtures at no extra charge.", avatar: "A" },
];

const RequestDetail = () => {
  const { id } = useParams();
  const request = mockRequests.find((r) => r.id === id) || mockRequests[0];

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
                            <Button size="sm" variant="hero">Accept</Button>
                            <Button size="sm" variant="ghost"><MessageSquare className="h-3.5 w-3.5" /></Button>
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

            <Button variant="hero" className="w-full gap-2">
              <MessageSquare className="h-4 w-4" /> Make an Offer
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RequestDetail;
