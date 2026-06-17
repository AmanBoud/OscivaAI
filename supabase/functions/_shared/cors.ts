// Shared permissive CORS headers — the chat widget is embedded on arbitrary
// customer domains, so the public chat function must accept any origin.
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
