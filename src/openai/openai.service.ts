import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

enum LanguageCode {
  en = "en",
  se = "se",
  da = "da",
  no = "no",
}

const languageMap: Record<LanguageCode, string> = {
  [LanguageCode.en]: "English",
  [LanguageCode.se]: "Swedish",
  [LanguageCode.da]: "Danish",
  [LanguageCode.no]: "Norwegian",
};

const mapLanguageCodeToName = (code: LanguageCode): string => {
  return languageMap[code] || "Unknown Language";
}
@Injectable()
export class OpenaiService {
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject('CORE_ENV_VARIABLES') private readonly envVariables: Record<string, any>,
  ) {

    this.apiKey = this.envVariables.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OpenAI API Key is not configured. Please provide it in the environment variables.');
    }
  }

  async generateProductDescription(lang: string, productName: string, attributes: Record<string, string>): Promise<string> {
    const prompt = this.createPrompt(lang, productName, attributes);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.apiUrl,
          {
            model: 'gpt-4',
            messages: [
              { role: 'system', content: 'You are a product description writer.' },
              { role: 'user', content: prompt },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      throw new HttpException(
        `Error communicating with OpenAI: ${error.response?.data?.error?.message || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private createPrompt(lang: string, productName: string, attributes: Record<string, string>): string {
    const attributesDescription = Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return `Write an SEO-optimized product description in this language "${mapLanguageCodeToName(lang as LanguageCode)}"about "${productName}" You can use these attributes as well: ${attributesDescription}. 
    The description should contain at least 1000 words. Use sentence case for headings. 
    Write the product description in shorter sections of at least 150 words each. 
    All sections should have meaningful titles rather than generic placeholders. 
    Refer to research in the article where relevant. Avoid repetition of words and sentences. Include HTML tags. Write about the product, and do not consider any potential flavors.`;
  }
}
