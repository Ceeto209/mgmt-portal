import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

async function createTestUsers() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);

  const users = [
    ...Array.from({ length: 5 }, (_, i) => ({
      username: `inmate${i + 1}`,
      password: 'password',
      role: 'inmate',
    })),
    { username: 'guard1', password: '123456', role: 'guard' },
    { username: 'admin1', password: '123456', role: 'admin' },
  ];

  for (const user of users) {
    const exists = await userRepository.findOne({ where: { username: user.username } });
    if (exists) {
      console.log(`User ${user.username} already exists, skipping.`);
      continue;
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = userRepository.create({
      username: user.username,
      password: hashedPassword,
      role: user.role,
    });
    await userRepository.save(newUser);
    console.log(`Created user: ${user.username} (${user.role})`);
  }

  console.log('\nTest user credentials:');
  for (const user of users) {
    console.log(`Username: ${user.username} | Password: ${user.password} | Role: ${user.role}`);
  }

  await AppDataSource.destroy();
}

createTestUsers().catch((err) => {
  console.error('Error creating test users:', err);
}); 