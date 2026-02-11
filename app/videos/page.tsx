import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Video } from '@/types/database';

export default async function VideosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
  }

  const statusColors: Record<string, string> = {
    idea: 'bg-gray-100 text-gray-800',
    script: 'bg-blue-100 text-blue-800',
    voiceover: 'bg-purple-100 text-purple-800',
    video: 'bg-yellow-100 text-yellow-800',
    thumbnail: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    uploaded: 'bg-teal-100 text-teal-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold">
              🎬 YouTube Video Staging
            </Link>
            <div className="flex gap-4">
              <Link href="/videos" className="text-blue-600 font-semibold">
                Відео
              </Link>
              <Link href="/workflows" className="text-gray-700 hover:text-gray-900">
                Workflow
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Всі відео</h1>
          <Link
            href="/videos/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + Створити відео
          </Link>
        </div>

        {!videos || videos.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-xl text-gray-600 mb-4">
              Поки немає відео
            </p>
            <p className="text-gray-500 mb-6">
              Почніть створювати контент для YouTube!
            </p>
            <Link
              href="/videos/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Створити перше відео
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Назва
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Створено
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {videos.map((video: Video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {video.title || 'Без назви'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[video.status]}`}>
                        {video.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {video.workflow_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(video.created_at).toLocaleDateString('uk-UA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/videos/${video.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Редагувати
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
