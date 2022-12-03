import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isDefined, isNumberString, isNegative } from 'class-validator';

@Injectable()
export class PageIndexPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (value && isDefined(value)) {
      const intPageIndex = parseInt(value, 10);
      return isNegative(intPageIndex) ? 0 : intPageIndex;
    }
    return 0;
  }
}
