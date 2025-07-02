'use client';

import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { storeAuthData } from '@/lib/auth';
import { handleTokenLoginSuccess } from '@/lib/api/auth/token';

const clientId = '485501319962-sh11atcehvgcfdfeoem7fv6igdqql6ud.apps.googleusercontent.com';

function LoginGoogle() {
  const router = useRouter();

  const handleSuccess = (response: any) => {
    // response.credential là token Google trả về
    if (!response.credential) {
      alert('Không có credential từ Google');
      return;
    }

    fetch('http://localhost:3001/auth/login-google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Login successful:', data);
        // Lưu thông tin xác thực nếu cần
        storeAuthData(data); // hoặc storeAuthData(data.token) tùy backend trả về
        // Redirect dựa vào role nếu có
        if (data.user.role === 'parent') {
          handleTokenLoginSuccess(data.tokens.accessToken);
          router.push('/dashboard');
        } else if (data.user.role === 'staff') {
          handleTokenLoginSuccess(data.tokens.accessToken);
          router.push('/cms');
        } else if (data.user.role === 'admin') {
          handleTokenLoginSuccess(data.tokens.accessToken);
          router.push("/cmscopy");
        } else {
          throw new Error('Không hợp lệ');
        }
      })
      .catch((e) => {console.log(e); alert('Đăng nhập thất bại')});
  };

  const handleFailure = () => {
    alert('Google login failed');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
        {/* <h2>Đăng nhập phụ huynh bằng Google</h2> */}
        <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginGoogle;