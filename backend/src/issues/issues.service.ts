import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import * as crypto from 'crypto';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
  ) {}

  private generateContentHash(error: string, description: string): string {
    const content = `${error.toLowerCase().trim()}|${description.toLowerCase().trim()}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    const contentHash = this.generateContentHash(
      createIssueDto.error,
      createIssueDto.description,
    );

    // Check for duplicate
    const existingIssue = await this.issuesRepository.findOne({
      where: { contentHash },
    });

    if (existingIssue) {
      throw new ConflictException(
        'An issue with the same error and description already exists',
      );
    }

    const issue = this.issuesRepository.create({
      ...createIssueDto,
      contentHash,
    });

    return this.issuesRepository.save(issue);
  }

  async findAll(
    search?: string,
    tags?: string[],
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Issue[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.issuesRepository.createQueryBuilder('issue');

    if (search) {
      queryBuilder.where(
        '(issue.error LIKE :search OR issue.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (tags && tags.length > 0) {
      // Filter by tags - at least one tag must match
      const tagConditions = tags.map((tag, index) => {
        queryBuilder.setParameter(`tag${index}`, `%${tag}%`);
        return `issue.tags LIKE :tag${index}`;
      });
      const condition = tagConditions.join(' OR ');
      
      if (search) {
        queryBuilder.andWhere(`(${condition})`);
      } else {
        queryBuilder.where(`(${condition})`);
      }
    }

    queryBuilder.orderBy('issue.createdAt', 'DESC');

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Issue> {
    const issue = await this.issuesRepository.findOne({ where: { id } });
    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }
    return issue;
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const issue = await this.findOne(id);

    // If error or description is being updated, check for duplicates
    if ('error' in updateIssueDto || 'description' in updateIssueDto) {
      const newError = updateIssueDto.error ?? issue.error;
      const newDescription = updateIssueDto.description ?? issue.description;
      const newContentHash = this.generateContentHash(newError, newDescription);

      if (newContentHash !== issue.contentHash) {
        const existingIssue = await this.issuesRepository.findOne({
          where: { contentHash: newContentHash },
        });

        if (existingIssue) {
          throw new ConflictException(
            'An issue with the same error and description already exists',
          );
        }

        Object.assign(issue, updateIssueDto, { contentHash: newContentHash });
      } else {
        Object.assign(issue, updateIssueDto);
      }
    } else {
      Object.assign(issue, updateIssueDto);
    }

    return this.issuesRepository.save(issue);
  }

  async remove(id: string): Promise<void> {
    const issue = await this.findOne(id);
    await this.issuesRepository.remove(issue);
  }

  async getAllTags(): Promise<string[]> {
    const issues = await this.issuesRepository.find({
      select: ['tags'],
    });

    const tagSet = new Set<string>();
    issues.forEach((issue) => {
      issue.tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }
}
