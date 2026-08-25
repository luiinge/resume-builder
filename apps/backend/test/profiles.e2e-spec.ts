import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Profiles (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects a profile without required personal data', async () => {
    await request(app.getHttpServer())
      .post('/api/profiles')
      .send({ name: 'Sin datos', personalData: {} })
      .expect(400);
  });

  it('returns 404 for a profile that does not exist', async () => {
    await request(app.getHttpServer())
      .get('/api/profiles/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });

  it('supports the full profile + sections lifecycle', async () => {
    const server = app.getHttpServer();

    const createRes = await request(server)
      .post('/api/profiles')
      .send({
        name: 'Perfil e2e',
        personalData: { fullName: 'Juana Pérez', email: 'juana@example.com' },
      })
      .expect(201);

    const profileId = createRes.body.id;
    expect(createRes.body.skills).toEqual([]);

    const skillA = await request(server)
      .post(`/api/profiles/${profileId}/skills`)
      .send({ name: 'SQL', level: 3 })
      .expect(201);
    const skillB = await request(server)
      .post(`/api/profiles/${profileId}/skills`)
      .send({ name: 'Docker' })
      .expect(201);

    const beforeReorder = await request(server)
      .get(`/api/profiles/${profileId}`)
      .expect(200);
    expect(beforeReorder.body.skills.map((s: { id: string }) => s.id)).toEqual([
      skillA.body.id,
      skillB.body.id,
    ]);

    await request(server)
      .patch(`/api/profiles/${profileId}/skills/reorder`)
      .send({ orderedIds: [skillB.body.id, skillA.body.id] })
      .expect(200);

    const afterReorder = await request(server)
      .get(`/api/profiles/${profileId}`)
      .expect(200);
    expect(afterReorder.body.skills.map((s: { id: string }) => s.id)).toEqual([
      skillB.body.id,
      skillA.body.id,
    ]);

    await request(server)
      .patch(`/api/profiles/${profileId}`)
      .send({ personalData: { fullName: 'Juana Pérez García' } })
      .expect(200);

    const updated = await request(server)
      .get(`/api/profiles/${profileId}`)
      .expect(200);
    expect(updated.body.personalData.fullName).toBe('Juana Pérez García');
    expect(updated.body.personalData.email).toBe('juana@example.com');

    await request(server)
      .delete(`/api/profiles/${profileId}/skills/${skillA.body.id}`)
      .expect(200);
    const afterDeleteSkill = await request(server)
      .get(`/api/profiles/${profileId}`)
      .expect(200);
    expect(afterDeleteSkill.body.skills).toHaveLength(1);

    await request(server).delete(`/api/profiles/${profileId}`).expect(200);
    await request(server).get(`/api/profiles/${profileId}`).expect(404);
  });
});
