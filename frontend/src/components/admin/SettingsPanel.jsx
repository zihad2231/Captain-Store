import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/api';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({ activeTheme: 'default', bannerText: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await updateSettings(settings);
      if (updated) {
        setMessage('Settings saved successfully! Refresh page to see changes if theme was updated.');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (err) {
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading Settings...</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h4 className="mb-4">Store Settings</h4>
        
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="form-label fw-bold">Active Theme</label>
            <select 
              className="form-select"
              value={settings.activeTheme}
              onChange={(e) => setSettings({ ...settings, activeTheme: e.target.value })}
            >
              <option value="default">Default Theme (Minimal)</option>
              <option value="stylish">Stylish Theme (Modern/Vibrant)</option>
            </select>
            <div className="form-text">Choose the primary design language for your store.</div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Special Offer Banner Text</label>
            <input 
              type="text" 
              className="form-control"
              value={settings.bannerText}
              onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
              placeholder="e.g., Free Shipping on all orders!"
            />
            <div className="form-text">This text appears at the very top of the website. Leave empty to hide banner.</div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;
