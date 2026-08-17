import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface IssueFormProps {
  onSuccess?: (issueId: string) => void;
}

export const IssueForm: React.FC<IssueFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState('');
  const [ward, setWard] = useState('Dharampeth');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCiYQrg5xKfl0bnahob08EljzyOfwPe7RBUTGY1JOO-p4ahlhlcnKBPFUj0ivIUHXKkIHMHNWeZLNeab_v82u-0uwHJqPtU0fST9mURR-gMAgoULR_6taBdjfYNW4a6qdAXauO_8a5ZDis-ZpyAjbnRqlFeJBoYBRgv6ipJY4aWflgLy9-RZQ4TAUnEkrIpt1lbjT8jwj-GdJHhg_mmSrXaXf5WMoD18TzEc8-6QeMkI2NzdpEULs75aQ'
  );
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [submittedId, setSubmittedId] = useState('1042');
  const [error, setError] = useState('');

  const wards = [
    { value: 'Dharampeth', label: 'Dharampeth' },
    { value: 'Dhantoli', label: 'Dhantoli' },
    { value: 'Laxmi Nagar', label: 'Laxmi Nagar' },
    { value: 'Hanuman Nagar', label: 'Hanuman Nagar' },
    { value: 'Mangalwari', label: 'Mangalwari' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    setError('');
    setLoading(true);

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      const newId = (1000 + Math.floor(Math.random() * 900)).toString();
      setSubmittedId(newId);
      setShowToast(true);

      if (onSuccess) {
        onSuccess(newId);
      }
    }, 1200);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="surface-level-1"
        style={{
          borderRadius: '4px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Description Field */}
        <Textarea
          label="Describe the problem *"
          id="description"
          name="description"
          placeholder="Type what you see..."
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (error) setError('');
          }}
          charCount={description.length}
          maxCharCount={500}
          aiHelpText="AI will auto-categorize this issue."
          error={error}
          required
        />

        {/* Ward Selection */}
        <Select
          label="Select Ward"
          id="ward"
          name="ward"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          options={wards}
        />

        {/* Photo Upload Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            className="font-label-sm"
            style={{
              color: 'var(--on-surface)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Add Photo (Optional)
          </label>

          {!photoPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-structural)',
                backgroundColor: 'var(--bg-base)',
                borderRadius: '4px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-structural)';
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '32px', color: 'var(--on-surface-variant)' }}
              >
                photo_camera
              </span>
              <div style={{ textAlign: 'center' }}>
                <span
                  className="font-body-md"
                  style={{ color: 'var(--primary-accent)', fontWeight: 600, display: 'block' }}
                >
                  Upload Photo
                </span>
                <span
                  className="font-label-sm"
                  style={{ color: 'var(--on-surface-variant)', display: 'block', marginTop: '4px' }}
                >
                  JPEG, PNG or WebP • Max 5MB
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div
              style={{
                position: 'relative',
                border: '1px solid var(--border-structural)',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: 'var(--surface-container-lowest)'
              }}
            >
              <img
                src={photoPreview}
                alt="Uploaded issue evidence"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={removePhoto}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(17, 19, 25, 0.8)',
                  padding: '4px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-structural)',
                  color: 'var(--on-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  close
                </span>
              </button>
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-structural)', margin: '4px 0' }} />

        {/* Indicators Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-container-low)',
            padding: '12px 16px',
            borderRadius: '4px',
            border: '1px solid var(--border-structural)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="material-symbols-outlined"
              style={{ color: 'var(--primary-container)', fontSize: '20px' }}
            >
              psychology
            </span>
            <span className="font-label-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Category assigned by AI
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="material-symbols-outlined"
              style={{ color: 'var(--primary-container)', fontSize: '20px' }}
            >
              location_on
            </span>
            <span className="font-label-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Appears on map instantly
            </span>
          </div>
        </div>

        {/* Submit Action */}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          loadingText="Submitting..."
          icon="arrow_forward"
          fullWidth
          style={{
            height: '48px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 'bold',
            marginTop: '8px'
          }}
        >
          Submit Issue
        </Button>
      </form>

      {/* Success Toast */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--primary-accent)',
            color: 'var(--on-surface)',
            padding: '12px 16px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--primary-container)',
              color: '#FFFFFF',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>
              check_circle
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-label-md" style={{ color: 'var(--on-surface)' }}>
              Issue #{submittedId} submitted.
            </span>
            <button
              type="button"
              onClick={() => navigate(`/issue/${submittedId}`)}
              className="font-label-sm"
              style={{
                color: 'var(--primary)',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: 0,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Track it here.
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--on-surface-variant)',
              cursor: 'pointer',
              marginLeft: '8px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>
        </div>
      )}
    </>
  );
};
