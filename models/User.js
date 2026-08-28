const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { initialUsers } = require('./initialData');

let memoryUsers = [...initialUsers];

class User {
  static async findByEmail(email) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('[User.findByEmail] Supabase error:', error);
      }
      return data || null;
    }
    return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at')
        .eq('id', id)
        .single();
      return data || null;
    }
    const user = memoryUsers.find(u => u.id === Number(id));
    if (!user) return null;
    const { password_hash, ...rest } = user;
    return rest;
  }

  static async create({ name, email, password_hash, role = 'admin' }) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email: email.toLowerCase(), password_hash, role }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const newUser = {
      id: memoryUsers.length ? Math.max(...memoryUsers.map(u => u.id)) + 1 : 1,
      name,
      email: email.toLowerCase(),
      password_hash,
      role,
      created_at: new Date().toISOString()
    };
    memoryUsers.push(newUser);
    return newUser;
  }

  static async updatePassword(id, newHash) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('users')
        .update({ password_hash: newHash, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const user = memoryUsers.find(u => u.id === Number(id));
    if (user) {
      user.password_hash = newHash;
      user.updated_at = new Date().toISOString();
      return user;
    }
    return null;
  }
}

module.exports = User;
