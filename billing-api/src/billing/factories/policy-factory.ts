import * as Policies from '../policies/billing-policies';

// 정책 팩토리 인터페이스
export interface PolicyFactory {
  createPolicy(): Policies.BillingPolicy;
}

// 고정 요금제 팩토리
export class FixedRatePolicyFactory implements PolicyFactory {
  constructor(
    private readonly baseRate: number,
    private readonly surcharge: number,
  ) {}

  createPolicy(): Policies.FixedRatePolicy {
    return new Policies.FixedRatePolicy(this.baseRate, this.surcharge);
  }
}

// 시간 기반 요금제 팩토리
export class TimeBasedPolicyFactory implements PolicyFactory {
  constructor(
    private readonly ratesByHour: Map<number, number>,
    private readonly surcharge: number,
  ) {}

  createPolicy(): Policies.TimeBasedPolicy {
    return new Policies.TimeBasedPolicy(this.ratesByHour, this.surcharge);
  }
}

// 요일 기반 요금제 팩토리
export class DayBasedPolicyFactory implements PolicyFactory {
  constructor(
    private readonly ratesByDay: Map<number, number>,
    private readonly surcharge: number,
  ) {}

  createPolicy(): Policies.DayBasedPolicy {
    return new Policies.DayBasedPolicy(this.ratesByDay, this.surcharge);
  }
}

// 구간 요금제 팩토리
export class TieredPolicyFactory implements PolicyFactory {
  constructor(
    private readonly tiers: Array<{
      threshold: number;
      rate: number;
      additionalFee: number;
    }>,
    private readonly surcharge: number,
  ) {}

  createPolicy(): Policies.TieredPolicy {
    return new Policies.TieredPolicy(this.tiers, this.surcharge);
  }
}

// 할인 정책 팩토리 인터페이스
export interface DiscountPolicyFactory {
  createDiscountPolicy(): Policies.DiscountPolicy;
}

// 나이 기반 할인 정책 팩토리
export class AgeBasedDiscountPolicyFactory implements DiscountPolicyFactory {
  constructor(private readonly discountRates: Map<number, number>) {}

  createDiscountPolicy(): Policies.AgeBasedDiscountPolicy {
    return new Policies.AgeBasedDiscountPolicy(this.discountRates);
  }
}
