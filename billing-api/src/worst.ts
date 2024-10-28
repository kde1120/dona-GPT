import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  calculateFee(
    planName: string,
    usage: number,
    date: Date,
    age?: number,
  ): number {
    let fee = 0;

    // 모든 요금 정책을 하나의 큰 if-else 문으로 처리
    if (planName === 'fixedRate') {
      fee = 1000 + 500; // 고정 요금 + 추가 요금
    } else if (planName === 'timeBased') {
      const hour = date.getHours();
      if (hour >= 9 && hour < 18) {
        fee = usage * 100 + 300; // 주간 요금
      } else {
        fee = usage * 50 + 300; // 야간 요금
      }
    } else if (planName === 'dayBased') {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        fee = usage * 1000 + 200; // 주말 요금
      } else {
        fee = usage * 500 + 200; // 평일 요금
      }
    } else if (planName === 'tiered') {
      if (usage > 1000) {
        fee = 1000 * 0.1 + (usage - 1000) * 0.05 + 1000;
      } else if (usage > 500) {
        fee = 500 * 0.2 + (usage - 500) * 0.1 + 500;
      } else {
        fee = usage * 0.3;
      }
      fee += 100; // 추가 요금
    } else if (planName === 'ageBasedDiscount') {
      fee = 1000 + 500; // 기본 요금 (고정 요금제 사용)

      // 나이 기반 할인 적용
      if (age !== undefined) {
        if (age >= 65) {
          fee *= 0.8; // 20% 할인
        } else if (age >= 20) {
          fee *= 0.9; // 10% 할인
        } else {
          fee *= 0.95; // 5% 할인
        }
      }
    } else {
      throw new Error('Unknown plan type');
    }

    return fee;
  }
}
