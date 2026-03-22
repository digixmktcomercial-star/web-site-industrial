import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const CLOROSOL_CONTEXT = `
A Clorosol é uma empresa portuguesa fundada em 1974, especializada no fabrico e comercialização de lixívias e detergentes.
Localizada em Alenquer, Portugal.
Produtos:
- Gama de Lixívias: Lixívia Tradicional, Lixívia Perfumada (Limão, Lavanda), Lixívia Máquina.
- Gama Detergentes: Detergente Loiça, Detergente Roupa, Amaciadores, Limpa Vidros, Desengordurantes.
- Produtos Industriais: Hipoclorito de Sódio, Soda Cáustica.
História: Mais de 40 anos de experiência no mercado nacional e internacional.
Exportação: Exporta para vários países na Europa e África.
Qualidade: Certificada pela ISO 9001.
`;

export async function askGemini(prompt: string) {
  if (!genAI) return "O serviço de IA não está configurado.";
  
  const result = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: `Contexto: ${CLOROSOL_CONTEXT}\n\nPergunta: ${prompt}` }] }],
    config: {
      systemInstruction: "Tu és o assistente inteligente da Clorosol. Responde de forma profissional e técnica em Português-PT.",
    }
  });
  
  return result.text || "Não foi possível obter uma resposta.";
}
