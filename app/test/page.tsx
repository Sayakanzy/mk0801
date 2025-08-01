'use client';

import { useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // ← 必要に応じてパス修正

export default function TestPage() {
  useEffect(() => {
    const test = async () => {
      try {
        const docRef = await addDoc(collection(db, 'testCollection'), {
          name: 'テストユーザー',
          createdAt: new Date(),
        });
        console.log('✅ 書き込み成功:', docRef.id);
      } catch (e) {
        console.error('❌ 書き込み失敗:', e);
      }
    };
    test();
  }, []);

  return <div className="p-6 text-xl">Firestore 書き込みテスト中</div>;
}
