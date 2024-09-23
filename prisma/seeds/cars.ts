import { Prisma } from '@prisma/client';
// const { Decimal } = require('@prisma/client/runtime');

const cars: Omit<Prisma.CarUncheckedCreateInput, 'garage_id'>[] = [
  {
    id: 1,
    name: 'Toyota Prius',
    plate: 'XYZ-1234',
    description: 'A reliable hybrid car',
    amount: 2.5,
    capacity: 5,
    type: 'Sedan',
    steering: 'Automatic',
  },
  {
    id: 2,
    name: 'Ford Mustang',
    plate: 'ABC-5678',
    description: 'A powerful muscle car',
    amount: 20.5,
    discount: 50,
    gasoline: 15,
    capacity: 4,
    type: 'Coupe',
    steering: 'Manual',
  },
  {
    id: 3,
    name: 'Honda Civic',
    plate: 'CDE-7890',
    description: 'A compact and efficient car',
    amount: 2.7,
    capacity: 5,
    type: 'Sedan',
    steering: 'Automatic',
  },
  {
    id: 4,
    name: 'Chevrolet Camaro',
    plate: 'FGH-2345',
    description: 'A stylish sports car',
    amount: 400,
    capacity: 4,
    type: 'Coupe',
    steering: 'Manual',
  },
  {
    id: 5,
    name: 'BMW X5',
    plate: 'IJK-3456',
    description: 'A luxury SUV with advanced features',
    amount: 3.45,
    capacity: 7,
    type: 'SUV',
    steering: 'Triptonic',
  },
  {
    id: 6,
    name: 'Audi A4',
    plate: 'LMN-4567',
    description: 'A premium sedan with cutting-edge technology',
    amount: 45000,
    capacity: 5,
    type: 'Sedan',
    steering: 'Automatic',
  },
  {
    id: 7,
    name: 'Tesla Model S',
    plate: 'OPQ-5678',
    description: 'An all-electric luxury sedan',
    amount: 800,
    capacity: 5,
    type: 'Sedan',
    steering: 'Automatic',
  },
  {
    id: 8,
    name: 'Mercedes-Benz G-Class',
    plate: 'RST-6789',
    description: 'A rugged luxury SUV',
    amount: 1200,
    capacity: 5,
    type: 'SUV',
    steering: 'Triptonic',
  },
  {
    id: 9,
    name: 'Volkswagen Golf',
    plate: 'UVW-7890',
    description: 'A versatile compact car',
    amount: 220,
    capacity: 5,
    type: 'Hatchback',
    steering: 'Manual',
  },
  {
    id: 10,
    name: 'Porsche 911',
    plate: 'XYZ-8901',
    description: 'A high-performance sports car',
    amount: 100,
    capacity: 2,
    type: 'Coupe',
    steering: 'Manual',
  },
  {
    id: 11,
    name: 'Hyundai Elantra',
    plate: 'ABC-9012',
    description: 'A reliable and efficient sedan',
    amount: 180,
    capacity: 5,
    type: 'Sedan',
    steering: 'Automatic',
  },
  {
    id: 12,
    name: 'Kia Sportage',
    plate: 'DEF-0123',
    description: 'A compact SUV with great value',
    amount: 25,
    capacity: 5,
    type: 'SUV',
    steering: 'Automatic',
  },
  {
    id: 13,
    name: 'Mazda MX-5 Miata',
    plate: 'GHI-1234',
    description: 'A fun and affordable sports car',
    amount: 300,
    capacity: 2,
    type: 'Convertible',
    steering: 'Manual',
  },
  {
    id: 14,
    name: 'Jeep Wrangler',
    plate: 'JKL-2345',
    description: 'A rugged off-road SUV',
    amount: 350,
    capacity: 4,
    type: 'SUV',
    steering: 'Manual',
  },
  {
    id: 15,
    name: 'Nissan Leaf',
    plate: 'MNO-3456',
    description: 'An all-electric hatchback',
    amount: 300,
    capacity: 5,
    type: 'Hatchback',
    steering: 'Automatic',
  },
  {
    id: 16,
    name: 'Subaru Outback',
    plate: 'PQR-4567',
    description: 'A versatile crossover with all-wheel drive',
    amount: 350,
    capacity: 5,
    type: 'Wagon',
    steering: 'Automatic',
  },
  {
    id: 17,
    name: 'Land Rover Range Rover',
    plate: 'STU-5678',
    description: 'A luxurious off-road SUV',
    amount: 950,
    capacity: 5,
    type: 'SUV',
    steering: 'Triptonic',
  },
];

// console.log('___new Decimal(20.5)', new Decimal(20.5));

export default cars;