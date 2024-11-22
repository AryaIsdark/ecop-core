import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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

  async generateProductDescription(productName: string, attributes: Record<string, string>): Promise<string> {
    const prompt = this.createPrompt(productName, attributes);

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

  private createPrompt(productName: string, attributes: Record<string, string>): string {
    const attributesDescription = Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return `Generate a compelling product description for a product named "${productName}". Key features include: ${attributesDescription}.`;
  }
}
