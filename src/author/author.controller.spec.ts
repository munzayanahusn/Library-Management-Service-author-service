import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockAuthorRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockLogsService = () => ({
  createLog: jest.fn(),
});

describe('AuthorController', () => {
  let controller: AuthorController;
  let service: AuthorService;
  let repository: Repository<Author>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          useFactory: mockAuthorRepository,
        },
        {
          provide: LogsService,
          useFactory: mockLogsService,
        },
      ],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
    service = module.get<AuthorService>(AuthorService);
    repository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const result = [{ id: 'uuid', name: 'Test Author', birthdate: '1970-01-01' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as Author[]);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single author', async () => {
      const result = { id: 'uuid', name: 'Test Author', birthdate: '1970-01-01' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as Author);
      expect(await controller.findOne('uuid')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const author = { name: 'Test Author', birthdate: '1970-01-01' };
      const result = { id: 'uuid', ...author };
      jest.spyOn(service, 'create').mockResolvedValue(result as Author);
      expect(await controller.create(author as Author)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an existing author', async () => {
      const author = { name: 'Updated Author' };
      const result = { id: 'uuid', name: 'Updated Author', birthdate: '1970-01-01' };
      jest.spyOn(service, 'update').mockResolvedValue(result as Author);
      expect(await controller.update('uuid', author)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete an existing author', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      await expect(controller.remove('uuid')).resolves.toBeUndefined();
    });
  });
});
