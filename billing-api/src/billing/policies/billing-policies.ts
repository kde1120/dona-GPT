// 기본 요금 정책 인터페이스
export interface BillingPolicy {
  calculateFee(usage: number, date: Date): number;
}

// 할인 정책 인터페이스
export interface DiscountPolicy {
  getDiscountRate(age: number): number;
}

export class FixedRatePolicy implements BillingPolicy {
  constructor(
    private readonly fixedRate: number,
    private readonly surcharge: number,
  ) {}

  calculateFee(): number {
    return this.fixedRate + this.surcharge;
  }
}

export class TimeBasedPolicy implements BillingPolicy {
  constructor(
    private readonly ratesByHour: Map<number, number>,
    private readonly surcharge: number,
  ) {}

  calculateFee(usage: number, date: Date): number {
    const hour = date.getHours();
    const rate = this.ratesByHour.get(hour) || 0;
    return usage * rate + this.surcharge;
  }
}

export class DayBasedPolicy implements BillingPolicy {
  constructor(
    private readonly ratesByDay: Map<number, number>,
    private readonly surcharge: number,
  ) {}

  calculateFee(usage: number, date: Date): number {
    const day = date.getDay();
    const rate = this.ratesByDay.get(day) || 0;
    return usage * rate + this.surcharge;
  }
}

export class TieredPolicy implements BillingPolicy {
  constructor(
    private readonly tiers: Array<{
      threshold: number;
      rate: number;
      additionalFee: number;
    }>,
    private readonly surcharge: number,
  ) {
    this.tiers.sort((a, b) => b.threshold - a.threshold);
  }

  calculateFee(usage: number): number {
    let totalFee = 0;
    let remainingUsage = usage;

    for (const tier of this.tiers) {
      if (remainingUsage > tier.threshold) {
        const usageInThisTier = remainingUsage - tier.threshold;
        totalFee += usageInThisTier * tier.rate + tier.additionalFee;
        remainingUsage = tier.threshold;
      }
    }

    return totalFee + this.surcharge;
  }
}

export class AgeBasedDiscountPolicy implements DiscountPolicy {
  constructor(private readonly discountRates: Map<number, number>) {}

  getDiscountRate(age: number): number {
    for (const [threshold, rate] of this.discountRates.entries()) {
      if (age >= threshold) {
        return rate;
      }
    }
    return 0;
  }
}
