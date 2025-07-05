export default () => ({
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'defaultSecretKey',
  GOOGLE_EMAIL: process.env.GOOGLE_EMAIL || '',
  GOOGLE_PASSWORD: process.env.GOOGLE_PASSWORD || '',

  // Thêm các key khác nếu cần
});
