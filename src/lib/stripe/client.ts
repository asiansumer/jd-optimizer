import { createStripeProvider, type StripeConfigs } from '@/extensions/payment/stripe';
import { getAllConfigs } from '@/shared/models/config';

/**
 * Get Stripe provider instance
 */
export async function getStripeProvider() {
  const configs = await getAllConfigs();

  const stripeConfigs: StripeConfigs = {
    secretKey: configs.stripe_secret_key || '',
    publishableKey: configs.stripe_publishable_key || '',
    signingSecret: configs.stripe_webhook_secret || '',
    apiVersion: '2025-01-27.acacia',
    allowedPaymentMethods: ['card'],
    allowPromotionCodes: true,
  };

  return createStripeProvider(stripeConfigs);
}

/**
 * Get Stripe publishable key for client-side use
 */
export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
}
