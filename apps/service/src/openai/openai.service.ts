import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Module,
} from '@nestjs/common';
import { Environment, EnvService } from '@nhl/env';
import OpenAI from 'openai';
import axios, { AxiosInstance } from 'axios';
import { Env } from '../common/env';
import * as moment from 'moment';
import { parseObjectFromContent } from '../common/util';
import { IElectricMeterImageResponse } from '../common/interface';

@Injectable()
export class OpenAiService {
  private openAiClient: OpenAI;
  private axiosClient: AxiosInstance;
  private apiKey: string;
  private url: string;
  private requestCounter = 0;
  private lastRequestTime;

  constructor(private readonly env: EnvService<Env>) {
    // this.openAiClient = new OpenAI({
    //   apiKey: this.env.get('openAi.apiKey'),
    // });
    this.apiKey = this.env.get('openAi.apiKey');
    this.url = this.env.get('openAi.url');
    this.axiosClient = axios.create();
  }

  encodeImage = (fileBuffer: Buffer) => {
    return Buffer.from(fileBuffer).toString('base64');
  };

  isAllowAccess = (): boolean => {
    console.log('Last', this.lastRequestTime);
    console.log('Last', this.requestCounter);

    if (!this.lastRequestTime) {
      this.lastRequestTime = moment();
      this.requestCounter += 1;
      return true;
    }

    const currentTime = moment();
    const minuteDiff = currentTime.diff(this.lastRequestTime, 'minutes');
    const dayDiff = currentTime.diff(this.lastRequestTime, 'days');

    if (
      minuteDiff <= 1 &&
      this.requestCounter >= this.env.get('openAi.rateLimit.perMinute')
    ) {
      console.log(
        'Cannot request more than',
        this.env.get('openAi.rateLimit.perMinute'),
        'requests per minute',
      );
      return false;
    }

    if (
      dayDiff < 1 &&
      this.requestCounter >= this.env.get('openAi.rateLimit.perDay')
    ) {
      console.log(
        'Cannot request more than',
        this.env.get('openAi.rateLimit.perDay'),
        'requests per day',
      );
      return false;
    }

    this.lastRequestTime = currentTime; // Update last request time for accurate tracking
    this.requestCounter = dayDiff >= 1 ? 1 : this.requestCounter + 1; // Reset counter daily or increment

    return true;
  };

  processMeterImage = async (
    file: Express.Multer.File,
  ): Promise<IElectricMeterImageResponse> => {
    console.log('env', this.env.get('env'));
    console.log('lolo', Environment.Development);

    if (this.env.get('env') == Environment.Development)
      return {
        electricMeterReading: '100',
        manufacturer: '100',
        model: '100',
        serialNumber: '100',
        voltage: '100',
        current: '100',
        frequency: '100',
        powerFactor: '100',
        temperature: '100',
        phase: '100',
        installationYear: '100',
        locationMarking: '100',
      };

    if (!file) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'No file provided',
      });
    }

    const base64Image = this.encodeImage(file[0].buffer); // Directly use file.buffer

    try {
      const response = await this.openAiClient.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant that extracts structured information from images. ' +
              'The image may contain meter readings, text, and labels. ' +
              'Provide a structured output (key-value format) with relevant details.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'Extract all the relevant details from this image into object like this interface' +
                  '{ ' +
                  ' electricMeterReading: string' +
                  ' manufacturer: string' +
                  ' model: string' +
                  ' serialNumber: string' +
                  ' voltage: string' +
                  ' current: string' +
                  ' frequency: string' +
                  ' powerFactor: string' +
                  ' temperature: string' +
                  ' phase: string' +
                  ' installationYear: string' +
                  ' locationMarking: string' +
                  '}',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        model: this.env.get('openAi.model'),
        max_tokens: 300,
      });

      const [choice] = response.choices;
      const content = parseObjectFromContent(
        choice.message.content.replace('`', '').replace('json', ''),
      ) as IElectricMeterImageResponse;

      return content;
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  };
}
