import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch videos stats
  const { data: videos, error } = await supabase
    .from('videos')
    .select('status, workflow_type')
    .order('created_at', { ascending: false });

  const stats = videos?.reduce((acc, video) => {
    acc[video.status] = (acc[video.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const statuses = ['idea', 'script', 'voiceover', 'video', 'thumbnail', 'ready', 'uploaded'];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">🎬 YouTube Video Staging</h1>
            <div className="flex gap-4">
              <Link href="/videos" className="text-gray-700 hover:text-gray-900">
                Відео
              </Link>
              <Link href="/workflows" className="text-gray-700 hover:text-gray-900">
                Workflow
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-gray-700 hover:text-gray-900">
                  Вийти
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statuses.map(status => (
            <div key={status} className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold">{stats[status] || 0}</div>
              <div className="text-gray-600 capitalize">{status}</div>
            </div>
          ))}
        </div>

        {/* Pipeline Kanban Board */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statuses.slice(0, 4).map(status => (
              <div key={status} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 capitalize">{status}</h3>
                <p className="text-sm text-gray-600">{stats[status] || 0} відео</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link 
              href="/videos/new"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              + Нове відео
            </Link>
          </div>
        </div>

        {/* Recent Videos */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Останні відео</h2>
          {!videos || videos.length === 0 ? (
            <p className="text-gray-600">Поки немає відео. Створіть перше!</p>
          ) : (
            <div className="space-y-2">
              {videos.slice(0, 5).map(video => (
                <div key={video.status} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="capitalize">{video.status}</span>
                  <span className="text-sm text-gray-600">{video.workflow_type}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link href="/videos" className="text-blue-600 hover:text-blue-700">
              Переглянути всі →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
