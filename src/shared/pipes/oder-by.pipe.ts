import { Injectable, PipeTransform } from '@nestjs/common';

export type OrderByDirection = 'ASC' | 'DESC';

export interface OrderBy {
  field: string;
  direction: OrderByDirection;
}

@Injectable()
export class OrderByPipe implements PipeTransform<string, OrderBy> {
  transform(value: string, ...args: any[]): OrderBy | undefined {
    if (!value || !value.trim()) {
      return undefined;
    }
    const params = value.split(' ');
    if (params.length < 1) {
      return undefined;
    }
    if (params.length < 2) {
      return {
        field: params[0],
        direction: 'ASC',
      };
    }

    let direction: OrderByDirection = 'ASC';
    if (params[1].toUpperCase() !== 'ASC' && params[1].toUpperCase() !== 'DESC') {
      // do nothing
    } else if (params[1].toUpperCase() === 'ASC') {
      direction = 'ASC';
    } else if (params[1].toUpperCase() === 'DESC') {
      direction = 'DESC';
    }
    return {
      field: params[0],
      direction,
    };
  }
}
