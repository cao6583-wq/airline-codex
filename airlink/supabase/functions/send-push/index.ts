import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type PushPayload = {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
  targetUserId?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@example.com";
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");

    if (!supabaseUrl || !anonKey || !serviceKey || !vapidPublicKey || !vapidPrivateKey) {
      return new Response(JSON.stringify({ error: "Missing Supabase or VAPID secrets" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser();
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = (await req.json().catch(() => ({}))) as PushPayload;
    const targetUserId = payload.targetUserId || authData.user.id;
    if (targetUserId !== authData.user.id) {
      return new Response(JSON.stringify({ error: "Sending to other users is not enabled yet" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: subscriptions, error } = await admin
      .from("airlink_push_subscriptions")
      .select("id, endpoint, subscription")
      .eq("user_id", targetUserId);

    if (error) throw error;

    const notification = JSON.stringify({
      title: payload.title || "LinkNest",
      body: payload.body || "你有一条新的借阅消息",
      url: payload.url || "./",
      tag: payload.tag || "airlink-update",
    });

    let sent = 0;
    const failed: Array<{ id: number; endpoint: string; reason: string }> = [];

    for (const row of subscriptions || []) {
      try {
        await webpush.sendNotification(row.subscription, notification);
        sent += 1;
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        failed.push({ id: row.id, endpoint: row.endpoint, reason });
        if ((err as { statusCode?: number }).statusCode === 404 || (err as { statusCode?: number }).statusCode === 410) {
          await admin.from("airlink_push_subscriptions").delete().eq("id", row.id);
        }
      }
    }

    return new Response(JSON.stringify({ sent, failed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
