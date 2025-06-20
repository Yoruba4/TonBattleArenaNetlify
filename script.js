const { createClient } = supabase;

// Initialize Supabase client
const supabaseUrl = 'https://hfoeczjdvjdrzjvgkuoq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmb2VjempkdmpkcnpqdmdrdW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjM1MzMsImV4cCI6MjA2NTg5OTUzM30.VcFFhbOZGiwlHdf-4KgrTbRpuitl4GLOmApI5UNoHwA'; // Your actual ANON public key
const supabase = createClient(supabaseUrl, supabaseKey);

let score = 0;
const userId = 'test-user-id'; // Use a placeholder for testing

// Function to update score
async function updateScore(userId, score, isBonus) {
    const { data, error } = await supabase.rpc('update_score', { user_id: userId, score: score, is_bonus: isBonus });
    if (error) console.error('Error updating score:', error);
}

// Function to subscribe
async function subscribe(userId) {
    const { data, error } = await supabase.rpc('subscribe', { user_id: userId });
    if (error) console.error('Error subscribing:', error);
}

// Function to link wallet address
async function linkWallet(userId, walletAddress) {
    const { data, error } = await supabase.rpc('link_wallet', { user_id: userId, wallet_address: walletAddress });
    if (error) console.error('Error linking wallet:', error);
}

// Event listeners
document.getElementById('tap-button').addEventListener('click', () => {
    score += 1; // Increment score
    document.getElementById('score-display').innerText = `Score: ${score}`;
    updateScore(userId, score, false); // Assuming isBonus is false
});

document.getElementById('subscribe-button').addEventListener('click', () => {
    subscribe(userId);
});

document.getElementById('link-wallet-button').addEventListener('click', () => {
    const walletAddress = document.getElementById('wallet-address').value;
    linkWallet(userId, walletAddress);
});
