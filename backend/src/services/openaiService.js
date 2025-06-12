import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 주어진 키워드로 쇼츠 스토리 아이디어를 생성하는 함수
async function generateStoryPrompt(keywords) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // 또는 "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content:
            "You are a creative writer who creates short, engaging story ideas for YouTube shorts based on keywords.",
        },
        {
          role: "user",
          content: `Create a short story plot with a surprising twist using these keywords: ${keywords.join(
            ", "
          )}`,
        },
      ],
      max_tokens: 200,
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to generate story prompt.");
  }
}

export { generateStoryPrompt };
