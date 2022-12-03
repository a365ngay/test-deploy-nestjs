import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class LowercaseStringPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (isNotEmpty(value)) {
      return value.toLowerCase();
    }
    return '';
  }
}
