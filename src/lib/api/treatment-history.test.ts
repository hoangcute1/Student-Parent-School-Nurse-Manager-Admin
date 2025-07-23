// Đảm bảo đã cài đặt @types/jest bằng lệnh:
// npm install --save-dev @types/jest
import { createTreatmentHistory } from './treatment-history';

// Mock fetch toàn cục
(global as any).fetch = jest.fn();

describe('createTreatmentHistory', () => {
  // Tương đương Fact
  it('should call fetch with correct params for valid data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _id: 'abc123', description: 'Test' }),
    });

    const data = { description: 'Test' };
    const result = await createTreatmentHistory(data);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/treatment-histories'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
    expect(result).toHaveProperty('_id', 'abc123');
  });

  // Tương đương Theory + InlineData
  it.each<[{ description: string }, boolean]>([
    [{ description: 'Test 1' }, true],
    [{ description: '' }, false],
  ])('should handle different input: %o', async (input, shouldSucceed) => {
    if (shouldSucceed) {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: 'id1', ...input }),
      });
      const result = await createTreatmentHistory(input);
      expect(result).toHaveProperty('_id');
    } else {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Error',
      });
      await expect(createTreatmentHistory(input)).rejects.toThrow('Error');
    }
  });
}); 