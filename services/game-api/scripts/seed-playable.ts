import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const templates = [
    { key: 'pickpocket', title: 'Pickpocket Circuit', energyCost: 5, durationSec: 60, cashReward: 220, influenceReward: 2 },
    { key: 'warehouse_hit', title: 'Warehouse Hit', energyCost: 10, durationSec: 180, cashReward: 600, influenceReward: 5 },
    { key: 'data_heist', title: 'Data Heist', energyCost: 14, durationSec: 300, cashReward: 950, influenceReward: 8 }
  ];

  for (const template of templates) {
    await prisma.missionTemplate.upsert({
      where: { key: template.key },
      update: template,
      create: template
    });
  }

  for (let i = 1; i <= 8; i += 1) {
    await prisma.player.upsert({
      where: { deviceId: `bot-device-${i}` },
      update: {
        isBot: true,
        powerRating: 80 + i * 15
      },
      create: {
        deviceId: `bot-device-${i}`,
        handle: `Bot_${i}`,
        faction: 'IRON_VOW',
        isBot: true,
        powerRating: 80 + i * 15,
        resources: {
          create: {
            cash: 1500 + i * 500,
            gems: 0,
            energy: 40,
            influence: 50,
            contraband: 10,
            loyalty: 100,
            heat: 0
          }
        }
      }
    });
  }

  console.log('Playable seed complete: mission templates + bot targets created');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
