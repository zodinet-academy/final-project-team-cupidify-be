import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point, Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly _locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      const pointObj: Point = {
        type: 'Point',
        coordinates: [createLocationDto.long, createLocationDto.lat],
      };

      const createdLocation = {
        userId: createLocationDto.userId,
        long: createLocationDto.long,
        lat: createLocationDto.lat,
        location: pointObj,
      };
      console.log(createdLocation);

      const location = await this._locationRepository.save(createdLocation);
      return location;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  findAll() {
    return `This action returns all location`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  async update(userId: string, updateLocationDto: UpdateLocationDto) {
    try {
      const location = await this._locationRepository.findOne({
        where: { userId },
      });

      const { long, lat } = updateLocationDto;

      const pointObj: Point = {
        type: 'Point',
        coordinates: [long, lat],
      };

      const updatedLocation = Object.assign(location, {
        long,
        lat,
        location: pointObj,
      });

      return await this._locationRepository.save(updatedLocation);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findWithin(userId: string) {
    try {
      const location = await this._locationRepository.findOne({
        where: { userId },
      });
      console.log(location);

      const locations = await this._locationRepository
        .createQueryBuilder('location')
        .where(
          'ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)',
        )
        .orderBy('distance')
        .setParameters({
          // stringify GeoJSON
          origin: JSON.stringify(location.location),
          range: 10000, //KM conversion
        })
        .getRawMany();

      return locations;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
