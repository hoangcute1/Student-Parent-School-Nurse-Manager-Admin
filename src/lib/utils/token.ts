// utils/token.ts
export function decodeToken(token: string) {
  try {
    // JWT có dạng: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Giải mã phần payload (phần 2)
    const payload = atob(parts[1]);
    return JSON.parse(payload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function storeTokenInfo(token: string) {
  const decoded = decodeToken(token);
  
  if (!decoded) return false;
  
  // Lấy thông tin từ token
  const { id, email, role } = decoded;
  
  if (!id || !email || !role) {
    console.error("Token doesn't contain required fields");
    return false;
  }
  
  // Lưu thông tin vào localStorage
  localStorage.setItem("user-id", id);
  localStorage.setItem("user-email", email);
  localStorage.setItem("user-role", role);
  
  // Lưu token
  localStorage.setItem("authToken", token);
  
  console.log("Token info stored successfully:", { id, email, role });
  return true;
}