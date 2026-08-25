import { PrismaClient } from '@prisma/client';
import type { TemplateLayoutConfig } from '@resume-builder/shared';

const prisma = new PrismaClient();

const classicLayout: TemplateLayoutConfig = {
  columns: 1,
  sections: [
    { section: 'personal-data', visible: true, column: 1, order: 1 },
    { section: 'summary', visible: true, column: 1, order: 2 },
    { section: 'work-experience', visible: true, column: 1, order: 3 },
    { section: 'education', visible: true, column: 1, order: 4 },
    { section: 'skills', visible: true, column: 1, order: 5 },
    { section: 'languages', visible: true, column: 1, order: 6 },
    { section: 'projects', visible: true, column: 1, order: 7 },
  ],
};

const classicCss = `
.cv-root {
  font-family: Georgia, 'Times New Roman', serif;
  color: #222;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
}
[data-section="personal-data"] h1 {
  font-size: 28px;
  margin-bottom: 4px;
}
[data-section="personal-data"] .contact {
  font-size: 13px;
  color: #555;
  margin-bottom: 24px;
}
.cv-section {
  margin-bottom: 20px;
}
.cv-section h2 {
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #222;
  padding-bottom: 4px;
  margin-bottom: 10px;
}
.cv-section p {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}
.cv-item {
  margin-bottom: 10px;
}
.cv-item .item-title {
  font-weight: bold;
}
.cv-item .item-subtitle {
  font-style: italic;
  color: #444;
}
.cv-item .item-dates {
  float: right;
  color: #666;
  font-size: 12px;
}
`.trim();

// Diseño de dos columnas con barra lateral verde a toda la altura, iconos de
// contacto en SVG y niveles de habilidad como etiqueta plana.
const modernLayout: TemplateLayoutConfig = {
  columns: 2,
  sections: [
    { section: 'summary', visible: true, column: 1, order: 1 },
    { section: 'skills', visible: true, column: 1, order: 2 },
    { section: 'languages', visible: true, column: 1, order: 3 },
    { section: 'personal-data', visible: true, column: 2, order: 1 },
    { section: 'projects', visible: true, column: 2, order: 2 },
    { section: 'work-experience', visible: true, column: 2, order: 3 },
    { section: 'education', visible: true, column: 2, order: 4 },
  ],
  visiblePersonalDataFields: [
    'title',
    'email',
    'phone',
    'address',
    'linkedin',
    'website',
  ],
};

const modernCss = `
.cv-root {
  grid-template-columns: 300px 1fr;
  gap: 0;
  align-items: stretch;
  min-height: 100vh;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #1a1a1a;
}

.cv-column-1 {
  background: #1b4d3e;
  color: #eef5f1;
  padding: 0 28px 40px;
}

.cv-column-2 {
  background: #ffffff;
  padding: 0 40px 48px;
}

/* --- Datos personales (columna clara) --- */
[data-section="personal-data"] .photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
}
[data-section="personal-data"] h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 4px;
  line-height: 1.2;
}
[data-section="personal-data"] .job-title {
  font-size: 15px;
  font-weight: 500;
  color: #1b4d3e;
  margin: 0 0 14px;
}
[data-section="personal-data"] .contact {
  display: flex;
  flex-wrap: wrap;
  column-gap: 18px;
  row-gap: 6px;
  font-size: 13px;
  color: #444;
}
[data-section="personal-data"] .contact-item {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
[data-section="personal-data"] .contact-item::after {
  content: none;
}
/* Iconos como SVG en línea con el color forzado en el propio SVG: a
   diferencia de los emoji, así el color no depende de la fuente del
   sistema y siempre sale en verde oscuro. */
[data-section="personal-data"] .contact-item::before {
  display: inline-block;
  width: 13px;
  height: 13px;
  margin-right: 5px;
  vertical-align: middle;
}
[data-section="personal-data"] .contact-email::before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b4d3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='5' width='18' height='14' rx='2'/%3E%3Cpath d='M3 7l9 6 9-6'/%3E%3C/svg%3E");
}
[data-section="personal-data"] .contact-phone::before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b4d3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 3h4l1 5-2 2c1 2 3 4 5 5l2-2 5 1v4c0 1-1 2-2 2C11 20 4 13 4 5c0-1 1-2 2-2z'/%3E%3C/svg%3E");
}
[data-section="personal-data"] .contact-address::before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b4d3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z'/%3E%3Ccircle cx='12' cy='9' r='2.5'/%3E%3C/svg%3E");
}
[data-section="personal-data"] .contact-birthDate::before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b4d3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='5' width='18' height='16' rx='2'/%3E%3Cpath d='M3 10h18M8 3v4M16 3v4'/%3E%3C/svg%3E");
}
[data-section="personal-data"] .contact-linkedin::before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b4d3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1'/%3E%3Cpath d='M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1'/%3E%3C/svg%3E");
}
[data-section="personal-data"] .contact-website::before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b4d3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z'/%3E%3C/svg%3E");
}

/* --- Títulos de sección: blancos en la barra lateral, verdes con línea en
   la columna principal --- */
.cv-column-1 .cv-section h2 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #ffffff;
  margin-bottom: 12px;
}
.cv-column-2 .cv-section h2 {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #1b4d3e;
  border-bottom: 2px solid #1b4d3e;
  padding-bottom: 6px;
  margin-bottom: 14px;
}

.cv-section {
  margin-bottom: 26px;
}
.cv-section p {
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}
.cv-column-1 .cv-section p {
  color: #dcece4;
}
.cv-section a {
  color: #1b4d3e;
}

.cv-item {
  margin-bottom: 14px;
}

/* --- Habilidades / Idiomas (barra lateral): nivel como etiqueta --- */
.cv-column-1 .item-title {
  display: block;
  font-weight: 600;
  font-size: 13px;
}
.cv-column-1 .item-subtitle {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  letter-spacing: 0.3px;
  color: #a9c9bc;
}

/* --- Carrera laboral / Estudios / Proyectos (columna principal) --- */
.cv-column-2 .item-dates {
  display: block;
  color: #777;
  font-size: 12px;
  margin-bottom: 2px;
}
.cv-column-2 .item-title {
  font-weight: 700;
  font-size: 14px;
}
.cv-column-2 .item-subtitle {
  display: block;
  color: #555;
  font-size: 13px;
  margin: 2px 0 6px;
}
`.trim();

// Plantilla minimalista de una columna: tipografía sans-serif, mucho espacio
// en blanco y un acento de color en vez de bordes/cajas; los datos de
// contacto se separan con un punto en lugar de iconos SVG.
const minimalLayout: TemplateLayoutConfig = {
  columns: 1,
  sections: [
    { section: 'personal-data', visible: true, column: 1, order: 1 },
    { section: 'summary', visible: true, column: 1, order: 2 },
    { section: 'skills', visible: true, column: 1, order: 3 },
    { section: 'work-experience', visible: true, column: 1, order: 4 },
    { section: 'education', visible: true, column: 1, order: 5 },
    { section: 'languages', visible: true, column: 1, order: 6 },
    { section: 'projects', visible: true, column: 1, order: 7 },
  ],
};

const minimalCss = `
.cv-root {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #2b2b2b;
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 44px;
  line-height: 1.5;
}

[data-section="personal-data"] h1 {
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #0f766e;
  margin: 0 0 4px;
}
[data-section="personal-data"] .job-title {
  font-size: 15px;
  color: #555;
  margin: 0 0 16px;
}
[data-section="personal-data"] .contact {
  display: flex;
  flex-wrap: wrap;
  font-size: 12.5px;
  color: #666;
  margin-bottom: 8px;
}
[data-section="personal-data"] .contact-item:not(:last-child)::after {
  content: '\\00B7';
  margin: 0 12px;
  color: #ccc;
}

.cv-section {
  margin-top: 30px;
}
.cv-section h2 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #0f766e;
  margin: 0 0 14px;
}
.cv-section p {
  font-size: 13.5px;
  color: #3a3a3a;
  margin: 0;
  white-space: pre-line;
}

.cv-item {
  margin-bottom: 16px;
}
.cv-item .item-dates {
  float: right;
  font-size: 12px;
  color: #999;
}
.cv-item .item-title {
  font-weight: 600;
  font-size: 14px;
}
.cv-item .item-subtitle {
  display: block;
  font-size: 12.5px;
  color: #777;
  margin-top: 1px;
}
.cv-item p {
  margin-top: 6px;
}
`.trim();

async function seedTemplates() {
  // Las plantillas predefinidas no son editables por el usuario (isPredefined),
  // así que es seguro sincronizarlas con su definición más reciente en cada
  // arranque en vez de dejarlas fijas tras la primera creación.
  const classicData = {
    name: 'Classic',
    description:
      'Single-column, sober template geared towards traditional profiles.',
    isPredefined: true,
    layoutConfig: classicLayout as unknown as object,
    css: classicCss,
  };
  await prisma.template.upsert({
    where: { id: 'seed-template-classic' },
    update: classicData,
    create: { id: 'seed-template-classic', ...classicData },
  });

  const modernData = {
    name: 'Modern',
    description:
      'Full-height green sidebar, contact icons and skill levels shown as a label.',
    isPredefined: true,
    layoutConfig: modernLayout as unknown as object,
    css: modernCss,
  };
  await prisma.template.upsert({
    where: { id: 'seed-template-modern' },
    update: modernData,
    create: { id: 'seed-template-modern', ...modernData },
  });

  const minimalData = {
    name: 'Minimal',
    description:
      'Single-column, sans-serif layout with generous whitespace and a subtle accent color instead of borders or icons.',
    isPredefined: true,
    layoutConfig: minimalLayout as unknown as object,
    css: minimalCss,
  };
  await prisma.template.upsert({
    where: { id: 'seed-template-minimal' },
    update: minimalData,
    create: { id: 'seed-template-minimal', ...minimalData },
  });
}

async function seedExampleProfileEn() {
  // El perfil de ejemplo NO se sincroniza en cada arranque: se crea una única
  // vez (si no existe ya) para que haya algo con lo que probar la aplicación
  // nada más instalarla, pero a partir de ahí el usuario puede editarlo o
  // borrarlo libremente sin que reaparezca.
  const exists = await prisma.profile.findUnique({
    where: { id: 'seed-profile-example-en' },
    select: { id: true },
  });
  if (exists) return;

  await prisma.profile.create({
    data: {
      id: 'seed-profile-example-en',
      name: 'Example profile (EN)',
      fullName: 'John Smith',
      title: 'Software Developer',
      email: 'john.smith@example.com',
      phone: '600 000 000',
      address: 'London, United Kingdom',
      summary:
        'Software developer with experience in modern web applications, relational databases and good testing practices.\n\nThis is an example profile — feel free to edit or delete it.',
      skills: {
        create: [
          { name: 'JavaScript / TypeScript', level: 4, order: 0 },
          { name: 'React', level: 4, order: 1 },
          {
            name: 'Node.js',
            level: 3,
            description: 'REST APIs with Express and NestJS',
            order: 2,
          },
          { name: 'SQL', level: 3, order: 3 },
        ],
      },
      languages: {
        create: [
          { name: 'English', level: 'Native', order: 0 },
          { name: 'Spanish', level: 'B2', order: 1 },
        ],
      },
      education: {
        create: [
          {
            institution: 'Example University',
            degree: "Bachelor's Degree in Computer Science",
            startDate: new Date('2016-09-01'),
            endDate: new Date('2020-06-30'),
            order: 0,
          },
        ],
      },
      workExperience: {
        create: [
          {
            company: 'Example Company Ltd.',
            position: 'Frontend Developer',
            location: 'London',
            startDate: new Date('2020-09-01'),
            description:
              'Built user interfaces with React and TypeScript, integrated REST APIs and improved load performance.',
            order: 0,
          },
        ],
      },
      projects: {
        create: [
          {
            name: 'Example project',
            description:
              'Task management web application with authentication and real-time synchronization.',
            technologies: 'React, Node.js, PostgreSQL',
            order: 0,
          },
        ],
      },
    },
  });
}

async function main() {
  await seedTemplates();
  await seedExampleProfileEn();
  console.log(
    'Seed completado: plantillas predefinidas sincronizadas y perfil de ejemplo asegurado.',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
