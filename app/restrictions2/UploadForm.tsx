'use client';

import React, { useState } from 'react';
import { db } from '../../firebase';
import {
  doc,
  setDoc
} from 'firebase/firestore';
import Papa from 'papaparse';

const UploadForm2 = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const normalize = (label: string) => {
    return label
      .trim()
      .replace(/　/g, ' ') // 全角スペースを半角に
      .replace(/\s*\(.*?\)/g, '') // ()内を削除
      .replace(/[（）]/g, '') // 全角の()削除
      .replace(/[\s_]/g, '')
      .toLowerCase();
  };

  const handleUpload = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        let added = 0;
        let skipped = 0;

        for (const rawRow of rows) {
          const row: any = {};
          for (const key in rawRow) {
            const normKey = normalize(key);
            row[normKey] = rawRow[key]?.toString().trim();
          }

          const id = row['社員番号'] || row['id'];
          const checkupDate = row['受診日'] || row['checkupdate'] || row['年度'] || row['year'];

          if (!id || !checkupDate) {
            console.warn('スキップ: IDまたは受診日が空欄', { id, checkupDate, row });
            skipped++;
            continue;
          }

          const docId = `${id}_${checkupDate}`;
          const ref = doc(db, 'restrictions_checkups_2', docId);

          try {
            await setDoc(ref, row, { merge: true });
            console.log('✅ 登録:', docId, row);
            added++;
          } catch (error) {
            console.error('❌ Firestore登録エラー:', error, row);
            skipped++;
          }
        }

        setMessage(`✅ 登録完了: ${added} 件追加、${skipped} 件スキップ`);
      },
    });
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2">CSVアップロード（リスト2用）</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        アップロード
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default UploadForm2;
