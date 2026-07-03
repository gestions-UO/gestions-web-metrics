import { db } from './index';
import { users, organizations, userOrganizations, projects, keywords } from './schema';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    console.log('Cleaning existing data...');
    await db.delete(keywords);
    await db.delete(projects);
    await db.delete(userOrganizations);
    await db.delete(users);
    await db.delete(organizations);

    console.log('Inserting default organization...');
    const [org] = await db.insert(organizations).values({
      name: 'SEOForge Default Org',
    }).returning();

    console.log('Inserting admin user...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const [user] = await db.insert(users).values({
      email: 'admin@seoforge.local',
      name: 'Admin User',
      passwordHash,
    }).returning();

    console.log('Linking user to organization...');
    await db.insert(userOrganizations).values({
      userId: user.id,
      orgId: org.id,
      role: 'owner',
    });

    console.log('Inserting mock projects...');
    const mockProjects = [
      { domain: 'tesla.com', dr: 91, traffic: 15400000, backlinks: 4200000 },
      { domain: 'apple.com', dr: 97, traffic: 312000000, backlinks: 12000000 },
      { domain: 'spacex.com', dr: 85, traffic: 3200000, backlinks: 850000 }
    ];

    for (const p of mockProjects) {
      const [insertedProject] = await db.insert(projects).values({
        orgId: org.id,
        domain: p.domain,
        domainRating: p.dr,
        organicTraffic: p.traffic,
        backlinksCount: p.backlinks,
      }).returning();

      // Insert keywords for each project
      await db.insert(keywords).values([
        { projectId: insertedProject.id, term: `buy ${p.domain.split('.')[0]}`, position: 1, volume: 45000, kd: 85, url: `https://${p.domain}/` },
        { projectId: insertedProject.id, term: `${p.domain.split('.')[0]} reviews`, position: 3, volume: 12000, kd: 60, url: `https://${p.domain}/reviews` },
        { projectId: insertedProject.id, term: `is ${p.domain.split('.')[0]} good`, position: 5, volume: 8000, kd: 45, url: `https://${p.domain}/about` },
      ]);
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();
