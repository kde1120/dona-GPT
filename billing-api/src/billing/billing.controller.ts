import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CalculateFeeDto } from './dto/calculate-fee.dto';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('calculate-fee')
  @ApiOperation({ summary: 'Calculate billing fee' })
  @ApiResponse({ status: 200, description: 'Returns the calculated fee' })
  calculateFee(@Body() calculateFeeDto: CalculateFeeDto): number {
    return this.billingService.calculateFee(
      calculateFeeDto.planName,
      calculateFeeDto.usage,
      calculateFeeDto.date,
      calculateFeeDto.age,
    );
  }
}
