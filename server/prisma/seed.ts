import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const demoEmail = 'demo@example.com';
  let demoUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        name: 'Alex Morgan',
        email: demoEmail,
        password: hashedPassword,
      },
    });
    console.log(`👤 Created Demo User: ${demoEmail} (Password: password123)`);
  } else {
    demoUser = await prisma.user.update({
      where: { email: demoEmail },
      data: { password: hashedPassword },
    });
    console.log(`👤 Updated Demo User: ${demoEmail}`);
  }

  // Clear existing leads for demo user to ensure clean state
  await prisma.lead.deleteMany({
    where: { userId: demoUser.id },
  });

  const sampleLeads = [
    {
      name: 'Sarah Connor',
      email: 'sarah.connor@cyberdyne.io',
      phone: '+1 (555) 234-5678',
      company: 'Cyberdyne Systems',
      source: 'Website',
      status: 'Qualified',
      notes: 'Interested in enterprise security and autonomous monitoring.',
    },
    {
      name: 'David Wallace',
      email: 'dwallace@dundermifflin.com',
      phone: '+1 (555) 456-7890',
      company: 'Dunder Mifflin Inc.',
      source: 'Referral',
      status: 'Contacted',
      notes: 'Looking to optimize regional branch CRM and paper sales workflow.',
    },
    {
      name: 'Elena Rostova',
      email: 'elena@novatech.co',
      phone: '+44 20 7946 0912',
      company: 'Nova Technologies',
      source: 'LinkedIn',
      status: 'New',
      notes: 'Found via founder outreach campaign. Wants pricing for 50 seats.',
    },
    {
      name: 'Marcus Brody',
      email: 'm.brody@museum-archaeology.org',
      phone: '+1 (555) 876-5432',
      company: 'National Heritage Foundation',
      source: 'Cold Outreach',
      status: 'Lost',
      notes: 'Budget cuts postponed software upgrades until Q3 next year.',
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@cloudzen.in',
      phone: '+91 98765 43210',
      company: 'CloudZen Labs',
      source: 'Event',
      status: 'Qualified',
      notes: 'Met at Bangalore Tech Summit. High buying intent, requested custom demo.',
    },
    {
      name: 'Jordan Lee',
      email: 'jordan.lee@apexfinance.com',
      phone: '+1 (555) 912-3456',
      company: 'Apex Financial Partners',
      source: 'Advertisement',
      status: 'Contacted',
      notes: 'Clicked Google Search ad. Exploring automated lead ingestion.',
    },
    {
      name: 'Claire Dupont',
      email: 'claire@lumieremedia.fr',
      phone: '+33 1 42 68 55 00',
      company: 'Lumiere Media',
      source: 'Website',
      status: 'New',
      notes: 'Submitted contact form from landing page pricing section.',
    },
    {
      name: 'Rajesh Patel',
      email: 'rajesh@vortexsol.com',
      phone: '+91 98234 56789',
      company: 'Vortex Solutions',
      source: 'Referral',
      status: 'Qualified',
      notes: 'Referred by Priya Sharma. Needs multi-pipeline integration.',
    },
  ];

  for (const lead of sampleLeads) {
    await prisma.lead.create({
      data: {
        ...lead,
        userId: demoUser.id,
      },
    });
  }

  console.log(`✅ Seeded ${sampleLeads.length} sample leads successfully.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
