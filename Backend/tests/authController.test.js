process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';

const jwt = require('jsonwebtoken');

jest.mock('../services/MailService', () => ({
  sendResetEmail: jest.fn(),
  sendGenericTemplate: jest.fn(),
}));

const authController = require('../controllers/authController');

describe('authController internal functions', () => {
  let generateAccessToken, generateRefreshToken, setCookies;

  beforeAll(() => {
    if (authController.__testing) {
      generateAccessToken = authController.__testing.generateAccessToken;
      generateRefreshToken = authController.__testing.generateRefreshToken;
      setCookies = authController.__testing.setCookies;
    }
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token with id and role (Normal Case)', () => {
      const token = generateAccessToken('123', 'admin');
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe('123');
      expect(decoded.role).toBe('admin');
    });

    it('should generate an access token even if role is undefined (Edge Case)', () => {
      const token = generateAccessToken('123', undefined);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe('123');
      expect(decoded.role).toBeUndefined();
    });

    it('should fail if jwt sign fails due to invalid parameters (Invalid Case)', () => {
      // jwt.sign expects payload to be a plain object
      expect(() => {
        // Here we test what happens when jwt secret is completely missing and not provided
        // Since we mocked it above, we can temporarily remove it
        const originalSecret = process.env.JWT_SECRET;
        delete process.env.JWT_SECRET;
        try {
          generateAccessToken('123', 'admin');
        } finally {
          process.env.JWT_SECRET = originalSecret;
        }
      }).toThrow();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token with id (Normal Case)', () => {
      const token = generateRefreshToken('456');
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      expect(decoded.id).toBe('456');
    });

    it('should fallback to default secret if JWT_REFRESH_SECRET is missing (Edge Case)', () => {
      const originalSecret = process.env.JWT_REFRESH_SECRET;
      delete process.env.JWT_REFRESH_SECRET;
      
      const token = generateRefreshToken('456');
      const decoded = jwt.verify(token, 'refresh_secret_fallback');
      expect(decoded.id).toBe('456');
      
      process.env.JWT_REFRESH_SECRET = originalSecret;
    });
  });

  describe('setCookies', () => {
    let mockRes;
    
    beforeEach(() => {
      mockRes = {
        cookie: jest.fn()
      };
      // Mock console.error to avoid noise in test output
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should set access and refresh cookies with correct options (Normal Case)', () => {
      setCookies(mockRes, 'access_token_123', 'refresh_token_123');
      
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(mockRes.cookie).toHaveBeenNthCalledWith(
        1,
        'accessToken',
        'access_token_123',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
          maxAge: 4 * 60 * 1000
        })
      );
      expect(mockRes.cookie).toHaveBeenNthCalledWith(
        2,
        'refreshToken',
        'refresh_token_123',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
          maxAge: 4 * 60 * 1000
        })
      );
    });

    it('should not throw if res is invalid, but should log an error (Invalid Case - no res)', () => {
      setCookies(null, 'access_token_123', 'refresh_token_123');
      expect(console.error).toHaveBeenCalledWith(
        '[AUTH] Failed to set cookies:',
        'Invalid response object'
      );
    });

    it('should not throw if res.cookie is not a function, but should log an error (Invalid Case - no res.cookie)', () => {
      setCookies({}, 'access_token_123', 'refresh_token_123');
      expect(console.error).toHaveBeenCalledWith(
        '[AUTH] Failed to set cookies:',
        'Invalid response object'
      );
    });

    it('should log an error if tokens are missing (Invalid Case - no tokens)', () => {
      setCookies(mockRes, null, null);
      expect(mockRes.cookie).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        '[AUTH] Failed to set cookies:',
        'Missing token(s) for cookies'
      );
    });

    it('should log an error if only one token is missing (Edge Case)', () => {
      setCookies(mockRes, 'access_token_123', undefined);
      expect(mockRes.cookie).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        '[AUTH] Failed to set cookies:',
        'Missing token(s) for cookies'
      );
    });
  });
});
