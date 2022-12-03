import { Injectable, PipeTransform } from '@nestjs/common';

export type OrderByDirection = 'ASC' | 'DESC';

@Injectable()
export class NotInPipe implements PipeTransform<string, string[]> {
  transform(value: string, ...args: any[]): string[] {
    if (value && value.trim()) {
      const params = value.split(',');
      return params.map(id => id.trim());
    }
    return []
  }
}
