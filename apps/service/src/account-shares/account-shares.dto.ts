import { IsInt, Min } from 'class-validator';

export class ShareAccountDto {
  @IsInt()
  @Min(1)
  sharedAccountId: number;
}