"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TestPage() {
  const [users, setUsers] = useState<any>(null);
  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(res => setUsers(res.data))
      .catch(err => setUsers({ error: String(err) }));
  }, []);

  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Test API: /users</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
        {Array.isArray(users)
          ? users.map((user: any, idx: number) => (
              <div key={user.id || idx} className="bg-white rounded shadow p-4 border flex flex-col gap-2">
                <div className="font-semibold text-lg">{user.name}</div>
                <div className="text-gray-500 text-sm">{user.email}</div>
              </div>
            ))
          : <div className="col-span-full"><pre className="bg-gray-100 rounded p-4 overflow-x-auto text-xs text-left">{users ? JSON.stringify(users, null, 2) : "Đang tải dữ liệu từ API..."}</pre></div>
        }
      </div>
    </div>
  );
}
