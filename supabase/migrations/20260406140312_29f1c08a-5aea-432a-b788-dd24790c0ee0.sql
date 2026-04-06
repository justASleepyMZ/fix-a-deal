
-- Storage bucket for request photos
INSERT INTO storage.buckets (id, name, public) VALUES ('request-photos', 'request-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Request photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'request-photos');

CREATE POLICY "Authenticated users can upload request photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'request-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own request photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'request-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Service Requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  city TEXT,
  district TEXT,
  address TEXT,
  budget NUMERIC,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','completed','cancelled')),
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service requests are viewable by everyone"
ON public.service_requests FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create requests"
ON public.service_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
ON public.service_requests FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requests"
ON public.service_requests FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_service_requests_updated_at
BEFORE UPDATE ON public.service_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL,
  price NUMERIC NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view offers on their requests or their own offers"
ON public.offers FOR SELECT
USING (
  auth.uid() = worker_id
  OR auth.uid() IN (SELECT user_id FROM public.service_requests WHERE id = request_id)
);

CREATE POLICY "Authenticated users can create offers"
ON public.offers FOR INSERT
WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Offer creator can update their offer"
ON public.offers FOR UPDATE
USING (auth.uid() = worker_id);

CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Chat Messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat participants can view messages"
ON public.chat_messages FOR SELECT
USING (
  auth.uid() IN (
    SELECT o.worker_id FROM public.offers o WHERE o.id = offer_id
    UNION
    SELECT sr.user_id FROM public.service_requests sr
    JOIN public.offers o ON o.request_id = sr.id WHERE o.id = offer_id
  )
);

CREATE POLICY "Chat participants can send messages"
ON public.chat_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND auth.uid() IN (
    SELECT o.worker_id FROM public.offers o WHERE o.id = offer_id
    UNION
    SELECT sr.user_id FROM public.service_requests sr
    JOIN public.offers o ON o.request_id = sr.id WHERE o.id = offer_id
  )
);

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
