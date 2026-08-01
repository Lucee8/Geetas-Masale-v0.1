import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Trash2, CheckCircle, Save, Smartphone, QrCode, CreditCard, Copy, RefreshCw } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function PaymentSettings() {
  const [settings, setSettings] = useState({
    upiId: '',
    qrImage: '',
    merchantName: '',
    paymentNote: 'Order Payment',
    amountBehavior: 'dynamic',
    fixedAmount: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'payment_settings'));
      if (snap.exists()) {
        setSettings(prev => ({ ...prev, ...snap.data() }));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (settings.upiId && !settings.upiId.includes('@')) {
      showToast('Invalid UPI ID format. Must include @', 'error');
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'payment_settings'), settings, { merge: true });
      showToast('Payment settings saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save settings.', 'error');
    }
    setSaving(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      showToast('File size must be less than 2MB', 'error');
      return;
    }
    
    if (!storage) {
      showToast('Storage not configured', 'error');
      return;
    }

    const storageRef = ref(storage, `payment_qrs/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
        showToast('QR Upload failed', 'error');
        setUploadProgress(0);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setSettings(prev => ({ ...prev, qrImage: downloadURL }));
        setUploadProgress(0);
        showToast('QR Uploaded successfully', 'success');
      }
    );
  };

  if (loading) return <div className="p-8 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>;

  const previewAmount = settings.amountBehavior === 'fixed' && settings.fixedAmount ? settings.fixedAmount : '1,250.00';

  return (
    <div className="w-full">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-bold flex items-center space-x-2 ${
          toast.type === 'success' ? 'bg-[#EBFDFB] text-[#1E6B65] border-[#C6F7F2]' : 'bg-red-50 text-red-600 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-sans font-black text-slate-900 tracking-tight flex items-center gap-3">
              Payment Settings
            </h1>
            <p className="text-[11px] sm:text-xs font-mono font-medium text-slate-400 mt-1 uppercase tracking-widest">
              Dynamic UPI & QR Code Management
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* VPA Address */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <span>1. UPI ID (VPA)</span>
              </h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={settings.upiId}
                  onChange={e => setSettings(prev => ({ ...prev, upiId: e.target.value }))}
                  placeholder="e.g. username@bank"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(settings.upiId);
                    showToast('UPI ID copied', 'success');
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center space-x-2 transition-all"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, upiId: '' }))}
                  className="px-4 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* QR Upload */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-slate-400" />
                <span>2. QR Code Upload</span>
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                  <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer overflow-hidden group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-slate-400 mb-3 group-hover:text-indigo-500 transition-colors" />
                      <p className="mb-2 text-sm text-slate-500"><span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-slate-400">PNG, JPG, WEBP (Max 2MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileUpload} />
                    {uploadProgress > 0 && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="w-3/4 bg-slate-200 rounded-full h-2.5">
                          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </label>
                  <div className="mt-4 flex space-x-3">
                    <button onClick={() => setSettings(prev => ({ ...prev, qrImage: '' }))} className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-all">Remove QR</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>3. Payment Configuration</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Amount Behavior</label>
                  <select
                    value={settings.amountBehavior}
                    onChange={e => setSettings(prev => ({ ...prev, amountBehavior: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-sans text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="dynamic">✓ Dynamic (Current Order Total)</option>
                    <option value="fixed">○ Fixed Amount</option>
                  </select>
                </div>
                
                {settings.amountBehavior === 'fixed' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Fixed Amount (₹)</label>
                    <input
                      type="number"
                      value={settings.fixedAmount}
                      onChange={e => setSettings(prev => ({ ...prev, fixedAmount: e.target.value }))}
                      placeholder="e.g. 500"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </motion.div>
                )}

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">4. Merchant Name</label>
                  <input
                    type="text"
                    value={settings.merchantName}
                    onChange={e => setSettings(prev => ({ ...prev, merchantName: e.target.value }))}
                    placeholder="e.g. Geeta's Masale"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-sans text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">5. Payment Note</label>
                  <input
                    type="text"
                    value={settings.paymentNote}
                    onChange={e => setSettings(prev => ({ ...prev, paymentNote: e.target.value }))}
                    placeholder="e.g. Order Payment"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-sans text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 sticky top-32">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center space-x-2 text-center justify-center">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <span>Live QR Preview</span>
              </h2>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                <div className="w-48 h-48 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-4 overflow-hidden relative">
                  {settings.qrImage ? (
                    <img src={settings.qrImage} alt="QR Code" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                      <QrCode className="w-16 h-16 opacity-50" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1 w-full">
                  <h3 className="text-lg font-bold text-slate-900 truncate px-2">{settings.merchantName || 'Merchant Name'}</h3>
                  <p className="text-sm text-slate-500 font-mono truncate px-2">{settings.upiId || 'username@bank'}</p>
                </div>
                
                <div className="mt-6 w-full pt-4 border-t border-slate-200/60">
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-bold">Total Amount</div>
                  <div className="text-2xl font-black text-slate-800 tracking-tight">₹{previewAmount}</div>
                  <div className="text-[10px] text-slate-400 mt-1 italic">{settings.paymentNote || 'Order Payment'}</div>
                </div>
                
                <button disabled className="mt-6 w-full py-3 bg-slate-800 text-white text-xs font-bold uppercase rounded-xl opacity-80 flex items-center justify-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Pay Via UPI App</span>
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
