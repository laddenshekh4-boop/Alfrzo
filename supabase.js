// Alfrzo Supabase Client Connection
// Connects to existing Supabase project using credentials from config.js
// Phase 1: Read-only access to rooms table
// Safe fallback to demo data if connection fails

(function() {
  'use strict';

  // Wait for config.js to load credentials
  if (!window.ROOMLY_SUPABASE_URL || !window.ROOMLY_SUPABASE_KEY) {
    console.warn('Alfrzo: Supabase credentials not found in config.js. Using demo data.');
    return;
  }

  // Wait for Supabase library to load from CDN
  const waitForSupabase = setInterval(() => {
    if (window.supabase && window.supabase.createClient) {
      clearInterval(waitForSupabase);
      initSupabaseClient();
    }
  }, 50);

  // Timeout after 3 seconds - fallback to demo data
  setTimeout(() => {
    if (!window.supabaseClient) {
      console.warn('Alfrzo: Supabase library failed to load. Using demo data.');
      clearInterval(waitForSupabase);
    }
  }, 3000);

  function initSupabaseClient() {
    try {
      // Create Supabase client using credentials from config.js
      window.supabaseClient = window.supabase.createClient(
        window.ROOMLY_SUPABASE_URL,
        window.ROOMLY_SUPABASE_KEY
      );
      
      console.log('Alfrzo: Supabase client initialized successfully.');
      console.log('Project:', window.ROOMLY_SUPABASE_URL.split('/')[2]);
      
      // TEST: Verify connection with safe read-only query
      testSupabaseConnection();
    } catch (error) {
      console.error('Alfrzo: Failed to initialize Supabase client:', error.message);
      window.supabaseClient = null;
    }
  }

  // Safe read-only test query (no write, no auth required)
  async function testSupabaseConnection() {
    if (!window.supabaseClient) return;

    try {
      const { data, error } = await window.supabaseClient
        .from('rooms')
        .select('id', { count: 'exact', head: true })
        .limit(1);

      if (error) {
        console.warn('Alfrzo: Supabase rooms table not accessible:', error.message);
        console.log('This is normal in Phase 1. Using demo data.');
        return;
      }

      console.log('Alfrzo: Supabase connection verified. Rooms table is accessible.');
      window.supabaseConnected = true;
    } catch (error) {
      console.warn('Alfrzo: Connection test failed:', error.message);
    }
  }

  // Public API for safe SELECT queries (read-only only)
  window.supabaseQuery = {
    async getRooms() {
      if (!window.supabaseClient) return null;
      try {
        const { data, error } = await window.supabaseClient
          .from('rooms')
          .select('*')
          .eq('active', true)
          .order('id', { ascending: true });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Alfrzo: Failed to fetch rooms:', error.message);
        return null;
      }
    },

    async getRoomsByCity(city) {
      if (!window.supabaseClient) return null;
      try {
        const { data, error } = await window.supabaseClient
          .from('rooms')
          .select('*')
          .eq('city', city)
          .eq('active', true)
          .order('id', { ascending: true });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Alfrzo: Failed to fetch rooms by city:', error.message);
        return null;
      }
    }
  };

  console.log('Alfrzo: Supabase module loaded. Waiting for library...');
})();
