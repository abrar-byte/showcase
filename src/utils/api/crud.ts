import * as qs from 'qs';

import { prismaAny } from './prisma';
import {
  deepConsole,
  handleError,
  isObjectEmpty,
  mergeObjects,
  parseFilter,
  parseInclude,
  sortingDataWithParams,
} from './index';

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

declare global {
  interface BigInt {
    toJSON(): string | number;
  }
}

BigInt.prototype.toJSON = function (): string | number {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

type obj = { [key: string]: any };
type args = {
  table?: Prisma.ModelName;
  params?: any;
  select?: obj;
  include?: obj;
  where?: obj;
  withoutLimitPagination?: boolean;
  returnValue?: boolean;
  QParams?: obj;
  body?: obj;
};

const numbersId = ['garage', 'car'];

function completeParams({
  params,
  select,
  include = {},
  QInclude = {},
}: {
  params: obj;
  select: obj;
  include?: obj;
  QInclude?: obj;
}) {
  const newInclude = mergeObjects(include, parseInclude(QInclude));
  if (!isObjectEmpty(newInclude)) {
    params.include = newInclude;
  }
  if (!isObjectEmpty(select)) {
    params.select = select;
  }
}

export const CREATE = async (
  req: NextRequest,
  { table, select = {}, include = {} }: args,
) => {
  try {
    if (!table) {
      table = req.nextUrl.pathname.split('/')[2] as Prisma.ModelName;
    }
    if (!table) {
      return NextResponse.json(null, { status: 400 });
    }

    const params = {
      data: await req.json(),
    };
    completeParams({ params, select, include });
    console.log('[PARAMS]');
    deepConsole(params);
    if (params?.data?.id) delete params.data.id;

    const result = await prismaAny[table].create(params);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
};

export const LIST = async (
  req: NextRequest,
  {
    table,
    include,
    where = {},
    select = {},
    withoutLimitPagination = false,
    returnValue,
    QParams,
  }: args,
): Promise<any> => {
  try {
    if (!table) {
      table = req.nextUrl.pathname.split('/')[2] as Prisma.ModelName;
    }
    const url = new URL(req.url).search.substring(1);
    const {
      page,
      take,
      // include: QInclude,
      ...query
    }: any = QParams || qs.parse(url);
    const params: any = {
      // where: { ...parseFilter(filter), ...where },
      where: where.AND
        ? { AND: [where.AND, parseFilter(query)] }
        : mergeObjects(parseFilter(query), where),
    };

    if (!withoutLimitPagination || (page && take)) {
      params.skip = (parseInt(page || 1) - 1) * parseInt(take || 10);
      params.take = parseInt(take || 10);
    }

    completeParams({
      params,
      select,
      include,
      // QInclude,
    });
    sortingDataWithParams(query.sort, params);
    console.log('[PARAMS]:');
    deepConsole(params);
    const [data, count] = await Promise.all([
      prismaAny[table].findMany(params),
      prismaAny[table].count({ where: params.where }),
    ]);
    const result = {
      data,
      meta: {
        count,
        take: take || (withoutLimitPagination ? count : 10),
        page: page || 1,
        pageCount: Math.ceil(
          count / (take || (withoutLimitPagination ? count : 10)),
        ),
      },
    };
    if (returnValue) {
      return result;
    }
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
};

export const READ = async (
  req: NextRequest,
  {
    table,
    params: p,
    include = {},
    select = {},
    where,
    returnValue,
    QParams,
  }: args,
) => {
  try {
    if (!table) {
      table = req.nextUrl.pathname.split('/')[2] as Prisma.ModelName;
    }
    const url = new URL(req.url).search.substring(1);
    const { include: QInclude }: any = QParams || qs.parse(url);
    const id = numbersId.includes(table) ? Number(p.id) : p.id;
    const params = { where: where || { id } };

    completeParams({
      params,
      select,
      include,
      // QInclude
    });

    const result = await prismaAny[table].findFirstOrThrow(params);
    if (returnValue) {
      return result;
    }
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
};

export const UPDATE = async (
  req: NextRequest,
  {
    table,
    params: p,
    include = {},
    select = {},
    where = {},
    returnValue,
    body,
  }: args,
) => {
  try {
    if (!table) {
      table = req.nextUrl.pathname.split('/')[2] as Prisma.ModelName;
    }

    const id = numbersId.includes(table) ? Number(p.id) : p.id;

    const params = {
      where: { ...where, id },
      data: body || (await req.json()),
    };
    completeParams({ params, select, include });
    if (params?.data?.id) delete params.data.id;

    const result = await prismaAny[table].update(params);
    if (returnValue) {
      return result;
    }
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
};

export const REMOVE = async (
  req: NextRequest,
  { table, params: p, returnValue }: args,
) => {
  try {
    if (!table) {
      table = req.nextUrl.pathname.split('/')[2] as Prisma.ModelName;
    }
    const id = numbersId.includes(table) ? Number(p.id) : p.id;

    const where = {
      id,
    };

    // const data = { active: false };
    // const { fields } = Prisma.dmmf.datamodel.models.find(
    //   (model) => model.name === table
    // );
    // const active = fields.find((x) => x.name == 'active');
    // if (!!active) {
    //   return await prismaAny[table].update({ where, data });
    // } else {
    const result = await prismaAny[table].delete({ where });
    return NextResponse.json(result);
    // }
  } catch (error) {
    return handleError(error);
  }
};
