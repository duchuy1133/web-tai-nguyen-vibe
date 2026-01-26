import { PrismaClient, ProductCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    const products = [
        {
            title: "Glitch Transition Pack Vol. 2",
            description: "Professional glitch transitions for Premiere Pro. Drag and drop functionality.",
            price: 2900, // $29.00
            category: ProductCategory.PLUGIN,
            thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
            downloadLink: "https://example.com/downloads/glitch-v2.zip",
        },
        {
            title: "Cinematic LUTs Bundle 2024",
            description: "50+ Cinematic LUTs for Log and Rec.709 footage.",
            price: 1500, // $15.00
            category: ProductCategory.PLUGIN, // Using PLUGIN as general category or add FILTER
            thumbnailUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000&auto=format&fit=crop",
            downloadLink: "https://example.com/downloads/luts-2024.zip",
        },
        {
            title: "Cyberpunk Title Templates",
            description: "Neon futuristic titles for After Effects and Premiere.",
            price: 4500, // $45.00
            category: ProductCategory.TEMPLATE,
            thumbnailUrl: "https://images.unsplash.com/photo-1620641788421-7f1c3385d536?q=80&w=1000&auto=format&fit=crop",
            downloadLink: "https://example.com/downloads/cyberpunk-titles.zip",
        },
        {
            title: "Retro VHS Overlay 4K",
            description: "Authentic 4K VHS noise and overlay textures.",
            price: 1999, // $19.99
            category: ProductCategory.IMAGE, // Using IMAGE for overlays
            thumbnailUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop",
            downloadLink: "https://example.com/downloads/vhs-overlay.zip",
        },
        {
            title: "Modern Sans-Serif Font Family",
            description: "Clean, geometric sans-serif font for headlines.",
            price: 3500, // $35.00
            category: ProductCategory.FONT,
            thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
            downloadLink: "https://example.com/downloads/modern-sans.zip",
        },
        {
            title: "3D Texture Pack: Concrete",
            description: "High resolution concrete textures for 3D rendering.",
            price: 1200, // $12.00
            category: ProductCategory.IMAGE,
            thumbnailUrl: "https://images.unsplash.com/photo-1513569771920-c9e1d31714b0?q=80&w=1000&auto=format&fit=crop",
            downloadLink: "https://example.com/downloads/concrete-textures.zip",
        },
    ]

    for (const p of products) {
        const product = await prisma.product.create({
            data: p,
        })
        console.log(`Created product with id: ${product.id}`)
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
