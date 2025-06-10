import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuggestionController } from '@/controllers/suggestion.controller';
import { SuggestionService } from '@/services/suggestion.service';
import { Suggestion, SuggestionSchema } from '@/schemas/suggestion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Suggestion.name, schema: SuggestionSchema },
    ]),
  ],
  controllers: [SuggestionController],
  providers: [SuggestionService],
  exports: [SuggestionService],
})
export class SuggestionModule {}
