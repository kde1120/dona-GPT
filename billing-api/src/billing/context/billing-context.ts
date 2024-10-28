import * as Factories from '../factories/policy-factory';
import * as Policies from '../policies/billing-policies';

// 요금 정책 설정을 위한 상수들
export const BillingContext = {
  fixedRate: {
    factory: new Factories.FixedRatePolicyFactory(1000, 500),
  },
  timeBased: {
    factory: new Factories.TimeBasedPolicyFactory(
      new Map([
        [9, 100],
        [18, 200],
      ]),
      300,
    ),
  },
  dayBased: {
    factory: new Factories.DayBasedPolicyFactory(
      new Map([
        [0, 500],
        [6, 1000],
      ]),
      200,
    ),
  },
  tiered: {
    factory: new Factories.TieredPolicyFactory(
      [
        { threshold: 1000, rate: 0.1, additionalFee: 1000 },
        { threshold: 500, rate: 0.2, additionalFee: 500 },
        { threshold: 0, rate: 0.3, additionalFee: 0 },
      ],
      100,
    ),
  },
};

// 할인 정책 설정을 위한 상수들
export const DiscountContext = {
  ageBasedDiscount: {
    factory: new Factories.AgeBasedDiscountPolicyFactory(
      new Map([
        [65, 0.2],
        [20, 0.1],
        [0, 0.05],
      ]),
    ),
  },
};

// 정책 생성 함수
export function createPolicy(policyType: string): Policies.BillingPolicy {
  const factory = BillingContext[policyType]?.factory;
  if (!factory) {
    throw new Error(`Unknown policy type: ${policyType}`);
  }
  return factory.createPolicy();
}

// 할인 정책 생성 함수
export function createDiscountPolicy(
  policyType: string,
): Policies.DiscountPolicy {
  switch (policyType) {
    case 'ageBasedDiscount':
      return new Policies.AgeBasedDiscountPolicy(
        new Map([
          [65, 0.2],
          [20, 0.1],
          [0, 0.05],
        ]),
      );
    default:
      throw new Error(`Unknown discount policy type: ${policyType}`);
  }
}

export const createPolicies = (): Map<string, Policies.BillingPolicy> => {
  const policies = new Map<string, Policies.BillingPolicy>();
  for (const [policyType, config] of Object.entries(BillingContext)) {
    policies.set(policyType, config.factory.createPolicy());
  }
  return policies;
};

export const createDiscountPolicies = (): Map<
  string,
  Policies.DiscountPolicy
> => {
  const discountPolicies = new Map<string, Policies.DiscountPolicy>();
  for (const [policyType, config] of Object.entries(DiscountContext)) {
    discountPolicies.set(policyType, config.factory.createDiscountPolicy());
  }
  return discountPolicies;
};
