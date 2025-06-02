import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await userRepository.delete({ email: 'test1@example.com' });
    await userRepository.delete({ email: 'test2@example.com' });

    await app.close();
  });

  it('/auth/signup (POST) should create a new user', async () => {
    const signupPayload = {
      name: 'testuser1',
      email: 'test1@example.com',
      password: 'TestPassword1234',
    };

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupPayload)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(signupPayload.name);
    expect(res.body.email).toBe(signupPayload.email);
  });

  it('/auth/login (POST) should login successfully and return a JWT token', async () => {
    const loginPayload = {
      email: 'test1@example.com',
      password: 'TestPassword1234',
    };

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload)
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('/auth/login (POST) should fail login with incorrect password', async () => {
    const loginPayload = {
      email: 'test1@example.com',
      password: 'wrongpassword',
    };

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload)
      .expect(401);

    expect(res.body.message).toBe('Incorrect email or password. Please try again.');
  });
});
