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

  const eventTemplates = [
    {
      key: 'district_skirmish',
      title: 'District Skirmish',
      type: 'DISTRICT_SKIRMISH' as const,
      durationHours: 24,
      scoringRule: { actionWeights: { crime_complete: 1, raid_win: 2 } },
      rewards: [
        { minPoints: 20, cash: 500, influence: 5, gems: 0 },
        { minPoints: 50, cash: 1200, influence: 10, gems: 1 }
      ]
    },
    {
      key: 'crew_surge',
      title: 'Crew Surge Drive',
      type: 'CREW_SURGE' as const,
      durationHours: 24,
      scoringRule: { actionWeights: { crime_complete: 1, daily_login: 1 } },
      rewards: [
        { minPoints: 15, cash: 400, influence: 4, gems: 0 },
        { minPoints: 40, cash: 900, influence: 8, gems: 1 }
      ]
    },
    {
      key: 'black_market_rush',
      title: 'Black Market Rush',
      type: 'BLACK_MARKET_RUSH' as const,
      durationHours: 24,
      scoringRule: { actionWeights: { raid_win: 2, syndicate_donation: 1 } },
      rewards: [
        { minPoints: 20, cash: 650, influence: 5, gems: 0 },
        { minPoints: 55, cash: 1500, influence: 12, gems: 2 }
      ]
    },
    {
      key: 'syndicate_donation',
      title: 'Syndicate Donation Rally',
      type: 'SYNDICATE_DONATION' as const,
      durationHours: 24,
      scoringRule: { actionWeights: { syndicate_donation: 2, daily_login: 1 } },
      rewards: [
        { minPoints: 10, cash: 300, influence: 3, gems: 0 },
        { minPoints: 35, cash: 800, influence: 7, gems: 1 }
      ]
    }
  ];

  for (const template of eventTemplates) {
    const savedTemplate = await prisma.eventTemplate.upsert({
      where: { key: template.key },
      update: template,
      create: template
    });

    const now = new Date();
    const existingLive = await prisma.liveEvent.findFirst({
      where: {
        templateId: savedTemplate.id,
        startsAt: { lte: now },
        endsAt: { gt: now }
      }
    });

    if (!existingLive) {
      await prisma.liveEvent.create({
        data: {
          templateId: savedTemplate.id,
          startsAt: now,
          endsAt: new Date(now.getTime() + template.durationHours * 60 * 60 * 1000)
        }
      });
    }
  }

  console.log('Playable seed complete: mission templates + bot targets + live events created');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
