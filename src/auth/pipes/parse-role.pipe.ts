import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { IRole } from '../../common';

@Injectable()
export class ParseRolePipe implements PipeTransform<string | string[], IRole[]> {
  transform(values: string | string[], metadata: ArgumentMetadata) {
    if (values) {
      try {
        const arrRoles = Array.isArray(values) ? values : [values];
        arrRoles.forEach(v => {
          if (['admin', 'user', 'case manager'].indexOf(v) < 0) {
            throw new BadRequestException(`${v} is not a valid role.`);
          }
        });
        const roles = arrRoles.map(v => v as IRole);
        return roles;
      } catch (err) {
        throw new BadRequestException(err.message);
      }
    }
    throw new BadRequestException('Roles are missing.');
  }
}
