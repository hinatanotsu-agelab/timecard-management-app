'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import OrganizationSelector from '@/components/OrganizationSelector';

export default function PartTimeDashboard() {
  const { userProfile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!userProfile) {
        router.push('/login/part-time');
      } else if (!userProfile.organizationIds || userProfile.organizationIds.length === 0) {
        router.push('/join-organization');
      }
    }
  }, [userProfile, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!userProfile || !userProfile.organizationIds || userProfile.organizationIds.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">アルバイトダッシュボード</h1>
            <OrganizationSelector />
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            ログアウト
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* シフト提出カード */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">シフト提出</h2>
            <p className="text-gray-600 mb-4">今月のシフトを提出しましょう</p>
            <button
              onClick={() => router.push('/shifts/submit')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              シフトを提出
            </button>
          </div>

          {/* シフト一覧カード */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">シフト一覧</h2>
            <p className="text-gray-600 mb-4">提出したシフトを確認</p>
            <button onClick={() => router.push('/shifts/my')} className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              シフトを見る
            </button>
          </div>

          {/* 給与一覧カード */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">給与一覧</h2>
            <p className="text-gray-600 mb-4">給与の詳細を確認</p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
              給与を見る
            </button>
          </div>

          {/* 見込み給与カード */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">今月の見込み給与</h2>
            <p className="text-3xl font-bold text-gray-900 mb-2">¥0</p>
            <p className="text-sm text-gray-600">承認済みシフト: 0時間</p>
          </div>

          {/* タイムカードカード */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">タイムカード</h2>
            <p className="text-gray-600 mb-4">出退勤の打刻</p>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
              打刻する
            </button>
          </div>

          {/* プロフィールカード */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">プロフィール</h2>
            <p className="text-sm text-gray-600 mb-2">メール: {userProfile.email}</p>
            <p className="text-sm text-gray-600 mb-4">
              所属組織数: {userProfile.organizationIds?.length || 0}
            </p>
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
              設定
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
