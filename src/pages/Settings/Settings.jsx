import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./Settings.css";

function Settings() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    avatarUrl: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, username, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile({
            fullName: data.full_name || "",
            username: data.username || "",
            avatarUrl: data.avatar_url || "",
          });
        }
      }
    } catch (err) {
      console.error("Profilni yuklashda xatolik:", err);
      setMessage({ type: "error", text: `Profil yuklanmadi: ${err.message || err}` });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Foydalanuvchi topilmadi");
      
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            full_name: profile.fullName,
            username: profile.username,
            avatar_url: profile.avatarUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      setMessage({ type: "success", text: "Profil sozlamalari muvaffaqiyatli saqlandi!" });
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage({ type: "error", text: err.message || "Saqlashda xatolik yuz berdi!" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="settings-loading">Yuklanmoqda...</div>;

  return (
    <div className="settings-container">
      <h2>Profil Sozlamalari</h2>
      {message.text && (
        <div className={`settings-alert ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleUpdate} className="settings-form">
        <div className="form-group">
          <label>To'liq ism</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            placeholder="Ismingizni kiriting"
            required
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            placeholder="username"
            required
          />
        </div>

        <div className="form-group">
          <label>Avatar URL (Rasm havolasi)</label>
          <input
            type="text"
            value={profile.avatarUrl}
            onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <button type="submit" className="settings-btn" disabled={updating}>
          {updating ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
        </button>
      </form>
    </div>
  );
}

export default Settings;