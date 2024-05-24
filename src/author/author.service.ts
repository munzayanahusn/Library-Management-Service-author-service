import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { validate } from 'class-validator';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>,
    ) {}

    findAll(): Promise<Author[]> {
        return this.authorRepository.find();
    }

    async findOne(id: string): Promise<Author> {
        if (!this.isValidUUID(id)) {
            throw new BadRequestException(`Invalid UUID format: ${id}`);
        }
        const author = await this.authorRepository.findOne({ where: { id } });
        if (!author) {
            throw new NotFoundException(`Author with ID ${id} not found`);
        }
        return author;
    }

    async create(author: Author): Promise<Author> {
        const errors = await validate(author);
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed');
        }
        return this.authorRepository.save(author);
    }

    async update(id: string, author: Partial<Author>): Promise<Author> {
        if (!this.isValidUUID(id)) {
            throw new BadRequestException(`Invalid UUID format: ${id}`);
        }
        const errors = await validate(author);
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed');
        }
        await this.authorRepository.update(id, author);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        if (!this.isValidUUID(id)) {
            throw new BadRequestException(`Invalid UUID format: ${id}`);
        }
        const result = await this.authorRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Author with ID ${id} not found`);
        }
    }

    private isValidUUID(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}
