import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isDefined, isNumberString, isPositive, min } from 'class-validator';
export const MAX_PAGE_LIMIT = 50;
export const DEFAULT_PAGE_LIMIT = 10;

@Injectable()
export class PageLimitPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (isDefined(value) && (isNumberString(value) || Number.isInteger(value))) {
      const intPageLimit = parseInt(value, 10);
      
      if (min(intPageLimit, MAX_PAGE_LIMIT)) {
        return MAX_PAGE_LIMIT;
      }
      return isPositive(intPageLimit) ? intPageLimit : DEFAULT_PAGE_LIMIT;
    }
    return DEFAULT_PAGE_LIMIT;
  }
}
