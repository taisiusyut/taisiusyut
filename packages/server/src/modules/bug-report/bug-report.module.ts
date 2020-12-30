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
          const schema = BugReportSchema;

          const fields: MongooseFuzzySearchingField<Schema$BugReport>[] = [
            { name: 'title' },
            { name: 'description' }
          ];

          schema.plugin(fuzzySearch, { fields });
          schema.plugin(autopopulate);
          schema.plugin(paginate);

          return schema;
        }
      }
    ])
  ],
  controllers: [BugReportController],
  providers: [BugReportService]
})
export class BugReportModule {}
