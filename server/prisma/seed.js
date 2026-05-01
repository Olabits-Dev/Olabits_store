import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seeding Process ---');

  try {
    // 1. Fetch data from DummyJSON
    console.log('Fetching products from DummyJSON...');
    const response = await fetch('https://dummyjson.com/products?limit=100');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const data = await response.json();
    const externalProducts = data.products;

    // 2. Map data to Prisma Product model
    const mappedProducts = externalProducts.map(p => ({
      name: p.title,
      description: p.description,
      price: parseFloat(p.price),
      stock: parseInt(p.stock),
      category: p.category,
      image_url: p.thumbnail
    }));

    // 3. Clear existing data (in correct order to respect constraints)
    console.log('Cleaning up existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();

    // 4. Bulk insert products
    console.log(`Inserting ${mappedProducts.length} products...`);
    const result = await prisma.product.createMany({
      data: mappedProducts,
      skipDuplicates: true,
    });

    console.log(`Successfully seeded ${result.count} products!`);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('--- Seeding Finished ---');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
