import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with authentic Indian business leads...');

  // Create demo user with Indian identity
  const demoEmail = 'demo@example.com';
  let demoUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        name: 'Aarav Sharma',
        email: demoEmail,
        password: hashedPassword,
      },
    });
    console.log(`👤 Created Demo User: Aarav Sharma (${demoEmail} / password123)`);
  } else {
    demoUser = await prisma.user.update({
      where: { email: demoEmail },
      data: {
        name: 'Aarav Sharma',
        password: hashedPassword,
      },
    });
    console.log(`👤 Updated Demo User: Aarav Sharma (${demoEmail})`);
  }

  // Clear existing leads for demo user to ensure clean state
  await prisma.lead.deleteMany({
    where: { userId: demoUser.id },
  });

  const sampleLeads = [
    {
      name: 'Rajesh Patel',
      email: 'rajesh.patel@vortexsolutions.in',
      phone: '+91 98234 56789',
      company: 'Vortex Solutions Mumbai',
      source: 'Referral',
      status: 'Qualified',
      notes: 'Referred by CFO. Looking for enterprise CRM integration with SAP ERP.',
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@cloudzenlabs.in',
      phone: '+91 98765 43210',
      company: 'CloudZen Labs Bengaluru',
      source: 'Event',
      status: 'Qualified',
      notes: 'Met at Bangalore Tech Summit. High buying intent, requested custom demo.',
    },
    {
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@tatanex.com',
      phone: '+91 97654 32109',
      company: 'Tata NexGen Technologies',
      source: 'Website',
      status: 'New',
      notes: 'Submitted inbound contact form requesting 75 sales executive seats.',
    },
    {
      name: 'Vikramaditya Singhania',
      email: 'vikram.singhania@apexfin.co.in',
      phone: '+91 98112 34567',
      company: 'Apex Financial Services Delhi',
      source: 'LinkedIn',
      status: 'Contacted',
      notes: 'Connected via LinkedIn sales outreach. Discussed automated lead distribution.',
    },
    {
      name: 'Kavita Iyer',
      email: 'kavita.iyer@luminaanalytics.in',
      phone: '+91 99401 23456',
      company: 'Lumina Analytics Chennai',
      source: 'Website',
      status: 'New',
      notes: 'Interested in conversion velocity analytics and custom reporting dashboard.',
    },
    {
      name: 'Aditya Verma',
      email: 'aditya.verma@vermalogistics.in',
      phone: '+91 98990 12345',
      company: 'Verma Logistics & Retail',
      source: 'Cold Outreach',
      status: 'Contacted',
      notes: 'In initial outreach discussion. Reviewing Q3 software migration budget.',
    },
    {
      name: 'Sneha Kulkarni',
      email: 'sneha.kulkarni@puneinnovate.org',
      phone: '+91 98220 54321',
      company: 'Pune Innovation Hub',
      source: 'Event',
      status: 'Qualified',
      notes: 'Met at Pune Startup Expo. High procurement priority, requested invoice draft.',
    },
    {
      name: 'Manish Malhotra',
      email: 'manish.malhotra@heritagefabrics.in',
      phone: '+91 98300 98765',
      company: 'Heritage Retail Group Kolkata',
      source: 'Cold Outreach',
      status: 'Lost',
      notes: 'Budget allocated to offline retail store expansion this financial year.',
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

  console.log(`✅ Seeded ${sampleLeads.length} sample Indian business leads successfully.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
