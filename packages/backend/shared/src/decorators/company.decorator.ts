import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract company/tenant ID from request
 * Used for multi-tenancy
 * Usage: @CompanyId() companyId: string
 */
export const CompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-company-id'] || request.company?.id;
  },
);

/**
 * Custom decorator to extract company details from request
 * Usage: @CurrentCompany() company: Company
 */
export const CurrentCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.company;
  },
);
