import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Your Supabase credentials
const supabaseUrl = 'https://hfoeczjdvjdrzjvgkuoq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmb2VjempkdmpkcnpqdmdrdW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjM1MzMsImV4cCI6MjA2NTg5OTUzM30.VcFFhbOZGiwlHdf-4KgrTbRpuitl4GLOmApI5UNoHwA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Temporary auth
let currentUser = null;

async function signInAnonymously() {
  const { data, error } = await supabase.auth.signUp({ email: `${Date.now()}@example.com`, password: crypto.randomUUID() });
  if (data.user) {
    currentUser = data.user;
    console.log("Signed in as:", currentUser.id);
    await supabase.from('users').insert({ auth_user_id: currentUser.id });
  } else if (error) {
    console.error("Sign in failed:", error.message);
  }
}

await signInAnonymously();

// Score logic
let score = 0;

async function updateScore(score, isBonus = false) {
  if (!currentUser) return;
  const { data, error } = await supabase.from("scores").insert({
    user_id: (await getUserId()),
    score,
    is_bonus: isBonus
  });
  if (error) console.error("Score error:", error);
}

// Link wallet
async function linkWallet(wallet) {
  if (!currentUser) return;
  const userId = await getUserId();
  const { error } = await supabase
    .from("users")
    .update({ ton_wallet_address: wallet })
    .eq("id", userId);
  if (error) console.error("Wallet error:", error);
  else alert("Wallet linked!");
}

// Subscribe
async function subscribe() {
  const userId = await getUserId();
  const { data, error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    subscription_date: new Date()
  });
  if (error) console.error("Subscription error:", error);
  else alert("Subscribed!");
}

// Get internal user ID
async function getUserId() {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", currentUser.id)
    .single();
  return data?.id;
}

// UI interactions
document.getElementById("tap-button").addEventListener("click", async () => {
  score += 1;
  document.getElementById("score-display").innerText = `Score: ${score}`;
  await updateScore(score, false);
});

document.getElementById("link-wallet-button").addEventListener("click", async () => {
  const wallet = document.getElementById("wallet-address").value;
  await linkWallet(wallet);
});

document.getElementById("subscribe-button").addEventListener("click", async () => {
  await subscribe();
});
