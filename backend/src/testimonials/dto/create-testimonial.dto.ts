import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @IsString()
  @IsOptional()
  authorTitle?: string;

  @IsString()
  @IsOptional()
  authorImage?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
