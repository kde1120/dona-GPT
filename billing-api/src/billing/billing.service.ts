import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as Policies from './policies/billing-policies';
import {
  createPolicies,
  createDiscountPolicies,
} from './context/billing-context';

// BillingService 클래스: 요금 계산 로직을 처리합니다.
@Injectable()
export class BillingService {
  // 요금 정책들을 저장하는 Map
  private readonly policies: Map<string, Policies.BillingPolicy>;
  // 할인 정책들을 저장하는 Map
  private readonly discountPolicies: Map<string, Policies.DiscountPolicy>;

  constructor() {
    // 서비스 초기화 시 모든 요금 정책과 할인 정책을 생성합니다.
    this.policies = createPolicies();
    this.discountPolicies = createDiscountPolicies();
  }

  // 요금을 계산하는 메서드
  calculateFee(
    planName: string,
    usage: number,
    date: Date,
    age?: number,
  ): number {
    try {
      // 요청된 플랜에 해당하는 정책을 가져옵니다.
      const policy = this.policies.get(planName);
      if (!policy) {
        throw new BadRequestException(`Unknown policy type: ${planName}`);
      }

      // 기본 요금을 계산합니다.
      let fee = policy.calculateFee(usage, date);

      // 해당 플랜에 할인 정책이 있고, 나이가 제공된 경우 할인을 적용합니다.
      const discountPolicy = this.discountPolicies.get(planName);
      if (discountPolicy && age !== undefined) {
        const discountRate = discountPolicy.getDiscountRate(age);
        fee -= fee * discountRate;
      }

      return fee;
    } catch (error) {
      // BadRequestException은 그대로 던집니다.
      if (error instanceof BadRequestException) {
        throw error;
      }
      // 그 외의 에러는 로그를 남기고 InternalServerErrorException으로 변환합니다.
      console.error('Error calculating fee:', error);
      throw new InternalServerErrorException(
        'An error occurred while calculating the fee',
      );
    }
  }
}
