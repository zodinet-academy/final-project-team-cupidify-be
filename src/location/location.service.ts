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

  async create(createLocationDto: Location) {
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

      const location = await this._locationRepository.save(createdLocation);
      console.log(location);

      return location;
    } catch (err) {
      console.log(err.message);

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
      console.log('userId: ', userId);

      const location = await this._locationRepository.findOne({
        where: { userId },
      });
      console.log(location);

      const origin = {
        type: 'Point',
        coordinates: [location.long, location.lat],
      };

      const locations = await this._locationRepository
        .createQueryBuilder('location')
        .select([
          'location.user_id AS user',
          'ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)))/1000 AS distance',
        ])
        .where(
          'ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)',
        )
        .orderBy('distance')
        .setParameters({
          // stringify GeoJSON
          origin: JSON.stringify(origin),
          range: 1000 * 1000, //KM conversion
        })
        .getRawMany();
      console.log(locations);

      return locations;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
