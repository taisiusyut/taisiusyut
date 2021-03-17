import { FastifyRequest } from 'fastify';
import {
  Controller,
  Req,
  Body,
  Get,
  Post,
  Patch,
  Query,
  NotFoundException
} from '@nestjs/common';
import { routes } from '@/constants';
import { ObjectId } from '@/decorators';
import { Access, AccessPipe } from '@/utils/access';
import { BugReportService } from './bug-report.service';
import {
  CreateBugReportDto,
  GetBugReportsDto,
  UpdateBugReportDto
} from './dto';
import { BugReportStatus } from '@/typings';

@Controller(routes.bug_report.prefix)
export class BugReportController {
  constructor(private readonly bugReportService: BugReportService) {}

  @Access('Optional')
  @Post(routes.bug_report.create_bug_report)
  create(
    @Req() req: FastifyRequest,
    @Body() createBookDto: CreateBugReportDto
  ) {
    return this.bugReportService.create({
      ...createBookDto,
      status: BugReportStatus.Open,
      user: req.user?.user_id
    });
  }

  @Access('Auth')
  @Patch(routes.bug_report.update_bug_report)
  async update(
    @Req() { user }: FastifyRequest,
    @ObjectId('id') id: string,
    @Body() updateBugReportDto: UpdateBugReportDto
  ) {
    const query = this.bugReportService.getRoleBasedQuery(user, { _id: id });

    const bugReport = await this.bugReportService.findOneAndUpdate(
      query,
      updateBugReportDto
    );

    if (!bugReport) {
      throw new NotFoundException(`report not found`);
    }

    return bugReport;
  }

  @Access('Everyone')
  @Get(routes.bug_report.get_bug_reports)
  async getAll(
    @Req() { user }: FastifyRequest,
    @Query(AccessPipe) getBugReportsDto: GetBugReportsDto
  ) {
    const query = this.bugReportService.getRoleBasedQuery(
      user,
      getBugReportsDto
    );

    return this.bugReportService.paginate(query);
  }

  @Access('Everyone')
  @Get(routes.bug_report.get_bug_report)
  async get(@Req() { user }: FastifyRequest, @ObjectId('id') id: string) {
    const query = this.bugReportService.getRoleBasedQuery(user, { _id: id });

    const bugReport = await this.bugReportService.findOne(query);

    if (!bugReport) {
      throw new NotFoundException(`report not found`);
    }

    return bugReport;
  }
}
