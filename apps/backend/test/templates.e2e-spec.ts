import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

const VALID_LAYOUT = {
  columns: 1,
  sections: [{ section: 'personal-data', visible: true, column: 1, order: 1 }],
};

describe('Templates (e2e)', () => {
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

  it('lists the predefined seed templates', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/templates')
      .expect(200);
    const predefined = res.body.filter(
      (t: { isPredefined: boolean }) => t.isPredefined,
    );
    expect(predefined.length).toBeGreaterThanOrEqual(1);
  });

  it('rejects CSS with a remote url() reference', async () => {
    await request(app.getHttpServer())
      .post('/api/templates')
      .send({
        name: 'Maliciosa',
        layoutConfig: VALID_LAYOUT,
        css: '.cv-root { background: url(https://evil.example.com/x.png); }',
      })
      .expect(400);
  });

  it('rejects CSS with an @import rule', async () => {
    await request(app.getHttpServer())
      .post('/api/templates')
      .send({
        name: 'Maliciosa 2',
        layoutConfig: VALID_LAYOUT,
        css: "@import url('https://evil.example.com/x.css');",
      })
      .expect(400);
  });

  it('supports create, update and delete of an own template', async () => {
    const server = app.getHttpServer();

    const created = await request(server)
      .post('/api/templates')
      .send({
        name: 'Plantilla e2e',
        layoutConfig: VALID_LAYOUT,
        css: '.cv-root { color: black; }',
      })
      .expect(201);
    expect(created.body.isPredefined).toBe(false);

    await request(server)
      .patch(`/api/templates/${created.body.id}`)
      .send({ css: '.cv-root { color: navy; }' })
      .expect(200);

    await request(server)
      .delete(`/api/templates/${created.body.id}`)
      .expect(200);
    await request(server).get(`/api/templates/${created.body.id}`).expect(404);
  });

  it('prevents editing or deleting predefined templates, but allows duplicating them', async () => {
    const server = app.getHttpServer();
    const list = await request(server).get('/api/templates').expect(200);
    const predefined = list.body.find(
      (t: { isPredefined: boolean }) => t.isPredefined,
    );

    await request(server)
      .patch(`/api/templates/${predefined.id}`)
      .send({ name: 'Hackeada' })
      .expect(400);
    await request(server).delete(`/api/templates/${predefined.id}`).expect(400);

    const predefinedDetail = await request(server)
      .get(`/api/templates/${predefined.id}`)
      .expect(200);

    const duplicate = await request(server)
      .post(`/api/templates/${predefined.id}/duplicate`)
      .expect(201);
    expect(duplicate.body.isPredefined).toBe(false);
    expect(duplicate.body.css).toBe(predefinedDetail.body.css);

    await request(server)
      .delete(`/api/templates/${duplicate.body.id}`)
      .expect(200);
  });
});
