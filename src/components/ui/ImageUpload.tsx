import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
}

export function ImageUpload({ value, onChange, bucket = 'images' }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!supabase) return;
    setIsUploading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError('Upload failed. Check Supabase Storage bucket "' + bucket + '" exists.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) uploadFile(file);
  }

  return (
    <div className="space-y-2">
      {value && (
        <img src={value} alt="" className="w-32 h-20 object-cover rounded border border-white/10" />
      )}
      <div
        className={`border-2 border-dashed rounded p-4 text-center transition-colors cursor-pointer ${
          isDragging ? 'border-white/60 bg-white/10' : 'border-white/20 hover:border-white/40'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex items-center justify-center gap-3">
          <span className="px-3 py-1.5 bg-white/10 text-white text-xs rounded hover:bg-white/20 pointer-events-none">
            {isUploading ? 'アップロード中...' : '参照'}
          </span>
          <span className="text-white/30 text-xs">またはここにドロップ</span>
        </div>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <input
        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="または URL を直接入力"
      />
    </div>
  );
}
