'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { WorkflowType, VideoStatus } from '@/types/database';

export default function NewVideo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const workflow_type = formData.get('workflow_type') as WorkflowType;
    const status = formData.get('status') as VideoStatus;
    const script = formData.get('script') as string;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        title,
        workflow_type,
        status,
        script: script || null,
        description: null,
        tags: [],
        voiceover_url: null,
        video_url: null,
        thumbnail_url: null,
        youtube_video_id: null,
        channel_id: null,
        scheduled_at: null,
        uploaded_at: null,
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/videos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="text-xl font-bold">
              🎬 YouTube Video Staging
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Створити нове відео</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Назва відео *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Наприклад: Як працює AI в 2024"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="workflow_type" className="block text-sm font-medium mb-2">
              Тип workflow *
            </label>
            <select
              id="workflow_type"
              name="workflow_type"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semi-auto">НАПІВ-АВТО (Semi-Auto)</option>
              <option value="full-auto">FULL-AUTO</option>
              <option value="empire">EMPIRE MODE</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Початковий статус *
            </label>
            <select
              id="status"
              name="status"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="idea">Ідея</option>
              <option value="script">Скрипт</option>
              <option value="voiceover">Озвучка</option>
              <option value="video">Відео</option>
              <option value="thumbnail">Thumbnail</option>
              <option value="ready">Готово</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="script" className="block text-sm font-medium mb-2">
              Скрипт (опціонально)
            </label>
            <textarea
              id="script"
              name="script"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Вставте скрипт відео тут..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Створення...' : 'Створити відео'}
            </button>
            <a
              href="/videos"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Скасувати
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}
