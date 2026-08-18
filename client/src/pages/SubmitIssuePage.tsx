import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWards } from '../hooks/useWards';
import api from '../services/api';
import { CategoryCivicIcon, VoiceMicIcon } from '../components/icons/CivicIcons';
import { categoryColors, categoryLabels } from '../utils/categoryColors';

export default function SubmitIssuePage() {
  const navigate = useNavigate();
  const { data: wards } = useWards();

  const [description, setDescription] = useState('');
  const [wardId, setWardId] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5MB');
      return;
    }
    setPhoto(file);
    setPhotoUploading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      // Immediately set local preview so user sees it
      setPhotoUrl(base64Data);

      try {
        const formData = new FormData();
        formData.append('photo', file);
        const { data } = await api.post('/api/issues/upload-photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (data?.data?.url || data?.data?.photo_url) {
          setPhotoUrl(data.data.url || data.data.photo_url);
        }
      } catch {
        // Fallback to base64 Data URL so photo is guaranteed to be saved and viewable
        setPhotoUrl(base64Data);
      } finally {
        setPhotoUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 5) {
      setError('Description must be at least 5 characters.');
      return;
    }
    if (!wardId) {
      setError('Please select a ward.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/api/issues', {
        description,
        ward_id: wardId,
        photo_url: photoUrl || undefined,
      });
      setResult(data.data);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success Confirmation Card
  if (result) {
    return (
      <div className="min-h-screen bg-[#0F141C] text-[#E6EDF3] flex items-center justify-center px-4 font-sans selection:bg-[#E85D04] selection:text-white">
        <div className="hud-panel-elevated max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-[#324259]">
          <div className="w-16 h-16 rounded-2xl bg-[#4EBA6F]/15 border border-[#4EBA6F] mx-auto flex items-center justify-center text-3xl">
            ✓
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-white">Incident Ingested & Verified</h2>
            <p className="text-[#8B9BB4] text-xs mt-1">
              AI classified this report and assigned an official municipal tracking ticket.
            </p>
          </div>

          <div className="bg-[#151D28] rounded-xl p-5 text-left space-y-3 border border-[#263345]">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#8B9BB4]">TICKET ID</span>
              <span className="font-bold text-white">#{result.id?.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#8B9BB4] font-mono">ASSIGNED CATEGORY</span>
              <span className="font-display font-bold uppercase text-[#E85D04] flex items-center gap-1">
                <CategoryCivicIcon category={result.category} size={14} color={categoryColors[result.category]} />
                <span>{categoryLabels[result.category] ?? result.category}</span>
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <span className="text-[#8B9BB4] font-mono text-[10px] uppercase block">AI Telemetry Summary</span>
              <p className="text-[#E6EDF3] leading-relaxed bg-[#0F141C] p-2.5 rounded-lg border border-[#263345]">
                {result.ai_summary}
              </p>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#8B9BB4]">SEVERITY RATING</span>
              <span className="font-bold uppercase text-[#E09F3E]">{result.severity_hint ?? 'Medium'}</span>
            </div>

            {/* Attached Photo Preview */}
            {photoUrl && (
              <div className="pt-2 border-t border-[#263345]">
                <span className="text-[#8B9BB4] font-mono text-[10px] uppercase block mb-1">Attached Photo Evidence</span>
                <div className="h-28 rounded-lg overflow-hidden border border-[#263345] bg-[#0F141C]">
                  <img src={photoUrl} alt="Attached Evidence" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {result.hotspot_triggered && (
              <div className="bg-[#D9534F]/15 border border-[#D9534F]/40 rounded-lg p-2.5 text-[#D9534F] text-xs font-mono font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D9534F] animate-ping" />
                <span>HOTSPOT CLUSTER TRIGGERED (3+ in same ward)</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate(`/issues/${result.id}`)} className="btn-primary flex-1 text-xs py-2.5">
              Track Ticket
            </button>
            <button onClick={() => navigate('/home')} className="btn-secondary flex-1 text-xs py-2.5">
              View on Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F141C] text-[#E6EDF3] px-4 py-8 font-sans selection:bg-[#E85D04] selection:text-white">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/home')}
            className="text-xs font-mono text-[#8B9BB4] hover:text-[#E85D04] mb-4 flex items-center gap-1 transition-colors"
          >
            ← Return to Live Map
          </button>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Report a Civic Incident
          </h1>
          <p className="text-xs text-[#8B9BB4] mt-1">
            Describe the problem using voice or text. NVIDIA AI will auto-categorize and map your report.
          </p>
        </div>

        {error && (
          <div className="hud-panel p-3.5 border-[#D9534F]/60 text-[#D9534F] text-xs font-mono flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="hud-panel p-6 sm:p-8 space-y-5">
          {/* Description with Voice-to-Text */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono text-[#8B9BB4] uppercase font-semibold">
                Incident Description *
              </label>
              <button
                type="button"
                onClick={() => {
                  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SpeechRec) {
                    alert('Speech Recognition is supported in Chrome/Edge browsers.');
                    return;
                  }
                  const recognition = new SpeechRec();
                  recognition.lang = 'en-IN';
                  recognition.start();
                  recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setDescription(prev => (prev ? `${prev} ${transcript}` : transcript));
                  };
                }}
                className="text-xs font-mono font-bold text-[#E85D04] hover:text-white bg-[#E85D04]/10 hover:bg-[#E85D04] border border-[#E85D04]/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all animate-pulse cursor-pointer"
              >
                <VoiceMicIcon size={14} color="currentColor" />
                <span>Voice Input (Hindi / English)</span>
              </button>
            </div>

            <textarea
              className="input min-h-28 resize-none text-xs leading-relaxed"
              placeholder="e.g. Deep asphalt pothole near Dharampeth market entrance causing two-wheeler skids... (or click Voice Input)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={500}
              required
            />

            <div className="flex justify-between items-center text-xs font-mono">
              <span className={description.length < 5 ? 'text-[#E09F3E]' : 'text-[#4EBA6F]'}>
                {description.length < 5 ? '⚠️ Minimum 5 characters' : '✓ AI ready to classify'}
              </span>
              <span className="text-[#8B9BB4]">{description.length}/500</span>
            </div>
          </div>

          {/* Ward Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#8B9BB4] uppercase font-semibold block">
              Administrative Ward *
            </label>
            <select
              className="input text-xs font-mono"
              value={wardId}
              onChange={e => setWardId(e.target.value)}
              required
            >
              <option value="">— Select Nagpur Ward —</option>
              {(wards ?? []).map((w: any) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.zone} Zone)
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload with Live Thumbnail Preview */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-[#8B9BB4] uppercase font-semibold block">
              Photo Evidence (Optional)
            </label>

            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-[#263345] bg-[#0F141C] p-3 flex items-center gap-4">
                <img src={photoUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-[#324259]" />
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-display font-bold text-white truncate">{photo?.name || 'Photo Attached'}</p>
                  <span className="text-[10px] font-mono text-[#4EBA6F] block">✓ Ready to attach to incident ticket</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoUrl(null);
                    }}
                    className="text-[10px] font-mono text-[#D9534F] hover:underline pt-1"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <label className="border border-dashed border-[#263345] hover:border-[#E85D04] rounded-xl p-4 flex items-center gap-3.5 cursor-pointer transition-colors bg-[#0F141C]">
                <span className="text-2xl">📷</span>
                <div>
                  <p className="text-white text-xs font-display font-medium">
                    Upload camera photo or gallery image
                  </p>
                  <p className="text-[#8B9BB4] text-[11px] font-mono">JPEG, PNG or WebP · Max 5MB</p>
                </div>
                {photoUploading && (
                  <div className="ml-auto w-5 h-5 border-2 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary text-xs font-display font-bold py-3 flex items-center justify-center gap-2"
            disabled={submitting || description.trim().length < 5 || !wardId}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running NVIDIA AI & Spatial Indexing...</span>
              </span>
            ) : (
              <span>Submit Incident Report →</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
