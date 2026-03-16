import type { RequestHandler } from 'express';
import { Router } from 'express';
import type { AuthModeCapabilities } from '../config/index.js';
import * as authController from '../controllers/authController.js';
import { moderateAuthRateLimiter, strictAuthRateLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import {
  loginSchema,
  signupSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createSetPasswordSchema,
  requestEmailChangeSchema,
  updateProfileSchema,
} from '../schemas/auth.js';

export function createAuthRouter(
  requireAuthMiddleware: RequestHandler,
  authModeCapabilities: AuthModeCapabilities
): Router {
  const router = Router();
  const setPasswordSchema = createSetPasswordSchema(authModeCapabilities);

  router.post('/login', strictAuthRateLimiter, validateBody(loginSchema), (req, res) => {
    void authController.login(req, res);
  });
  router.post('/logout', (req, res) => {
    authController.logout(req, res);
  });
  router.post('/refresh', (req, res) => {
    void authController.refresh(req, res);
  });
  router.post(
    '/change-password',
    moderateAuthRateLimiter,
    requireAuthMiddleware,
    validateBody(changePasswordSchema),
    (req, res) => {
      void authController.changePassword(req, res);
    }
  );
  router.get('/me', requireAuthMiddleware, (req, res) => {
    authController.me(req, res);
  });
  router.get('/username-available', moderateAuthRateLimiter, (req, res) => {
    void authController.usernameAvailable(req, res);
  });
  router.patch(
    '/me',
    moderateAuthRateLimiter,
    requireAuthMiddleware,
    validateBody(updateProfileSchema),
    (req, res) => {
      void authController.updateProfile(req, res);
    }
  );

  if (authModeCapabilities.canPublicSignup) {
    router.post('/signup', strictAuthRateLimiter, validateBody(signupSchema), (req, res) => {
      void authController.signup(req, res);
    });
  } else {
    router.post('/signup', strictAuthRateLimiter, (_req, res) => {
      res.status(403).json({ message: 'Registration is by admin only' });
    });
  }

  // Plan 34: verification flows (mailer mode only)
  router.post('/verify-email', strictAuthRateLimiter, (req, res) => {
    if (!authModeCapabilities.canUseEmailVerificationFlows) {
      res.status(403).json({ message: 'Email verification is not enabled' });
      return;
    }
    void authController.verifyEmail(req, res);
  });
  router.post(
    '/forgot-password',
    strictAuthRateLimiter,
    validateBody(forgotPasswordSchema),
    (req, res) => {
      if (!authModeCapabilities.canUseEmailVerificationFlows) {
        res.status(403).json({ message: 'Email verification is not enabled' });
        return;
      }
      void authController.forgotPassword(req, res);
    }
  );
  router.post(
    '/reset-password',
    strictAuthRateLimiter,
    validateBody(resetPasswordSchema),
    (req, res) => {
      if (!authModeCapabilities.canUseEmailVerificationFlows) {
        res.status(403).json({ message: 'Email verification is not enabled' });
        return;
      }
      void authController.resetPassword(req, res);
    }
  );
  router.post(
    '/set-password',
    strictAuthRateLimiter,
    validateBody(setPasswordSchema),
    (req, res) => {
      void authController.setPassword(req, res);
    }
  );
  router.post(
    '/request-email-change',
    strictAuthRateLimiter,
    requireAuthMiddleware,
    validateBody(requestEmailChangeSchema),
    (req, res) => {
      if (!authModeCapabilities.canUseEmailVerificationFlows) {
        res.status(403).json({ message: 'Email verification is not enabled' });
        return;
      }
      void authController.requestEmailChange(req, res);
    }
  );
  router.post('/confirm-email-change', strictAuthRateLimiter, (req, res) => {
    if (!authModeCapabilities.canUseEmailVerificationFlows) {
      res.status(403).json({ message: 'Email verification is not enabled' });
      return;
    }
    void authController.confirmEmailChange(req, res);
  });

  return router;
}
