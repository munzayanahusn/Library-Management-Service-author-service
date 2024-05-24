import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { LogsService } from '../logs/logs.service';

@ApiTags('author')
@Controller('author')
export class AuthorController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly logsService: LogsService
  ) {}

  @ApiOperation({ summary: 'Get all authors' })
  @Get()
  findAll(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  @ApiOperation({ summary: 'Get an author by ID' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Author> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  @ApiOperation({ summary: 'Create an author' })
  @ApiBody({ type: Author })
  @Post()
  async create(@Body() author: Author) {
    const createdAuthor = await this.authorService.create(author);
    await this.logsService.createLog('create', 'author', createdAuthor.id);
    return createdAuthor;
  }

  @ApiOperation({ summary: 'Update an author by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: Author })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() author: Partial<Author>) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    const updatedAuthor = await this.authorService.update(id, author);
    await this.logsService.createLog('update', 'author', updatedAuthor.id);
    return updatedAuthor;
  }

  @ApiOperation({ summary: 'Delete an author by ID' })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    await this.authorService.remove(id);
    await this.logsService.createLog('delete', 'author', id);
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}