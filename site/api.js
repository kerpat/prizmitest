// Check if APP_CONFIG is loaded
if (!window.APP_CONFIG) {
    console.error('ОШИБКА: config.js не загружен! Убедитесь, что <script src="config.js"></script> добавлен в HTML.');
    throw new Error('Configuration not loaded');
}

const SUPABASE_URL = window.APP_CONFIG.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.APP_CONFIG.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL или SUPABASE_ANON_KEY не настроены в config.js');
}

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getClient(userId) {
    const { data, error } = await supabase.from('clients').select('*').eq('id', userId).single();
    if (error) {
        console.error('Error fetching client:', error);
        return null;
    }
    return data;
}

export async function getActiveRental(userId) {
    const { data, error } = await supabase
        .from('rentals')
        .select('*, tariffs(duration_days)')
        .eq('user_id', userId)
        .in('status', ['active', 'overdue', 'pending_return'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Rental fetch error:", error);
        return null;
    }
    return data;
}

export async function createPayment(userId, bikeId, tariffId) {
    const response = await fetch('/api/payments', {
        method: 'POST',
        body: JSON.stringify({ action: 'create-payment', userId, bikeId, tariffId })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Неизвестная ошибка сервера');
    }
    return data;
}
