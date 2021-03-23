import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseFuzzySearchingField } from 'mongoose';
import { fuzzySearch } from '@/utils/mongoose';
import { Schema$BugReport } from '@/typings';
import { BugReport, BugReportSchema } from './schemas/bug-report.schema';
import { BugReportService } from './bug-report.service';
import { BugReportController } from './bug-report.controller';
import autopopulate from 'mongoose-autopopulate';
import paginate from 'mongoose-paginate-v2';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: BugReport.name,
        useFactory: async () => {
          const fields: MongooseFuzzySearchingField<Schema$BugReport>[] = [
            { name: 'title' },
            { name: 'description' }
          ];

          BugReportSchema.plugin(fuzzySearch, { fields });
          BugReportSchema.plugin(autopopulate);
          BugReportSchema.plugin(paginate);

          return BugReportSchema;
        }
      }
    ])
  ],
  controllers: [BugReportController],
  providers: [BugReportService]
})
export class BugReportModule {}
