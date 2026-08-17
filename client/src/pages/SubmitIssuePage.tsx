import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useWards } from '../hooks/useWards';

export default function SubmitIssuePage() {
  const navigate = useNavigate();
  const { data: wards } = useWards();

  const [description, setDescription] = useState('');
  const [wardId, setWardId] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5MB');
      return;
    }
    setPhoto(file);
    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const { data } = await api.post('/api/issues/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhotoUrl(data.data.url);
    } catch {
      // Photo upload failed — issue can still be submitted without it
      setError('Photo upload failed. You can still submit without it.');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 20) {
      setError('Description must be at least 20 characters.');
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

  // Success state
  if (result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-text-high font-bold text-xl mb-2">Issue Submitted!</h2>
          <p className="text-text-muted text-sm mb-4">
            AI has analyzed your report and assigned a category.
          </p>
          <div className="bg-surface-high rounded-xl p-4 text-left mb-6 space-y-2">
            <Row label="Category" value={result.category?.toUpperCase()} color="text-primary" />
            <Row label="AI Summary" value={result.ai_summary} />
            <Row label="Severity" value={result.severity_hint?.toUpperCase()} color={
              result.severity_hint === 'high' ? 'text-danger' :
              result.severity_hint === 'medium' ? 'text-warning' : 'text-success'
            } />
            {result.hotspot_triggered && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg px-3 py-2 text-red-400 text-xs font-semibold mt-2">
                🔴 HOTSPOT TRIGGERED — 3+ reports in this ward/category!
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/issues/${result.id}`)} className="btn-primary flex-1 text-sm">
              Track Issue
            </button>
            <button onClick={() => navigate('/home')} className="btn-secondary flex-1 text-sm">
              View Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <button onClick={() => navigate('/home')} className="text-text-muted text-sm hover:text-text-high mb-6 flex items-center gap-1">
          ← Back to map
        </button>
        <h1 className="text-text-high font-bold text-2xl mb-2">Report an Issue</h1>
        <p className="text-text-muted text-sm mb-8">
          Describe the problem and our AI will automatically categorize it.
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Description */}
          <div>
            <label className="text-text-muted text-xs font-semibold uppercase tracking-wide block mb-2">
              Describe the problem *
            </label>
            <textarea
              className="input min-h-28 resize-none"
              placeholder="e.g. Large pothole near the post office on Main Street, about 2 feet wide..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={500}
              required
            />
            <div className="flex justify-between mt-1">
              <p className="text-text-muted text-xs">AI will auto-categorize from your description</p>
              <span className={`text-xs ${description.length < 20 ? 'text-danger' : 'text-text-muted'}`}>
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Ward selector */}
          <div>
            <label className="text-text-muted text-xs font-semibold uppercase tracking-wide block mb-2">
              Select Ward *
            </label>
            <select
              className="input"
              value={wardId}
              onChange={e => setWardId(e.target.value)}
              required
            >
              <option value="">— Choose your ward —</option>
              {(wards ?? []).map((w: any) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          {/* Photo upload */}
          <div>
            <label className="text-text-muted text-xs font-semibold uppercase tracking-wide block mb-2">
              Add Photo (optional)
            </label>
            <label className="flex items-center gap-3 cursor-pointer bg-surface border border-dashed border-border rounded-lg px-4 py-4 hover:border-primary/60 transition-colors">
              <span className="text-2xl">📷</span>
              <div>
                <p className="text-text-high text-sm font-medium">
                  {photo ? photo.name : 'Upload a photo'}
                </p>
                <p className="text-text-muted text-xs">JPEG, PNG or WebP · Max 5MB</p>
              </div>
              {photoUploading && (
                <div className="ml-auto w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
              {photoUrl && !photoUploading && <span className="ml-auto text-success">✓</span>}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>

          {/* Feature pills */}
          <div className="flex gap-3 text-text-muted text-xs">
            <span>✓ Category assigned by AI</span>
            <span>✓ Appears on map instantly</span>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting || description.length < 20 || !wardId}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting + running AI...
              </span>
            ) : (
              'Submit Issue →'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value, color = 'text-text-high' }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
