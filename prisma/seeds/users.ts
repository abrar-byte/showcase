import { Prisma } from '@prisma/client';

const users: Prisma.UserUncheckedCreateInput[] = [
  {
    email: 'user1@example.com',
    fullname: 'John Doe',
    image: 'https://picsum.photos/600/400?random=1',
    role: 'USER',
  },
  {
    email: 'user2@example.com',
    fullname: 'Jane Doe',
    image: 'https://picsum.photos/600/400?random=2',
    role: 'ADMIN',
  },
  {
    email: 'user3@example.com',
    fullname: 'Sam Smith',
    image: 'https://picsum.photos/600/400?random=3',
    role: 'USER',
  },
];

export default users;
