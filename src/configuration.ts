export default () => ({
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'defaultSecretKey',
  // Thêm các key khác nếu cần
});
