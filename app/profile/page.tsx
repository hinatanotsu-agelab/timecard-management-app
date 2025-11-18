'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfilePage() {
  const router = useRouter();
  const { userProfile, loading } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!userProfile) {
      router.push('/login/part-time');
      return;
    }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', userProfile.uid));
        if (snap.exists()) {
          const u = snap.data() as any;
          setDisplayName(u.displayName || '');
          setEmail(u.email || userProfile.email || '');
          setPhoneNumber(u.phoneNumber || '');
          setAvatarSeed(u.avatarSeed || (u.displayName || userProfile.uid));
          setAvatarBackgroundColor(u.avatarBackgroundColor || '');
        } else {
          setDisplayName(userProfile.displayName || '');
          setEmail(userProfile.email || '');
          setAvatarSeed(userProfile.displayName || userProfile.uid);
        }
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, [loading, userProfile, router]);

  const save = async () => {
    if (!userProfile) return;
    if (!displayName.trim()) {
      alert('表示名を入力してください');
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userProfile.uid), {
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
        avatarSeed: avatarSeed.trim() || displayName.trim() || userProfile.uid,
        avatarBackgroundColor: avatarBackgroundColor.trim(),
        updatedAt: Timestamp.now(),
      } as any);
      alert('保存しました');
      router.back();
    } catch (e) {
      console.error('[Profile] save error', e);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) return null;

  const avatarUrl = (seed: string, bgColor?: string) => {
    const base = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}`;
    const params = bgColor ? `&backgroundColor=${encodeURIComponent(bgColor)}` : '&backgroundType=gradientLinear';
    return `${base}${params}&fontWeight=700&radius=50`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
          <button onClick={() => router.back()} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">戻る</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center gap-4">
            <img src={avatarUrl(avatarSeed || displayName || userProfile.uid, avatarBackgroundColor)} alt="avatar" className="w-16 h-16 rounded-full ring-1 ring-gray-200" />
            <div>
              <p className="text-sm text-gray-600">プレビュー（DiceBear）</p>
              <p className="text-xs text-gray-500">表示名/シードを変更すると自動で更新されます</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 山田 太郎"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メール（変更不可）</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電話番号（任意）</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 090-1234-5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">アバターシード（任意）</label>
            <input
              type="text"
              value={avatarSeed}
              onChange={(e) => setAvatarSeed(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="表示名ベースで自動生成されます"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">アバター背景色（任意）</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={avatarBackgroundColor}
                onChange={(e) => setAvatarBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: FF5733, blue, rgb(100,150,200)"
              />
              <input
                type="color"
                value={avatarBackgroundColor.startsWith('#') ? avatarBackgroundColor : `#${avatarBackgroundColor}`}
                onChange={(e) => setAvatarBackgroundColor(e.target.value.substring(1))}
                className="w-12 h-10 border rounded cursor-pointer"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">空欄の場合はグラデーション背景になります</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className={`px-4 py-2 rounded ${saving ? 'bg-gray-300 text-gray-600' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >{saving ? '保存中...' : '保存'}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
