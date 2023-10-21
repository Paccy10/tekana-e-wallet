import { FindManyOptions, FindOptionsOrder, ILike } from 'typeorm';

import { FilterDTO } from '../dto';
import { FilterResponse } from '../interfaces';

interface Filters {
  filters: FilterDTO;
  options?: FindManyOptions;
  searchFields?: string[];
}

export class FilterService {
  constructor(
    private repository: any,
    private serializer: any = null,
  ) {}

  async filter({
    filters,
    options = {} as FindManyOptions<any>,
    searchFields = [],
  }: Filters): Promise<FilterResponse<any>> {
    const { page, limit, orderBy, sortOrder, search } = filters;

    if (orderBy) {
      const order = {} as FindOptionsOrder<any>;
      order[orderBy] = sortOrder;
      options.order = order;
    }

    if (search) {
      options.where = searchFields.map((field) => ({
        ...options.where,
        [field]: ILike(`%${search}%`),
      }));
    }

    options.skip = (page - 1) * limit;
    options.take = limit;

    const [data, count] = await this.repository.findAndCount(options);

    return {
      items: this.serializer ? data.map((d) => new this.serializer(d)) : data,
      count,
      pages: Math.ceil(count / limit),
      previousPage: page > 1 ? Number(page - 1) : null,
      page: Number(page),
      nextPage: count / limit > page ? Number(page) + 1 : null,
      limit: Number(limit),
    };
  }
}
