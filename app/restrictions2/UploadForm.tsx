"use client";

import React from "react";
import Papa, { ParseResult } from "papaparse";
import { db } from '@/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export type HealthCheckRow = {
  氏名: string;
  社員番号: string;
  所属: string;
  年度: string;
  性別: string;
  年齢: string;
  BMI: string;
  血圧_上: string;
  血圧_下: string;
  中性脂肪: string;
  LDLコレステロール: string;
  HbA1c: string;
  AST: string;
  ALT: string;
  γGTP: string;
  受診日: string;
  就業制限: string;
};

const UploadForm2 = () => {
  const normalize = (label: string) => {
    return label
      .replace(/\r?\n/g, "")
      .replace(/（.*?）/g, "") // 全角の()削除
      .replace(/[\s_]/g, "")
      .toLowerCase();
  };

  const handleUpload = () => {
    const fileInput = document.getElementById("csvFile") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: ParseResult<HealthCheckRow>) => {
        const rows = results.data;
        let added = 0;
        let skipped = 0;

        for (const rawRow of rows) {
          const employeeId = rawRow["社員番号"];
          const year = rawRow["年度"];
          if (!employeeId || !year) continue;

          const q = query(
            collection(db, "restrictions_checkups_2"),
            where("社員番号", "==", employeeId),
            where("年度", "==", year)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            skipped++;
            continue;
          }

          await addDoc(collection(db, "restrictions_checkups_2"), rawRow);
          added++;
        }

        alert(`✅ 登録完了: ${added}件追加、${skipped}件スキップ`);
      },
    });
  };

  return (
    <div className="p-4">
      <input type="file" id="csvFile" accept=".csv" className="mb-2" />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        アップロード
      </button>
    </div>
  );
};

export default UploadForm2;
