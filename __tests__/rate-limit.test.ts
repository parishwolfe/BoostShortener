import { rateLimit } from '../src/lib/rate-limit';

describe('rateLimit', () => {
    it('should allow requests below the limit', async () => {
        const limit = 5;
        const token = 'test-token-1';
        const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

        for (let i = 0; i < limit; i++) {
            await expect(limiter.check(limit, token)).resolves.not.toThrow();
        }
    });

    it('should block requests exceeding the limit', async () => {
        const limit = 2;
        const token = 'test-token-2';
        const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

        await limiter.check(limit, token); // 1
        await limiter.check(limit, token); // 2

        // 3rd request should fail
        await expect(limiter.check(limit, token)).rejects.toBeUndefined();
    });

    it('should separate limits by token', async () => {
        const limit = 2;
        const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

        await limiter.check(limit, 'user-A');
        await limiter.check(limit, 'user-A');
        await expect(limiter.check(limit, 'user-A')).rejects.toBeUndefined();

        // user-B should still be fine
        await expect(limiter.check(limit, 'user-B')).resolves.not.toThrow();
    });
});
