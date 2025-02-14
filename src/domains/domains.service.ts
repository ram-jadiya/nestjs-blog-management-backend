import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Domain } from './schemas/domain.schema';
import { PaginationDto } from '../shared/interfaces/pagination.dto';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

/**
 * Service for managing domains.
 *
 * This service provides methods for creating, retrieving, updating, and deleting domains.
 * It also supports pagination for listing domains.
 */
@Injectable()
export class DomainsService {
  constructor(
    @InjectModel(Domain.name)
    private domainModel: Model<Domain>,
  ) {}

  /**
   * Creates a new domain.
   *
   * @param {CreateDomainDto} createDto - The DTO containing the data for the new domain.
   * @returns {Promise<string>} - The created domain.
   */
  async create(createDto: CreateDomainDto): Promise<string> {
    const domain = await this.domainModel.create(createDto);
    return domain._id as string;
  }

  /**
   * Retrieves all domains with pagination.
   *
   * @param {PaginationDto} pagination - The pagination parameters to control the results.
   * @returns {Promise<{ data: Domain[]; count: number }>} - An object containing the list of domains and the total count.
   */
  async findAll(
    pagination: PaginationDto,
  ): Promise<{ data: Domain[]; count: number }> {
    const [data, count] = await Promise.all([
      this.domainModel
        .find()
        .skip((pagination.pageIndex - 1) * pagination.pageSize)
        .limit(pagination.pageSize)
        .exec(),
      this.domainModel.countDocuments().exec(),
    ]);

    return { data, count };
  }

  /**
   * Retrieves a single domain by its ID.
   *
   * @param {string} id - The ID of the domain to retrieve.
   * @returns {Promise<Domain | null>} - The requested domain or `null` if not found.
   */
  async findOne(id: string): Promise<Domain | null> {
    return this.domainModel.findById(id).exec();
  }

  /**
   * Updates an existing domain by its ID.
   *
   * @param {string} id - The ID of the domain to update.
   * @param {UpdateDomainDto} updateDto - The DTO containing the updated data for the domain.
   * @returns {Promise<string | null>} - The updated domain.
   */
  async update(id: string, updateDto: UpdateDomainDto): Promise<string | null> {
    const domain = await this.domainModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    return (domain?._id as string) ?? null;
  }

  /**
   * Deletes a domain by its ID.
   *
   * @param {string} id - The ID of the domain to delete.
   * @returns {Promise<string | null>} - The deleted domain or `null` if not found.
   */
  async remove(id: string): Promise<string | null> {
    const domain = await this.domainModel.findByIdAndDelete(id).exec();
    return (domain?._id as string) ?? null;
  }
}
