'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import UploadForm2 from './UploadForm';

const calculateAge = (birthdate: string): number => {
  const birth = new Date(birthdate);
  const refDate = new Date('2024-12-31');
  let age = refDate.getFullYear() - birth.getFullYear();
  const m = refDate.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && refDate.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'restrictions_checkups_2'));
      const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(results);
    };
    fetchData();
  }, []);

  const filtered = data.filter((item) =>
    [item.name, item.id, item.department, item['検診実施年月日'], item.checkup_date]
      .some((field) => field?.toString().includes(search))
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">就業制限者リスト（詳細版）</h1>
      <UploadForm2 />
      <input
        type="text"
        placeholder="氏名・社員番号などで検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mt-4 w-full"
      />
      <table className="table-auto w-full mt-4 border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">氏名</th>
            <th className="border p-2">社員番号</th>
            <th className="border p-2">受診日</th>
            <th className="border p-2">所属</th>
            <th className="border p-2">性別</th>
            <th className="border p-2">生年月日</th>
            <th className="border p-2">年齢</th>
            <th className="border p-2">就業制限</th>
            <th className="border p-2">BMI</th>
            <th className="border p-2">血圧（上）</th>
            <th className="border p-2">血圧（下）</th>
            <th className="border p-2">LDL</th>
            <th className="border p-2">中性脂肪</th>
            <th className="border p-2">HbA1c</th>
            <th className="border p-2">AST</th>
            <th className="border p-2">ALT</th>
            <th className="border p-2">γGTP</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => {
            const isRestricted = item.restriction && !item.restriction.includes('通常勤務可');
            return (
              <tr key={item.id} className={isRestricted ? 'bg-red-100' : ''}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item['検診実施年月日'] || item.checkup_date || '―'}</td>
                <td className="border p-2">{item.department || '―'}</td>
                <td className="border p-2">{item.gender || '―'}</td>
                <td className="border p-2">{item.birthdate || '―'}</td>
                <td className="border p-2">{item.birthdate ? calculateAge(item.birthdate) : '―'}</td>
                <td className="border p-2">
                  {isRestricted ? (
                    <span className="text-red-600 font-semibold">{item.restriction}</span>
                  ) : (
                    item.restriction || '―'
                  )}
                </td>
                <td className="border p-2">{item.bmi || '―'}</td>
                <td className="border p-2">{item.blood_pressure_upper || '―'}</td>
                <td className="border p-2">{item.blood_pressure_lower || '―'}</td>
                <td className="border p-2">{item.ldl || item['ldlコレステロール'] || '―'}</td>
                <td className="border p-2">{item.triglyceride || item['中性脂肪'] || '―'}</td>
                <td className="border p-2">{item.hba1c || item['hba1c'] || '―'}</td>
                <td className="border p-2">{item.ast || item['got'] || '―'}</td>
                <td className="border p-2">{item.alt || item['gpt'] || '―'}</td>
                <td className="border p-2">{item.ggt || item['γgtp'] || item['γgtp（結果値）'] || '―'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
