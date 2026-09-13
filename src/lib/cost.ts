import { prisma } from "./prisma";

export async function initializeModelPrices() {
  const defaultPrices = [
    { modelName: "qwen-plus", inputPrice: 0.004, outputPrice: 0.012 }, // Approximate USD per 1K tokens
    { modelName: "qwen-max", inputPrice: 0.012, outputPrice: 0.040 },
    { modelName: "qwen-turbo", inputPrice: 0.002, outputPrice: 0.006 },
    { modelName: "text-embedding-v3", inputPrice: 0.0005, outputPrice: 0 }, // Embedding model
  ];

  for (const price of defaultPrices) {
    await prisma.modelPrice.upsert({
      where: { 
        modelName_effectiveDate: {
          modelName: price.modelName,
          effectiveDate: new Date(),
        },
      },
      update: {},
      create: {
        modelName: price.modelName,
        inputPrice: price.inputPrice,
        outputPrice: price.outputPrice,
        currency: "USD",
        effectiveDate: new Date(),
      },
    });
  }
}

export async function getModelPrice(modelName: string): Promise<{ inputPrice: number; outputPrice: number } | null> {
  const price = await prisma.modelPrice.findFirst({
    where: { modelName },
    orderBy: { effectiveDate: "desc" },
  });

  if (!price) return null;

  return {
    inputPrice: parseFloat(price.inputPrice.toString()),
    outputPrice: parseFloat(price.outputPrice.toString()),
  };
}

export async function calculateCost(
  modelName: string,
  promptTokens: number,
  completionTokens: number
): Promise<number> {
  const price = await getModelPrice(modelName);

  if (!price) {
    // Default fallback pricing
    return (promptTokens * 0.004 + completionTokens * 0.012) / 1000;
  }

  return (promptTokens * price.inputPrice + completionTokens * price.outputPrice) / 1000;
}
