import { FastifyRequest } from 'fastify';
import {
  Controller,
  Req,
  Body,
  Get,
  Post,
  Patch,
  Query,
  NotFoundException,
  BadRequestException,
  Delete
} from '@nestjs/common';
import { ConfigService } from '@/config';
import { routes } from '@/constants';
import { ObjectId } from '@/decorators';
import { BugReportStatus, UserRole } from '@/typings';
import { Access, AccessPipe } from '@/utils/access';
import { BugReportService } from './bug-report.service';
import {
  CreateBugReportDto,
  GetBugReportsDto,
  UpdateBugReportDto
} from './dto';

@Controller(routes.bug_report.prefix)
export class BugReportController {
  constructor(
    private readonly bugReportService: BugReportService,
    private readonly configService: ConfigService
  ) {}

  @Access('Auth')
  @Post(routes.bug_report.create_bug_report)
  create(
    @Req() req: FastifyRequest,
    @Body() createBookDto: CreateBugReportDto
  ) {
    return this.bugReportService.create({
      ...createBookDto,
      status: BugReportStatus.Open,
      user: req.user?.user_id,
      version: this.configService.get('WEB_VERSION')
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

    const bugReport = await this.bugReportService.findOne(query);

    if (!bugReport) {
      throw new NotFoundException(`report not found`);
    }

    const isAdmin =
      user?.role === UserRole.Root || user?.role === UserRole.Admin;
    const newStatus = updateBugReportDto.status;

    if (
      newStatus &&
      !isAdmin &&
      !this.bugReportService
        .getBugReportStatus(bugReport.status)
        .includes(newStatus)
    ) {
      throw new BadRequestException(`InValid status`);
    }

    return this.bugReportService.findOneAndUpdate(query, {
      ...updateBugReportDto,
      version: this.configService.get('WEB_VERSION')
    });
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

  @Access('Auth')
  @Delete(routes.bug_report.delete_bug_report)
  async delete(@Req() { user }: FastifyRequest, @ObjectId('id') id: string) {
    const query = this.bugReportService.getRoleBasedQuery(user, { _id: id });
    await this.bugReportService.delete(query);
  }
}
