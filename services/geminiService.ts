import { GoogleGenAI, Type } from "@google/genai";

interface TeamNameSuggestion {
  name: string;
  color: string;
}

export async function generateTeamNames(count: number): Promise<TeamNameSuggestion[]> {
  if (!process.env.API_KEY) {
    throw new Error("API key for Gemini is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Gere uma lista de ${count} objetos, onde cada objeto contém um nome de time de vôlei criativo em português e uma cor hexadecimal (hex code) que combine com o nome.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            teams: {
              type: Type.ARRAY,
              description: "Uma lista de sugestões de times.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: 'Um nome de time de vôlei criativo.'
                  },
                  color: {
                    type: Type.STRING,
                    description: 'Uma cor em formato hexadecimal (ex: "#FF5733") que combine com o nome do time.'
                  }
                },
                required: ['name', 'color']
              },
            },
          },
          required: ['teams'],
        },
      },
    });

    const jsonString = response.text;
    if (!jsonString) {
        throw new Error("Resposta da API vazia ou inválida.");
    }
    
    const parsed = JSON.parse(jsonString);
    if (parsed.teams && Array.isArray(parsed.teams)) {
      return parsed.teams.slice(0, count);
    }
    
    throw new Error("Formato da resposta da API inesperado.");

  } catch (error) {
    console.error("Erro ao chamar a API Gemini para nomes:", error);
    return Array.from({ length: count }, (_, i) => ({
      name: `Time ${i + 1}`,
      color: '#06b6d4'
    }));
  }
}

export async function generateTeamLogo(teamName: string): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API key for Gemini (Imagen) is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Crie um logo de emblema para um time de vôlei chamado "${teamName}". O logo deve ser simples, moderno e icônico, adequado para um emblema de time esportivo. Fundo branco.`;

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error('Nenhuma imagem foi gerada pela API.');
  } catch (error) {
    console.error(`Erro ao gerar logo para "${teamName}":`, error);
    throw error;
  }
}