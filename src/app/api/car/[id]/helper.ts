import { prisma } from '@/utils/api/prisma';

export const getRating = async (id: number) => {
  const aggregations = await prisma.order.aggregate({
    where: { car_id: id, rating: { not: null } },
    _avg: {
      rating: true,
    },
    _count: true,
  });

  return {
    avg: aggregations._avg.rating,
    respondent: aggregations._count,
  };
};
