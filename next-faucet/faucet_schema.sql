
-- Create the table to track faucet claims
CREATE TABLE IF NOT EXISTS public.faucet_claims (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    address text NOT NULL,
    amount numeric NOT NULL DEFAULT 5,
    ip_address text, -- Stores the Node IP used for verification
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster lookups by address (critical for rate limiting checks)
CREATE INDEX IF NOT EXISTS idx_faucet_claims_address ON public.faucet_claims(address);

-- Index for time-based queries (e.g. checking last month's claims)
CREATE INDEX IF NOT EXISTS idx_faucet_claims_created_at ON public.faucet_claims(created_at);

-- Optional: Add a comment
COMMENT ON TABLE public.faucet_claims IS 'Tracks QUANTIX faucet claims to enforce monthly limits per address.';
