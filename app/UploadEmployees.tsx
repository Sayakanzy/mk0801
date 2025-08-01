'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const UploadHealthCheckups = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];

        let added = 0;
        let skipped = 0;

        for (const row of rows) {
          const {
            employeeId,
            name,
            gender,
            department,
            restriction,
            bmi,
            systolic,
            diastolic,
            hemoglobin,
            ast,
            ggt,
            triglycerides,
            ldl,
            hba1c,
            age,
          } = row;

          if (!employeeId || !name) {
            skipped++;
            continue;
          }

          const q = query(
            collection(db, 'health_checkups'),
            where('employeeId', '==', employeeId)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            skipped++;
            continue;
          }

          await addDoc(collection(db, 'health_checkups'), {
            employeeId,
            name,
            gender,
            department,
            restriction,
            bmi: Number(bmi),
            systolic: Number(systolic),
            diastolic: Number(diastolic),
            hemoglobin: Number(hemoglobin),
            ast: Number(ast),
            ggt: Number(ggt),
            triglycerides: Number(triglycerides),
            ldl: Number(ldl),
            hba1c: Number(hba1c),
            age: Number(age),
          });

          added++;
        }

        setMessage(`✅ 登録完了: ${added}件追加、${skipped}件スキップ`);
      },
      error: (error) => {
        console.error('CSV読み込みエラー:', error);
        setMessage('❌ CSVの読み込みに失敗しました');
      },
    });
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        健康診断CSVアップロード
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default UploadHealthCheckups;
