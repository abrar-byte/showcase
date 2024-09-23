import { prisma } from '../../src/utils/api/prisma';
import users from './users';
import garages from './garages';
import cars from './cars';
import orders from './orders';

async function main() {
  const favoritesData = [{ id: 'f1' }, { id: 'f2' }, { id: 'f3' }];
  // await prisma.order.deleteMany()
  // await prisma.favorite.deleteMany();
  // await prisma.car.deleteMany();
  // await prisma.garage.deleteMany();
  await prisma.carMedia.deleteMany({
    where: { car_id: { in: cars.map((c) => c.id!) } },
  });

  const [user1, user2, user3] = await prisma.$transaction(
    users.map((data) =>
      prisma.user.upsert({
        where: { email: data.email },
        create: data,
        update: data,
      }),
    ),
  );

  // Create Garages
  const [garage1, garage2, garage3] = await prisma.$transaction(
    garages.map(({ id, ...data }) =>
      prisma.garage.upsert({
        where: { id },
        create: data,
        update: data,
      }),
    ),
  );

  // Create Cars
  const carsResult = await prisma.$transaction(
    cars.map(({ id, ...data }, index) =>
      prisma.car.upsert({
        where: { id },
        create: {
          ...data,
          garage_id:
            index === 0 ? garage1.id : index === 1 ? garage2.id : garage3.id,
        },
        update: {},
      }),
    ),
  );
  const [car1, car2, car3] = carsResult;

  // Create CarMedia
  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  await prisma.$transaction(
    carsResult.map((car) => {
      const mediaCount = getRandomInt(3, 5); // Generate 3 to 5 media entries per car
      const carMediaData = Array.from({ length: mediaCount }, (_, index) => ({
        name: `${car.name} Media ${index + 1}`,
        link: `https://loremflickr.com/600/400/car?random=${Math.random()}`,
        // link: `https://picsum.photos/600/400?random=${Math.random()}`,
        type: 'image',
        cover: index === 0, // Make the first image the cover
        car_id: car.id!,
      }));

      return prisma.carMedia.createMany({
        data: carMediaData,
      });
    }),
  );

  // Create Orders
  await prisma.$transaction(
    orders.map((data, index) => {
      // Determine the car based on the index
      const car = index === 0 ? car1 : index === 1 ? car2 : car3;

      // Convert amount, tax, and discount to Decimal
      const amount = car.amount;
      // const taxRate = 0; // Assuming tax rate is 10%
      const discount = car.discount ? car.discount : 0;
      // const tax = amount.mul(taxRate); // Calculate tax
      // const total = amount.sub(discount).add(tax); // Calculate total
      const total = Number(amount) - discount;

      return prisma.order.upsert({
        where: { id: data.id },
        create: {
          ...data,
          amount,
          total,
          user_id: index === 0 ? user1.id : index === 1 ? user2.id : user3.id,
          car_id: car.id,
        },
        update: {},
      });
    }),
  );

  // Create Favorites
  await prisma.$transaction(
    favoritesData.map((data, index) =>
      prisma.favorite.upsert({
        where: { id: data.id },
        create: {
          user_id: index === 0 ? user1.id : index === 1 ? user2.id : user3.id,
          car_id: index === 0 ? car2.id : index === 1 ? car3.id : car1.id,
        },
        update: {},
      }),
    ),
  );
}

main()
  .then(() => {
    console.log('Seed data created successfully');
  })
  .catch((e) => {
    console.error('Error seeding data', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
