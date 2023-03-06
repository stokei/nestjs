import {
  IBaseOrderByData,
  IPaginationArgsToPrismaDataPaginationPrismaMapper,
  IWhere,
  IWhereAllowIsEmptyValues,
  IWhereData,
  IWhereDataInterval,
  IWhereDataSearch
} from '../../../interfaces';
import {
  cleanObject,
  cleanValueNumber,
  getPageLimit,
  getPageSkip,
  isUndefined
} from '../../../utils';

export class PrismaMapper {
  toOrderBy(data: IBaseOrderByData) {
    if (!data) {
      return undefined;
    }
    return Object.entries(data).map(([dataKey, dataValue]) => ({
      [dataKey]: dataValue
    }));
  }
  toWhere<DTO = any>({
    data,
    allowIsEmptyValues,
    operatorMapper
  }: {
    data: IWhere<DTO>;
    operatorMapper?: (operatorData: DTO) => any;
    allowIsEmptyValues?: IWhereAllowIsEmptyValues;
  }) {
    const mapper = operatorMapper
      ? operatorMapper
      : (operatorData) => operatorData;
    const clearMapper = (operatorData) =>
      operatorData ? mapper(operatorData) : undefined;
    return {
      ...cleanObject(
        {
          AND: clearMapper(data?.AND)
        },
        allowIsEmptyValues?.AND
      ),
      ...cleanObject(
        {
          OR: data?.OR?.map(clearMapper)
        },
        allowIsEmptyValues?.OR
      ),
      ...cleanObject(
        {
          NOT: clearMapper(data?.NOT)
        },
        allowIsEmptyValues?.NOT
      )
    };
  }
  toWhereIds(data: string[]) {
    return !isUndefined(data)
      ? {
          in: data
        }
      : undefined;
  }
  toWhereData<TDataType = string>(data: IWhereData<TDataType>) {
    return !isUndefined(data?.equals)
      ? {
          equals: data?.equals
        }
      : undefined;
  }
  toWhereDataInterval<TDataType = string>(data: IWhereDataInterval<TDataType>) {
    return {
      ...this.toWhereData<TDataType>(data),
      ...(!isUndefined(data?.less) && {
        lt: data?.less
      }),
      ...(!isUndefined(data?.lessEquals) && {
        lte: data?.lessEquals
      }),
      ...(!isUndefined(data?.greater) && {
        gt: data?.greater
      }),
      ...(!isUndefined(data?.greaterEquals) && {
        gte: data?.greaterEquals
      })
    };
  }
  toWhereDataSearch<TDataType = string>(data: IWhereDataSearch<TDataType>) {
    return {
      ...this.toWhereData<TDataType>(data),
      ...(!isUndefined(data?.search) && {
        contains: data?.search,
        mode: 'insensitive'
      }),
      ...(!isUndefined(data?.startsWith) && {
        startsWith: data?.startsWith,
        mode: 'insensitive'
      }),
      ...(!isUndefined(data?.endsWith) && {
        endsWith: data?.endsWith,
        mode: 'insensitive'
      })
    };
  }
  toPagination(data: IPaginationArgsToPrismaDataPaginationPrismaMapper) {
    if (!data?.page) {
      return null;
    }
    const limit = getPageLimit(cleanValueNumber(data?.page.limit));
    const pageNumber = cleanValueNumber(data?.page.number) || 1;
    const skip = getPageSkip(pageNumber, limit);
    return {
      skip,
      take: limit
    };
  }
}
